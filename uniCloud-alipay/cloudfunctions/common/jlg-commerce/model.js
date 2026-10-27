'use strict';
const crypto = require('crypto');
const copy = value => JSON.parse(JSON.stringify(value));
const key = specs => JSON.stringify(specs);
const id = () => crypto.randomBytes(16).toString('hex');
function fail(message, code = 'GOODS_INVALID') {
  throw Object.assign(new Error(message), { errCode: code, errMsg: message });
}
function integer(value, label, min = 0) {
  if (!Number.isSafeInteger(value) || value < min) fail(`${label}无效`);
  return value;
}
function normalize(goods) {
  const result = copy(goods);
  for (const field of ['suks', 'fs_suks']) {
    const seen = new Set();
    result[field] = (result[field] || []).map(row => {
      if (!Array.isArray(row.specs) || !row.specs.length || row.specs.some(v => typeof v !== 'string' || !v.trim())) fail('规格不能为空');
      if (seen.has(key(row.specs))) fail('商品存在重复规格，请先在后台修复');
      seen.add(key(row.specs));
      // Deterministic legacy IDs let old snapshots resolve before/after lazy migration.
      const sku_id = row.sku_id || 'sku_' + crypto.createHash('sha256').update(key([goods._id, field, row.specs])).digest('hex').slice(0, 32);
      return { ...row, sku_id, legacy_specs: row.legacy_specs || [copy(row.specs)] };
    });
    if (new Set(result[field].map(row => row.sku_id)).size !== result[field].length) fail('SKU 标识重复');
  }
  return result;
}
function resolve(goods, selection, seckill = false) {
  const rows = goods[seckill ? 'fs_suks' : 'suks'] || [];
  const matches = selection.sku_id ? rows.filter(row => row.sku_id === selection.sku_id) : rows.filter(row =>
    key(row.specs) === key(selection.specs) || (row.legacy_specs || []).some(specs => key(specs) === key(selection.specs)));
  if (matches.length !== 1 || matches[0].disabled) fail('该规格已变更或停售，请重新选择', 'SKU_UNAVAILABLE');
  return matches[0];
}
function available(goods) {
  return ['suks', 'fs_suks'].reduce((sum, field) => sum + (goods[field] || []).reduce((n, row) => n + integer(row.inventory, '库存'), 0), 0);
}
function mergeSkus(previous, incoming, field) {
  const rows = previous[field] || [];
  const used = new Set();
  const merged = incoming.map(row => {
    integer(row.price, '售价', 1);
    integer(row.inventory, '库存');
    const old = row.sku_id && rows.find(item => item.sku_id === row.sku_id);
    if (row.sku_id && !old) fail('SKU 已变化，请重新加载', 'GOODS_CONFLICT');
    const result = { ...row, sku_id: old ? old.sku_id : id(), legacy_specs: old ? old.legacy_specs : [] };
    if (!result.legacy_specs.some(specs => key(specs) === key(result.specs))) result.legacy_specs.push(copy(result.specs));
    if (used.has(result.sku_id)) fail('SKU 标识重复');
    used.add(result.sku_id);
    return result;
  });
  const aliases = new Map();
  for (const row of merged) for (const specs of row.legacy_specs || []) {
    const k = key(specs);
    if (aliases.has(k) && aliases.get(k) !== row.sku_id) fail('此规格名称已被历史 SKU 使用，请使用新的名称');
    aliases.set(k, row.sku_id);
  }
  return merged;
}
module.exports = { copy, key, id, fail, integer, normalize, resolve, available, mergeSkus };
