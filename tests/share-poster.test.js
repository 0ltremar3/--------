const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const read = p => fs.readFileSync(p, 'utf8');
function preprocess(source, platform) {
	const stack = [true];
	return source.split('\n').filter(line => {
		const start = line.match(/\/\/ #(ifdef|ifndef) (\S+)/);
		if (start) { stack.push(stack[stack.length - 1] && (start[1] === 'ifdef' ? start[2] === platform : start[2] !== platform)); return false; }
		if (line.includes('// #endif')) { stack.pop(); return false; }
		return stack[stack.length - 1];
	}).join('\n');
}
function helper(platform = 'H5') {
	let uid = 'viewer', stored = {}, binds = 0, saves = 0, auth = undefined, settingCalls = 0;
	const uni = { removeStorageSync: key => delete stored[key], getStorageSync: key => stored[key], setStorageSync: (key, value) => stored[key] = value,
		getImageInfo: ({ src, success, fail }) => src === 'missing' ? fail(Error('missing')) : success({ path: src, width: 500, height: 500 }),
		getSetting: ({ success }) => success({ authSetting: { 'scope.writePhotosAlbum': auth } }),
		authorize: ({ success }) => { auth = true; success({}); },
		showModal: ({ success }) => success({ confirm: true }),
		openSetting: ({ success }) => { settingCalls++; auth = true; success({ authSetting: { 'scope.writePhotosAlbum': true } }); },
		saveImageToPhotosAlbum: ({ success }) => { saves++; success({}); }, previewImage: ({ success }) => success({}), showToast() {}
	};
	const uniCloud = { getCurrentUserInfo: () => ({ uid }), importObject: name => name === 'jlg-distribution' ? { add: async id => { binds++; return { errCode: 0, status: 'bound' }; } } : {
		resolveScene: async ({ scene }) => scene === 'a'.repeat(24) ? { errCode: 0, goodsId: 'correct', sharerId: 'promoter' } : { errCode: 'UNKNOWN', errMsg: '未知商品码' }
	} };
	let source = preprocess(read('common/product-share.js'), platform).replace(/export /g, '');
	source += '\nmodule.exports = { mainImage, resolveProductEntry, bindPendingReferral, withTimeout, savePicture, imageInfo, apiCall };';
	const context = { module: { exports: {} }, uni, uniCloud, setTimeout, clearTimeout };
	vm.runInNewContext(source, context);
	return { ...context.module.exports, uni, uniCloud, stored, setUid: value => uid = value, setAuth: value => auth = value, counts: () => ({ binds, saves, settingCalls }) };
}
function poster(helper, options = {}) {
	const state = { loads: 0, exports: 0, images: [], emissions: [] };
	const nativeContext = new Proxy({ measureText: value => ({ width: String(value).length * 6 }), drawImage: image => state.images.push(image.src) }, { get: (obj, key) => obj[key] || (() => {}) });
	const nativeCanvas = { getContext: () => nativeContext, createImage: () => {
		const image = {}; Object.defineProperty(image, 'src', { get: () => image.path, set: value => { image.path = value; if (options.decodeFail) image.onerror(); else if (!options.noDecode) image.onload(); } }); return image;
	} };
	const uni = { ...helper.uni, getSystemInfoSync: () => ({ pixelRatio: 2 }), upx2px: n => n / 2, showLoading: () => state.loads++, hideLoading: () => state.loads--,
		canvasToTempFilePath: ({ success, fail, canvas }) => { state.exports++; state.exportCanvas = canvas; options.exportFail ? fail(Error('export failed')) : success({ tempFilePath: 'poster.png' }); },
		createSelectorQuery: () => {
			let done; const query = { in: () => query, select: () => query, boundingClientRect: callback => { done = callback; return query; }, fields: (options, callback) => { done = callback; return query; }, exec: () => { if (!options.noLayout) done(options.missingCanvas ? null : { width: 325, height: 500, node: nativeCanvas }); } }; return query;
		},
		createCanvasContext: id => new Proxy({ measureText: value => ({ width: String(value).length * 6 }), draw: (reserve, done) => { if (!options.noDraw && id === state.nativeCanvasId) done(); }, drawImage: path => state.images.push(path) }, { get: (obj, key) => obj[key] || (() => {}) })
	};
	let source = preprocess(read('components/zhangyu-qrcode-poster/zhangyu-qrcode-poster.vue').match(/<script>([\s\S]*?)<\/script>/)[1], options.platform || 'H5').replace(/import[^;]+;/, '').replace('export default', 'module.exports =');
	const context = { module: { exports: {} }, uni,
		codeEnvironment: () => 'trial', getProductCode: async () => ({ path: 'original-1024.png', scene: 'scene' }),
		imageInfo: async src => { if (options.noImage) return new Promise(() => {}); if (src === 'bad') throw Error('bad image'); return { path: src, width: 500, height: 500 }; },
		withTimeout: (promise, ms, message) => helper.withTimeout(promise, 25, message), apiCall: (method, opts, instance) => new Promise((resolve, reject) => uni[method]({ ...opts, success: resolve, fail: reject }, instance)), savePicture: helper.savePicture
	};
	vm.runInNewContext(source, context);
	const component = context.module.exports;
	const instance = { ...component.data(), ...component.methods, goodsId: 'goods', identity: 'viewer', title: '真实商品', headerImg: 'product.png', price: 20, origprice: 30, username: 'name', $nextTick: async () => {}, $emit: (...args) => state.emissions.push(args) };
	state.nativeCanvasId = instance.canvasId; // Native registration does not follow later reactive ID changes.
	Object.defineProperty(instance, 'contentKey', { get: () => component.computed.contentKey.call(instance) });
	return { instance, state, component };
}
(async () => {
	const h = helper();
	assert.equal(h.mainImage({ goods_banner_imgs: [{ fileType: 'video', url: 'video' }, { fileType: 'image', url: 'actual' }] }), 'actual');
	assert.equal(h.mainImage({ goods_banner_imgs: [], goods_thumb: 'thumb' }), 'thumb'); assert.equal(h.mainImage({}), '');
	h.stored.dicrID = 'stale';
	await assert.rejects(h.resolveProductEntry({ scene: '%', id: 'fallback' })); assert.equal(h.stored.dicrID, undefined);
	await assert.rejects(h.resolveProductEntry({ scene: 'b'.repeat(24) }));
	const entry = await h.resolveProductEntry({ scene: 'a'.repeat(24), id: 'wrong' }); assert.equal(entry.goodsId, 'correct');
	assert.equal((await h.resolveProductEntry({ q: encodeURIComponent('https://old.test?id=old&fxsid=promoter'), id: 'wrong' })).goodsId, 'old');
	assert.equal((await h.resolveProductEntry({ id: 'old', fxsid: 'null' })).sharerId, '');
	h.stored.dicrID = 'promoter'; h.setUid(''); await h.bindPendingReferral(); assert.equal(h.counts().binds, 0);
	h.setUid('viewer'); await Promise.all([h.bindPendingReferral(), h.bindPendingReferral()]); assert.equal(h.counts().binds, 1); assert.equal(h.stored.dicrID, undefined);
	await assert.rejects(h.withTimeout(new Promise(() => {}), 5), /超时/);
	let { instance: p, state: s } = poster(h);
	p.revision = 7; // An invalidation before drawing must not rename the mounted native canvas.
	await p.open(); assert.equal(p.qrcodeFilePath, 'original-1024.png'); assert.equal(s.exports, 0);
	const work = p.showCanvas(); assert.equal(p.showCanvas(), work); await work;
	assert.equal(s.loads, 0); assert.equal(s.exports, 1); assert.ok(s.images.includes('product.png')); assert.ok(s.images.includes('original-1024.png'));
	await p.showCanvas(); assert.equal(s.exports, 1); // preview/save share one export
	p.title = '另一种语言'; await p.showCanvas(); assert.equal(s.exports, 2);
	p.price++; await p.showCanvas(); assert.equal(s.exports, 3);
	p._posterCache.path = 'missing'; await p.showCanvas(); assert.equal(s.exports, 4);
	p.headerImg = 'bad'; await p.showCanvas(); assert.ok(p.error); assert.equal(s.loads, 0); assert.equal(p.qrcodeFilePath, 'original-1024.png');
	for (const options of [{ noDraw: true }, { noImage: true }, { exportFail: true }, { noLayout: true }, { missingCanvas: true }]) {
		({ instance: p, state: s } = poster(h, options)); await p.open(); await p.showCanvas(); assert.ok(p.error); assert.equal(s.loads, 0);
		if (options.noLayout) assert.match(p.error, /等待画布就绪超时/);
		if (options.missingCanvas) assert.match(p.error, /画布尚未就绪/);
		if (options.noDraw) assert.match(p.error, /绘制海报超时/);
		if (options.noImage) assert.match(p.error, /准备海报素材超时/);
	}
	({ instance: p, state: s } = poster(h)); await p.open(); const late = p.showCanvas(); p.showClick(); await late; assert.equal(p.isShow, false); assert.equal(p.pahta, ''); assert.equal(s.loads, 0);
	await p.open(); p.identity = 'another'; p.invalidate(); assert.equal(p.isShow, false); assert.equal(p.qrcodeFilePath, '');
	({ instance: p, state: s } = poster(h, { platform: 'MP-WEIXIN' }));
	p.revision = 8; await p.open(); await p.showCanvas(); assert.equal(p.error, ''); assert.equal(s.exports, 1);
	assert.equal(s.exportCanvas.width, p.canvasW * 2); assert.ok(s.images.includes('product.png'));
	p.showClick(); await p.open(); p.price++; await p.showCanvas(); assert.equal(s.exports, 2);
	for (const options of [{ decodeFail: true }, { noDecode: true }]) {
		({ instance: p, state: s } = poster(h, { platform: 'MP-WEIXIN', ...options }));
		await p.open(); await p.showCanvas(); assert.match(p.error, /解码/); assert.equal(s.loads, 0); assert.equal(s.exports, 0);
	}
	const mp = helper('MP-WEIXIN');
	mp.uni.getImageInfo = ({ success }) => success({ path: 'static/share-brand.png', width: 155, height: 160 });
	assert.equal((await mp.imageInfo('/static/share-brand.png')).path, '/static/share-brand.png');
	assert.equal((await mp.imageInfo('/static/share-brand.png')).path, '/static/share-brand.png'); // cache hits must keep the package-root path too
	await mp.savePicture('original-1024.png'); assert.equal(mp.counts().saves, 1); assert.equal(mp.counts().settingCalls, 0);
	mp.setAuth(false); await mp.savePicture('original-1024.png'); assert.equal(mp.counts().settingCalls, 1); assert.equal(mp.counts().saves, 2);
	mp.setAuth(false); mp.uni.showModal = ({ success }) => success({ confirm: false }); await assert.rejects(mp.savePicture('code'), /取消/); assert.equal(mp.counts().saves, 2);
	mp.setAuth(true); mp.uni.saveImageToPhotosAlbum = ({ fail }) => fail(Error('save failed')); await assert.rejects(mp.savePicture('code'), /save failed/);
	// Page integration: one initializer per entry, H5 has the same product image, and no legacy QR generator remains.
	for (const file of ['pages/product/product.vue', 'jlg-use/distribution/distrList.vue']) {
		const source = read(file); assert.ok(!source.includes('test.slwjd.com')); assert.ok(!source.includes('<uqrcode')); assert.ok(source.includes(':header-img=')); assert.ok(source.includes('.poster.open()'));
	}
	// Execute the actual H5 onLoad lifecycle, including scene/id conflict and unavailable goods.
	let pageSource = preprocess(read('pages/product/product.vue').match(/<script>([\s\S]*?)<\/script>/)[1], 'H5')
		.replace(/import[\s\S]*?from\s+['"][^'"]+['"];?/g, '').replace('export default', 'module.exports =');
	const pageContext = { module: { exports: {} }, QrcodePoster: {}, uniCloud: { database: () => ({}) }, uni: h.uni, resolveProductEntry: h.resolveProductEntry, bindPendingReferral: h.bindPendingReferral };
	vm.runInNewContext(pageSource, pageContext);
	let loads = [], evaluations = 0;
	const page = { $t: () => '', goodsList: async id => loads.push(id), receiveData() {}, toFavorite() {}, evaluateData() { evaluations++; } };
	pageContext.module.exports.onLoad.call(page, { scene: 'a'.repeat(24), id: 'wrong' }); await page._entryTask;
	assert.equal(loads.join(), 'correct'); assert.equal(evaluations, 1);
	page.goodsList = async () => { throw Error('商品已下架'); };
	pageContext.module.exports.onLoad.call(page, { id: 'deleted', fxsid: 'promoter' }); await page._entryTask;
	assert.equal(h.stored.dicrID, undefined); assert.equal(page.entryError, '商品已下架');
	console.log('Share poster: entry parsing/attribution, image selection, independent code, dedup/cache, cancel/timeout/export failures, and album permissions passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
