'use strict';
const assert = require('node:assert/strict');
const { database } = require('./helpers/commerce-db');
const { createCommerce, copy } = require('../uniCloud-alipay/cloudfunctions/common/jlg-commerce');
const { repair, SOURCE_ID, ARCHIVE_ID, ORDER_NUMBERS } = require('../scripts/repair-test-product-identity');
const GOODS = 'opendb-mall-goods', ORDERS = 'uni-pay-orders', COMMENTS = 'opendb-mall-comments';
function product() {
  return { _id: 'g', name: '测试商品', category_id: 'c', goods_thumb: 'https://example.test/test.jpg', goods_banner_imgs: [{ url: 'https://example.test/test.jpg' }], goods_services: [], freight: true, stock_version: 1, is_on_sale: true, total_sell_count: 0, editor_revision: 0, orig_suks: [{ name: '包装', values: [{ name: '默认' }] }], orig_fs_suks: [], suks: [{ sku_id: 's', specs: ['默认'], legacy_specs: [['默认']], price: 1, inventory: 99 }], fs_suks: [] };
}
async function rename(service, legacy = false) {
  const goods = await service.goodsDetail('g');
  return service.saveGoods(legacy ? { ...goods, name: '四物膏', stock_snapshot: { suks: goods.suks, fs_suks: goods.fs_suks } } : { _id: 'g', editor_revision: 0, request_id: 'rename_product', patch: { name: '四物膏' } }, 'admin');
}
function incident() {
  const historicalProduct = { ...product(), _id: SOURCE_ID };
  const formal = { ...copy(historicalProduct), name: '四物膏', total_sell_count: 1, editor_revision: 13, remain_count: 98 };
  formal.suks[0].price = 24800; formal.suks[0].inventory = 98;
  const orders = ORDER_NUMBERS.map((order_no, i) => ({ _id: 'order_' + i, order_no, out_trade_no: order_no + '-1', user_id: 'buyer', type: 'goods', stock_version: 1, status: i === 5 ? 7 : i === 1 ? 3 : -1, stock_state: i === 5 ? 'paid' : i === 1 ? 'refunded' : 'released', total_fee: i === 5 ? 1 : 10, transaction_id: 'provider_' + i, goods_arr: [{ goods_id: SOURCE_ID, goods_name: '测试商品', goods_suk: ['默认'], sku_id: 's', goods_num: 1, goods_price: i === 5 ? 1 : 10, goods_img: 'https://example.test/test.jpg' }] }));
  const comment = { _id: '6ae348690877c0122b7cbe25', goods_id: SOURCE_ID, order_id: orders[5]._id, user_id: 'buyer', goods_suk: ['默认'], grade: 5, content: { text: '测试评价' } };
  return { historicalProduct, state: { [GOODS]: { [SOURCE_ID]: formal }, [ORDERS]: Object.fromEntries(orders.map(o => [o._id, o])), [COMMENTS]: { [comment._id]: comment } } };
}
(async () => {
  // Both the current editor and the legacy full-object endpoint must enforce identity.
  for (const legacy of [false, true]) {
    for (const status of [0, 1, 3, 7, -1]) {
      const state = { [GOODS]: { g: product() }, [ORDERS]: { o: { _id: 'o', status, goods_arr: [{ goods_id: 'g' }] } } };
      const db = database(state);
      await assert.rejects(rename(createCommerce(db), legacy), e => e.errCode === 'GOODS_IDENTITY_LOCKED' && e.fieldErrors[0].path === 'name');
      assert.deepEqual(db.snapshot(), state, 'failed renames must not change products, orders or save receipts');
    }
    for (const collection of [COMMENTS, 'jlg-goods-evaluate']) {
      const state = { [GOODS]: { g: product() }, [collection]: { c: { _id: 'c', goods_id: 'g' } } };
      const db = database(state);
      await assert.rejects(rename(createCommerce(db), legacy), e => e.errCode === 'GOODS_IDENTITY_LOCKED');
      assert.deepEqual(db.snapshot(), state);
    }
    const historicalSales = product(); historicalSales.total_sell_count = 1;
    await assert.rejects(rename(createCommerce(database({ [GOODS]: { g: historicalSales } })), legacy), /已有订单/);
    const unused = database({ [GOODS]: { g: product() } });
    await rename(createCommerce(unused), legacy);
    assert.equal(unused.snapshot()[GOODS].g.name, '四物膏', 'unused drafts can still be renamed');
  }
  const db = database({ [GOODS]: { g: product() } }), service = createCommerce(db);
  const order = await service.prepare({ user_id: 'buyer', provider: 'wxpay', order_no: 'business', out_trade_no: 'test-payment', description: 'test', total_fee: 1, address: 'synthetic', goods_arr: [{ goods_id: 'g', sku_id: 's', goods_num: 1 }] });
  await service.settle(order.out_trade_no, 1, {});
  await assert.rejects(rename(service), /不能改名复用/);
  await service.saveGoods({ _id: 'g', editor_revision: 0, request_id: 'update_details', patch: { goods_desc: '说明更新', is_on_sale: false } }, 'admin');
  assert.equal(db.snapshot()[GOODS].g.total_sell_count, 1);
  const fresh = product(); delete fresh._id; delete fresh.total_sell_count; delete fresh.stock_version; delete fresh.editor_revision; delete fresh.suks[0].sku_id; delete fresh.suks[0].legacy_specs; fresh.name = '四物膏';
  const created = await service.saveGoods({ request_id: 'create_formal', patch: fresh }, 'admin');
  assert.notEqual(created.id, 'g');
  assert.equal(db.snapshot()[GOODS][created.id].total_sell_count, 0);
  await service.settle(order.out_trade_no, 1, {});
  assert.equal(db.snapshot()[GOODS].g.total_sell_count, 1, 'duplicate callbacks keep the original identity');
  assert.equal(db.snapshot()[GOODS][created.id].total_sell_count, 0);

  const { state, historicalProduct } = incident(), repairDb = database(state);
  const plan = await repair(repairDb, { historicalProduct });
  assert.equal(plan.dryRun, true); assert.deepEqual(repairDb.snapshot(), state);
  assert.deepEqual([plan.result.orderCount, plan.result.commentCount, plan.result.salesMoved], [6, 1, 1]);
  await assert.rejects(repair(repairDb, { historicalProduct, apply: true, expectedFingerprint: 'unreviewed' }), /预演不一致/);
  assert.deepEqual(repairDb.snapshot(), state);
  const drifted = copy(state); drifted[GOODS][SOURCE_ID].suks[0].inventory = 97;
  const driftedDb = database(drifted);
  await assert.rejects(repair(driftedDb, { historicalProduct, apply: true, expectedFingerprint: plan.result.fingerprint }), /预演不一致/);
  assert.deepEqual(driftedDb.snapshot(), drifted, 'even an allowed stock edit invalidates the reviewed plan');
  await repair(repairDb, { historicalProduct, apply: true, expectedFingerprint: plan.result.fingerprint });
  const after = repairDb.snapshot();
  assert.equal(after[GOODS][SOURCE_ID].total_sell_count, 0);
  assert.deepEqual(after[GOODS][SOURCE_ID].suks, state[GOODS][SOURCE_ID].suks, 'never infer a physical stock correction');
  assert.equal(after[GOODS][ARCHIVE_ID].total_sell_count, 1);
  assert.equal(after[GOODS][ARCHIVE_ID].deleted, true);
  assert.equal(after[GOODS][ARCHIVE_ID].is_on_sale, false);
  for (const original of Object.values(state[ORDERS])) {
    const saved = copy(after[ORDERS][original._id]);
    assert.equal(saved.goods_arr[0].goods_id, ARCHIVE_ID);
    saved.goods_arr[0].goods_id = SOURCE_ID;
    assert.deepEqual(saved, original, 'preserve payment, amount, status, SKU, quantities and snapshots');
  }
  const savedComment = copy(Object.values(after[COMMENTS])[0]);
  assert.equal(savedComment.goods_id, ARCHIVE_ID); savedComment.goods_id = SOURCE_ID;
  assert.deepEqual(savedComment, Object.values(state[COMMENTS])[0]);
  assert.equal((await repair(repairDb, { historicalProduct, apply: true })).alreadyApplied, true);
  assert.deepEqual(repairDb.snapshot(), after, 'a second run cannot subtract sales again');
  for (const mutate of [s => { s[GOODS][SOURCE_ID].total_sell_count = 2; }, s => { s[ORDERS].order_0.status = 0; }, s => { s[ORDERS].order_0.goods_arr[0].goods_name = '四物膏'; }, s => { s[COMMENTS].extra = { _id: 'extra', goods_id: SOURCE_ID }; }]) {
    const changed = copy(state); mutate(changed); const changedDb = database(changed);
    await assert.rejects(repair(changedDb, { historicalProduct }));
    assert.deepEqual(changedDb.snapshot(), changed);
  }
  const rollbackDb = database(state), start = rollbackDb.startTransaction;
  rollbackDb.startTransaction = async () => {
    const tx = await start(), collection = tx.collection;
    tx.collection = name => { const api = collection(name); if (name === COMMENTS) api.update = async () => { throw new Error('simulated write failure'); }; return api; };
    return tx;
  };
  await assert.rejects(repair(rollbackDb, { historicalProduct, apply: true, expectedFingerprint: plan.result.fingerprint }), /simulated write failure/);
  assert.deepEqual(rollbackDb.snapshot(), state, 'all historical changes and archive creation must roll back together');
  console.log('Product identity: both save APIs, all order states, reviews, paid callbacks, new-product isolation, read-only repair, exact scope, preserved money/stock, idempotency and atomic rollback passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
