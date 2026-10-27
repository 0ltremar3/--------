const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../pages/product/product.vue'), 'utf8');
const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
	.replace(/import QrcodePoster[^;]+;/, 'const QrcodePoster = {};')
	.replace(/import \{[^}]+\} from '@\/common\/delivery.js';/, '')
	.replace(/import \{[^}]+\} from '@\/common\/product-share.js';/, '')
	.replace('export default', 'module.exports =');
const deliveryContext = { module: { exports: {} } };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../common/delivery.js'), 'utf8').replace(/export /g, '') + '\nmodule.exports = { shippingText, shippingHint };', deliveryContext);
const context = { module: { exports: {} }, uniCloud: { database: () => ({}) }, ...deliveryContext.module.exports };
vm.runInNewContext(script, context);
const { computed, methods } = context.module.exports;
const page = { goodsdata: {}, minPrice: 10, getCurrentLang: () => 'zh-Hans', $t: () => '折', displayGoodsService: methods.displayGoodsService };

for (const services of [undefined, null, [], ['', '  ', null], '']) {
	page.goodsdata = { goods_services: services };
	assert.equal(computed.visibleServices.call(page).length, 0);
}
page.goodsdata = { goods_services: ['', '包邮', ' 七天退换 '], goods_services_en: ['', 'Free shipping', 'Returns'] };
assert.equal(computed.visibleServices.call(page).join('·'), '包邮·七天退换');
page.getCurrentLang = () => 'en';
assert.equal(computed.visibleServices.call(page).join('·'), 'Free shipping·Returns');
page.getCurrentLang = () => 'zh-Hans';
for (const crossed_price of [undefined, null, 0, -1, 5, 10, 'invalid', Infinity]) {
	page.goodsdata = { crossed_price };
	assert.equal(computed.discountText.call(page), '');
}
page.goodsdata = { crossed_price: 20 };
assert.equal(computed.discountText.call(page), '5折');
const zhContext = { module: { exports: {} } };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../lang/zh-Hans.js'), 'utf8').replace('export default', 'module.exports ='), zhContext);
const translate = (key, args = {}) => key.split('.').reduce((value, part) => value[part], zhContext.module.exports).replace(/\{(\w+)\}/g, (_, name) => args[name]);
const shipping = { delivery: { region_name: '江苏省 南京市 玄武区' }, freightLoading: false, freightError: '', freightPreview: { deliverable: true, exact: true, freight: 1200, threshold: 12000, remaining: 3000 }, $t: translate };
assert.equal(computed.freightText.call(shipping), '预计 ¥12.00');
assert.equal(computed.freightHint.call(shipping), '再购 ¥30 活动商品可包邮');
shipping.freightPreview.remaining = 1;
assert.equal(computed.freightHint.call(shipping), '再购 ¥0.01 活动商品可包邮');
shipping.freightPreview.freight = 0;
assert.equal(computed.freightText.call(shipping), '包邮');
assert.equal(computed.freightHint.call(shipping), '', 'already free items must not prompt unnecessary extra purchases');
shipping.freightPreview.exact = false;
assert.equal(computed.freightText.call(shipping), '选择规格后查看运费');
assert.equal(computed.freightHint.call(shipping), '');
shipping.freightPreview.exact = true; shipping.freightPreview.freight = 1200; shipping.freightPreview.deliverable = false;
assert.equal(computed.freightHint.call(shipping), '');
const actions = [];
shipping.$refs = { deliveryPicker: { open: () => actions.push('address') }, freightInfo: { open: () => actions.push('rules') } };
shipping.refreshFreight = () => actions.push('retry'); shipping.toggleSpec = () => actions.push('specs');
methods.openFreightInfo.call(shipping); assert.equal(actions.pop(), 'address');
shipping.freightPreview.deliverable = true;
methods.openFreightInfo.call(shipping); assert.equal(actions.pop(), 'rules');
shipping.freightError = '网络错误';
methods.openFreightInfo.call(shipping); assert.equal(actions.pop(), 'retry');
assert.equal(computed.freightHint.call(shipping), '');
shipping.freightLoading = true;
methods.openFreightInfo.call(shipping); assert.equal(actions.length, 0);
shipping.freightLoading = false; shipping.freightError = ''; shipping.delivery = null;
assert.equal(computed.freightText.call(shipping), '选择地区查看运费');
assert.equal(computed.freightHint.call(shipping), '');
methods.openFreightInfo.call(shipping); assert.equal(actions.pop(), 'address');
console.log('Product detail: services, discounts, two-line shipping, free/unknown/error states and detail actions passed.');
