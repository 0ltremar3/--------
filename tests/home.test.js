'use strict';
// Run: node tests/home.test.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const now = 1800000000000;
const source = fs.readFileSync(path.join(__dirname, '../uniCloud-alipay/cloudfunctions/jlg-home/index.js'), 'utf8');

async function query(data) {
	const context = {
		exports: {},
		Date: { now: () => now },
		uniCloud: { database: () => ({ collection(name) {
			assert.equal(name, 'jlg-goods-seckill');
			return { get: async () => ({ data }) };
		} }) }
	};
	vm.runInNewContext(source, context);
	return JSON.parse(JSON.stringify(await context.exports.main({ functionName: 'seckilldata' })));
}

(async () => {
	const empty = { filteredData: [], hours: 0, minutes: 0, seconds: 0, control: false };
	for (const data of [[], undefined, [null], [{ start_time: now - 2000, end_time: now - 1 }], [{ start_time: now - 2000, end_time: now }]]) {
		assert.deepEqual(await query(data), empty);
	}
	const active = { start_time: now - 1000, end_time: now + 3661000 };
	const future = { start_time: now + 61000, end_time: now + 7200000 };
	assert.deepEqual(await query([future, active]), { filteredData: [active], hours: 1, minutes: 1, seconds: 1, control: true });
	assert.deepEqual(await query([{ start_time: now + 120000, end_time: now + 7200000 }, future]), { filteredData: [future], hours: 0, minutes: 1, seconds: 1, control: false });
	const starting = { start_time: now, end_time: now + 60000 };
	assert.deepEqual(await query([starting]), { filteredData: [starting], hours: 0, minutes: 1, seconds: 0, control: true });
	console.log('Home seckill regression checks passed (8 scenarios).');
	const categories = [
		{ _id: 'later', is_index_show: true, sort: 2 },
		{ _id: 'hidden', is_index_show: false, sort: 0 },
		{ _id: 'missing', sort: 0 },
		{ _id: 'null', is_index_show: null, sort: 0 },
		{ _id: 'string', is_index_show: 'true', sort: 0 },
		{ _id: 'first', is_index_show: true, sort: 1 }
	];
	const cloud = { exports: {}, uniCloud: { database: () => ({ collection(name) {
		assert.equal(name, 'jlg-homepage-cetagories');
		let rows = categories.slice();
		return {
			where(filter) { rows = rows.filter(row => Object.entries(filter).every(([key, value]) => row[key] === value)); return this; },
			orderBy(key, direction) { rows.sort((a,b) => (a[key] - b[key]) * (direction === 'asc' ? 1 : -1)); return this; },
			get: async () => ({ data: rows })
		};
	} }) } };
	vm.runInNewContext(source, cloud);
	const homeCategories = () => cloud.exports.main({ functionName: 'cetagories' });
	assert.deepEqual(Array.from(await homeCategories(), row => row._id), ['first', 'later']);
	categories[5].is_index_show = false;
	assert.deepEqual(Array.from(await homeCategories(), row => row._id), ['later'], 'admin toggle takes effect on the next request');
	categories[0].is_index_show = false;
	assert.equal((await homeCategories()).length, 0);
	categories[0].is_index_show = true;

	const homeScript = fs.readFileSync(path.join(__dirname, '../pages/index/index.vue'), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1]
		.replace(/import[^;]+;/g, '').replace('export default', 'module.exports =');
	const home = { module: { exports: {} }, BcakColor: {}, uniCloud: { database: () => ({ collection: () => ({}) }) } };
	vm.runInNewContext(homeScript, home);
	const component = home.module.exports, pending = [];
	const page = { categoryRequest: 0, cetagoriesList: [], $nextTick() {}, $func: { myFunction: () => new Promise(resolve => pending.push(resolve)) } };
	let loaded;
	page.cetagories = () => (loaded = component.methods.cetagories.call(page));
	component.onShow.call(page);pending.shift()({ result: categories });await loaded;
	assert.deepEqual(Array.from(page.cetagoriesList, row => row._id), ['later'], 'client also filters older cloud responses');
	const older = page.cetagories(), newer = page.cetagories();
	const resolveOlder = pending.shift(), resolveNewer = pending.shift();
	resolveNewer({ result: [] });await newer;resolveOlder({ result: categories });await older;
	assert.equal(page.cetagoriesList.length, 0, 'late response must not restore a hidden icon');
	component.onShow.call(page);pending.shift()({ result: categories });await loaded;
	assert.equal(page.cetagoriesList.length, 1, 'returning to homepage reloads categories');
	const unloaded = page.cetagories();component.onUnload.call(page);pending.shift()({ result: [] });await unloaded;
	assert.equal(page.cetagoriesList.length, 1);

	// Both admin forms must preserve false when passing validated values to clientDB.
	for (const action of ['add', 'edit']) {
		let saved;
		const adminSource = fs.readFileSync(path.join(__dirname, '../../养生商城-管理端/pages/homepage-cetagories', action + '.vue'), 'utf8')
			.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/import[^;]+;/g, '').replace('export default', 'module.exports =');
		const table = { doc() { return this; }, add: save, update: save };
		function save(value) { saved = value; return Promise.resolve({}); }
		const admin = { module: { exports: {} }, validator: {}, uni: { showToast() {} }, setTimeout() {}, uniCloud: { database: () => ({ collection: () => table }) } };
		vm.runInNewContext(adminSource, admin);
		await admin.module.exports.methods.submitForm.call({ formDataId: 'hidden', getOpenerEventChannel: () => ({ emit() {} }) }, { is_index_show: false });
		assert.equal(saved.is_index_show, false);
	}
	console.log('Home categories: admin false value, server filtering/sort, all hidden, client fallback, page return and stale responses passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
