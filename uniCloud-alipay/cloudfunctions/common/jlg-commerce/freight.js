'use strict';
const M = require('./model');
const { getDocument: get, findDocuments: find } = require('./db');
const TABLE = 'jlg-freight-templates';
function fail(message, code = 'FREIGHT_INVALID') { M.fail(message, code); }
function money(n, min = 0) { if (!Number.isSafeInteger(n) || n < min || n > 2147483647) fail('运费或包邮金额无效'); return n; }
function mode(goods) {
  const value = goods.freight_mode || (goods.freight ? 'free' : 'fixed');
  if (!['free', 'fixed', 'template'].includes(value)) fail('商品运费方式无效');
  return value;
}
function validateTemplate(value) {
  if (!value || typeof value.name !== 'string' || !value.name.trim() || value.name.length > 80) fail('请填写80字以内的模板名称');
  money(value.default_fee);
  const blocked = value.blocked_regions;
  if (!Array.isArray(blocked) || blocked.length > 100 || new Set(blocked).size !== blocked.length) fail('不配送地区无效');
  const codes = new Set(blocked);
  for (const [field, amount] of [['region_fees', 'fee'], ['free_rules', 'threshold']]) {
    if (!Array.isArray(value[field]) || value[field].length > 100) fail('地区规则无效');
    const seen = new Set();
    for (const rule of value[field]) {
      if (!rule || !Array.isArray(rule.regions) || !rule.regions.length || rule.regions.length > 100) fail('请选择规则适用地区');
      money(rule[amount], amount === 'threshold' ? 1 : 0);
      for (const code of rule.regions) {
        if (seen.has(code)) fail('同类规则地区重复');
        if (blocked.includes(code)) fail('不配送地区与收费或包邮规则冲突');
        seen.add(code); codes.add(code);
      }
    }
  }
  if ([...codes].some(code => typeof code !== 'string' || !/^\d{6}$/.test(code))) fail('地区编码无效');
  return [...codes];
}
async function region(db, tx, code) {
  if (typeof code !== 'string' || !/^\d{6}$/.test(code)) fail('请选择有效配送地区', 'ADDRESS_INVALID');
  const chain = [];
  for (let depth = 0; depth < 3; depth++) {
    const row = (await find(db, tx, 'opendb-city-china', { code }, 1))[0];
    if (!row || ![0, 1, 2].includes(row.type) || chain.some(v => v.code === code)) fail('收货地区无效，请重新选择', 'ADDRESS_INVALID');
    if (chain.length && row.type !== chain[chain.length - 1].type - 1) fail('地区层级无效', 'ADDRESS_INVALID');
    chain.push(row);
    if (row.type === 0) return { province_code: row.code, area_code: chain[0].code, region_name: chain.slice().reverse().map(v => v.name).join(' '), region_type: chain[0].type };
    code = row.parent_code;
  }
  fail('收货地区无效', 'ADDRESS_INVALID');
}
async function address(db, tx, uid, id) {
  if (!uid) fail('请先登录', 'AUTH_REQUIRED');
  if (typeof id !== 'string' || !id) fail('请选择收货地址', 'ADDRESS_INVALID');
  const row = await get(tx, 'jlg-goods-address', id);
  if (!row || row.user_id !== uid) fail('收货地址不存在或无权使用', 'ADDRESS_INVALID');
  if (![row.name, row.mobile, row.address].every(v => typeof v === 'string' && v.trim())) fail('请补全收货信息', 'ADDRESS_INVALID');
  const area = await region(db, tx, row.area_code);
  if (area.region_type !== 2) fail('请选择完整省市区', 'ADDRESS_INVALID');
  return { address_id: id, name: row.name, mobile: row.mobile, detail: row.address, ...area };
}
async function template(tx, id) {
  if (typeof id !== 'string' || !id) fail('商品未绑定运费模板', 'FREIGHT_CONFIG_INVALID');
  const row = await get(tx, TABLE, id);
  if (!row || row.deleted) fail('运费模板不可用，请联系商家', 'FREIGHT_CONFIG_INVALID');
  try { validateTemplate(row); } catch (_) { fail('运费模板配置无效，请联系商家', 'FREIGHT_CONFIG_INVALID'); }
  return row;
}
function calculate(lines, products, templates, province) {
  const groups = new Map();
  for (const line of lines) {
    const goods = products.get(line.goods_id), kind = mode(goods);
    const id = kind === 'template' ? goods.freight_template_id : 'legacy';
    if (!groups.has(id)) groups.set(id, { group_id: id, template_id: kind === 'template' ? id : '', amount: 0, fee: 0, goods: [], rule: 'fixed' });
    const group = groups.get(id);
    group.amount = money(group.amount + money(line.goods_price) * M.integer(line.goods_num, '数量', 1));
    if (!group.goods.some(item => item.id === goods._id)) group.goods.push({ id: goods._id, name: goods.name });
    if (kind === 'fixed') group.fee = Math.max(group.fee, money(goods.freight_amount));
  }
  const blocked = [];
  for (const group of groups.values()) {
    if (!group.template_id) continue;
    const t = templates.get(group.template_id);
    if (!t || t.deleted) fail('运费模板不可用', 'FREIGHT_CONFIG_INVALID');
    validateTemplate(t);
    Object.assign(group, { template_name: t.name, version: t.version, rule: 'default', fee: t.default_fee, threshold: null, remaining: null });
    if (t.blocked_regions.includes(province)) { group.rule = 'blocked'; blocked.push(...group.goods); continue; }
    const special = t.region_fees.find(r => r.regions.includes(province));
    if (special) { group.fee = special.fee; group.rule = 'region'; }
    const free = t.free_rules.find(r => r.regions.includes(province));
    if (free) {
      group.threshold = free.threshold;
      group.remaining = Math.max(0, free.threshold - group.amount);
      if (!group.remaining) { group.fee = 0; group.rule = 'free'; }
    }
  }
  return { deliverable: !blocked.length, blocked_goods: blocked, freight: blocked.length ? null : Math.max(0, ...[...groups.values()].map(g => g.fee)), groups: [...groups.values()].sort((a,b) => a.group_id.localeCompare(b.group_id)), merge: 'max' };
}
async function shipping(db, tx, lines, products, destination) {
  const templates = new Map();
  for (const goods of products.values()) if (mode(goods) === 'template' && !templates.has(goods.freight_template_id)) templates.set(goods.freight_template_id, await template(tx, goods.freight_template_id));
  return calculate(lines, products, templates, destination.province_code);
}
// Binding and deletion both write the template document, preventing a dangling reference race.
async function bind(db, tx, previous, next) {
  const oldId = previous && mode(previous) === 'template' ? previous.freight_template_id : '';
  const newId = mode(next) === 'template' ? next.freight_template_id : '';
  if (newId) await template(tx, newId);
  if (oldId !== newId) for (const id of new Set([oldId, newId].filter(Boolean))) {
    const row = await get(tx, TABLE, id);
    if (row) await tx.collection(TABLE).doc(id).update({ binding_revision: (row.binding_revision || 0) + 1 });
  }
  if (next.freight_mode) {
    next.freight = next.freight_mode === 'free';
    if (next.freight_mode !== 'fixed') next.freight_amount = 0;
    if (next.freight_mode !== 'template') next.freight_template_id = '';
  }
  if (mode(next) === 'fixed') money(next.freight_amount);
}
function fingerprint(value) {
  function stable(v) { return Array.isArray(v) ? v.map(stable) : v && typeof v === 'object' ? Object.keys(v).sort().reduce((o,k) => { if (v[k] !== undefined) o[k] = stable(v[k]); return o; }, {}) : v; }
  return require('crypto').createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
}
module.exports = { TABLE, mode, money, validateTemplate, region, address, template, calculate, shipping, bind, fingerprint };
