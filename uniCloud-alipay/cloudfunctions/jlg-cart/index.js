const db = uniCloud.database();
const $ = db.command.aggregate;
const skuModel = require('jlg-commerce');
const { getDocument, findDocuments } = require('jlg-commerce/db');
const uniId = require('uni-id-common');

exports.main = async (event, context) => {
	const functionName = event.functionName;
	const data = event.data || {};
	if (['cartdata', 'addToCart', 'addCoupon'].includes(functionName)) {
		const auth = await uniId.createInstance({ clientInfo: context }).checkToken(event.uniIdToken);
		if (auth.errCode || !auth.uid) throw new Error('请重新登录');
		data.user_id = auth.uid;
	}

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
			result = await addToCart(user_id, goods_id, control, specSelected, suks_price, numberl, data.sku_id);
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
		cartList.forEach(item => {
			item.efficacy = false;
			try {
				const goods = skuModel.normalize(item.goods_info[0]);
				if (item.goods_seckill && !goods.is_new) return;
				item.goods_suk = skuModel.resolve(goods, item.goods_suk, item.goods_seckill);
				item.efficacy = item.goods_suk.inventory > 0;
			} catch (_) { /* Keep unavailable rows visible for removal. */ }
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
	return skuModel.transaction(db, async tx => {
		const rule = await getDocument(tx, 'jlg-goods-couponrule', id);
		const now = Date.now();
		if (!rule || rule.state !== '已发放' || rule.start_time > now || rule.end_time <= now) throw new Error('优惠券已失效');
		if (!['所有人', '指定用户'].includes(rule.user_type) || (rule.user_type === '指定用户' && !(rule.user_arr || []).includes(user_id))) throw new Error('不可领取此优惠券');
		skuModel.integer(rule.max_number, '每人领取限额', 1);
		skuModel.integer(rule.number, '发行数量', 1);
		if ((rule.received_number || 0) >= rule.number) throw new Error('优惠券已领完');
		const owned = await findDocuments(db, tx, 'jlg-goods-coupon', { user_id, coupon_id: id });
		if (owned.length >= rule.max_number || owned.some(item => !item.is_use)) throw new Error('已经领取过了，请先使用');
		await tx.collection('jlg-goods-coupon').add({ user_id, coupon_id: id, is_use: false, create_time: now });
		await tx.collection('jlg-goods-couponrule').doc(id).update({ received_number: db.command.inc(1) });
		return { success: true, message: '领取成功' };
	});
}

async function addToCart(user_id, goods_id, control, specSelected, suks_price, numberl, sku_id) {
	return skuModel.transaction(db, async tx => {
		skuModel.integer(numberl, '购买数量', 1);
		const raw = await getDocument(tx, 'opendb-mall-goods', goods_id);
		if (!raw || !raw.is_on_sale || (control && !raw.is_new)) throw new Error('商品已下架或活动已结束');
		const goods = skuModel.normalize(raw);
		const row = skuModel.resolve(goods, { sku_id, specs: (specSelected || []).map(item => item.name) }, control === true);
		const cart = await findDocuments(db, tx, 'jlg-goods-cart', { user_id, goods_id, goods_seckill: control === true });
		const matches = cart.filter(item => { try { return skuModel.resolve(goods, item.goods_suk, control === true).sku_id === row.sku_id; } catch (_) { return false; } });
		const quantity = matches.reduce((sum, item) => sum + item.goods_number, numberl);
		if (quantity > row.inventory) throw new Error('库存不足');
		const value = { user_id, goods_id, goods_seckill: control === true, goods_suk: row, goods_number: quantity, modify_date: Date.now() };
		if (matches.length) {
			await tx.collection('jlg-goods-cart').doc(matches[0]._id).update(value);
			for (const duplicate of matches.slice(1)) await tx.collection('jlg-goods-cart').doc(duplicate._id).remove();
		} else {
			const key = require('crypto').createHash('sha256').update(JSON.stringify([user_id, goods_id, control === true, row.sku_id])).digest('hex').slice(0, 32);
			await tx.collection('jlg-goods-cart').add({ ...value, _id: key, create_date: Date.now() });
		}
		await tx.collection('opendb-mall-goods').doc(goods_id).update({ suks: goods.suks, fs_suks: goods.fs_suks });
		return { success: true, message: '加购成功' };
	});
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
