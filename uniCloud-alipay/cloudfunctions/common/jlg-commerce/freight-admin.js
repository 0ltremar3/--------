'use strict';
const F = require('./freight');
const M = require('./model');
const { getDocument: get, findDocuments: find } = require('./db');
function createFreightAdmin(db, transaction) {
  async function refs(id) { return (await db.collection('opendb-mall-goods').where({ freight_mode: 'template', freight_template_id: id }).count()).total; }
  async function list({ page = 1, keyword = '' } = {}) {
    M.integer(page, '页码', 1);
    if (typeof keyword !== 'string' || keyword.length > 80) M.fail('搜索内容无效');
    const where = { deleted: false };
    if (keyword.trim()) where.name = new RegExp(keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const collection = () => db.collection(F.TABLE).where(where);
    const total = (await collection().count()).total;
    const { data } = await collection().orderBy('updated_at desc').skip((page - 1) * 50).limit(50).get();
    for (const row of data) row.goods_count = await refs(row._id);
    return { data, total, page };
  }
  async function getDetail(id) { const row = await F.template(db, id); return { ...row, goods_count: await refs(id) }; }
  async function save(input, uid) {
    const codes = F.validateTemplate(input);
    return transaction(db, async tx => {
      const previous = input._id ? await F.template(tx, input._id) : null;
      if (previous && input.version !== previous.version) M.fail('模板已被修改，请刷新后重试', 'FREIGHT_CONFLICT');
      for (const code of codes) { const r = await F.region(db, tx, code); if (r.region_type !== 0) M.fail('首期仅支持选择省级地区'); }
      const value = {};
      for (const key of ['name', 'default_fee', 'region_fees', 'free_rules', 'blocked_regions']) value[key] = M.copy(input[key]);
      Object.assign(value, { name: value.name.trim(), version: (previous ? previous.version : 0) + 1, deleted: false, updated_at: Date.now(), updated_by: uid });
      if (previous) { await tx.collection(F.TABLE).doc(input._id).update(value); return { id: input._id, version: value.version }; }
      return tx.collection(F.TABLE).add({ ...value, created_at: Date.now(), binding_revision: 0 });
    });
  }
  async function copy(id, uid) { const row = await getDetail(id); return save({ ...row, _id: undefined, name: row.name.slice(0, 75) + ' 副本' }, uid); }
  async function remove(input, uid) {
    return transaction(db, async tx => {
      const row = await F.template(tx, input.id);
      if (row.version !== input.version) M.fail('模板已被修改，请刷新后重试', 'FREIGHT_CONFLICT');
      const linked = await find(db, tx, 'opendb-mall-goods', { freight_mode: 'template', freight_template_id: input.id }, 1);
      if (linked.length) M.fail('已有商品使用此模板，请先解除绑定', 'FREIGHT_IN_USE');
      await tx.collection(F.TABLE).doc(input.id).update({ deleted: true, version: row.version + 1, updated_by: uid, updated_at: Date.now(), binding_revision: (row.binding_revision || 0) + 1 });
      return { success: true };
    });
  }
  return { list, getDetail, save, copy, remove };
}
module.exports = { createFreightAdmin };
