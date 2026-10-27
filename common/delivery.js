// In-memory, account-scoped selection; never changes the user's default address.
let owner = '', selected = null
export function getDelivery() {
	const uid = uniCloud.getCurrentUserInfo().uid || ''
	if (uid !== owner) { owner = uid; selected = null }
	return selected
}
export function setDelivery(value) { getDelivery(); selected = value }
export function checkoutApi() {
	const api = uniCloud.importObject('jlg-checkout', { customUI: true })
	return { previewFreight: input => api.previewFreight(input), async quote(input) { const result = await api.quote(input); if (result.error) throw result.error; return result } }
}
export async function regionLabel(code) {
	const names = [], db = uniCloud.database()
	for (let depth = 0; code && depth < 3; depth++) {
		const { result } = await db.collection('opendb-city-china').where({ code }).limit(1).get()
		const row = result.data[0]
		if (!row) throw new Error('Invalid delivery region')
		names.unshift(row.name)
		if (row.type === 0) return names.join(' ')
		code = row.parent_code
	}
	throw new Error('Invalid delivery region')
}
export async function deliveryForAddress(row) { return { address_id: row._id, area_code: row.area_code, region_name: await regionLabel(row.area_code) } }
export async function defaultDelivery() {
	const prior = getDelivery()
	if (prior) return prior
	const uid = uniCloud.getCurrentUserInfo().uid
	if (!uid) return null
	const { result } = await uniCloud.database().collection('jlg-goods-address').where({ user_id: uid, is_default: true }).limit(1).get()
	if (!result.data.length) return null
	const selection = await deliveryForAddress(result.data[0])
	if ((uniCloud.getCurrentUserInfo().uid || '') !== uid) return null
	if (getDelivery()) return getDelivery()
	setDelivery(selection)
	return selection
}
export function shippingText(result, t) {
	if (!result.deliverable) return t('shipping.blocked')
	if (!result.exact || !Number.isFinite(result.freight)) return t('shipping.selectSku')
	return result.freight === 0 ? t('shipping.free') : t('shipping.estimate', { amount: (result.freight / 100).toFixed(2) })
}
export function shippingHint(result, t) {
	if (!result || !result.deliverable || !result.exact || !(result.freight > 0) || !(result.remaining > 0)) return ''
	return t('shipping.remaining', { amount: (result.remaining / 100).toFixed(2).replace(/\.00$/, '') })
}
export function checkoutError(error, t) {
	const code = error.errCode || error.code || ''
	if (code === 'NOT_DELIVERABLE') return t('shipping.blocked') + (error.blocked_goods ? ' ' + error.blocked_goods.map(g => g.name).join('、') : '')
	if (code === 'PRICE_CHANGED') return t('shipping.confirm')
	if (code === 'ADDRESS_INVALID') return t('shipping.addressInvalid')
	if (code === 'AUTH_REQUIRED') return t('shipping.auth')
	if (code === 'CHECKOUT_UPDATE_REQUIRED') return t('shipping.update')
	if (String(code).indexOf('FREIGHT') === 0) return t('shipping.configInvalid')
	if (['GOODS_INVALID', 'SKU_UNAVAILABLE', 'STOCK_INSUFFICIENT', 'STOCK_NOT_MIGRATED'].includes(code)) return t('shipping.stockInvalid')
	if (code === 'COUPON_INVALID') return t('shipping.couponInvalid')
	return t('shipping.loadFailed')
}
