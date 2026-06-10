const db = uniCloud.database();
const $ = db.command.aggregate;

exports.main = async (event, context) => {
	const functionName = event.functionName;
	const data = event.data;

	try {
		let result;

		if (functionName === 'cartdata') {
			result = await getCartData(data.user_id);
		} else if (functionName === 'coupondata') {
			result = await getCouponData(data.e);
		} else if (functionName === 'addCoupon') {
			const {
				id,
				maxnum,
				yl_num,
				fx_num,
				usertype,
				usarr,
				user_id
			} = data;
			result = await addCoupon(id, maxnum, yl_num, fx_num, usertype, usarr, user_id);
		} else if (functionName === 'addToCart') {
			const {
				user_id,
				goods_id,
				control,
				specSelected,
				suks_price,
				numberl
			} = data;
			result = await addToCart(user_id, goods_id, control, specSelected, suks_price, numberl);
		} else if (functionName === 'getCouponsByTime') {
			const {
				user_id,
				goods_id,
				currentTime
			} = data;
			result = await getCouponsByTime(user_id, goods_id);
		} else if (functionName === 'orderDate') {
			const {
				userid,
				commpropo
			} = data;
			result = await orderDate(userid, commpropo);
		} else if (functionName == 'myCoupon') {
			result = await getmyCoupon(data);
		} else {
			throw new Error('Invalid functionName');
		}

		return result;
	} catch (err) {
		throw err;
	}
};

async function getCartData(user_id) {
	try {
		const res = await db.collection("jlg-goods-cart")
			.aggregate()
			.lookup({
				from: "opendb-mall-goods",
				localField: "goods_id",
				foreignField: "_id",
				as: "goods_info"
			})
			.addFields({
				id: '$goods_info._id',
				gssuks: '$goods_info.suks',
				fs_gssuks: '$goods_info.fs_suks',
				image: '$goods_info.goods_thumb',
				title: '$goods_info.name',
				stock: '$goods_info.remain_count',
				services: '$goods_info.goods_services',
				crossed_price: '$goods_info.crossed_price'
			})
			.match({
				"user_id": user_id,
				"goods_info.is_on_sale": true
			})
			.sort({
				"create_date": -1,
				"modify_date": -1
			})
			.end();

		const cartList = res.data;
		cartList.forEach((item) => {
			item.efficacy = false;
			if (!item.goods_seckill) {
				item.gssuks[0].forEach((items) => {
					if (items.specs.every((value, index) => value === item.goods_suk
							.specs[index])) {
						item.goods_suk = items;
						item.efficacy = true;
					}
				});
			} else {
				item.fs_gssuks[0].forEach((items) => {
					if (items.specs.every((value, index) => value === item.goods_suk
							.specs[index])) {
						item.goods_suk = items;
						item.efficacy = true;
					}
				});
			}
		});

		const empty = cartList.length === 0;

		return {
			cartList: cartList,
			empty: empty
		};
	} catch (err) {
		throw err;
	}
}

async function getCouponData(e) {
	const currentTime = Date.now();
	const where = {
		"state": '已发放',
		"user_type": db.command.nin(['会员权益', 'vip', 'svip']),
		"end_time": db.command.gt(currentTime),
		"start_time": db.command.lt(currentTime)
	};

	if (e == 1) {
		where.allow_type = '所有商品';
		where.user_type = '所有人';
	} else if (e == 2) {
		where.allow_type = '指定商品';
		where.user_type = '所有人';
	} else if (e == 3) {
		where.user_type = '指定用户';
	}

	try {
		const res = await db.collection("jlg-goods-couponrule")
			.where(where)
			.get();

		const couponList = res.data;

		// 返回couponList给调用方
		return couponList;
	} catch (err) {
		throw err;
	}
}

