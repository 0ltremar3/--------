'use strict';
const db = uniCloud.database();
const payment = require('jlg-pay-runtime').pay;
const commerce = require('jlg-commerce').createCommerce(db);
async function eachPage(where, work) {
  let cursor = '';
  while (true) {
    const filter = cursor ? { ...where, _id: db.command.gt(cursor) } : where;
    const rows = (await db.collection('uni-pay-orders').where(filter).orderBy('_id', 'asc').limit(100).get()).data;
    if (!rows.length) break;
    for (const row of rows) await work(row);
    cursor = rows[rows.length - 1]._id;
  }
}
exports.main = async () => {
  let closed = 0;
  const failed = [];
  await eachPage({ status: 0, type: 'goods', create_date: db.command.lt(Date.now() - 24 * 3600 * 1000) }, async order => {
    try {
      if (order.stock_version === 1 && !order.stock_payment_started) await commerce.release(order.out_trade_no, true);
      else await payment.closeOrder({ out_trade_no: order.out_trade_no });
      closed++;
    } catch (error) { failed.push({ id: order._id, message: error.message || error.errMsg }); }
  });
  await eachPage({ stock_refund_pending: true }, async order => {
    try { await payment.getRefund({ out_trade_no: order.out_trade_no }); }
    catch (error) { failed.push({ id: order._id, message: error.message || error.errMsg }); }
  });
  console.log('stock reconciliation', { closed, failed });
  return { closed, failed: failed.length };
};
