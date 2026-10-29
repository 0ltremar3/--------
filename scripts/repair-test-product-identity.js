'use strict';
// Incident-specific maintenance module. Run locally with an authenticated DB;
// never expose it as a public cloud function. Default mode makes no writes.
const crypto = require('crypto');
const { transaction, copy } = require('../uniCloud-alipay/cloudfunctions/common/jlg-commerce');
const { getDocument, findDocuments } = require('../uniCloud-alipay/cloudfunctions/common/jlg-commerce/db');
const GOODS = 'opendb-mall-goods', ORDERS = 'uni-pay-orders', COMMENTS = 'opendb-mall-comments';
const SOURCE_ID = 'goods_af6b6f4a6fcaefdd2d068178d170e338';
const ARCHIVE_ID = 'goods_test_archive_af6b6f4a6fcaefdd2d068178d170e338';
const AUDIT_ID = 'repair_product_identity_20261029';
const ORDER_NUMBERS = [
  '564191791802863230', '818381792130051006', '796721792139000302',
  '972301792139018773', '481101792139222550', '128601792164685896'
];
function ensure(condition, message) { if (!condition) throw new Error(message); }
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  return value;
}
async function repair(db, { historicalProduct, apply = false, expectedFingerprint } = {}) {
  return transaction(db, async tx => {
    const prior = await getDocument(tx, 'jlg-goods-editor-requests', AUDIT_ID);
    if (prior) return { alreadyApplied: true, result: prior.result };
    const goods = await getDocument(tx, GOODS, SOURCE_ID);
    ensure(goods && goods.name === '四物膏' && goods.total_sell_count === 1, '正式商品或销量已变化，停止修复');
    ensure(!await getDocument(tx, GOODS, ARCHIVE_ID), '归档商品 ID 已存在，停止修复');
    ensure(historicalProduct && historicalProduct._id === SOURCE_ID && historicalProduct.name === '测试商品', '缺少正确的历史测试商品备份');
    const orders = (await findDocuments(db, tx, ORDERS, { 'goods_arr.goods_id': SOURCE_ID }, 100)).sort((a, b) => a.order_no.localeCompare(b.order_no));
    ensure(orders.length === ORDER_NUMBERS.length && new Set(orders.map(o => o.order_no)).size === ORDER_NUMBERS.length && orders.every(o => ORDER_NUMBERS.includes(o.order_no)), '关联订单范围变化，停止修复');
    let sales = 0;
    for (const order of orders) {
      ensure(order.type === 'goods' && order.stock_version === 1 && order.goods_arr.length === 1, '订单结构变化，停止修复');
      const line = order.goods_arr[0];
      ensure(line.goods_id === SOURCE_ID && line.goods_name === '测试商品' && line.goods_num === 1 && [1, 10].includes(line.goods_price) && !line.goods_seckill, '发现非测试商品行，停止修复');
      ensure(historicalProduct.suks.some(row => row.sku_id === line.sku_id), '历史 SKU 无法对应，停止修复');
      ensure((order.status === -1 && order.stock_state === 'released') || (order.status === 3 && order.stock_state === 'refunded') || (order.status === 7 && order.stock_state === 'paid'), '发现未结束订单，停止修复');
      if (order.stock_state === 'paid') sales += line.goods_num;
    }
    ensure(sales === 1, '测试订单净销量变化，停止修复');
    const comments = await findDocuments(db, tx, COMMENTS, { goods_id: SOURCE_ID }, 100);
    ensure(comments.length === 1 && comments[0]._id === '6ae348690877c0122b7cbe25', '评价范围变化，停止修复');
    ensure(comments.every(c => orders.some(o => o._id === c.order_id && o.order_no === '128601792164685896' && o.user_id === c.user_id && JSON.stringify(c.goods_suk) === JSON.stringify(o.goods_arr[0].goods_suk))), '评价归属无法验证，停止修复');
    ensure(!(await findDocuments(db, tx, 'jlg-goods-evaluate', { goods_id: SOURCE_ID }, 1)).length, '发现额外旧版评价，停止修复');
    const paidLine = orders.find(o => o.stock_state === 'paid').goods_arr[0];
    const archive = {
      ...copy(historicalProduct), _id: ARCHIVE_ID, name: '测试商品',
      goods_thumb: paidLine.goods_img, goods_banner_imgs: [{ url: paidLine.goods_img }],
      goods_desc: '', videos: [], goods_editor_meta: undefined,
      is_on_sale: false, is_best: false, is_new: false, is_hot: false, vip_goods: '', deleted: true,
      freight_mode: 'free', freight_template_id: '', freight: true, freight_amount: 0,
      suks: historicalProduct.suks.map(row => ({ ...row, inventory: 0, price: paidLine.goods_price, goods_thumb: paidLine.goods_img })),
      fs_suks: [], orig_fs_suks: [], remain_count: 0, total_sell_count: sales, comment_count: comments.length,
      stock_version: 1, editor_revision: 1
    };
    delete archive.goods_editor_meta;
    const operations = [
      { collection: GOODS, id: ARCHIVE_ID, before: null, add: archive },
      { collection: GOODS, id: SOURCE_ID, before: goods, patch: { total_sell_count: goods.total_sell_count - sales, editor_revision: (goods.editor_revision || 0) + 1 } },
      ...orders.map(order => ({ collection: ORDERS, id: order._id, before: order, patch: { goods_arr: order.goods_arr.map(line => ({ ...line, goods_id: ARCHIVE_ID })) } })),
      ...comments.map(comment => ({ collection: COMMENTS, id: comment._id, before: comment, patch: { goods_id: ARCHIVE_ID } }))
    ];
    const fingerprint = crypto.createHash('sha256').update(JSON.stringify(stable(operations))).digest('hex');
    const result = { sourceId: SOURCE_ID, archiveId: ARCHIVE_ID, orderCount: orders.length, commentCount: comments.length, salesMoved: sales, fingerprint };
    if (!apply) return { dryRun: true, result, operations };
    ensure(expectedFingerprint === fingerprint, '数据与已审核预演不一致，请重新预演');
    for (const op of operations) {
      if (op.add) await tx.collection(op.collection).add(op.add);
      else await tx.collection(op.collection).doc(op.id).update(op.patch);
    }
    // Private, transactional before-images support a reviewed rollback.
    await tx.collection('jlg-goods-editor-requests').add({ _id: AUDIT_ID, fingerprint, result, before: operations.map(({ collection, id, before }) => ({ collection, id, before })), create_date: Date.now() });
    return { applied: true, result };
  });
}
module.exports = { repair, SOURCE_ID, ARCHIVE_ID, ORDER_NUMBERS };