async function addCoupon(id, maxnum, yl_num, fx_num, usertype, usarr, user_id) {
	if (yl_num == fx_num) {
		return {
			success: false,
			message: '优惠券被抢完了'
		};
	}

	if (usertype == '指定用户' && !usarr.includes(user_id)) {
		return {
			success: false,
			message: '专享用户可领'
		};
	}

	const res1 = await db.collection("jlg-goods-coupon").where({
		"user_id": user_id,
		"coupon_id": id,
	}).get();

	if (res1.data.length >= maxnum) {
		return {
			success: false,
			message: '已经领取过了'
		};
	}

	const res2 = await db.collection("jlg-goods-coupon").where({
		"user_id": user_id,
		"coupon_id": id,
		"is_use": false
	}).get();

	if (res2.data.length > 0) {
		return {
			success: false,
			message: '请使用后再来'
		};
	}

	try {
		await db.collection("jlg-goods-coupon").add({
			"coupon_id": id,
			"user_id": user_id,
			"is_use": false
		});
		// 更新 received_number 字段
		await db.collection("jlg-goods-couponrule").doc(id).update({
			"received_number": yl_num + 1
		});

		// 返回成功消息
		return {
			success: true,
			message: '领取成功'
		};
	} catch (error) {
		console.error("领取失败", error);
		return {
			success: false,
			message: '领取失败'
		};
	}
}

async function addToCart(user_id, goods_id, control, specSelected, suks_price, numberl) {
	const suk = {
		specs: specSelected.map(item => item.name),
		price: suks_price
	};

	try {
		const res = await db.collection("jlg-goods-cart").where({
			"user_id": user_id,
			"goods_id": goods_id,
			"goods_seckill": control
		}).get();

		const cartData = res.data;
		const foundItem = cartData.find(item =>
			item.goods_suk.specs.length === suk.specs.length &&
			item.goods_suk.specs.every(value => suk.specs.includes(value)) &&
			item.goods_suk.price === suk.price
		);

		if (foundItem) {
			await db.collection("jlg-goods-cart").doc(foundItem._id).update({
				"goods_number": foundItem.goods_number + numberl,
				"modify_date": Date.now()
			});
		} else {
			await db.collection("jlg-goods-cart").add({
				"user_id": user_id,
				"goods_id": goods_id,
				"goods_suk": suk,
				"goods_seckill": control,
				"goods_number": numberl,
				"create_date": Date.now()
			});
		}

		return {
			success: true,
			message: '加购成功'
		};
	} catch (err) {
		console.error("加购失败", err);
		return {
			success: false,
			message: err.message || '加购失败'
		};
	}
}

async function getCouponsByTime(user_id, goods_id) {
	let time = Date.now();
	let coupomFalse = false
	try {
		const res = await db.collection("jlg-goods-coupon").aggregate()
			.lookup({
				from: "jlg-goods-couponrule",
				localField: "coupon_id",
				foreignField: "_id",
				as: "coupon_info"
			})
			.addFields({
				allowType: '$coupon_info.allow_type',
				goodsArr: '$coupon_info.goods_arr',
				isShare: '$coupon_info.is_share',
				State: '$coupon_info.state',
				startTime: '$coupon_info.start_time',
				endTime: '$coupon_info.end_time',
				orderAmount: '$coupon_info.order_amount',
				userType: '$coupon_info.user_type',
				userArr: '$coupon_info.user_arr',
				Price: '$coupon_info.price',
				couponName: '$coupon_info.name',
				couponType: '$coupon_info.type',
				crossedPrice: '$coupon_info.crossed_price',
			})
			.match({
				"user_id": user_id,
				"is_use": false,
				"coupon_info.end_time": db.command.gt(time),
				"coupon_info.start_time": db.command.lt(time),
			}).end();

		const couponList = res.data;
		couponList.forEach(item => {
			if (item.allowType[0] !== '指定商品' || goods_id.some(id => item.goodsArr[0].includes(id))) {
				coupomFalse = true;
			}
		});

		return {
			coupomFalse: coupomFalse,
			data: couponList
		};
	} catch (err) {
		console.error("获取优惠券失败", err);
		return {
			coupomFalse: coupomFalse,
			message: err.message || '获取优惠券失败'
		};
	}
}

