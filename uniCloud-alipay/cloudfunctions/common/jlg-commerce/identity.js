'use strict';
const { findDocuments } = require('./db');

// A product ID owns its orders and reviews for life. Replacing its name after
// use would make a different product inherit that history (including refunds).
async function assertNameChange(db, tx, previous, name) {
  if (!previous || name === undefined || name === previous.name) return;
  const message = '此商品已有订单、销量或评价，不能改名复用；请新增商品，原商品可下架';
  const reject = () => {
    throw Object.assign(new Error(message), {
      errCode: 'GOODS_IDENTITY_LOCKED', errMsg: message,
      fieldErrors: [{ path: 'name', message, sku_id: '' }]
    });
  };
  if (previous.total_sell_count > 0 || previous.comment_count > 0) reject();
  for (const [collection, query] of [
    ['uni-pay-orders', { 'goods_arr.goods_id': previous._id }],
    ['opendb-mall-comments', { goods_id: previous._id }],
    ['jlg-goods-evaluate', { goods_id: previous._id }]
  ]) {
    if ((await findDocuments(db, tx, collection, query, 1)).length) reject();
  }
}

module.exports = { assertNameChange };
