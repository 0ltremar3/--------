'use strict';
// The two HBuilderX projects deploy to one cloud space. Keep duplicate server code identical.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const admin = path.resolve(root, '../养生商城-管理端');
const files = [
  'uni_modules/uni-pay/components/uni-pay/uni-pay.vue',
  'uniCloud-alipay/database/jlg-freight-templates.schema.json',
  ...['index.obj.js', 'package.json'].map(file => 'uniCloud-alipay/cloudfunctions/jlg-checkout/' + file),
  ...['index.js', 'model.js', 'refund.js', 'editor.js', 'db.js', 'freight.js', 'freight-admin.js', 'package.json'].map(file => 'uniCloud-alipay/cloudfunctions/common/jlg-commerce/' + file),
  ...['index.obj.js', 'service/pay.js', 'package.json', 'package-lock.json', 'notify/goods.js', 'notify/vip.js'].map(file => 'uni_modules/uni-pay/uniCloud/cloudfunctions/uni-pay-co/' + file)
];
// Timed functions cannot depend on a cloud object as a file: common module.
// Generate the payment runtime from the canonical cloud-object sources instead.
const paymentBase = 'uni_modules/uni-pay/uniCloud/cloudfunctions/uni-pay-co/';
const runtimeBase = 'uniCloud-alipay/cloudfunctions/common/jlg-pay-runtime/';
const runtimeFiles = ['service', 'dao', 'libs', 'common', 'notify'].flatMap(folder =>
  fs.readdirSync(path.join(root, paymentBase, folder)).filter(file => file.endsWith('.js')).map(file => folder + '/' + file));
let mismatches = 0;
for (const file of runtimeFiles) {
  const source = fs.readFileSync(path.join(root, paymentBase, file));
  const dest = path.join(root, runtimeBase, file);
  if (process.argv.includes('--write')) { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, source); }
  if (!fs.existsSync(dest) || !source.equals(fs.readFileSync(dest))) { console.error('Runtime out of sync:', file); mismatches++; }
}
for (const file of files) {
  const source = fs.readFileSync(path.join(root, file));
  const dest = path.join(admin, file);
  if (process.argv.includes('--write')) { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, source); }
  if (!fs.existsSync(dest) || !source.equals(fs.readFileSync(dest))) { console.error('Out of sync:', file); mismatches++; }
}
for (const [name, fields] of [['opendb-mall-goods', ['freight_mode', 'freight_template_id']], ['uni-pay-orders', ['address_id', 'address_snapshot', 'freight_snapshot', 'checkout_version', 'quote_key']]]) {
  const relative = 'uniCloud-alipay/database/' + name + '.schema.json';
  const source = JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
  const dest = path.join(admin, relative), target = JSON.parse(fs.readFileSync(dest, 'utf8'));
  if (process.argv.includes('--write')) { for (const field of fields) target.properties[field] = source.properties[field]; fs.writeFileSync(dest, JSON.stringify(target, null, '\t') + '\n'); }
  for (const field of fields) if (JSON.stringify(source.properties[field]) !== JSON.stringify(target.properties[field])) { console.error('Schema out of sync:', relative, field); mismatches++; }
}
console.log(`${files.length} shared server files and ${runtimeFiles.length} generated runtime files checked; ${mismatches} mismatches`);
process.exitCode = mismatches ? 1 : 0;