async function orderDate(userid, commpropo) {
	const orderList = [];

	try {
		const res = await db.collection("uni-pay-orders").aggregate().lookup({
			from: "uni-id-users",
			localField: "user_id",
			foreignField: "_id",
			as: "user_info"
		}).addFields({
			suboname: '$user_info.nickname',
			avatarimg: '$user_info.avatar_file'
		}).match({
			"user_info._id": db.command.in(userid),
			"is_distr": true,
			"status": db.command.gt(0).and(db.command.neq(2, 3, 6))
		}).sort({
			create_date: -1
		}).end();

		if (res.data.length > 0) {
			res.data.forEach((item) => {
				item.grade = "一级";
				item.comm = Math.floor(item.total_fee * (commpropo.one_pro / 100));
				orderList.push(item);
			});
		}

		for (let i = 0; i < userid.length; i++) {
			const res1 = await db.collection("jlg-distribution").where({
				"user_id": userid[i]
			}).get();
			console.log(res1.data)
			if (res1.data.length > 0 && res1.data[0].user_arr.length > 0) {
				const res2 = await db.collection("uni-pay-orders").aggregate().lookup({
					from: "uni-id-users",
					localField: "user_id",
					foreignField: "_id",
					as: "user_info"
				}).addFields({
					suboname: '$user_info.nickname',
					avatarimg: '$user_info.avatar_file'
				}).match({
					"user_info._id": db.command.in(res1.data[0].user_arr),
					"is_distr": true,
					"status": db.command.gt(0).and(db.command.neq(2, 3, 6))
				}).sort({
					create_date: -1
				}).end();

				if (res2.data.length > 0) {
					res2.data.forEach((item) => {
						item.grade = "二级";
						item.comm = Math.floor(item.total_fee * (commpropo.two_pro / 100));
						orderList.push(item);
					});
				}

				for (let ii = 0; ii < res1.data[0].user_arr.length; ii++) {
					const res3 = await db.collection("jlg-distribution").where({
						"user_id": res1.data[0].user_arr[ii]
					}).get();

					if (res3.data.length > 0 && res3.data[0].user_arr.length > 0) {
						const res4 = await db.collection("uni-pay-orders").aggregate().lookup({
							from: "uni-id-users",
							localField: "user_id",
							foreignField: "_id",
							as: "user_info"
						}).addFields({
							suboname: '$user_info.nickname',
							avatarimg: '$user_info.avatar_file'
						}).match({
							"user_info._id": db.command.in(res3.data[0].user_arr),
							"is_distr": true,
							"status": db.command.gt(0).and(db.command.neq(2, 3, 6))
						}).sort({
							create_date: -1
						}).end();

						if (res4.data.length > 0) {
							res4.data.forEach((item) => {
								item.grade = "三级";
								item.comm = Math.floor(item.total_fee * (commpropo.three_pro / 100));
								orderList.push(item);
							});
						}
					}
				}
			}
		}

		return {
			success: true,
			data: orderList
		};
	} catch (err) {
		console.error("获取订单数据失败", err);
		return {
			success: false,
			message: err.message || '获取订单数据失败'
		};
	}
}
// 我的优惠券
async function getmyCoupon(data) {
	try {
		const currentTime = Date.now();
		let where = {
			"user_id": data.userid,
		};
		if (data.current == 1) {
			where = {
				"user_id": data.userid,
				"is_use": false,
				"couponList.end_time": db.command.gte(currentTime)
			}
		} else if (data.current == 2) {
			where = {
				"user_id": data.userid,
				"is_use": true
			}
		} else if (data.current == 3) {
			where = {
				"user_id": data.userid,
				"is_use": false,
				"couponList.end_time": db.command.lt(currentTime)
			}
		}
		const res = await db.collection("jlg-goods-coupon").aggregate()
			.lookup({
				from: "jlg-goods-couponrule",
				localField: 'coupon_id',
				foreignField: '_id',
				as: "couponList"
			})
			.match(where).end();

		return res.data;
	} catch (err) {
		throw err;
	}
}