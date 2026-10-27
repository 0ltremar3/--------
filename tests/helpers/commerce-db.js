'use strict';
const { copy } = require('../../uniCloud-alipay/cloudfunctions/common/jlg-commerce');
function database(initial) {
  let tables = copy(initial), tail = Promise.resolve(), serial = 0;
  const command = { inc: value => ({ $inc: value }) };
  function collection(store, name, transactional = false) {
    const table = () => store[name] || {};
    let filter = () => true, count = Infinity, document = false;
    const api = {
      doc(id) { document = true; filter = row => row._id === id; return api; },
      where(query) { filter = row => Object.entries(query).every(([key, value]) => {
        const parts = key.split('.');
        const actual = row[parts[0]];
        if (parts.length === 2 && Array.isArray(actual)) return actual.some(item => item[parts[1]] === value);
        return Array.isArray(actual) ? actual.includes(value) : actual === value;
      }); return api; },
      limit(n) { count = n; return api; },
      async count() { return { total: Object.values(table()).filter(filter).length }; },
      async get() {
        if (transactional && !document) throw new Error('事务失败错误: transaction not support action [find]');
        const rows = copy(Object.values(table()).filter(filter).slice(0, count));
        // Aliyun transaction doc.get() returns one object (undefined when absent), not an array.
        return { data: transactional && document ? rows[0] : rows };
      },
      async add(value) { const id = value._id || `generated_${++serial}`; if (table()[id]) throw new Error('duplicate'); (store[name] || (store[name] = {}))[id] = { ...copy(value), _id: id }; return { id }; },
      async update(value) { let updated = 0; for (const row of Object.values(table()).filter(filter)) { const before = JSON.stringify(row); for (const [k, v] of Object.entries(value)) row[k] = v && v.$inc !== undefined ? (row[k] || 0) + v.$inc : copy(v); if (JSON.stringify(row) !== before) updated++; } return { updated }; },
      async updateAndReturn(value) {
        const row = Object.values(table()).find(filter);
        if (!row) return { updated: 0, doc: null };
        const before = JSON.stringify(row);
        for (const [k, v] of Object.entries(value)) row[k] = v && v.$inc !== undefined ? (row[k] || 0) + v.$inc : copy(v);
        return { updated: Number(JSON.stringify(row) !== before), doc: copy(row) };
      },
      async remove() { for (const row of Object.values(table()).filter(filter)) delete table()[row._id]; }
    };
    return api;
  }
  return {
    command, collection: name => collection(tables, name), snapshot: () => copy(tables),
    async startTransaction() {
      const previous = tail; let unlock; tail = new Promise(resolve => { unlock = resolve; }); await previous;
      const local = copy(tables);
      return { collection: name => collection(local, name, true), async commit() { tables = local; unlock(); }, async rollback() { unlock(); } };
    }
  };
}
module.exports = { database };
