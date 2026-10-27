const db = uniCloud.database();
const uniId = require('uni-id-common');
const first = res => Array.isArray(res.data) ? res.data[0] : res.data;
module.exports = {
	async add(sharerId) {
		let tx;
		try {
			const auth = await uniId.createInstance({ clientInfo: this.getClientInfo() }).checkToken(this.getUniIdToken());
			if (auth.errCode || !auth.uid) return { errCode: 'LOGIN_REQUIRED', errMsg: '请先登录' };
			const uid = auth.uid; // Legacy second argument is intentionally ignored.
			if (typeof sharerId !== 'string' || !/^[\w-]{1,128}$/.test(sharerId) || ['null', 'undefined'].includes(sharerId)) return { errCode: 'INVALID_PARAM', errMsg: '推广来源无效' };
			if (uid === sharerId) return { errCode: 'SELF_REFERRAL', errMsg: '不能绑定自己' };
			tx = await db.startTransaction();
			// Serialize competing first binds through the same user document, including different referrers.
			const users = tx.collection('uni-id-users');
			const user = first(await users.doc(uid).get());
			const sharer = first(await users.doc(sharerId).get());
			if (!user || !sharer) { await tx.rollback(); return { errCode: 'INELIGIBLE_REFERRER', errMsg: '用户或推广人不存在' }; }
			const relations = db.collection('jlg-distribution');
			const existing = (await relations.where({ user_arr: uid }).limit(1).get()).data[0];
			if (user.share_parent_id || existing) { await tx.rollback(); return { errCode: 0, status: 'already-bound' }; }
			const cycle = (await relations.where({ user_id: uid, user_arr: sharerId }).limit(1).get()).data[0];
			if (cycle) { await tx.rollback(); return { errCode: 'CYCLE_REFERRAL', errMsg: '不能绑定自己的下级' }; }
			const candidate = (await relations.where({ user_id: sharerId }).limit(1).get()).data[0];
			const parent = candidate && first(await tx.collection('jlg-distribution').doc(candidate._id).get());
			if (!parent || parent.user_id !== sharerId || !Array.isArray(parent.user_arr)) { await tx.rollback(); return { errCode: 'INELIGIBLE_REFERRER', errMsg: '推广人不具备分销资格' }; }
			await users.doc(uid).update({ share_parent_id: sharerId });
			await tx.collection('jlg-distribution').doc(parent._id).update({ user_arr: [...new Set([...parent.user_arr, uid])] });
			await tx.commit();
			return { errCode: 0, status: 'bound' };
		} catch (_) {
			if (tx) { try { await tx.rollback(); } catch (_) {} }
			return { errCode: 'BIND_SERVICE_ERROR', errMsg: '推广关系绑定暂不可用，请重试' };
		}
	}
};
