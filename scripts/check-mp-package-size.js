// Run after HBuilderX publishes mp-weixin; count raw bytes conservatively.
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const output = path.resolve(__dirname, '..', process.argv[2] || 'unpackage/dist/build/mp-weixin');
assert(fs.existsSync(path.join(output, 'app.json')), '请先通过 HBuilderX 发行微信小程序');
const app = JSON.parse(fs.readFileSync(path.join(output, 'app.json'), 'utf8'));
const roots = (app.subPackages || app.subpackages || []).map(pkg => pkg.root.replace(/\/$/, '') + '/');
const sizes = new Map([['main', 0], ...roots.map(root => [root, 0])]);
const files = [];

function walk(dir) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			walk(full);
		} else if (entry.isFile()) {
			const name = path.relative(output, full).split(path.sep).join('/');
			const owner = roots.find(root => name.startsWith(root)) || 'main';
			const bytes = fs.statSync(full).size;
			sizes.set(owner, sizes.get(owner) + bytes);
			if (owner === 'main') files.push({ name, bytes });
		}
	}
}

walk(output);
for (const tab of app.tabBar.list) {
	assert(app.pages.includes(tab.pagePath), `tabBar 页面必须在主包：${tab.pagePath}`);
}
for (const [name, bytes] of sizes) {
	console.log(`${(bytes / 1024).toFixed(1)} KB\t${name}`);
	if (bytes > 2 * 1024 * 1024) process.exitCode = 1;
}
console.log('\n主包最大的 10 个文件：');
for (const file of files.sort((a, b) => b.bytes - a.bytes).slice(0, 10)) {
	console.log(`${(file.bytes / 1024).toFixed(1)} KB\t${file.name}`);
}
if (process.exitCode) console.error('存在超过 2048 KB 的代码包，请调整分包后重新发行。');
