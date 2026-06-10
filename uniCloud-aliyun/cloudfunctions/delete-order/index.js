const db = uniCloud.database();
const _ = db.command;
const dbName = {
	payOrders: "uni-pay-orders"
};

// 云函数定时每天00点执行取消24小时内未付款的订单
async function main(event, context) {
	const time = Date.now() - 1000 * 60 * 60 * 24;

	const ress = await db.collection(dbName.payOrders).where({
		status: _.in([0]),
		create_date: _.lt(time)
	}).get();

	for (const order of ress.data) {
		// 还原优惠卷使用状态
		for (const item of order.preferential) {
			await db.collection("jlg-goods-coupon").doc(item.id).update({
				"is_use": false
			});
		}

		// 还原商品库存及销量
		for (const item of order.goods_arr) {
			const goods = await db.collection("opendb-mall-goods").doc(item.goods_id).get();
			await db.collection("opendb-mall-goods").doc(item.goods_id).update({
				"remain_count": goods.data[0].remain_count + item.goods_num,
				"total_sell_count": goods.data[0].total_sell_count - item.goods_num
			});
		}

		// 取消订单
		await db.collection("uni-pay-orders").doc(order._id).update({
			"status": -1
		});
	}

	return ress.data.length > 0 ? ress.data.length : 0;
}

exports.main = main;