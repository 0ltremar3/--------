const db = uniCloud.database();
const _ = db.command;
const dbName = "jlg-goods-record";

exports.main = async (event, context) => {
	let time = Date.now();
	let res = await db.collection(dbName).where({
		"user_id": event.user_id,
		"goods_id": event.id
	}).get();

	if (res.data.length === 0) {
		try {
			await db.collection(dbName).add({
				"user_id": event.user_id,
				"goods_id": event.id,
				"modify_date": time
			});
			return {
				success: true,
				message: "新增记录成功"
			};
		} catch (err) {
			return {
				success: false,
				message: "新增记录失败"
			};
		}
	} else {
		try {
			await db.collection(dbName).where({
				"user_id": event.user_id,
				"goods_id": event.id
			}).update({
				"modify_date": time
			});
			return {
				success: true,
				message: "修改记录成功"
			};
		} catch (err) {
			return {
				success: false,
				message: "修改记录失败"
			};
		}
	}
};