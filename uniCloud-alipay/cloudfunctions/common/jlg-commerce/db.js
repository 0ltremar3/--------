'use strict';
async function getDocument(db, collection, id) {
  const { data } = await db.collection(collection).doc(id).get();
  // Normal reads return arrays; Aliyun transaction reads return an object or no data.
  return Array.isArray(data) ? data[0] : data;
}
function matches(value, fields, expected) {
  if (Array.isArray(value)) return value.some(item => matches(item, fields, expected));
  if (!fields.length) return value === expected;
  return value != null && matches(value[fields[0]], fields.slice(1), expected);
}
async function findDocuments(db, tx, collection, query, limit = 100) {
  // Aliyun transactions support doc.get(), but reject where/limit.get() (find).
  // Discover IDs outside the transaction; only trust documents re-read inside it.
  const { data } = await db.collection(collection).where(query).limit(limit).get();
  const rows = [];
  for (const candidate of data) {
    const row = await getDocument(tx, collection, candidate._id);
    if (!row || !Object.entries(query).every(([field, value]) => matches(row, field.split('.'), value))) {
      throw Object.assign(new Error('数据已变化，请刷新后重试'), { errCode: 'DATA_CHANGED' });
    }
    rows.push(row);
  }
  return rows;
}
module.exports = { getDocument, findDocuments };
