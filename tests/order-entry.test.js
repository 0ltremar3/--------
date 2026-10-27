const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../pages/order/order.vue'), 'utf8')
	.match(/<script>([\s\S]*?)<\/script>/)[1].replace('export default', 'module.exports =');
const context = { module: { exports: {} }, uniCloud: { database: () => ({}), getCurrentUserInfo: () => ({ uid: 'me' }) } };
vm.runInNewContext(source, context);
const page = context.module.exports;
for (const [options, expected] of [
	[undefined, 99], [{}, 99], [{ state: '' }, 99], [{ state: ' ' }, 99],
	[{ state: null }, 99], [{ state: 'invalid' }, 99], [{ state: '999' }, 99],
	...[99, 0, 1, 5, 6].flatMap(state => [[{ state }, state], [{ state: String(state) }, state]])
]) {
	const calls = [];
	const instance = { ...page.data(), $t: key => key, loadData: state => calls.push(state) };
	instance.tabList = page.computed.tabList.call(instance);
	page.onLoad.call(instance, options);
	assert.equal(instance.tabIndex, expected);
	assert.equal(instance.tabList[instance.labelIndex].state, expected);
	page.onReachBottom.call(instance);
	page.methods.clearClick.call(instance);
	assert.deepEqual(calls, [expected, expected, expected]);
}
console.log('Order entry: default, invalid, explicit states, pagination and search reset passed.');
