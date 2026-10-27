'use strict';
// Run: node tests/cloud-image-url.test.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
	const source = fs.readFileSync(path.join(__dirname, '../common/cloud-image-url.js'), 'utf8');
	const { toPublicImageUrl } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
	const url = 'https://env-00jy6y52fd8l.normal.cloudstatic.cn/goods/test.png';
	assert.equal(toPublicImageUrl(url), url);
	assert.equal(toPublicImageUrl(url + '?expire_at=123&er_sign=signature'), url);
	assert.equal(toPublicImageUrl(url + '?er_sign=signature&width=600&expire_at=123'), url + '?width=600');
	const external = 'https://other.example/image.png?expire_at=123&er_sign=signature';
	assert.equal(toPublicImageUrl(external), external);
	const lookalike = 'https://env-00jy6y52fd8l.normal.cloudstatic.cn.evil.example/image.png?er_sign=x';
	assert.equal(toPublicImageUrl(lookalike), lookalike);
	assert.equal(toPublicImageUrl(null), null);
	console.log('Cloud image URLs: stable public URLs, retained transforms and untouched external signatures passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
