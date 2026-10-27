'use strict';
// Validate a built mini-program before opening it in WeChat DevTools.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const projectRoot = path.resolve(__dirname, '..');
const output = path.resolve(projectRoot, process.argv[2] || 'unpackage/dist/build/mp-weixin');
const read = file => JSON.parse(fs.readFileSync(path.join(output, file), 'utf8'));
const app = read('app.json'), project = read('project.config.json');
const configured = fs.readFileSync(path.join(projectRoot, 'manifest.json'), 'utf8').match(/"mp-weixin"\s*:\s*\{\s*"appid"\s*:\s*"(wx[a-zA-Z0-9]+)"/);
assert(configured, 'manifest.json 的微信 AppID 为空或无效；请填写项目真实 AppID 后重新构建');
assert.equal(project.appid, configured[1], '产物 AppID 与源码不一致；请重新构建，勿用游客模式替代真实 AppID');
const vendor = fs.readFileSync(path.join(output, 'common/vendor.js'), 'utf8');
assert(/["']?spaceId["']?\s*:\s*["'][^"']+["']/.test(vendor), '产物缺少 uniCloud 服务空间注入；请通过 HBuilderX 正式运行/发行入口重新构建');
const roots = (app.subPackages || app.subpackages || []).map(pkg => pkg.root.replace(/\/$/, '') + '/');
const owner = file => roots.find(root => path.relative(output, file).split(path.sep).join('/').startsWith(root)) || 'main';
const entries = [...app.pages, ...(app.subPackages || app.subpackages || []).flatMap(pkg => pkg.pages.map(page => pkg.root + '/' + page))];
const exists = file => assert(fs.existsSync(file), '缺少构建文件：' + path.relative(output, file));
for (const file of ['app.js', 'app.wxss', 'common/runtime.js', 'common/vendor.js', 'common/main.js']) exists(path.join(output, file));
for (const page of entries) for (const ext of ['.js', '.json', '.wxml']) exists(path.join(output, page + ext));
for (const tab of app.tabBar.list) {
  assert(app.pages.includes(tab.pagePath), 'tabBar 页面必须在主包：' + tab.pagePath);
  for (const field of ['iconPath', 'selectedIconPath']) if (tab[field]) exists(path.join(output, tab[field]));
}
let components = 0, scripts = 0;
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) { walk(file); continue; }
    if (item.name.endsWith('.js')) { new vm.Script(fs.readFileSync(file, 'utf8'), { filename: path.relative(output, file) }); scripts++; }
    if (!item.name.endsWith('.json')) continue;
    const json = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const target of Object.values(json.usingComponents || {})) {
      if (target.includes('://')) continue;
      const resolved = target.startsWith('/') ? path.resolve(output, '.' + target) : path.resolve(path.dirname(file), target);
      assert(!path.relative(output, resolved).startsWith('..'), '组件路径超出构建目录：' + target);
      for (const ext of ['.js', '.json', '.wxml']) exists(resolved + ext);
      assert(owner(resolved) === 'main' || owner(resolved) === owner(file), '组件跨分包引用：' + path.relative(output, file) + ' → ' + target);
      components++;
    }
  }
}
walk(output);
console.log(`PASS ${project.appid}: ${entries.length} pages, ${components} component references, ${scripts} JavaScript files`);
console.log('这是产物完整性检查；开发者工具登录/网络、云函数部署和真实页面运行仍需单独验证。');
