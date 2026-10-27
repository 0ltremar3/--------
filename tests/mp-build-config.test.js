'use strict';
const assert = require('node:assert/strict');
const { configureWebpack } = require('../vue.config');
const keys = ['UNI_CLOUD_PROVIDER', 'UNI_CLOUD_SPACES'];
const original = Object.fromEntries(keys.map(key => [key, process.env[key]]));
try {
	for (const key of keys) delete process.env[key];
	assert.throws(configureWebpack, /默认 uniCloud 服务空间/);
	for (const value of ['[]', 'invalid', '{}', '[null]', '[{}]', '[{"spaceId":"a"},{"spaceId":"b"}]']) {
		process.env.UNI_CLOUD_PROVIDER = value;
		assert.throws(configureWebpack, /默认 uniCloud 服务空间/);
	}
	process.env.UNI_CLOUD_PROVIDER = JSON.stringify([{ provider: 'alipay', spaceId: 'test-space' }]);
	assert.doesNotThrow(configureWebpack);
	delete process.env.UNI_CLOUD_PROVIDER;
	process.env.UNI_CLOUD_SPACES = JSON.stringify([{ provider: 'alipay', id: 'test-space' }]);
	assert.doesNotThrow(configureWebpack);
	console.log('Build guard: missing, invalid, empty, ambiguous and valid cloud-space configurations passed.');
} finally {
	for (const key of keys) {
		if (original[key] === undefined) delete process.env[key];
		else process.env[key] = original[key];
	}
}
