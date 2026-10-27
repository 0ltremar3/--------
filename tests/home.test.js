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
})().catch(error => { console.error(error); process.exitCode = 1; });
