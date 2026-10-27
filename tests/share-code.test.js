const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { database } = require('./helpers/commerce-db');
function fixture() {
	const db = database({ 'opendb-mall-goods': { good: { _id: 'good', is_on_sale: true } }, 'uni-id-users': { buyer: { _id: 'buyer' }, promoter: { _id: 'promoter' }, other: { _id: 'other' } }, 'jlg-distribution': { parent: { _id: 'parent', user_id: 'promoter', user_arr: [] }, other: { _id: 'other', user_id: 'other', user_arr: [] } } });
	const state = { calls: 0, uploads: 0, refreshes: 0, deleted: [], error: null, uploadFail: false, head: 200 };
	const config = { dcloudAppid: 'app', weixinAppid: 'wx-test', allowedEnvironments: ['trial', 'develop', 'release'] };
	const cloud = { database: () => db,
		getTempFileURL: async () => ({ fileList: [{ tempFileURL: 'https://storage.test/code' }] }),
		uploadFile: async () => { state.uploads++; if (state.uploadFail) throw Error('upload'); return { fileID: 'cloud://' + state.uploads }; },
		deleteFile: async ({ fileList }) => state.deleted.push(...fileList),
		httpclient: { request: async (url, options) => {
			if (state.timeout) throw Error('timeout');
			if (options.method === 'HEAD') return { status: state.head };
			state.calls++;
			assert.equal(options.data.width, 1024); assert.equal(options.data.check_path, options.data.env_version === 'release');
			if (state.error) { const err = state.error; if (state.once) state.error = null; return { status: 200, headers: { 'content-type': 'application/json' }, data: Buffer.from(JSON.stringify(err)) }; }
			return { status: 200, headers: { 'content-type': 'image/png' }, data: Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0]) };
		} }
	};
	function load(file, uid = 'promoter') {
		const context = { module: { exports: {} }, uniCloud: cloud, Buffer, require: name => {
			if (name === 'crypto') return require(name);
			if (name === 'uni-id-common') return { createInstance: () => ({ checkToken: async () => uid ? { uid } : { errCode: 'bad' } }) };
			if (name === 'uni-open-bridge-common') return { getAccessToken: async () => ({ access_token: 'test' }), removeAccessToken: async () => state.refreshes++ };
			if (name === 'uni-config-center') return ({ pluginId }) => ({ config: () => pluginId === 'jlg-share' ? config : { 'mp-weixin': { oauth: { weixin: { appid: 'wx-test', appsecret: 'mock' } } } } });
			throw Error(name);
		} };
		vm.runInNewContext(fs.readFileSync(file, 'utf8'), context);
		return Object.assign(context.module.exports, { getClientInfo: () => ({}), getUniIdToken: () => 'test' });
	}
	return { db, state, config, share: uid => load('uniCloud-alipay/cloudfunctions/jlg-share/index.obj.js', uid), bind: uid => load('uniCloud-alipay/cloudfunctions/jlg-distribution/index.obj.js', uid) };
}
(async () => {
	let f = fixture(), service = f.share();
	const input = { goodsId: 'good', envVersion: 'trial' };
	assert.equal((await f.share(null).getProductCode(input)).errCode, 'LOGIN_REQUIRED');
	assert.equal((await service.getProductCode({ ...input, goodsId: {} })).errCode, 'INVALID_PARAM');
	assert.equal((await service.getProductCode({ ...input, envVersion: 'bogus' })).errCode, 'INVALID_PARAM');
	f.config.allowedEnvironments = ['trial'];
	assert.equal((await service.getProductCode({ ...input, envVersion: 'release' })).errCode, 'ENV_NOT_ENABLED');
	f.config.allowedEnvironments.push('release');
	const first = await service.getProductCode(input);
	assert.equal(first.errCode, 0); assert.equal(first.scene.length, 24);
	assert.equal((await service.getProductCode(input)).fileID, first.fileID); assert.equal(f.state.calls, 1);
	assert.equal((await f.share(null).resolveScene({ scene: first.scene })).goodsId, 'good');
	assert.equal((await service.resolveScene({ scene: '%' })).errCode, 'INVALID_SCENE');
	assert.equal((await service.resolveScene({ scene: 'f'.repeat(24) })).errCode, 'SCENE_UNAVAILABLE');
	assert.notEqual((await f.share('other').getProductCode(input)).scene, first.scene);
	assert.notEqual((await service.getProductCode({ ...input, envVersion: 'release' })).scene, first.scene);
	f.state.head = 404;
	const repaired = await service.getProductCode(input); assert.equal(repaired.scene, first.scene); assert.notEqual(repaired.fileID, first.fileID);
	await f.db.collection('opendb-mall-goods').doc('good').update({ is_on_sale: false });
	assert.equal((await service.resolveScene({ scene: first.scene })).errCode, 'GOODS_UNAVAILABLE');
	for (const fault of ['upload', 'json', 'token']) {
		f = fixture(); service = f.share();
		if (fault === 'upload') f.state.uploadFail = true;
		else { f.state.error = { errcode: fault === 'token' ? 40001 : 45009 }; f.state.once = fault === 'token'; }
		const failed = await service.getProductCode(input);
		if (fault === 'token') { assert.equal(failed.errCode, 0); assert.equal(f.state.refreshes, 1); assert.equal(f.state.calls, 2); }
		else { assert.notEqual(failed.errCode, 0); f.state.uploadFail = false; f.state.error = null; assert.equal((await service.getProductCode(input)).errCode, 0); }
		assert.equal(Object.keys(f.db.snapshot()['jlg-share-codes']).length, 1);
	}
	f = fixture(); service = f.share();
	f.config.weixinAppid = 'wrong'; assert.equal((await service.getProductCode(input)).errCode, 'CONFIG_MISSING');
	f.config.weixinAppid = 'wx-test'; f.state.timeout = true;
	assert.notEqual((await service.getProductCode(input)).errCode, 0);
	const pending = Object.values(f.db.snapshot()['jlg-share-codes'])[0];
	assert.equal(pending.leaseUntil, 0);
	f.state.timeout = false; assert.equal((await service.getProductCode(input)).scene, pending.scene);
	f = fixture(); service = f.share();
	f.state.error = { errcode: 40001 };
	assert.notEqual((await service.getProductCode(input)).errCode, 0); assert.equal(f.state.refreshes, 1); assert.equal(f.state.calls, 2);
	f = fixture(); service = f.share();
	await service.getProductCode(input); f.state.head = 404;
	for (let i = 0; i < 9; i++) assert.equal((await service.getProductCode(input)).errCode, 0);
	assert.equal((await service.getProductCode(input)).errCode, 'RATE_LIMIT');
	f.state.head = 200; assert.equal((await service.getProductCode(input)).errCode, 0); // quota never blocks a valid cache hit
	f = fixture();
	const concurrent = await Promise.all([f.share().getProductCode(input), f.share().getProductCode(input), f.share().getProductCode(input)]);
	assert.ok(concurrent.some(r => r.errCode === 0)); assert.equal(f.state.uploads, 1);
	assert.equal(Object.keys(f.db.snapshot()['jlg-share-codes']).length, 1);
	assert.equal((await f.bind(null).add('promoter')).errCode, 'LOGIN_REQUIRED');
	assert.equal((await f.bind('promoter').add('promoter')).errCode, 'SELF_REFERRAL');
	assert.equal((await f.bind('buyer').add('missing')).errCode, 'INELIGIBLE_REFERRER');
	const bindings = await Promise.all([f.bind('buyer').add('promoter', 'forged-victim'), f.bind('buyer').add('other')]);
	assert.equal(bindings.filter(r => r.status === 'bound').length, 1);
	assert.equal(bindings.filter(r => r.status === 'already-bound').length, 1);
	assert.equal(f.db.snapshot()['jlg-distribution'].parent.user_arr.join(), 'buyer');
	assert.equal((await f.bind('buyer').add('promoter')).status, 'already-bound');
	f = fixture();
	await f.db.collection('jlg-distribution').doc('parent').update({ user_arr: ['buyer'] });
	assert.equal((await f.bind('buyer').add('other')).status, 'already-bound'); // legacy relationship without new lock
	await f.db.collection('jlg-distribution').doc('parent').update({ user_arr: ['other'] });
	assert.equal((await f.bind('promoter').add('other')).errCode, 'CYCLE_REFERRAL');

	f = fixture(); service = f.share();
	f.config.allowedEnvironments = JSON.parse(fs.readFileSync('uni_modules/uni-config-center/uniCloud/cloudfunctions/common/uni-config-center/jlg-share/config.json')).allowedEnvironments;
	const trialCode = await service.getProductCode(input);
	const developCode = await service.getProductCode({ ...input, envVersion: 'develop' });
	assert.equal(trialCode.errCode, 0); assert.equal(developCode.errCode, 0);
	assert.notEqual(trialCode.scene, developCode.scene);
	assert.equal((await service.getProductCode({ ...input, envVersion: 'release' })).errCode, 'ENV_NOT_ENABLED');
	console.log('Share code: auth, environment, persistent cache/repair, token refresh, failure recovery, concurrent claims and first attribution passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
