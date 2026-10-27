'use strict';
const { transaction } = require('./index');
const { fail } = require('./model');
const { getDocument, findDocuments } = require('./db');
const TABLE = 'uni-pay-orders';
const find = async (db, tx, out_trade_no) => (await findDocuments(db, tx, TABLE, { out_trade_no }, 1))[0];
// Full refunds only: the current product offers unshipped/full-order refunds.
// Provider acceptance is NOT proof that a refund has completed.
async function refundStock(db, provider, order, data) {
  if (data.refund_fee && data.refund_fee !== order.total_fee) fail('此订单仅支持整单退款');
  const outRefundNo = order.out_trade_no + '-full';
  await transaction(db, async tx => {
    const current = await find(db, tx, order.out_trade_no);
    if (current.stock_state === 'refunded') return;
    if (current.stock_state !== 'paid' || ![1, 6].includes(current.status) || (current.status === 6 && current.origstate !== 1)) fail('仅未发货订单可以自动退款入库');
    await tx.collection(TABLE).doc(current._id).update({ stock_refund_pending: true, stock_refund_no: outRefundNo, status: 6, origstate: 1 });
  });
  if (order.stock_state === 'refunded') return { errCode: 0, errMsg: '已退款' };
  const result = await provider.refund({ outTradeNo: order.out_trade_no, outRefundNo, totalFee: order.total_fee, refundFee: order.total_fee, refundDesc: data.refund_desc || '未发货整单退款' });
  const response = await provider.refundQuery({ outTradeNo: order.out_trade_no, outRefundNo });
  const confirmed = await confirmRefund(db, order.out_trade_no, response);
  return { errCode: 0, errMsg: confirmed ? '退款完成，库存已恢复' : '退款处理中，库存将在确认到账后恢复', pending: !confirmed, result };
}
async function confirmRefund(db, outTradeNo, response) {
  // uni-pay normalizes WeChat/Alipay refund query results. Unknown states fail closed.
  if (!response) return false;
  return transaction(db, async tx => {
    const order = await find(db, tx, outTradeNo);
    if (!order || order.stock_version !== 1 || !order.stock_refund_pending) return false;
    if (order.stock_state === 'refunded') return true;
    response = Array.isArray(response.refundList) ? response.refundList.find(item => item.outRefundNo === order.stock_refund_no) : response;
    if (!response || !['SUCCESS', 'REFUND_SUCCESS'].includes(response.refundStatus || response.status)) return false;
    if (Number(response.refundFee) !== order.total_fee || (response.outRefundNo && response.outRefundNo !== order.stock_refund_no)) fail('退款金额或退款单号不匹配');
    if (order.stock_state !== 'paid') fail('退款库存状态冲突');
    const products = new Map();
    for (const line of order.goods_arr) {
      if (!products.has(line.goods_id)) products.set(line.goods_id, await getDocument(tx, 'opendb-mall-goods', line.goods_id));
      const goods = products.get(line.goods_id);
      const row = goods && (goods[line.goods_seckill ? 'fs_suks' : 'suks'] || []).find(row => row.sku_id === line.sku_id);
      if (!row) fail('原 SKU 不存在，不能自动入库');
      row.inventory += line.goods_num;
      goods.total_sell_count = Math.max(0, (goods.total_sell_count || 0) - line.goods_num);
    }
    for (const goods of products.values()) await tx.collection('opendb-mall-goods').doc(goods._id).update({ suks: goods.suks, fs_suks: goods.fs_suks, remain_count: require('./model').available(goods), total_sell_count: goods.total_sell_count });
    await tx.collection(TABLE).doc(order._id).update({ stock_state: 'refunded', stock_refund_pending: false, stock_refunded_fee: order.total_fee, refund_fee: order.total_fee, refund_count: 1, status: 3, refund_date: Date.now(), refund_list: [{ out_refund_no: order.stock_refund_no, refund_fee: order.total_fee, refund_date: Date.now() }] });
    return true;
  });
}
module.exports = { refundStock, confirmRefund };
