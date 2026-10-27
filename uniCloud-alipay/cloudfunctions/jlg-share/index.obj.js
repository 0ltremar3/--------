const crypto = require('crypto');
const uniId = require('uni-id-common');
const bridge = require('uni-open-bridge-common');
const configCenter = require('uni-config-center');
const db = uniCloud.database();
const first = res => Array.isArray(res.data) ? res.data[0] : res.data;
const PAGE = 'pages/product/product';
const WIDTH = 1024;
const VERSION = 1;
const fail = (errCode, errMsg) => { throw Object.assign(new Error(errMsg), { errCode }); };
const idValid = value => typeof value === 'string' && /^[\w-]{1,128}$/.test(value) && !['null', 'undefined'].includes(value);
const result = record => ({ errCode: 0, scene: record.scene, fileID: record.fileID, envVersion: record.envVersion, width: WIDTH });
async function goodsAvailable(id) {
	const { data } = await db.collection('opendb-mall-goods').doc(id).get();
	if (!data[0] || data[0].is_on_sale !== true) fail('GOODS_UNAVAILABLE', '商品不存在或已下架');
}
function settings() {
	const config = configCenter({ pluginId: 'jlg-share' }).config();
	if (!config || !config.dcloudAppid || !config.weixinAppid || !Array.isArray(config.allowedEnvironments)) fail('CONFIG_MISSING', '商品码服务配置缺失');
	const all = configCenter({ pluginId: 'uni-id' }).config();
	const app = Array.isArray(all) ? all.find(item => item.dcloudAppid === config.dcloudAppid) : all;
	const oauth = app && app['mp-weixin'] && app['mp-weixin'].oauth && app['mp-weixin'].oauth.weixin;
	if (!oauth || oauth.appid !== config.weixinAppid || !oauth.appsecret) fail('CONFIG_MISSING', '微信小程序凭据缺失或 AppID 不一致');
	return config;
}
async function requestImage(config, record) {
	const key = { dcloudAppid: config.dcloudAppid, appid: config.weixinAppid, provider: 'weixin-mp' };
	for (let attempt = 0; attempt < 2; attempt++) {
		const token = await bridge.getAccessToken(key);
		if (!token || !token.access_token) fail('TOKEN_UNAVAILABLE', '微信凭据暂不可用，请重试');
		const response = await uniCloud.httpclient.request('https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + encodeURIComponent(token.access_token), {
			method: 'POST', contentType: 'json', dataType: 'buffer', timeout: 5000,
			data: { page: PAGE, scene: record.scene, env_version: record.envVersion, check_path: record.envVersion === 'release', width: WIDTH }
		});
		const data = Buffer.isBuffer(response.data) ? response.data : Buffer.from(JSON.stringify(response.data || {}));
		let error;
		try { error = JSON.parse(data.toString('utf8')); } catch (_) { /* binary image */ }
		if (error && [40001, 40014, 42001].includes(error.errcode) && attempt === 0) {
			await bridge.removeAccessToken(key);
			continue;
		}
		const type = String((response.headers || {})['content-type'] || '').toLowerCase();
		const png = data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
		const jpeg = data.length > 3 && data[0] === 255 && data[1] === 216 && data[2] === 255;
		if (response.status !== 200 || error || !type.startsWith('image/') || (!png && !jpeg)) fail('WECHAT_CODE_FAILED', '微信制码失败，请检查服务端配置后重试');
		return { data, extension: png ? 'png' : 'jpg' };
	}
}
// A missing file is repaired with the SAME persistent scene; transient storage errors never invalidate it.
async function fileExists(fileID) {
	const res = await uniCloud.getTempFileURL({ fileList: [fileID] });
	const file = res.fileList && res.fileList[0];
	if (!file || !file.tempFileURL) fail('STORAGE_UNAVAILABLE', '商品码文件暂不可用，请重试');
	const response = await uniCloud.httpclient.request(file.tempFileURL, { method: 'HEAD', timeout: 3000 });
	if (response.status === 404) return false;
	if (response.status !== 200) fail('STORAGE_UNAVAILABLE', '商品码文件暂不可用，请重试');
	return true;
}
module.exports = {
	async getProductCode(input = {}) {
		let record, owner, uploaded;
		try {
			const auth = await uniId.createInstance({ clientInfo: this.getClientInfo() }).checkToken(this.getUniIdToken());
			if (auth.errCode || !auth.uid) fail('LOGIN_REQUIRED', '请先登录后生成商品码');
			if (!idValid(input.goodsId) || !['trial', 'develop', 'release'].includes(input.envVersion)) fail('INVALID_PARAM', '商品或小程序环境无效');
			const config = settings();
			if (!config.allowedEnvironments.includes(input.envVersion)) fail('ENV_NOT_ENABLED', '当前小程序版本尚未开放制码');
			await goodsAvailable(input.goodsId);
			const cacheKey = crypto.createHash('sha256').update(JSON.stringify([config.weixinAppid, input.envVersion, PAGE, input.goodsId, auth.uid, VERSION, WIDTH])).digest('hex');
			const cacheStarted = Date.now();
			const codes = db.collection('jlg-share-codes');
			record = (await codes.doc(cacheKey).get()).data[0];
			if (!record) {
				const value = { _id: cacheKey, cacheKey, scene: crypto.randomBytes(12).toString('hex'), goodsId: input.goodsId, sharerId: auth.uid, weixinAppid: config.weixinAppid, page: PAGE, envVersion: input.envVersion, version: VERSION, width: WIDTH, status: 'pending', leaseUntil: 0, createdAt: Date.now() };
				try { await codes.add(value); } catch (error) {
					if (!(await codes.doc(cacheKey).get()).data[0]) throw error;
				}
				record = (await codes.doc(cacheKey).get()).data[0];
			}
			console.info('[share] cache-query-ms', Date.now() - cacheStarted);
			if (record.disabled) fail('SCENE_DISABLED', '该商品码已停用');
			if (record.status === 'ready' && record.fileID && await fileExists(record.fileID)) return result(record);
			owner = crypto.randomBytes(12).toString('hex');
			const now = Date.now();
			// Transaction serializes both per-key leases and the user's minute quota across instances.
			const tx = await db.startTransaction();
			try {
				const fresh = first(await tx.collection('jlg-share-codes').doc(cacheKey).get());
				if (fresh.status === 'ready' && fresh.fileID && fresh.fileID !== record.fileID) { await tx.rollback(); return result(fresh); }
				if (fresh.leaseUntil > now) fail('CODE_BUSY', '商品码正在生成，请稍后重试');
				const limitId = crypto.createHash('sha256').update(auth.uid).digest('hex');
				const limits = tx.collection('jlg-share-limits');
				const limit = first(await limits.doc(limitId).get());
				const count = limit && limit.window > now - 60000 ? limit.count : 0;
				if (count >= 10) fail('RATE_LIMIT', '生成过于频繁，请一分钟后重试');
				const quota = { count: count + 1, window: count ? limit.window : now };
				if (limit) await limits.doc(limitId).update(quota);
				else await limits.add({ _id: limitId, ...quota });
				await tx.collection('jlg-share-codes').doc(cacheKey).update({ owner, status: 'generating', leaseUntil: now + 30000, updatedAt: now });
				await tx.commit();
			} catch (error) { try { await tx.rollback(); } catch (_) {} throw error; }
			const requestStarted = Date.now();
			const image = await requestImage(config, record);
			console.info('[share] wechat-request-ms', Date.now() - requestStarted);
			const uploadStarted = Date.now();
			const file = await uniCloud.uploadFile({ cloudPath: `share-codes/${record.scene}-${owner}.${image.extension}`, fileContent: image.data });
			console.info('[share] upload-ms', Date.now() - uploadStarted);
			uploaded = file.fileID;
			if (!uploaded) fail('UPLOAD_FAILED', '商品码上传失败，请重试');
			const saved = await db.collection('jlg-share-codes').where({ _id: record._id, owner }).update({ fileID: uploaded, status: 'ready', leaseUntil: 0, updatedAt: Date.now() });
			if (!saved.updated) fail('CODE_BUSY', '生成任务已更新，请重试');
			return result({ ...record, fileID: uploaded });
		} catch (error) {
			if (record && owner) {
				// Read before cleanup: an uncertain write may already have committed successfully.
				try {
					const current = (await db.collection('jlg-share-codes').doc(record._id).get()).data[0];
					if (uploaded && current && current.fileID !== uploaded) await uniCloud.deleteFile({ fileList: [uploaded] });
					await db.collection('jlg-share-codes').where({ _id: record._id, owner, status: 'generating' }).update({ status: 'pending', leaseUntil: 0 });
				} catch (_) { /* Lease expiry allows recovery; never delete a possibly referenced file. */ }
			}
			return { errCode: error.errCode || 'CODE_SERVICE_ERROR', errMsg: error.errCode ? error.message : '商品码服务暂不可用，请重试' };
		}
	},
	async resolveScene(input = {}) {
		try {
			if (typeof input.scene !== 'string' || !/^[a-f0-9]{24}$/.test(input.scene)) fail('INVALID_SCENE', '商品码无效');
			const record = (await db.collection('jlg-share-codes').where({ scene: input.scene }).limit(1).get()).data[0];
			if (!record || record.disabled || !idValid(record.goodsId) || !idValid(record.sharerId)) fail('SCENE_UNAVAILABLE', '商品码不存在或已停用');
			await goodsAvailable(record.goodsId);
			return { errCode: 0, goodsId: record.goodsId, sharerId: record.sharerId, envVersion: record.envVersion };
		} catch (error) { return { errCode: error.errCode || 'SCENE_SERVICE_ERROR', errMsg: error.errCode ? error.message : '商品码解析失败，请重试' }; }
	}
};
