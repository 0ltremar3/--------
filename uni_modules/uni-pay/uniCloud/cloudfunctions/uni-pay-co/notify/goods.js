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
		custom
	} = data; // uni-pay-orders 表内的数据均可获取到
	if (custom) {
		if (custom.cid) {
			//修改商品领取状态
			await db.collection("jlg-warehouse").doc(custom.cid).update({
				state: '已领取'
			})
		}
	}
	// 此处写你自己的支付成功逻辑结束-----------------------------------------------------------
	// user_order_success =  true 代表你自己的逻辑处理成功 返回 false 代表你自己的处理逻辑失败。
	return user_order_success;
};