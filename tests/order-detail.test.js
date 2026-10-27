const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../pages/order/orderDetail.vue'), 'utf8')
	.match(/<script>([\s\S]*?)<\/script>/)[1].replace('export default', 'module.exports =');
const rows = [
	{ _id: 'other-id', out_trade_no: 'other-pay', user_id: 'other', status: 1 },
	{ _id: 'my-id', out_trade_no: 'my-pay-1', user_id: 'me', status: 1, address: '姓名：张三；电话：123；地址：上海' }
];

function setup(uid = 'me', fail = false) {
	const calls = { queries: [], toasts: [], loading: 0 };
	const context = {
		module: { exports: {} },
		uni: {
			showToast: options => calls.toasts.push(options.title),
			showLoading: () => calls.loading++,
			hideLoading: () => calls.loading--
		},
		uniCloud: {
			getCurrentUserInfo: () => ({ uid }),
			database: () => ({ collection(name) {
				assert.equal(name, 'uni-pay-orders');
				return { where(query) {
					calls.queries.push(query);
					return { limit(n) {
						assert.equal(n, 1);
						return { async get() {
							if (fail) throw new Error('network unavailable');
							return { result: { data: rows.filter(row => Object.entries(query).every(([k, v]) => row[k] === v)).map(row => ({ ...row })) } };
						} };
					} };
				} };
			} })
		}
	};
	vm.runInNewContext(source, context);
	const component = context.module.exports;
	const page = Object.assign(component.data(), component.methods);
	return { page, calls, load: options => component.onLoad.call(page, options) };
}

(async () => {
	for (const params of [{ out_trade_no: 'my-pay-1' }, { id: 'my-id' }, { id: 'other-id', out_trade_no: 'my-pay-1' }]) {
		const { page, calls, load } = setup();
		await load(params);
		assert.equal(page.orderid, 'my-id');
		assert.equal(page.orderList.name, '张三');
		assert.equal(calls.queries[0].user_id, 'me');
		await page.orderData(page.orderid); // Existing receipt/refund/payment refreshes use the database ID.
		assert.equal(page.orderid, 'my-id');
		assert.equal(calls.loading, 0);
	}
	for (const params of [{ out_trade_no: 'other-pay' }, { id: 'other-id' }, { out_trade_no: 'missing' }]) {
		const { page, calls, load } = setup();
		await load(params);
		assert.equal(page.orderid, '');
		assert.equal(page.orderList._id, undefined);
		assert(calls.toasts.includes('订单不存在或无权访问'));
		assert.equal(calls.loading, 0);
	}
	for (const [uid, params] of [['', { out_trade_no: 'my-pay-1' }], ['me', {}], ['me', { out_trade_no: { $ne: '' } }]]) {
		const { calls, load } = setup(uid);
		await load(params);
		assert.equal(calls.queries.length, 0);
		assert.equal(calls.loading, 0);
		assert.equal(calls.toasts.length, 1);
	}
	const { page, calls, load } = setup('me', true);
	await load({ out_trade_no: 'my-pay-1' });
	assert.equal(page.orderid, '');
	assert.equal(calls.loading, 0);
	assert(calls.toasts.includes('订单加载失败，请稍后重试'));
	console.log('Order detail regression checks passed (10 scenarios).');
})().catch(error => { console.error(error); process.exitCode = 1; });
