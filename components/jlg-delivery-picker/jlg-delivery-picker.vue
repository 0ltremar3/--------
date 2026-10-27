<template>
	<uni-popup ref="sheet" type="bottom" background-color="#fff" border-radius="16px 16px 0 0">
		<view class="delivery-sheet">
			<view class="delivery-heading"><text>{{$t('shipping.choose')}}</text><button size="mini" @click="$refs.sheet.close()">{{$t('shipping.close')}}</button></view>
			<view v-if="loading" class="delivery-state">{{$t('shipping.loading')}}</view>
			<view v-if="error" class="delivery-state" role="alert">{{error}}<button size="mini" @click="load">{{$t('shipping.retry')}}</button></view>
			<scroll-view scroll-y class="delivery-addresses">
				<button v-for="row in addresses" :key="row._id" class="delivery-address" :disabled="loading" @click="chooseAddress(row)"><text>{{row.formatted_address}}</text><text v-if="row.is_default" class="delivery-default">{{$t('address.defaultAddress')}}</text></button>
			</scroll-view>
			<button v-if="loggedIn" class="delivery-add" :disabled="loading" @click="add">{{$t('address.addAddress')}}</button>
			<view v-if="allowRegion" class="delivery-region"><text>{{$t('shipping.regionOnly')}}</text><uni-data-picker v-model="areaCode" collection="opendb-city-china" field="code as value, name as text" orderby="value asc" :step-searh="true" self-field="code" parent-field="parent_code" :placeholder="$t('shipping.choose')" :popup-title="$t('shipping.choose')" @change="chooseRegion" /></view>
		</view>
	</uni-popup>
</template>
<script>
import { setDelivery, deliveryForAddress } from '@/common/delivery.js'
export default {
	props: { allowRegion: { type: Boolean, default: true } },
	data: () => ({ addresses: [], loggedIn: false, loading: false, error: '', areaCode: '' }),
	methods: {
		open() { this.$refs.sheet.open(); this.load() },
		async load() { this.loading = true; this.error = ''; this.addresses = []; const uid = uniCloud.getCurrentUserInfo().uid; this.loggedIn = !!uid; try { if (uid) { const { result } = await uniCloud.database().collection('jlg-goods-address').where({ user_id: uid }).orderBy('is_default desc').limit(100).get(); if (uid === uniCloud.getCurrentUserInfo().uid) this.addresses = result.data } } catch(e) { this.error = this.$t('shipping.loadFailed') } finally { this.loading = false } },
		select(value) { setDelivery(value); this.$emit('change', value); this.$refs.sheet.close() },
		async chooseAddress(row) { this.loading = true; try { const uid = uniCloud.getCurrentUserInfo().uid; const value = await deliveryForAddress(row); if (uid && uid === uniCloud.getCurrentUserInfo().uid && row.user_id === uid) this.select(value) } catch(e) { this.error = this.$t('shipping.addressInvalid') } finally { this.loading = false } },
		chooseRegion(event) { const values = event.detail.value || []; if (values.length < 3) return; this.select({ area_code: values[values.length - 1].value, region_name: values.map(v => v.text).join(' '), address_id: '' }) },
		add() { uni.navigateTo({ url: '/pages/address/add', events: { addressSaved: async id => { await this.load(); const row = this.addresses.find(r => r._id === id); if (row) this.chooseAddress(row) } } }) }
	}
}
</script>
<style scoped>
.delivery-sheet { padding: 32rpx; padding-bottom: calc(32rpx + env(safe-area-inset-bottom)); color: #292e2c; }.delivery-heading { display: flex; justify-content: space-between; align-items: center; font-size: 32rpx; font-weight: 600; }.delivery-heading button { margin: 0; }.delivery-state { padding: 24rpx 0; color: #525c57; }.delivery-addresses { max-height: 44vh; margin: 24rpx 0; }.delivery-address { display: block; width: 100%; margin: 0; border: 0; text-align: left; font-size: 28rpx; line-height: 1.6; padding: 24rpx 0; border-bottom: 1px solid #e0e5e2; background: #fff; border-radius: 0; }.delivery-address::after { border: 0; }.delivery-default { display: block; color: #406b59; font-size: 24rpx; }.delivery-add { font-size: 28rpx; color: #315d4a; background: #edf4ef; }.delivery-region { margin-top: 32rpx; line-height: 2; font-size: 26rpx; }
</style>
