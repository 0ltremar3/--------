'use strict';
const crypto = require('crypto');
const M = require('./model');
const { getDocument, findDocuments } = require('./db');
const FIELDS = ['name', 'category_id', 'crossed_price', 'goods_services', 'freight', 'freight_amount', 'freight_mode', 'freight_template_id', 'goods_desc', 'goods_thumb', 'goods_banner_imgs', 'videos', 'is_on_sale', 'is_best', 'is_new', 'is_hot', 'vip_goods', 'orig_suks', 'orig_fs_suks', 'suks', 'fs_suks', 'goods_editor_meta'];
const STOCK = ['suks', 'fs_suks', 'orig_suks', 'orig_fs_suks'];
function error(path, message, code = 'GOODS_INVALID', sku_id) {
  throw Object.assign(new Error(message), { errCode: code, errMsg: message, fieldErrors: [{ path, message, sku_id: sku_id || '' }] });
}
function money(value, path, min = 0) {
  if (!Number.isSafeInteger(value) || value < min || value > 2147483647) error(path, '请输入有效金额（最多两位小数）');
}
function validate(data, stock, isNew) {
  if (typeof data.name !== 'string' || !data.name.trim()) error('name', '请填写商品名称');
  if (typeof data.category_id !== 'string' || !data.category_id) error('category_id', '请选择商品分类');
  if (!Array.isArray(data.goods_banner_imgs) || data.goods_banner_imgs.length < 1 || data.goods_banner_imgs.length > 5 || data.goods_banner_imgs.some(file => !file || !/^https?:\/\//.test(file.url || ''))) error('goods_banner_imgs', '请上传 1–5 张商品图片');
  if (!/^https?:\/\//.test(data.goods_thumb || '')) error('goods_thumb', '请等待封面生成完成');
  if (!Array.isArray(data.videos || []) || (data.videos || []).length > 1) error('videos', '最多上传一个视频');
  if (!Array.isArray(data.goods_services) || data.goods_services.some(v => typeof v !== 'string')) error('goods_services', '商品服务格式无效');
  if (!['', 'vip', 'svip'].includes(data.vip_goods || '')) error('vip_goods', '请选择有效权益类型');
  for (const field of ['freight', 'is_on_sale', 'is_best', 'is_new', 'is_hot']) if (data[field] != null && typeof data[field] !== 'boolean') error(field, '请选择有效状态');
  if (data.crossed_price != null) money(data.crossed_price, 'crossed_price');
  if (!data.freight) money(data.freight_amount, 'freight_amount');
  if (stock || isNew) for (const [field, origin] of [['suks', 'orig_suks'], ['fs_suks', 'orig_fs_suks']]) {
    const rows = data[field], specs = data[origin];
    if (!Array.isArray(rows) || rows.length > 200 || (field === 'suks' && !rows.length)) error(field, '请填写规格，最多 200 个组合');
    if (!Array.isArray(specs) || (rows.length && !specs.length)) error(origin, '请填写规格选项');
    specs.forEach((spec, i) => {
      if (!spec.name || !spec.name.trim() || !Array.isArray(spec.values) || !spec.values.length || spec.values.some(v => !v.name || !v.name.trim()) || new Set(spec.values.map(v => v.name)).size !== spec.values.length) error(origin + '.' + i, '规格名称和值不能为空或重复');
    });
    rows.forEach((row, i) => {
      money(row.price, field + '.' + i + '.price', 1);
      if (!Number.isSafeInteger(row.inventory) || row.inventory < 0 || row.inventory > 2147483647) error(field + '.' + i + '.inventory', '库存应为大于或等于 0 的整数', 'GOODS_INVALID', row.sku_id);
      if (!Array.isArray(row.specs) || row.specs.length !== specs.length || row.specs.some((v, n) => !specs[n].values.some(option => option.name === v))) error(field, '规格组合与选项不一致');
    });
  }
  if (data.is_new && !(data.fs_suks || []).length) error('fs_suks', '请添加至少一个秒杀规格');
  if (data.is_new) (data.fs_suks || []).forEach((row, i) => {
    if (!row.source_sku_id) return;
    const source = data.suks.find(item => item.sku_id === row.source_sku_id);
    if (!source || row.price > source.price) error('fs_suks.' + i + '.price', '秒杀价不能高于对应普通售价', 'GOODS_INVALID', row.sku_id);
  });
  const meta = data.goods_editor_meta;
  if (meta) {
    if (meta.version !== 1 || !['single', 'multi'].includes(meta.spec_mode)) error('goods_editor_meta', '编辑器元数据无效');
    if (meta.spec_mode === 'single' && (!Array.isArray(data.suks) || data.suks.length !== 1)) error('suks', '单规格商品必须只有一个规格');
    const cover = meta.cover;
    if (!cover || !['auto', 'legacy'].includes(cover.mode) || !['contain', 'crop'].includes(cover.fit)) error('goods_thumb', '封面设置无效');
    if (cover.mode === 'auto' && cover.source_id !== (data.goods_banner_imgs[0].fileID || data.goods_banner_imgs[0].url)) error('goods_thumb', '封面必须对应第一张商品图片');
    if (cover.fit === 'crop') {
      const c = cover.crop;
      if (!c || ['x', 'y', 'width', 'height'].some(k => !Number.isFinite(c[k]) || c[k] < 0 || c[k] > 1) || c.width <= 0 || c.height <= 0 || c.x + c.width > 1.000001 || c.y + c.height > 1.000001) error('goods_thumb', '裁切范围无效');
    }
  }
}
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.keys(value).sort().reduce((o, k) => { if (value[k] !== undefined) o[k] = stable(value[k]); return o; }, {});
  return value;
}
function createEditor(db, transaction) {
  async function save(input, uid) {
    if (!uid) M.fail('请重新登录', 'AUTH_REQUIRED');
    if (!input.patch || typeof input.patch !== 'object' || Array.isArray(input.patch)) error('form', '保存内容无效');
    if (!/^[a-zA-Z0-9_-]{8,100}$/.test(input.request_id || '')) error('form', '保存请求标识无效');
    if (Object.keys(input.patch).some(k => !FIELDS.includes(k) && k !== 'sku_images')) error('form', '包含不可编辑字段');
    const fingerprint = crypto.createHash('sha256').update(JSON.stringify(stable(input))).digest('hex');
    const requestId = crypto.createHash('sha256').update(uid + ':' + input.request_id).digest('hex').slice(0, 32);
    return transaction(db, async tx => {
      const prior = await getDocument(tx, 'jlg-goods-editor-requests', requestId);
      if (prior) {
        if (prior.fingerprint !== fingerprint) error('form', '请求内容已变化，请重新保存');
        return prior.result;
      }
      const raw = input._id ? await getDocument(tx, 'opendb-mall-goods', input._id) : null;
      if (input._id && !raw) error('form', '商品不存在');
      if (raw && raw.deleted) error('form', '商品已删除，不能继续编辑');
      if (raw && (raw.editor_revision || 0) !== input.editor_revision) error('form', '其他管理员已修改此商品，请核对后重试', 'EDITOR_CONFLICT');
      const stock = !raw || STOCK.some(k => Object.prototype.hasOwnProperty.call(input.patch, k)) || input.inventory_verified === true;
      const previous = raw ? M.normalize(raw) : { suks: [], fs_suks: [] };
      if (raw && stock && JSON.stringify(stable({ suks: previous.suks, fs_suks: previous.fs_suks })) !== JSON.stringify(stable(input.stock_snapshot))) error('suks', '价格或库存已变化，请核对最新值', 'GOODS_CONFLICT');
      const data = { goods_services: [], videos: [], vip_goods: '', goods_desc: '', crossed_price: null, freight: true, freight_amount: 0, is_on_sale: false, is_best: false, is_new: false, is_hot: false, suks: [], fs_suks: [], orig_suks: [], orig_fs_suks: [], ...previous, ...M.copy(input.patch) };
      if (raw && data.goods_editor_meta && (raw.goods_editor_meta ? raw.goods_editor_meta.spec_mode : 'multi') !== data.goods_editor_meta.spec_mode) error('suks', '保存后的规格类型不能切换');
      await require('./freight').bind(db, tx, raw, data);
      validate(data, stock, !raw);
      await require('./identity').assertNameChange(db, tx, raw, data.name);
      data.goods_services = [...new Set(data.goods_services.map(v => v.trim()).filter(Boolean))];
      if (data.freight) data.freight_amount = 0;
      if (stock) {
        for (const field of ['suks', 'fs_suks']) {
          if (previous[field].some(row => !data[field].some(item => item.sku_id === row.sku_id))) error(field, '已保存 SKU 不能删除，请设库存为 0');
          const oldDimensions = previous[field === 'suks' ? 'orig_suks' : 'orig_fs_suks'] || [];
          if (raw && previous[field].length && oldDimensions.length !== data[field === 'suks' ? 'orig_suks' : 'orig_fs_suks'].length) error(field, '已有 SKU 不能新增或删除规格维度');
          data[field] = M.mergeSkus(previous, data[field], field);
        }
        for (const row of data.fs_suks) {
          const source = row.source_sku_id ? data.suks.find(s => s.sku_id === row.source_sku_id) : row.source_spec_value_ids && data.suks.find(s => M.key(s.spec_value_ids) === M.key(row.source_spec_value_ids));
          if (row.source_sku_id || row.source_spec_value_ids) {
            if (!source) error('fs_suks', '秒杀对应的普通 SKU 不存在');
            row.source_sku_id = source.sku_id;
            row.specs = M.copy(source.specs);
            delete row.source_spec_value_ids;
            if (data.is_new && row.price > source.price) error('fs_suks', '秒杀价不能高于对应普通售价', 'GOODS_INVALID', row.sku_id);
          }
        }
        if (data.fs_suks.length && data.fs_suks.every(row => row.source_sku_id)) data.orig_fs_suks = M.copy(data.orig_suks);
        validate(data, true, !raw);
        M.normalize(data);
        if (!raw || raw.stock_version === 1) data.stock_version = 1;
        else if (input.inventory_verified === true) {
          const pending = await findDocuments(db, tx, 'uni-pay-orders', { status: 0, 'goods_arr.goods_id': raw._id }, 1);
          if (pending.length) error('inventory_verified', '请先关闭旧的未付款订单，再核对库存');
          data.stock_version = 1;
        }
        data.remain_count = M.available(data);
      }
      if (data.is_on_sale && (!raw || !raw.is_on_sale || input.intent === 'publish') && data.stock_version !== 1) error('inventory_verified', '上架前请确认实际可售库存');
      const update = {};
      for (const field of Object.keys(input.patch)) if (field !== 'sku_images') update[field] = data[field];
      if (input.patch.sku_images !== undefined) {
        const images = input.patch.sku_images;
        if (!raw || !Array.isArray(images) || images.length > 400) error('suks', '规格图片更新无效');
        for (const image of images) {
          if (!['suks', 'fs_suks'].includes(image.pool) || typeof image.sku_id !== 'string' || typeof image.url !== 'string' || image.url && !/^https?:\/\//.test(image.url)) error('suks', '规格图片地址或标识无效');
          const row = data[image.pool].find(item => item.sku_id === image.sku_id);
          if (!row) error(image.pool, '此规格已变更，请重新加载', 'EDITOR_CONFLICT');
          row.goods_thumb = image.url;
          // Use the transaction's latest rows, never the client's price/inventory snapshot.
          update[image.pool] = data[image.pool];
        }
      }
      if (stock) for (const field of [...STOCK, 'remain_count', 'stock_version']) if (data[field] !== undefined) update[field] = data[field];
      if (['freight', 'freight_amount', 'freight_mode', 'freight_template_id'].some(k => k in input.patch)) {
        for (const k of ['freight', 'freight_amount', 'freight_mode', 'freight_template_id']) if (data[k] !== undefined) update[k] = data[k];
      }
      if (raw && stock && data.stock_version === 1) {
        if (raw.total_sell_count == null) update.total_sell_count = 0;
        else M.integer(raw.total_sell_count, '历史销量');
      }
      update.editor_revision = (raw && raw.editor_revision || 0) + 1;
      update.updated_at = Date.now();
      let id = input._id;
      if (raw) await tx.collection('opendb-mall-goods').doc(id).update(update);
      else {
        const fresh = {}; for (const field of FIELDS) if (data[field] !== undefined) fresh[field] = data[field];
        id = 'goods_' + requestId;
        await tx.collection('opendb-mall-goods').add({ ...fresh, ...update, _id: id, total_sell_count: 0, add_date: Date.now() });
      }
      const result = { id, editor_revision: update.editor_revision };
      await tx.collection('jlg-goods-editor-requests').add({ _id: requestId, user_id: uid, fingerprint, result, create_date: Date.now() });
      return result;
    });
  }
  async function takeOff(ids) {
    return transaction(db, async tx => {
      for (const id of ids) {
        const raw = await getDocument(tx, 'opendb-mall-goods', id);
        if (raw) await tx.collection('opendb-mall-goods').doc(id).update({ is_on_sale: false, editor_revision: (raw.editor_revision || 0) + 1, updated_at: Date.now() });
      }
      return { success: true };
    });
  }
  async function remove(ids, uid) {
    if (!uid) M.fail('请重新登录', 'AUTH_REQUIRED');
    if (!Array.isArray(ids) || !ids.length || ids.length > 100 || ids.some(id => typeof id !== 'string' || !id.trim() || id.length > 128)) M.fail('请选择 1–100 件有效商品');
    return transaction(db, async tx => {
      let deletedCount = 0;
      for (const id of new Set(ids)) {
        const raw = await getDocument(tx, 'opendb-mall-goods', id);
        if (!raw || raw.deleted) continue;
        // Retain SKU identities for pending payments, cancellations and refunds.
        const patch = {
          deleted: true,
          is_on_sale: false, is_best: false, is_new: false, is_hot: false, vip_goods: '',
          editor_revision: (raw.editor_revision || 0) + 1, updated_at: Date.now()
        };
        // Deleted products must not keep an invisible freight-template binding.
        if (raw.freight_mode === 'template') {
          patch.freight_mode = 'free';
          await require('./freight').bind(db, tx, raw, patch);
        }
        // Public product reads must not include fields with admin-only permissions.
        // Keep the actor/time in the existing server-only audit collection.
        await tx.collection('jlg-goods-editor-requests').add({
          _id: crypto.createHash('sha256').update('delete:' + id).digest('hex').slice(0, 32),
          user_id: uid, fingerprint: 'delete:' + id, result: { id, deleted: true }, create_date: Date.now()
        });
        await tx.collection('opendb-mall-goods').doc(id).update(patch);
        deletedCount++;
      }
      return { success: true, deletedCount };
    });
  }
  return { save, takeOff, remove };
}
module.exports = { createEditor, validate };
