// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
module.exports = {
	// _before: function () { // 通用预处理器

	// },
	async add(dicrID, user_id) {
		// 参数校验，如无参数则不需要
		if (!dicrID && !user_id) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '参数不能为空'
			}
		}
		try {
			// 查询当前用户是否是经销商的上级
			let its = await db.collection("jlg-distribution").where({
				user_id: user_id,
				user_arr: dicrID
			}).get();

			if (its.data.length > 0) {
				return "当前用户是经销商的上级,绑定失败"
			}
			//查询当前下级是否真实存在
			const xjuser = await db.collection('uni-id-users').doc(dicrID).get();
			if (xjuser.data.length == 0) {
				return "下级不存在，绑定失败"
			}
			//查询当前上级是否真实存在
			const sjuser = await db.collection('uni-id-users').doc(user_id).get();
			if (sjuser.data.length == 0) {
				return "上级不存在，绑定失败"
			}
			if (user_id == dicrID) {
				return "不能绑定自己"
			}
			//查询分销商的下级是否存在当前用户
			const res1 = await db.collection("jlg-distribution").where({
				"user_arr": user_id
			}).get();
			if (res1.data.length == 0) {
				const res3 = await db.collection("jlg-distribution").where({
					"user_id": dicrID
				}).get();
				let newarr = [];
				if (res3.data[0].user_arr.length > 0) {
					newarr = res3.data[0].user_arr;
					newarr.push(user_id);
					await db.collection("jlg-distribution").where({
						"user_id": dicrID
					}).update({
						"user_arr": newarr
					});
					// return {
					// 	errCode: 0,
					// 	errMsg: '处理成功'
					// };
				} else {
					newarr.push(user_id);
					await db.collection("jlg-distribution").where({
						"user_id": dicrID
					}).update({
						"user_arr": newarr
					});
					// return {
					// 	errCode: 0,
					// 	errMsg: '处理成功'
					// };
				}
			} else {
				return "用户已绑定上级"
			}
			// return {
			// 	errCode: 0,
			// 	errMsg: '处理成功'
			// };
		} catch (err) {
			console.error(err);
			// return {
			// 	errCode: -1,
			// 	errMsg: '处理失败'
			// };
		}
		// 返回结果
		return {
			dicrID //请根据实际需要返回值
		}
	}
}