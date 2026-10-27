// 本空间的图片已验证支持公开 CDN 访问，保存稳定地址，避免临时签名过期。
const PUBLIC_IMAGE_ORIGIN = 'https://env-00jy6y52fd8l.normal.cloudstatic.cn/';

export function toPublicImageUrl(value) {
	if (typeof value !== 'string' || !value.startsWith(PUBLIC_IMAGE_ORIGIN)) return value;
	const [path, query = ''] = value.split('?');
	const params = query.split('&').filter(param => param && !/^(expire_at|er_sign)=/.test(param));
	return path + (params.length ? '?' + params.join('&') : '');
}
