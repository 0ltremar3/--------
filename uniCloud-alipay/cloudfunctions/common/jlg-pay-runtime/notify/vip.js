'use strict';
/**
 * 此处建议只改下订单状态，保证能及时返回给第三方支付服务器成功状态
 * 限制4秒内必须执行完全部的异步回调逻辑，建议将消息发送、返佣、业绩结算等业务逻辑异步处理（如用定时任务去处理这些异步逻辑）
 * 建议再判断下金额和你业务系统订单中的金额是否一致
 */

const payCrypto = require('../libs/crypto.js'); // 获取加密服务
const db = uniCloud.database();
module.exports = async (obj) => {
	let user_order_success = true;
	let {
		data = {}
	} = obj;
	let {
		order_no,
		out_trade_no,
		total_fee,
		user_id,
		nickname,
		custom,
		pay_date
	} = data; // uni-pay-orders 表内的数据均可获取到
	const time = Date.now();
	// 获取当前用户会员表数据
	let res = await db.collection("jlg-member").where({
		user_id: user_id
	}).get();
	// 获取会员价格等参数
	let uls = await db.collection("jlg-parameter").get();
	let gswhere = {};
	if (custom.grade == 0 || custom.grade == 1) {
		gswhere = {
			vip_goods: custom.grade == 0 ? 'svip' : 'vip'
		}
	}
	// 查询会员权益商品
	let vip_goods = await db.collection("opendb-mall-goods").where(gswhere).get();
	// 会员权益券数据
	let vrswhere = {}
	if (custom.grade != 3) {
		vrswhere = {
			user_type: custom.grade == 0 ? 'svip' : 'vip'
		}
	} else {
		// 升级时的条件
		vrswhere = {
			user_type: '佳茗卡'
		}
	}
	// 查询优惠券规则
	let vsr = await db.collection("jlg-goods-couponrule").where(vrswhere).get();
	// 如果要开通的等级和开通的价格无误
	if ((custom.grade == 0 && total_fee == uls.data[0].svip) || (custom.grade == 1 && total_fee == uls.data[0]
			.vip)) {
		if (res.data.length == 0 && (custom.grade == 0 || custom.grade == 1)) {
			// 正常流程开通一年
			await db.collection("jlg-member").add({
				user_id: user_id,
				grade: custom.grade,
				opening_time: pay_date,
				failure_time: pay_date + (365 * 24 * 60 * 60 * 1000), //一年后的时间戳
				order_no: [order_no]
			})
			// 赠送会员权益券
			if (vsr.data.length > 0) {
				await giveCoupon(user_id, vsr.data, pay_date);
			}
			// 赠送12月免费商品
			if (vip_goods.data.length > 0) {
				await addWarehouse(user_id, vip_goods.data[0]._id, pay_date);
			}

			return {
				success: true,
				msg: '开通成功'
			}
		} else if (res.data.length != 0 && time < res.data[0].failure_time) {
			// 用户续费走这里,还未过期再次开通
			let orderArray = [];
			orderArray = res.data[0].order_no;
			orderArray.push(order_no);
			await db.collection("jlg-member").doc(res.data[0]._id).update({
				failure_time: res.data[0].failure_time + (365 * 24 * 60 * 60 * 1000), //一年后的时间戳
				order_no: orderArray,
			})
			// 赠送会员权益券
			if (vsr.data.length > 0) {
				await giveCoupon(user_id, vsr.data, res.data[0].failure_time);
			}
			// 赠送12月免费商品
			if (vip_goods.data.length > 0) {
				await addWarehouse(user_id, vip_goods.data[0]._id, res.data[0].failure_time);
			}

			return {
				success: true,
				msg: '续费成功'
			}
		} else if (res.data.length != 0 && time > res.data[0].failure_time) {
			// 用户会员已经过期再次开通走这里
			await db.collection("jlg-member").doc(res.data[0]._id).update({
				grade: custom.grade,
				opening_time: pay_date,
				failure_time: pay_date + (365 * 24 * 60 * 60 * 1000), //一年后的时间戳
				order_no: [order_no]
			})
			// 赠送会员权益券
			if (vsr.data.length > 0) {
				await giveCoupon(user_id, vsr.data, pay_date);
			}
			// 赠送12月免费商品
			if (vip_goods.data.length > 0) {
				await addWarehouse(user_id, vip_goods.data[0]._id, pay_date);
			}

			return {
				success: true,
				msg: '开通成功'
			}
		} else {
			return {
				success: true,
				msg: '未知错误'
			}
		}

	} else {
		return {
			success: false,
			msg: '价格与对应会员等级不符'
		}
	}
};
// 赠送会员权益券
async function giveCoupon(user_id, couponRules, pay_date) {
	for (let i = 0; i < couponRules.length; i++) {
		const ivsr = await db.collection("jlg-goods-couponrule").add({
			type: couponRules[i].type,
			name: couponRules[i].name,
			price: couponRules[i].price,
			user_type: '会员权益',
			user_arr: [],
			order_amount: couponRules[i].order_amount,
			start_time: pay_date,
			allow_type: couponRules[i].allow_type,
			goods_arr: couponRules[i].goods_arr,
			is_share: false,
			state: '已发放',
			end_time: pay_date + (365 * 24 * 60 * 60 * 1000),
		});

		for (let c = 0; c < couponRules[i].number; c++) {
			await db.collection("jlg-goods-coupon").add({
				coupon_id: ivsr.id,
				user_id: user_id,
				is_use: false,
				create_time: pay_date
			});
		}
	}
}
// 赠送每月免费商品
async function addWarehouse(user_id, goods_id, start_time) {
	let jtime = start_time;
	for (let i = 0; i < 12; i++) {
		if (i > 0) {
			jtime += 30 * 24 * 60 * 60 * 1000;
		}
		await db.collection("jlg-warehouse").add({
			user_id: user_id,
			goods_id: goods_id,
			start_time: jtime,
			end_time: jtime + (30 * 24 * 60 * 60 * 1000),
			state: "待领取"
		})
	}
}