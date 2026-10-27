const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
function load(file, globals = {}) {
	let source = read(file);
	if (file.endsWith('.vue')) source = source.match(/<script>([\s\S]*?)<\/script>/)[1];
	source = source.replace(/import[\s\S]*?from\s+['"][^'"]+['"];?/g, '').replace('export default', 'module.exports =');
	const context = { module: { exports: {} }, ...globals };
	vm.runInNewContext(source, context, { filename: file });
	return context.module.exports;
}
(async () => {
	const routes = read('pages.json').split('"needLogin":')[1].split(']')[0];
	for (const route of ['ucenter/ucenter', 'category/category']) assert.ok(!routes.includes(`/pages/${route}`));
	for (const route of ['order/createOrder', 'address/list', 'order/order']) assert.ok(routes.includes(`/pages/${route}`));
	let destination;
	const uni = { navigateTo: options => { destination = options.url; }, switchTab: options => { destination = options.url; }, setNavigationBarTitle() {} };
	const config = load('uni_modules/uni-id-pages/config.js');
	const agreements = load('uni_modules/uni-id-pages/components/uni-id-pages-agreements/uni-id-pages-agreements.vue', { config, uni });
	for (const agreement of agreements.computed.agreements()) {
		agreements.methods.navigateTo(agreement);
		assert.equal(destination, '/jlg-use/problem/probileDetail?id=' + agreement.id);
		assert.ok(!routes.includes('/jlg-use/problem/probileDetail'));
	}
	const mixin = load('uni_modules/uni-id-pages/common/login-page.mixin.js', { config, uni });
	const login = { uniIdRedirectUrl: '/pages/order/createOrder' };
	mixin.methods.cancelLogin.call(login);
	assert.equal(login.uniIdRedirectUrl, '');
	assert.equal(destination, '/pages/index/index');
	assert.equal((read('uni_modules/uni-id-pages/pages/login/login-withoutpwd.vue').match(/@click="cancelLogin"/g) || []).length, 2);

	let session = {};
	let queries = 0;
	const uniCloud = { getCurrentUserInfo: () => session, database: () => ({}) };
	const center = load('pages/ucenter/ucenter.vue', { uniCloud });
	const instance = { ...center.data(), recordData() { queries++; }, uservipData() { queries++; }, loadOrderBadges() { queries++; } };
	for (const user of [{}, { uid: 'expired', tokenExpired: Date.now() - 1 }]) {
		session = user;
		instance.recordList = ['old-user'];
		center.onShow.call(instance);
		assert.equal(queries, 0);
		assert.equal(instance.recordList.length, 0);
		assert.equal(instance.user_id, '');
	}
	session = { uid: 'signed-in', tokenExpired: Date.now() + 60000 };
	center.onShow.call(instance);
	assert.equal(queries, 3);
	assert.equal(instance.user_id, 'signed-in');

	let records = [], fail = false, reads = 0;
	const article = load('jlg-use/problem/probileDetail.vue', { uni, uniCloud: { database: () => ({ collection: () => ({ doc: () => ({ get: async () => {
		reads++;
		if (fail) throw new Error('offline');
		return { result: { data: records } };
	} }) }) }) } });
	const detail = article.data();
	await article.methods.loadData.call(detail, '');
	assert.equal(reads, 0);
	assert.ok(detail.error);
	for (const data of [[], [{ content: '   ' }]]) {
		records = data;
		await article.methods.loadData.call(detail, 'privacy');
		assert.ok(detail.error);
		assert.equal(detail.loading, false);
	}
	fail = true;
	await article.methods.loadData.call(detail, 'privacy');
	assert.ok(detail.error.includes('网络'));
	fail = false;
	records = [{ title: '隐私政策', content: '<p>协议正文</p>' }];
	await article.methods.loadData.call(detail, 'privacy');
	assert.equal(detail.error, '');
	assert.equal(detail.loadList.content, records[0].content);
	assert.equal(detail.loading, false);
	console.log('Review remediation: native agreements, guest access, cancel login, session refresh and article retry passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
