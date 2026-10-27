'use strict';
const uniId = require('uni-id-common');
const { createCommerce } = require('jlg-commerce');
module.exports = {
  async _before() {
    const token = this.getUniIdToken();
    const auth = token ? await uniId.createInstance({ clientInfo: this.getClientInfo() }).checkToken(token) : {};
    this.uid = !auth.errCode && auth.uid || '';
    if (this.getMethodName() === 'quote' && !this.uid) throw Object.assign(new Error('请先登录'), { errCode: 'AUTH_REQUIRED' });
    this.commerce = createCommerce(uniCloud.database());
  },
  async quote(input = {}) {
    try { return await this.commerce.quote({ ...input, user_id: this.uid }); }
    catch (error) { if (!error.errCode) throw error; console.warn('checkout', error.errCode); return { error: { errCode: error.errCode, errMsg: error.errMsg || error.message, blocked_goods: error.blocked_goods || [] } }; }
  },
  async previewFreight(input = {}) { return this.commerce.previewFreight({ ...input, user_id: this.uid }); },
  _after(error, result) {
    if (error) { console.warn('checkout', error.errCode || 'INTERNAL_ERROR'); throw error; }
    return result;
  }
};
