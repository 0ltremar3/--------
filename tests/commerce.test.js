'use strict';
const assert = require('node:assert/strict');
const { createCommerce, normalize, resolve, copy } = require('../uniCloud-alipay/cloudfunctions/common/jlg-commerce');
const { refundStock, confirmRefund } = require('../uniCloud-alipay/cloudfunctions/common/jlg-commerce/refund');
// Transaction fixture exercises business atomicity/rollback. Production DB isolation is verified separately in staging.
const { database } = require('./helpers/commerce-db');

const goods = () => ({ _id: 'g', name: '茶', category_id: 'c', goods_thumb: 'https://example.test/a.jpg', goods_banner_imgs: [{ url: 'https://example.test/a.jpg' }], goods_services: [], freight: true, stock_version: 1, is_on_sale: true, is_new: true, total_sell_count: 0, orig_suks: [{ name: '包装', values: [{ name: '单盒' }] }], orig_fs_suks: [{ name: '包装', values: [{ name: '单盒' }] }], suks: [{ specs: ['单盒'], price: 9900, inventory: 2 }], fs_suks: [{ specs: ['单盒'], price: 8800, inventory: 1 }] });
const initial = () => ({ 'opendb-mall-goods': { g: goods() } });
const request = (out_trade_no = 'o1', extra = {}) => ({ user_id: 'u', provider: 'wxpay', type: 'goods', order_no: 'business_' + out_trade_no, out_trade_no, description: '订单', total_fee: 9900, address: '测试地址', goods_arr: [{ goods_id: 'g', goods_suk: ['单盒'], goods_num: 1 }], ...extra });
function paymentService(db, gateway) {
  const fs = require('node:fs'), vm = require('node:vm');
  const dao = {
    uniPayOrders: {
      find: async query => (await db.collection('uni-pay-orders').where(query).get()).data[0],
      updateById: (id, value) => db.collection('uni-pay-orders').doc(id).update(value),
      updateAndReturn: async ({ whereJson, dataJson }) => (await db.collection('uni-pay-orders').where(whereJson).updateAndReturn(dataJson)).doc
    }
  };
  const libs = { common: {
    getPlatform: value => value, getProviderPayType: () => 'jsapi', getTradeType: () => 'JSAPI',
    getNotifyData: () => ({}), returnNotifySUCCESS: () => ({ ok: true })
  } };
  const context = { module: { exports: {} }, console: { log() {}, error() {} }, uniCloud: { database: () => db }, require(name) {
    if (name === 'uni-config-center') return () => ({ requireFile: () => ({ notifyUrl: { default: 'https://example.test' } }) });
    if (name === 'uni-pay') return {};
    if (name === '../dao') return dao;
    if (name === '../libs') return libs;
    if (name === '../common/error') return { ERROR: {} };
    if (name === 'jlg-commerce') return require('../uniCloud-alipay/cloudfunctions/common/jlg-commerce');
    if (name === 'jlg-commerce/refund') return require('../uniCloud-alipay/cloudfunctions/common/jlg-commerce/refund');
    return require(name);
  } };
  vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname, '../uni_modules/uni-pay/uniCloud/cloudfunctions/uni-pay-co/service/pay.js'), 'utf8'), context);
  context.module.exports.getUniPayConfig = async () => ({ appId: 'app' });
  context.module.exports.initUniPayInstance = async () => gateway;
  return context.module.exports;
}
function cartService(db) {
  const fs = require('node:fs'), vm = require('node:vm'), exported = {};
  const context = { exports: exported, module: { exports: exported }, console, uniCloud: { database: () => db }, require(name) {
    if (name === 'jlg-commerce') return require('../uniCloud-alipay/cloudfunctions/common/jlg-commerce');
    if (name === 'jlg-commerce/db') return require('../uniCloud-alipay/cloudfunctions/common/jlg-commerce/db');
    if (name === 'uni-id-common') return { createInstance: () => ({ checkToken: async token => token === 'valid' ? { uid: 'u' } : { errCode: 'invalid' } }) };
    return require(name);
  } };
  vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname, '../uniCloud-alipay/cloudfunctions/jlg-cart/index.js'), 'utf8'), context);
  return exported.main;
}
let passed = 0;
async function test(name, run) { await run(); passed++; console.log('✓', name); }
(async () => {
  await test('document reads support normal arrays and Aliyun transaction objects/absent records', async () => {
    const { getDocument } = require('../uniCloud-alipay/cloudfunctions/common/jlg-commerce/db');
    const row = { _id: 'g', name: '茶' };
    for (const data of [[row], row, [], null, undefined]) {
      const db = { collection: () => ({ doc: () => ({ get: async () => ({ data }) }) }) };
      assert.deepEqual(await getDocument(db, 'opendb-mall-goods', 'g'), Array.isArray(data) ? data[0] : data);
    }
  });
  await test('transaction queries re-read documents and reject changed query membership', async () => {
    const { findDocuments } = require('../uniCloud-alipay/cloudfunctions/common/jlg-commerce/db');
    const candidate = { _id: 'row', user_arr: ['u'], price: 1 };
    const db = { collection: () => ({ where: () => ({ limit: () => ({ get: async () => ({ data: [candidate] }) }) }) }) };
    let current = { ...candidate, price: 9900 };
    const tx = { collection: () => ({ doc: id => {
      assert.equal(id, candidate._id);
      return { get: async () => ({ data: current }) };
    } }) };
    assert.equal((await findDocuments(db, tx, 'rows', { user_arr: 'u' }))[0].price, 9900);
    current = { ...current, user_arr: ['other'] };
    await assert.rejects(findDocuments(db, tx, 'rows', { user_arr: 'u' }), error => error.errCode === 'DATA_CHANGED');
    current = undefined;
    await assert.rejects(findDocuments(db, tx, 'rows', { user_arr: 'u' }), error => error.errCode === 'DATA_CHANGED');
  });
  await test('member pricing and distribution work with Aliyun document-only transactions', async () => {
    const state = initial();
    state['jlg-member'] = { member: { _id: 'member', user_id: 'u', grade: 1, failure_time: Date.now() + 3600000 } };
    state['jlg-parameter'] = { settings: { _id: 'settings', vip_price: 90 } };
    state['jlg-distribution'] = { distributor: { _id: 'distributor', user_arr: ['u'] } };
    const db = database(state);
    const order = await createCommerce(db).prepare(request('member', { total_fee: 8910 }));
    assert.equal(order.total_fee, 8910);
    assert.equal(order.deduprice, 990);
    assert.equal(order.is_distr, true);
    assert.equal(db.snapshot()['opendb-mall-goods'].g.suks[0].inventory, 1);
  });
  await test('legacy identity independent of price, inventory and normal/seckill pool', () => {
    const a = normalize(goods()); const b = goods(); b.suks[0].price = 1; b.suks[0].inventory = 5;
    assert.equal(a.suks[0].sku_id, normalize(b).suks[0].sku_id);
    assert.notEqual(a.suks[0].sku_id, a.fs_suks[0].sku_id);
    assert.throws(() => resolve(a, { specs: [] }), /规格/);
    assert.throws(() => resolve(a, { sku_id: 'wrong', specs: ['单盒'] }), /规格/);
  });
  await test('reservation changes SKU only, and retries do not reserve twice', async () => {
    const db = database(initial()), service = createCommerce(db);
    const first = await service.prepare(request()); await service.prepare(request());
    assert.equal(db.snapshot()['opendb-mall-goods'].g.suks[0].inventory, 1);
    assert.equal(db.snapshot()['opendb-mall-goods'].g.fs_suks[0].inventory, 1);
    assert.equal(db.snapshot()['opendb-mall-goods'].g.total_sell_count, 0);
    assert.ok(first.goods_arr[0].sku_id);
    await assert.rejects(service.prepare(request('o1', { user_id: 'other' })), /无权/);
  });
  await test('last-item concurrent requests: only one succeeds', async () => {
    const state = initial(); state['opendb-mall-goods'].g.suks[0].inventory = 1;
    const db = database(state), service = createCommerce(db);
    const results = await Promise.allSettled([service.prepare(request('a')), service.prepare(request('b'))]);
    assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
    assert.equal(db.snapshot()['opendb-mall-goods'].g.suks[0].inventory, 0);
  });
  await test('duplicate lines aggregate demand; whole transaction rolls back on shortage', async () => {
    const db = database(initial()), service = createCommerce(db), before = db.snapshot();
    const line = { goods_id: 'g', goods_suk: ['单盒'], goods_num: 2 };
    await assert.rejects(service.prepare(request('many', { total_fee: 39600, goods_arr: [line, line] })), /库存不足/);
    assert.deepEqual(db.snapshot(), before);
  });
  await test('normal and seckill stock stay independent in mixed orders', async () => {
    const db = database(initial()), service = createCommerce(db);
    await service.prepare(request('mixed', { total_fee: 18700, goods_arr: [...request().goods_arr, { goods_id: 'g', goods_suk: ['单盒'], goods_num: 1, goods_seckill: true }] }));
    assert.equal(db.snapshot()['opendb-mall-goods'].g.suks[0].inventory, 1);
    assert.equal(db.snapshot()['opendb-mall-goods'].g.fs_suks[0].inventory, 0);
    await service.release('mixed'); await service.release('mixed');
    assert.equal(db.snapshot()['opendb-mall-goods'].g.suks[0].inventory, 2);
    assert.equal(db.snapshot()['opendb-mall-goods'].g.fs_suks[0].inventory, 1);
  });
  await test('negative/fractional quantity, forged price and unknown SKU fail without writes', async () => {
    for (const extra of [ { total_fee: 1 }, { goods_arr: [{ goods_id: 'g', goods_suk: ['单盒'], goods_num: -1 }] }, { goods_arr: [{ goods_id: 'g', goods_suk: ['单盒'], goods_num: 0.5 }] }, { goods_arr: [{ goods_id: 'g', sku_id: 'missing', goods_suk: ['单盒'], goods_num: 1 }] } ]) {
      const db = database(initial()), before = db.snapshot();
      await assert.rejects(createCommerce(db).prepare(request('invalid', extra)));
      assert.deepEqual(db.snapshot(), before);
    }
  });
  await test('paid callbacks are amount-checked and idempotent; paid orders cannot release', async () => {
    const db = database(initial()), service = createCommerce(db);
    await service.prepare(request());
    await assert.rejects(service.settle('o1', 1, {}), /金额/);
    await service.settle('o1', 9900, { transaction_id: 'tx' }); await service.settle('o1', 9900, {});
    assert.equal(db.snapshot()['opendb-mall-goods'].g.total_sell_count, 1);
    await assert.rejects(service.release('o1'), /已付款/);
  });
  await test('cancelled order rejects late payment transition instead of double-selling', async () => {
    const db = database(initial()), service = createCommerce(db);
    await service.prepare(request()); await service.release('o1');
    await assert.rejects(service.settle('o1', 9900, {}), /冲突/);
    assert.equal(db.snapshot()['opendb-mall-goods'].g.suks[0].inventory, 2);
  });
  await test('old cancellations restore only the counters they originally deducted', async () => {
    const state = initial(); state['opendb-mall-goods'].g.remain_count = 1; state['opendb-mall-goods'].g.total_sell_count = 1;
    state['uni-pay-orders'] = { old: { _id: 'old', out_trade_no: 'old', user_id: 'u', status: 0, goods_arr: [{ goods_id: 'g', goods_num: 1 }] } };
    const db = database(state), service = createCommerce(db);
    await service.release('old'); await service.release('old');
    assert.equal(db.snapshot()['opendb-mall-goods'].g.suks[0].inventory, 2);
    assert.equal(db.snapshot()['opendb-mall-goods'].g.remain_count, 2);
    assert.equal(db.snapshot()['opendb-mall-goods'].g.total_sell_count, 0);
  });
  await test('unverified legacy SKU stock cannot be sold or silently activated', async () => {
    const state = initial(); delete state['opendb-mall-goods'].g.stock_version;
    const db = database(state), service = createCommerce(db);
    await assert.rejects(service.prepare(request()), /核对/);
    const current = await service.goodsDetail('g');
    await assert.rejects(service.saveGoods({ ...current, stock_snapshot: { suks: current.suks, fs_suks: current.fs_suks } }), /核对/);
  });
  await test('old pending orders block activation even after inventory confirmation', async () => {
    const state = initial(); delete state['opendb-mall-goods'].g.stock_version;
    state['uni-pay-orders'] = { old: { _id: 'old', status: 0, goods_arr: [{ goods_id: 'g' }] } };
    const db = database(state), service = createCommerce(db), current = await service.goodsDetail('g');
    await assert.rejects(service.saveGoods({ ...current, inventory_verified: true, stock_snapshot: { suks: current.suks, fs_suks: current.fs_suks } }), /未付款旧订单/);
  });
  await test('rename retains identity and resolves old carts; stale editor cannot overwrite checkout', async () => {
    const db = database(initial()), service = createCommerce(db), current = await service.goodsDetail('g');
    const edit = copy(current); edit.stock_snapshot = { suks: current.suks, fs_suks: current.fs_suks };
    edit.suks[0].specs = ['一盒']; edit.orig_suks[0].values[0].name = '一盒';
    await service.saveGoods(edit);
    const saved = await service.goodsDetail('g');
    assert.equal(saved.suks[0].sku_id, current.suks[0].sku_id);
    assert.equal(resolve(saved, { specs: ['单盒'] }).sku_id, saved.suks[0].sku_id);
    await service.prepare(request());
    await assert.rejects(service.saveGoods(edit), /已变化/);
  });
  await test('coupons are server-validated, reserved and released with stock', async () => {
    const state = initial(); state['jlg-goods-coupon'] = { c: { _id: 'c', user_id: 'u', coupon_id: 'rule', is_use: false } };
    state['jlg-goods-couponrule'] = { rule: { _id: 'rule', state: '已发放', type: '满减', price: 100, order_amount: 100, allow_type: '所有商品', start_time: 0, end_time: Date.now() + 100000, name: '优惠' } };
    const db = database(state), service = createCommerce(db);
    await service.prepare(request('coupon', { total_fee: 9800, preferential: [{ id: 'c' }] }));
    assert.equal(db.snapshot()['jlg-goods-coupon'].c.is_use, true);
    await assert.rejects(service.prepare(request('reuse', { total_fee: 9800, preferential: [{ id: 'c' }] })), /优惠券不可用/);
    await service.release('coupon'); assert.equal(db.snapshot()['jlg-goods-coupon'].c.is_use, false);
  });
  await test('refund acceptance alone does not restore inventory; confirmation does exactly once', async () => {
    const db = database(initial()), service = createCommerce(db);
    const order = await service.prepare(request()); await service.settle('o1', 9900, {});
    const paid = db.snapshot()['uni-pay-orders'][order._id];
    const provider = { refund: async () => ({ refundFee: 9900 }), refundQuery: async () => ({ status: 'PROCESSING', refundFee: 9900 }) };
    const result = await refundStock(db, provider, paid, {}); assert.equal(result.pending, true);
    assert.equal(db.snapshot()['opendb-mall-goods'].g.suks[0].inventory, 1);
    const response = { status: 'SUCCESS', refundFee: 9900, outRefundNo: 'o1-full' };
    await confirmRefund(db, 'o1', response); await confirmRefund(db, 'o1', response);
    assert.equal(db.snapshot()['opendb-mall-goods'].g.suks[0].inventory, 2);
    assert.equal(db.snapshot()['opendb-mall-goods'].g.total_sell_count, 0);
  });
  await test('WeChat v2 refund list resolves only the matching refund number', async () => {
    const db = database(initial()), service = createCommerce(db);
    const order = await service.prepare(request()); await service.settle('o1', 9900, {});
    await db.collection('uni-pay-orders').doc(order._id).update({ stock_refund_pending: true, stock_refund_no: 'o1-full' });
    assert.equal(await confirmRefund(db, 'o1', { refundList: [{ outRefundNo: 'other', refundStatus: 'SUCCESS', refundFee: 9900 }] }), false);
    assert.equal(await confirmRefund(db, 'o1', { refundList: [{ outRefundNo: 'o1-full', refundStatus: 'SUCCESS', refundFee: 9900 }] }), true);
  });
  await test('order actions check owner and refund-in-flight state', async () => {
    const db = database(initial()), service = createCommerce(db);
    const order = await service.prepare(request()); await service.settle('o1', 9900, {});
    await assert.rejects(service.orderAction('other', order._id, 'refund', 'reason'), /无权/);
    await service.orderAction('u', order._id, 'refund', '不需要了');
    await db.collection('uni-pay-orders').doc(order._id).update({ stock_refund_pending: true });
    await assert.rejects(service.orderAction('u', order._id, 'cancelRefund'), /状态已变化/);
  });
  await test('actual pay service reserves before gateway, ignores other overrides, and settles verified callback', async () => {
    const db = database(initial());
    let sent;
    const gateway = {
      getOrderInfo: async args => {
        assert.equal(db.snapshot()['opendb-mall-goods'].g.suks[0].inventory, 1);
        assert.equal(Object.keys(db.snapshot()['uni-pay-orders']).length, 1);
        sent = args; return { prepayId: 'p' };
      },
      checkNotifyType: async () => 'payment',
      verifyPaymentNotify: async () => ({ outTradeNo: 'o1', totalFee: 9900, transactionId: 'tx', resultCode: 'SUCCESS' })
    };
    const service = paymentService(db, gateway);
    await service.createOrder(request('o1', { clientInfo: { platform: 'mp-weixin', appId: 'app' }, cloudInfo: { spaceId: 'test' }, other: { total_fee: 1, out_trade_no: 'forged' } }));
    assert.equal(sent.totalFee, 9900); assert.equal(sent.outTradeNo, 'o1');
    await service.paymentNotify({ httpInfo: { path: '/payNotify/wxpay-jsapi' } });
    await service.paymentNotify({ httpInfo: { path: '/payNotify/wxpay-jsapi' } });
    assert.equal(db.snapshot()['opendb-mall-goods'].g.total_sell_count, 1);
  });
  await test('pending payment can retry unchanged fields after cancellation or gateway timeout', async () => {
    for (const timeout of [false, true]) {
      const db = database(initial());
      let calls = 0;
      const service = paymentService(db, { getOrderInfo: async () => {
        calls++;
        if (timeout && calls === 1) throw new Error('timeout');
        return { prepayId: 'p' };
      } });
      const input = request('retry', { clientInfo: { platform: 'mp-weixin', appId: 'app' }, cloudInfo: { spaceId: 'test' } });
      if (timeout) await assert.rejects(service.createOrder(input));
      else await service.createOrder(input);
      const { goods_arr, address, ...retry } = input;
      const result = await service.createOrder(retry);
      assert.equal(result.errCode, 0);
      assert.equal(calls, 2);
      assert.equal(Object.keys(db.snapshot()['uni-pay-orders']).length, 1);
      assert.equal(db.snapshot()['opendb-mall-goods'].g.suks[0].inventory, 1);
    }
  });
  await test('payment claim rejects an order paid or closed after preparation', async () => {
    for (const state of [{ status: 1, stock_state: 'paid' }, { status: -1, stock_state: 'released' }]) {
      const db = database(initial());
      let calls = 0;
      const gateway = { getOrderInfo: async () => { calls++; return { prepayId: 'p' }; } };
      const service = paymentService(db, gateway);
      const order = await createCommerce(db).prepare(request());
      service.initUniPayInstance = async () => {
        await db.collection('uni-pay-orders').doc(order._id).update(state);
        return gateway;
      };
      await assert.rejects(service.createOrder(request('o1', { clientInfo: { platform: 'mp-weixin', appId: 'app' }, cloudInfo: { spaceId: 'test' } })), /订单已关闭或已付款/);
      assert.equal(calls, 0);
    }
  });
  await test('gateway timeout retains reservation; provider-confirmed close can release on retry', async () => {
    const db = database(initial());
    const gateway = { getOrderInfo: async () => { throw new Error('timeout'); }, orderQuery: async () => ({ tradeState: 'CLOSED' }) };
    const service = paymentService(db, gateway);
    await assert.rejects(service.createOrder(request('o1', { clientInfo: { platform: 'mp-weixin', appId: 'app' }, cloudInfo: { spaceId: 'test' } })));
    assert.equal(db.snapshot()['opendb-mall-goods'].g.suks[0].inventory, 1);
    await service.closeOrder({ out_trade_no: 'o1' }); await service.closeOrder({ out_trade_no: 'o1' });
    assert.equal(db.snapshot()['opendb-mall-goods'].g.suks[0].inventory, 2);
  });
  await test('a started payment cannot use the unstarted fast-release path', async () => {
    const db = database(initial()), service = createCommerce(db);
    const order = await service.prepare(request());
    await db.collection('uni-pay-orders').doc(order._id).update({ stock_payment_started: true });
    await assert.rejects(service.release('o1', true), /重新关单/);
  });
  await test('editor label rename and added values preserve filled SKU rows', async () => {
    const source = require('node:fs').readFileSync(require('node:path').resolve(__dirname, '../../养生商城-管理端/js_sdk/goods-sku.js'), 'utf8');
    const editor = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
    const specs = [{ name: '包装', values: [{ name: '单盒' }] }];
    const rows = [{ sku_id: 'stable', specs: ['单盒'], price: 9900, inventory: 2, goods_thumb: 'image' }];
    editor.identify(specs, rows);
    specs[0].values[0].name = '一盒'; specs[0].values.push({ name: '双盒' });
    const result = editor.combinations(specs, rows);
    assert.equal(result[0].sku_id, 'stable'); assert.equal(result[0].price, 9900);
    assert.equal(result[0].inventory, 2); assert.equal(result[0].goods_thumb, 'image');
    assert.equal(result[1].price, null); assert.equal(result[1].sku_id, undefined);
  });
  await test('cart API authenticates owner and ignores client price when merging', async () => {
    const db = database(initial()), cart = cartService(db);
    const event = { functionName: 'addToCart', uniIdToken: 'valid', data: { user_id: 'forged', goods_id: 'g', control: false, specSelected: [{ name: '单盒' }], suks_price: 1, numberl: 1 } };
    await assert.rejects(cart({ ...event, uniIdToken: 'bad' }, {}), /重新登录/);
    await cart(event, {}); event.data.suks_price = 100000; await cart(event, {});
    const rows = Object.values(db.snapshot()['jlg-goods-cart']);
    assert.equal(rows.length, 1); assert.equal(rows[0].user_id, 'u');
    assert.equal(rows[0].goods_number, 2); assert.equal(rows[0].goods_suk.price, 9900);
  });
  await test('coupon API trusts server limits and authenticated owner, not client arguments', async () => {
    const state = initial(); state['jlg-goods-couponrule'] = { rule: { _id: 'rule', user_type: '所有人', state: '已发放', max_number: 1, number: 1, received_number: 0, start_time: 0, end_time: Date.now() + 100000 } };
    const db = database(state), cart = cartService(db);
    const event = { functionName: 'addCoupon', uniIdToken: 'valid', data: { id: 'rule', maxnum: 999, fx_num: 999, user_id: 'forged' } };
    await cart(event, {}); await assert.rejects(cart(event, {}), /领完/);
    const rows = Object.values(db.snapshot()['jlg-goods-coupon']);
    assert.equal(rows.length, 1); assert.equal(rows[0].user_id, 'u');
    assert.equal(db.snapshot()['jlg-goods-couponrule'].rule.received_number, 1);
  });
  await test('receipt/evaluation continue working after client order writes are denied', async () => {
    const db = database(initial()), service = createCommerce(db);
    const order = await service.prepare(request()); await service.settle('o1', 9900, {});
    await db.collection('uni-pay-orders').doc(order._id).update({ status: 4 });
    await service.orderAction('u', order._id, 'receipt');
    await assert.rejects(service.orderAction('u', order._id, 'evaluate'), /评价/);
    await db.collection('opendb-mall-comments').add({ user_id: 'u', order_id: order._id, goods_id: 'g', goods_suk: ['单盒'] });
    await service.orderAction('u', order._id, 'evaluate');
    assert.equal(db.snapshot()['uni-pay-orders'][order._id].status, 7);
  });
  await test('verified migration initializes missing sales without copying product stock', async () => {
    const state = initial(); delete state['opendb-mall-goods'].g.stock_version;
    state['opendb-mall-goods'].g.total_sell_count = null;
    state['opendb-mall-goods'].g.remain_count = 999;
    const db = database(state), service = createCommerce(db), current = await service.goodsDetail('g');
    await service.saveGoods({ ...current, inventory_verified: true, stock_snapshot: { suks: current.suks, fs_suks: current.fs_suks } });
    assert.equal(db.snapshot()['opendb-mall-goods'].g.total_sell_count, 0);
    assert.equal(db.snapshot()['opendb-mall-goods'].g.remain_count, 3);
    await service.prepare(request()); await service.settle('o1', 9900, {});
    assert.equal(db.snapshot()['opendb-mall-goods'].g.total_sell_count, 1);
  });
  await test('commit failure preserves the original error when Aliyun refuses rollback', async () => {
    const original = new Error('transaction conflict');
    const db = { startTransaction: async () => ({ commit: async () => { throw original; }, rollback: async () => { throw new Error('transaction already commit'); } }) };
    await assert.rejects(require('../uniCloud-alipay/cloudfunctions/common/jlg-commerce').transaction(db, async () => true), error => error === original);
  });
  await test('editor image-only patch survives a purchase without overwriting stock', async () => {
    const db = database(initial()), service = createCommerce(db);
    await service.prepare(request());
    const input = { _id:'g', editor_revision:0, request_id:'image_patch_1', patch:{goods_thumb:'https://example.test/new.jpg'} };
    const result = await service.saveGoods(input,'admin');
    assert.equal(result.editor_revision,1);
    assert.equal(db.snapshot()['opendb-mall-goods'].g.suks[0].inventory,1);
    assert.equal(db.snapshot()['opendb-mall-goods'].g.goods_thumb,'https://example.test/new.jpg');
    assert.deepEqual(await service.saveGoods(input,'admin'),result);
    assert.equal(db.snapshot()['opendb-mall-goods'].g.editor_revision,1);
  });
  await test('editor revision rejects another administrator and changed request retries', async () => {
    const db=database(initial()), service=createCommerce(db);
    const input={_id:'g',editor_revision:0,request_id:'revision_1',patch:{name:'新名称'}};
    await service.saveGoods(input,'admin');
    await assert.rejects(service.saveGoods({...input,request_id:'revision_2'},'other'),e=>e.errCode==='EDITOR_CONFLICT');
    await assert.rejects(service.saveGoods({...input,patch:{name:'其他'}},'admin'),/请求内容/);
  });
  await test('metadata edits do not activate legacy inventory, but publication requires verification', async () => {
    const state=initial(); delete state['opendb-mall-goods'].g.stock_version; state['opendb-mall-goods'].g.is_on_sale=false;
    const db=database(state),service=createCommerce(db);
    await service.saveGoods({_id:'g',editor_revision:0,request_id:'legacy_meta_1',patch:{name:'新商品资料'}},'admin');
    assert.equal(db.snapshot()['opendb-mall-goods'].g.stock_version,undefined);
    await assert.rejects(service.saveGoods({_id:'g',editor_revision:1,request_id:'legacy_publish',patch:{is_on_sale:true}},'admin'),e=>e.fieldErrors[0].path==='inventory_verified');
  });
  await test('new editor requests create once and bind new campaign SKUs to generated identities', async () => {
    const db=database({}),service=createCommerce(db); const patch=goods();
    delete patch._id;delete patch.stock_version;delete patch.total_sell_count;
    patch.suks[0].spec_value_ids=['box'];patch.fs_suks[0].source_spec_value_ids=['box'];
    const input={request_id:'create_once_1',intent:'publish',patch};
    const first=await service.saveGoods(input,'admin');const second=await service.saveGoods(input,'admin');
    assert.equal(first.id,second.id);assert.equal(Object.keys(db.snapshot()['opendb-mall-goods']).length,1);
    const saved=db.snapshot()['opendb-mall-goods'][first.id];
    assert.equal(saved.is_on_sale,true);assert.equal(saved.stock_version,1);
    assert.equal(Object.keys(db.snapshot()['jlg-goods-editor-requests']).length,1);
    assert.equal(saved.fs_suks[0].source_sku_id,saved.suks[0].sku_id);
  });
  await test('stock patch still rejects stale snapshots and reports field errors', async () => {
    const db=database(initial()),service=createCommerce(db),raw=await service.goodsDetail('g');
    await service.prepare(request());
    await assert.rejects(service.saveGoods({_id:'g',editor_revision:0,request_id:'stock_conflict_1',stock_snapshot:{suks:raw.suks,fs_suks:raw.fs_suks},patch:{suks:raw.suks}},'admin'),e=>e.errCode==='GOODS_CONFLICT');
    await assert.rejects(service.saveGoods({_id:'g',editor_revision:0,request_id:'field_error_1',patch:{name:''}},'admin'),e=>e.fieldErrors[0].path==='name');
  });
  await test('take-off increments editor revision and leaves inventory unchanged', async () => {
    const db=database(initial());const editor=require('../uniCloud-alipay/cloudfunctions/common/jlg-commerce/editor').createEditor(db,require('../uniCloud-alipay/cloudfunctions/common/jlg-commerce').transaction);
    await editor.takeOff(['g']);const saved=db.snapshot()['opendb-mall-goods'].g;
    assert.equal(saved.editor_revision,1);assert.equal(saved.is_on_sale,false);assert.equal(saved.suks[0].inventory,2);
  });
  await test('sparse editor activation initializes null sales and preserves confirmed inventory', async () => {
    const state=initial();delete state['opendb-mall-goods'].g.stock_version;state['opendb-mall-goods'].g.total_sell_count=null;
    const db=database(state),service=createCommerce(db),raw=await service.goodsDetail('g');
    await service.saveGoods({_id:'g',editor_revision:0,request_id:'activate_patch_1',inventory_verified:true,stock_snapshot:{suks:raw.suks,fs_suks:raw.fs_suks},patch:{}},'admin');
    await service.prepare(request());await service.settle('o1',9900,{});
    assert.equal(db.snapshot()['opendb-mall-goods'].g.total_sell_count,1);
  });
  await test('SKU image patch uses latest stock without requiring a stale client snapshot', async () => {
    const db=database(initial()),service=createCommerce(db),raw=await service.goodsDetail('g');
    await service.prepare(request());
    await service.saveGoods({_id:'g',editor_revision:0,request_id:'sku_image_only',patch:{sku_images:[{pool:'suks',sku_id:raw.suks[0].sku_id,url:'https://example.test/sku.jpg'}]}},'admin');
    const saved=db.snapshot()['opendb-mall-goods'].g;
    assert.equal(saved.suks[0].inventory,1);assert.equal(saved.suks[0].price,9900);assert.equal(saved.suks[0].goods_thumb,'https://example.test/sku.jpg');
  });
  await test('inactive campaign settings are retained; reactivation validates linked prices', async () => {
    const state=initial();state['opendb-mall-goods'].g=normalize(state['opendb-mall-goods'].g);const g=state['opendb-mall-goods'].g;
    g.fs_suks[0].source_sku_id=g.suks[0].sku_id;g.suks[0].price=8000;g.is_new=false;
    const db=database(state),service=createCommerce(db);
    await service.saveGoods({_id:'g',editor_revision:0,request_id:'inactive_keep_1',patch:{name:'保留关闭活动'}},'admin');
    await assert.rejects(service.saveGoods({_id:'g',editor_revision:1,request_id:'activate_sale_1',patch:{is_new:true}},'admin'),e=>e.fieldErrors[0].path==='fs_suks.0.price');
  });
  console.log(`${passed} commerce tests passed`);
})().catch(error => { console.error(error); process.exitCode = 1; });
