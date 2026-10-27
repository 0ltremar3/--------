// H5 has no WeChat runtime version; change deliberately when deploying a release site.
export const H5_CODE_ENV = 'trial';
export function codeEnvironment() {
	let version = H5_CODE_ENV;
	// #ifdef MP-WEIXIN
	version = wx.getAccountInfoSync().miniProgram.envVersion;
	// #endif
	return version;
}
export function withTimeout(promise, ms = 8000, message = '生成超时，请重试') {
	let timer;
	return Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(typeof message === 'function' ? message() : message)), ms); })]).finally(() => clearTimeout(timer));
}
export function apiCall(method, options = {}, context) {
	return new Promise((resolve, reject) => uni[method]({ ...options, success: resolve, fail: reject }, context));
}
export function mainImage(goods = {}) {
	const images = Array.isArray(goods.goods_banner_imgs) ? goods.goods_banner_imgs : [];
	const first = images.find(item => item && typeof item.url === 'string' && item.url.trim() && item.fileType !== 'video');
	return (first && first.url) || (typeof goods.goods_thumb === 'string' ? goods.goods_thumb : '') || '';
}
const images = new Map();
const ownedImages = new Map();
function dropImage(src) {
	images.delete(src);
	// #ifdef MP-WEIXIN
	const path = ownedImages.get(src);
	if (path) wx.getFileSystemManager().unlink({ filePath: path, fail() {} });
	// #endif
	ownedImages.delete(src);
}
const pendingCodes = new Map();
export async function imageInfo(src) {
	if (!src) throw new Error('缺少商品图片，可单独保存商品码');
	if (images.has(src)) {
		const cached = images.get(src);
		try { return { ...await apiCall('getImageInfo', { src: cached.path }), path: cached.path }; } catch (_) { dropImage(src); }
	}
	let path = src;
	// #ifdef MP-WEIXIN
	const match = /^data:image\/(png|jpeg);base64,(.+)$/.exec(src);
	if (match) {
		path = wx.env.USER_DATA_PATH + '/share-' + Date.now() + '-' + Math.random().toString(16).slice(2) + '.' + (match[1] === 'jpeg' ? 'jpg' : 'png');
		ownedImages.set(src, path);
		try {
			await withTimeout(new Promise((resolve, reject) => wx.getFileSystemManager().writeFile({ filePath: path, data: match[2], encoding: 'base64', success: resolve, fail: reject })));
		} catch (error) { dropImage(src); throw error; }
	}
	// #endif
	const started = Date.now();
	try {
		const image = await withTimeout(apiCall('getImageInfo', { src: path }));
		// 微信 getImageInfo 会去掉包内图片的前导 /；画布位于分包时必须保留根路径。
		// #ifdef MP-WEIXIN
		if (src.startsWith('/static/')) image.path = src;
		// #endif
		images.set(src, image);
		if (images.size > 24) dropImage(images.keys().next().value);
		console.info('[share] image-ready-ms', Date.now() - started);
		return image;
	} catch (error) { dropImage(src); throw error; }
}
export function getProductCode(goodsId, envVersion) {
	const uid = uniCloud.getCurrentUserInfo().uid;
	if (!uid) return Promise.reject(new Error('请先登录后生成商品码'));
	const key = JSON.stringify([uid, goodsId, envVersion]);
	if (pendingCodes.has(key)) return pendingCodes.get(key);
	const promise = withTimeout((async () => {
		const data = await uniCloud.importObject('jlg-share', { customUI: true }).getProductCode({ goodsId, envVersion });
		if (data.errCode) throw new Error(data.errMsg);
		const urls = await uniCloud.getTempFileURL({ fileList: [data.fileID] });
		const file = urls.fileList && urls.fileList[0];
		if (!file || !file.tempFileURL) throw new Error('商品码下载地址不可用，请重试');
		const image = await imageInfo(file.tempFileURL);
		return { ...data, path: image.path };
	})());
	pendingCodes.set(key, promise);
	promise.finally(() => { if (pendingCodes.get(key) === promise) pendingCodes.delete(key); }).catch(() => {});
	return promise;
}
const validId = value => typeof value === 'string' && /^[\w-]{1,128}$/.test(value) && !['null', 'undefined'].includes(value);
export async function resolveProductEntry(options = {}) {
	// Any new entry supersedes a previous pending referral, including malformed scans.
	uni.removeStorageSync('dicrID');
	let goodsId, sharerId;
	if (Object.prototype.hasOwnProperty.call(options, 'scene')) {
		let scene;
		try { scene = decodeURIComponent(options.scene); } catch (_) { throw new Error('商品码无效'); }
		if (!/^[a-f0-9]{24}$/.test(scene)) throw new Error('商品码无效');
		const data = await withTimeout(uniCloud.importObject('jlg-share', { customUI: true }).resolveScene({ scene }));
		if (data.errCode) throw new Error(data.errMsg);
		({ goodsId, sharerId } = data);
	} else if (options.q) {
		let url;
		try { url = decodeURIComponent(options.q); } catch (_) { throw new Error('商品链接无效'); }
		const params = {};
		for (const part of (url.split('?')[1] || '').split('&')) {
			const [key, value] = part.split('=');
			if (key === 'id' || key === 'fxsid') {
				try { params[key] = decodeURIComponent(value || ''); } catch (_) { throw new Error('商品链接无效'); }
			}
		}
		goodsId = params.id; sharerId = params.fxsid;
	} else { goodsId = options.id; sharerId = options.fxsid; }
	if (!validId(goodsId)) throw new Error('商品链接无效');
	return { goodsId, sharerId: validId(sharerId) ? sharerId : '' };
}
let binding;
export function bindPendingReferral() {
	const sharerId = uni.getStorageSync('dicrID');
	const uid = uniCloud.getCurrentUserInfo().uid;
	if (!uid || !validId(sharerId)) return Promise.resolve({ errCode: 0, status: 'no-source' });
	if (binding && binding.key === uid + ':' + sharerId) return binding.promise;
	const promise = uniCloud.importObject('jlg-distribution', { customUI: true }).add(sharerId).then(result => {
		if ((result.errCode === 0 || ['SELF_REFERRAL', 'INELIGIBLE_REFERRER', 'CYCLE_REFERRAL'].includes(result.errCode)) && uni.getStorageSync('dicrID') === sharerId) uni.removeStorageSync('dicrID');
		return result;
	}).catch(() => ({ errCode: 'BIND_SERVICE_ERROR', errMsg: '推广关系绑定暂不可用' }));
	binding = { key: uid + ':' + sharerId, promise };
	promise.finally(() => { if (binding && binding.promise === promise) binding = null; });
	return promise;
}
export async function savePicture(path) {
	if (!path) throw new Error('图片尚未就绪，请重试');
	// #ifdef MP-WEIXIN
	const setting = await apiCall('getSetting');
	const permission = setting.authSetting['scope.writePhotosAlbum'];
	if (permission === false) {
		const answer = await apiCall('showModal', { title: '允许保存图片', content: '请在设置中开启相册权限后重试。', confirmText: '去设置' });
		if (!answer.confirm) throw new Error('已取消保存');
		const updated = await apiCall('openSetting');
		if (!updated.authSetting['scope.writePhotosAlbum']) throw new Error('未开启相册权限');
	} else if (permission !== true) {
		await apiCall('authorize', { scope: 'scope.writePhotosAlbum' });
	}
	await apiCall('saveImageToPhotosAlbum', { filePath: path });
	// #endif
	// #ifdef H5
	await apiCall('previewImage', { urls: [path], current: path });
	uni.showToast({ title: '请长按图片保存；若失败请在浏览器打开', icon: 'none' });
	// #endif
}
