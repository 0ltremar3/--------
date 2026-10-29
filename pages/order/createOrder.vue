<template>
	<view>
		<!-- 地址 -->
		<view @click="navigator" class="list-item " style="padding: 20rpx 25rpx">
			<view class="flex-dir-row b-b pb-30  flex-x-between flex-y-center">
				<view v-if="ressList.formatted_address" class="flex-dir-column w-100">
					<view class="col-3  f-w f-29">
						{{ressList.formatted_address}}
					</view>
					<view class="col-3 mt-10 f-26 flex-dir-row flex-y-center">
						<text class="">{{ressList.name}}</text>
						<text class="ml-10">{{ressList.mobile}}</text>
					</view>
				</view>
				<view v-else class="flex-dir-row w-100">
					<text class="iconfont icon-uniE03d col-61A189"
						style="font-size: 40rpx;height: 20rpx;line-height: 48rpx;"></text>
					<text class="ml-10 f-28" style="line-height: 46rpx;height: 30rpx;">{{ $t('createOrder.selectAddress') }}</text>
				</view>
				<text class="iconfont f-34 icon-uniE003"></text>
			</view>
			<view class="flex-dir-row mt-20  flex-y-center flex-x-between">
				<text class="f-28 col-3">{{ $t('createOrder.deliveryMethod') }}</text>
				<text class="f-28 col-0 f-w">{{ $t('createOrder.express') }}</text>
			</view>
		</view>
		<view class="list-item flex-dir-column" style="padding: 20rpx 25rpx 30rpx 25rpx;">
			<view class="flex-dir-row b-b pb-20 flex-y-center">
				<text class="iconfont  f-32 icon-uniE01f col-61A189"
					style="line-height: 20rpx;font-size: 60rpx;"></text>
				<text class="col-3 f-29 ml-10">{{ $t('createOrder.storeName') }}</text>
			</view>
			<view class="goods mt-20 flex-dir-column w-100">
				<view class="goods-item mb-20 flex-dir-row flex-y-center flex-x-between"
					v-for="(item,index) in goodsList" :key="index">

					<image class="goods-litpic" :src="item.goods_thumb">
					</image>
					<view class="flex-dir-column flex-1 ml-20">
						<text class="f-28 col-0 goods-name ">{{displayLangText(item, 'name')}}</text>
						<view class="f-24  col-9">
							<text style="margin-right: 15rpx;"
								v-for="goods_suk in item.goodssuk.suk.specs">{{goods_suk}}</text>
						</view>
						<view class="flex-dir-row mt-20 flex-y-center flex-x-between">
							<view class="flex-dir-row flex-y-baseline">
								<text class="f-28 col-0 price">{{item.goodssuk.suk.price/100}}</text>
							</view>

							<text class="f-26 col-9 ml-10">x {{item.goodssuk.num}}</text>
						</view>
					</view>

				</view>
				<view class="flex-dir-row mt-20  flex-y-center flex-x-between">
					<button class="checkout-freight-help" :aria-label="$t('shipping.viewDetails')" :disabled="!canSubmit" @click="openFreightDetails">
						<text>{{ $t('createOrder.freight') }}</text>
						<uni-icons type="help" size="16" color="#757575" />
					</button>
					<text class="f-w f-28 col-0">{{freightText}}</text>
				</view>
				<view v-if="!ressList || !ressList._id" class="checkout-freight-status">
					<button class="checkout-freight-action" @click="navigator">{{$t('createOrder.selectAddress')}}</button>
				</view>
				<view v-else-if="quoteError" class="checkout-freight-status" role="alert">
					<text>{{quoteError}}</text>
					<view class="checkout-freight-actions">
						<button class="checkout-freight-action" @click="requestQuote">{{$t('shipping.retry')}}</button>
						<button class="checkout-freight-action" @click="navigator">{{$t('shipping.changeAddress')}}</button>
					</view>
				</view>
				<view class="flex-dir-row mt-20  flex-y-center flex-x-end">
					<text class="f-28 col-3">{{ $t('createOrder.subtotal') }}</text>
					<text v-if="!quoteResult">—</text><jlg-minPrice v-else :min-price="payments" maxSize="32rpx"></jlg-minPrice>
				</view>
			</view>
		</view>
		<view class="list-item flex-dir-column">
			<view class="flex-dir-row b-b pb-20 flex-y-center flex-x-between">
				<view class="col-3 f-28">{{ $t('createOrder.coupon') }}</view>
				<view @click="openpop()" v-if="canChooseCoupons" class="flex-dir-row flex-y-center">
					<view v-if="couponname.length == 0" class="f-26 col-61A189">
						{{ $t('createOrder.selectCoupon') }}
					</view>
					<view v-else class="col-61A189 f-28">
						<text style="margin-right: 15rpx;" v-for="c_name in couponname">{{c_name.name}}</text>
					</view>
					<text class="iconfont ml-20 f-32 icon-uniE003"></text>
				</view>
				<view v-else class="flex-dir-row flex-y-center">
					<view v-if="couponname.length == 0" class="f-26 col-9">
						{{control?$t('createOrder.seckillUnavailable'):$t('createOrder.noCoupon')}}
					</view>
					<view v-else class="col-61A189 f-28">
						<text style="margin-right: 15rpx;" v-for="c_name in couponname">{{c_name.name}}</text>
					</view>
					<text class="iconfont ml-20 f-32 icon-uniE003"></text>
				</view>

			</view>
			<view v-if="hasPromotion" class="flex-dir-row b-b pb-20 mt-20 flex-y-center flex-x-between">
				<view class="col-3 f-28">{{ $t('createOrder.promotion') }}</view>
				<text class="f-28 col-61A189">-￥{{(crossed_total/100).toFixed(2)}}</text>
			</view>
			<view class="flex-dir-row b-b pb-20 mt-20 flex-y-center flex-x-between">
				<view class="col-3 f-28">{{ $t('createOrder.discountAmount') }}</view>
				<text v-if="payments - payment > 0"
					class="f-28 col-61A189">-￥{{((payments - payment)/100).toFixed(2)}}</text>
				<text v-else class="f-26 col-9">{{ $t('createOrder.noDiscount') }}</text>
			</view>
			<view class="flex-dir-row   mt-20 flex-y-center flex-x-between">
				<view class="col-3 f-28">{{ $t('createOrder.note') }}</view>
				<input class="desc f-28" type="text" v-model="desc" :placeholder="$t('createOrder.notePlaceholder')"
					placeholder-class="placeholder" />
			</view>
		</view>
		<!-- 占位 -->
		<view class="line">

		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="pl-30 col-61A189  flex-dir-row flex-y-baseline">
				<text class="col-0 f-26">{{ $t('createOrder.actualPay') }}</text>
				<text v-if="!canSubmit">—</text><jlg-minPrice v-else :min-price="quoteResult.total_fee" maxSize="40rpx" minSize="27rpx"></jlg-minPrice>
			</view>
			<button class="submit" :disabled="!canSubmit || !openstate" @click="submit">{{ $t('createOrder.submitOrder') }}</button>
		</view>
		<!-- 优惠卷 -->
		<view>
			<uv-popup bgColor="#eaeaea" ref="popup" :round="10" mode="bottom">
				<view class="checkout-coupon-heading">
					<text class="checkout-coupon-title">{{$t('createOrder.selectCoupon')}}</text>
					<button v-if="selectedCoupons.length" class="checkout-coupon-clear" @click="clearCoupons">{{$t('createOrder.skipCoupons')}}</button>
				</view>
				<view style="font-size: 22rpx;color: #61A189;padding: 11px 0px 0px 12px;">{{ $t('createOrder.seckillCouponTip') }}</view>
				<!-- <scroll-view></scroll-view> -->
				<scroll-view scroll-y class="coupon-cen">
					<view v-if="selectedCoupons.includes(item._id) || item.allowType[0] !== '指定商品' || goods_id.some(id=> item.goodsArr[0].includes(id))"
						v-for="(item,index) in couponList" :key="index"
						@click="selectCoupon(item._id)"
						class="coupon-van" :class="{'coupon-van--selected': selectedCoupons.includes(item._id)}">
						<view class="coupon-letf">
							<view class="flex-dir-row">
								<view class="coupon-icqc">
									{{ couponScopeLabel(item) }}
								</view>
								<text class="coupon-name">{{ couponNameText(item) }}</text>
							</view>
							<view class="ml-20 mt-30">
								<view class="f-26 col-9">
									{{ $t('productDetail.validPeriod') }}
								</view>
								<view class="f-26 col-9" style="line-height: 40rpx;">
									{{formatDate(item.startTime[0])+ '-' +formatDate(item.endTime[0])}}
								</view>
							</view>
						</view>
						<view v-if="item.isShare[0]" class="coupon-diej">
							{{ $t('productDetail.stackable') }}</view>
						<view class="coupon-righ">
							<view class="mt-10">
								<text v-if="couponValuePrefix(item)" class="f-40">{{ couponValuePrefix(item) }}</text>
								<text class="coupon-qian">{{ couponValueText(item) }}<text v-if="couponValueSuffix(item)"
										class="coupon-z">{{ couponValueSuffix(item) }}</text></text>
							</view>
							<view style="font-size: 30rpx;">{{ couponThresholdText(item) }}</view>
							<view class="coupon-lqsy">{{selectedCoupons.includes(item._id) ? $t('createOrder.cancelCoupon') : $t('productDetail.useNow')}}</view>
						</view>
					</view>
				</scroll-view>
			</uv-popup>
		</view>
		<uni-popup ref="freightDetails" type="bottom" :animation="false" :safe-area="false">
			<view class="checkout-freight-sheet" role="dialog" :aria-label="$t('shipping.details')">
				<view class="checkout-freight-heading">
					<text class="checkout-freight-title">{{$t('shipping.details')}}</text>
					<button class="checkout-freight-close" @click="closeFreightDetails">{{$t('shipping.close')}}</button>
				</view>
				<scroll-view scroll-y class="checkout-freight-body">
					<view v-if="canSubmit" class="checkout-freight-content">
						<view class="checkout-freight-summary"><text>{{$t('shipping.orderFreight')}}</text><text class="checkout-freight-amount">{{freightText}}</text></view>
						<view v-if="quoteResult.address_snapshot" class="checkout-freight-destination">{{$t('shipping.to')}} {{quoteResult.address_snapshot.region_name}}</view>
						<view v-for="group in freightGroups" :key="group.group_id" class="checkout-freight-group">
							<view class="checkout-freight-group-heading"><text class="checkout-freight-goods">{{group.goodsNames}}</text><text v-if="freightGroups.length > 1" class="checkout-freight-amount">{{group.feeText}}</text></view>
							<template v-if="group.showThreshold">
								<view>{{$t('shipping.checkoutThreshold', {amount: group.thresholdText})}}</view>
								<view>{{$t('shipping.checkoutAmount', {amount: group.amountText})}}</view>
							</template>
							<view class="checkout-freight-explanation">{{group.explanation}}</view>
						</view>
						<view v-if="freightGroups.length > 1" class="checkout-freight-note">{{$t('shipping.merge')}}</view>
						<view v-if="hasFreightThreshold" class="checkout-freight-note">{{$t('shipping.amountBasisNote')}}</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
		<uni-popup ref="messpopup" type="dialog">
			<uni-popup-dialog mode="base" :title="$t('createOrder.paymentTitle')" :content="$t('createOrder.paymentContent')" :duration="0" :confirmText="$t('createOrder.payNow')"
				:cancelText="$t('createOrder.back')" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
		<view><uni-pay ref="uniPay" @success="onSuccess" @create="onCreate" @cancel="onCancel" @fail="onPayFail"></uni-pay></view>
		<jlg-delivery-picker ref="deliveryPicker" :allow-region="false" @change="chooseDelivery" />
	</view>
</template>

<script>
	import { getDelivery, setDelivery, deliveryForAddress, checkoutApi, checkoutError } from '@/common/delivery.js';
	const db = uniCloud.database();
	export default {
		data() {
			return {
				goodsList: [],
				quoteResult: null, quotedInput: '', quoteLoading: false, quoteError: '', quoteRequest: 0, selectedCoupons: [],
				goods_id: [],
				payment: null, //使用优惠卷后的总金额
				payments: null, //未使用优惠卷时的总金额
				couponList: [],
				user_id: uniCloud.getCurrentUserInfo().uid,
				couponname: [],
				freight: null, //运费
				desc: '', //备注
				payType: 1, //1微信 2支付宝
				crossed_total: 0,
				ressList: [],
				//支付参数
				goods_arr: [], //商品信息组
				order_no: "", // 业务系统订单号（即你自己业务系统的订单表的订单号）
				out_trade_no: "", // 插件支付单号
				description: "", // 支付描述
				type: "goods", // 支付回调类型 如 recharge 代表余额充值 goods 代表商品订单（可自定义，任意英文单词都可以，只要你在 uni-pay-co/notify/目录下创建对应的 xxx.js文件进行编写对应的回调逻辑即可）
				openstate: true,
				coupomFalse: false, //当前拥有优惠卷在当前商品是否可用
				control: false, //秒杀，false为普通商品
				is_distr: false, //是否为分销订单
				openid: '',
			}
		},
		onLoad(e) {
			this.description = this.$t('createOrder.storeName');
			let goodsData = JSON.parse(e.suk);
			this.crossed_total = Number(e.motion);
			this.distributionData();
			this.loadData(goodsData);
			this.ressDate();

			if (e.control == 'true') {
				this.control = true;
			}
		},
		onShow() { this.user_id = uniCloud.getCurrentUserInfo().uid; if (this.goodsList.length) this.ressDate(); },
		onUnload() { this.quoteRequest++; },
		watch: {
			quoteInputKey() { this.requestQuote(); },
			canSubmit(valid) { if (!valid) this.closeFreightDetails(); }
		},
		computed: {
			canChooseCoupons() { return this.selectedCoupons.length > 0 || (this.coupomFalse && !this.control); },
			quoteInputKey() { return JSON.stringify([this.ressList && this.ressList._id, this.goodsList.map(item => [item._id, item.goodssuk.suk.sku_id, item.goodssuk.suk.specs, item.goodssuk.num, item.goodssuk.seckill, item.goodssuk.cart_id]), this.selectedCoupons]); },
			canSubmit() { return !!this.quoteResult && !this.quoteLoading && !this.quoteError && this.quotedInput === this.quoteInputKey; },
			hasPromotion() {
				return Number.isFinite(this.crossed_total) && this.crossed_total > 0;
			},
			freightText() {
				if (this.quoteLoading) return this.$t('shipping.loading');
				if (!this.canSubmit) return '—';
				if (this.freight == 0) return this.$t('createOrder.freeShipping');
				const amount = (this.freight / 100).toFixed(2);
				return this.getCurrentLang() === 'en' ? `CNY ${amount}` : `￥${amount}`;
			},
			freightGroups() {
				if (!this.canSubmit || !this.quoteResult.freight_snapshot) return [];
				const groups = this.quoteResult.freight_snapshot.groups || [];
				return groups.map(group => {
					const showThreshold = group.threshold > 0 && (group.fee > 0 || group.rule === 'free');
					let explanation = this.$t(group.fee === 0 ? 'shipping.checkoutFree' : 'shipping.checkoutFixed', {amount: this.freightMoney(group.fee)});
					if (showThreshold) explanation = group.remaining > 0
						? this.$t(groups.length > 1 ? 'shipping.groupRemaining' : 'shipping.checkoutRemaining', {amount: this.freightMoney(group.remaining)})
						: this.$t('shipping.thresholdMet');
					return {
						...group, showThreshold, explanation,
						goodsNames: (group.goods || []).map(goods => this.displayLangText(this.goodsList.find(item => item._id === goods.id) || goods, 'name')).join('、'),
						feeText: group.fee === 0 ? this.$t('createOrder.freeShipping') : this.freightMoney(group.fee),
						thresholdText: showThreshold ? this.freightMoney(group.threshold) : '',
						amountText: this.freightMoney(group.amount)
					};
				});
			},
			hasFreightThreshold() { return this.freightGroups.some(group => group.showThreshold); }
		},
		methods: {
			freightMoney(amount) { return `${this.getCurrentLang() === 'en' ? 'CNY ' : '¥'}${(amount / 100).toFixed(2)}`; },
			openFreightDetails() { if (this.canSubmit) this.$refs.freightDetails.open(); },
			closeFreightDetails() { if (this.$refs.freightDetails) this.$refs.freightDetails.close(); },
			async requestQuote() {
				this.closeFreightDetails();
				const request = ++this.quoteRequest, key = this.quoteInputKey;
				this.quoteResult = null; this.quotedInput = ''; this.quoteError = ''; this.quoteLoading = false; this.freight = null; this.payment = null; this.payments = null; this.couponname = [];
				if (!this.goodsList.length) return;
				if (!this.ressList || !this.ressList._id) { this.quoteError = this.$t('shipping.needAddress'); return; }
				this.quoteLoading = true;
				try {
					const result = await checkoutApi().quote({ address_id: this.ressList._id, goods_arr: this.orderLines(), preferential: this.selectedCoupons.map(id => ({ id })) });
					if (request !== this.quoteRequest || key !== this.quoteInputKey || this.user_id !== uniCloud.getCurrentUserInfo().uid) return;
					this.quoteResult = result; this.quotedInput = key; this.payment = result.payable; this.payments = result.origprice; this.freight = result.freight; this.couponname = result.preferential;
					this.goodsList.forEach(item => { const line = result.goods_arr.find(row => row.goods_id === item._id && row.goods_seckill === (item.goodssuk.seckill === true) && (item.goodssuk.suk.sku_id ? row.sku_id === item.goodssuk.suk.sku_id : JSON.stringify(row.goods_suk) === JSON.stringify(item.goodssuk.suk.specs))); if (line) item.goodssuk.suk.price = line.goods_price; });
				} catch(e) { if (request === this.quoteRequest) this.quoteError = checkoutError(e, key => this.$t(key)); }
				finally { if (request === this.quoteRequest) this.quoteLoading = false; }
			},
			orderLines() { return this.goodsList.map(item => ({ goods_id: item._id, sku_id: item.goodssuk.suk.sku_id, goods_suk: item.goodssuk.suk.specs, goods_num: item.goodssuk.num, goods_seckill: item.goodssuk.seckill === true, ...(item.goodssuk.cart_id ? { cart_id: item.goodssuk.cart_id } : {}) })); },
			async chooseDelivery(selection) {
				this.closeFreightDetails();
				this.quoteRequest++; this.quoteResult = null; this.quoteLoading = true; this.quoteError = ''; this.ressList = [];
				try { const { result } = await db.collection('jlg-goods-address').doc(selection.address_id).get(); if (getDelivery() && getDelivery().address_id !== selection.address_id) return; this.ressList = result.data[0] || []; await this.requestQuote(); }
				catch(e) { this.quoteLoading = false; this.quoteError = this.$t('shipping.addressInvalid'); }
			},
			getCurrentLang() {
				const language = uni.getStorageSync('CURRENT_LANG') || this.$i18n.locale || 'zh-Hans';
				return String(language).indexOf('en') === 0 ? 'en' : 'zh-Hans';
			},
			displayLangText(item, key) {
				if (!item) return '';
				const langKey = this.getCurrentLang() === 'en' ? `${key}_en` : key;
				return item[langKey] || item[key] || '';
			},
			memberDiscountText(level, discount) {
				if (this.getCurrentLang() === 'en') {
					const percentOff = Math.max(0, Math.round(100 - Number(discount || 0)));
					return `${level} ${percentOff}% ${this.$t('productDetail.discountSuffix')}`;
				}
				return `${level}享${Number(discount || 0) / 10}${this.$t('productDetail.discountSuffix')}`;
			},
			couponScopeLabel(item) {
				if (item.userType && item.userType[0] === '会员权益') {
					return this.$t('couponCenter.memberBenefit');
				}
				if (item.allowType[0] === '所有商品' && item.userType[0] === '所有人') {
					return this.$t('productDetail.couponFullStore');
				}
				if (item.allowType[0] === '指定商品' && item.userType[0] === '所有人') {
					return this.$t('productDetail.couponSpecificGoods');
				}
				return this.$t('productDetail.couponSpecificUser');
			},
			couponNameText(item) {
				const enName = item.couponName_en && item.couponName_en[0];
				return this.getCurrentLang() === 'en' ? (enName || item.couponName[0]) : item.couponName[0];
			},
			couponValuePrefix(item) {
				return item.couponType[0] === '满减' ? '￥' : '';
			},
			couponValueText(item) {
				if (item.couponType[0] === '满减') {
					return item.Price[0] / 100;
				}
				if (this.getCurrentLang() === 'en') {
					return Math.max(0, Math.round(100 - Number(item.Price[0] || 0)));
				}
				return (item.Price[0] / 10).toFixed(1);
			},
			couponValueSuffix(item) {
				if (item.couponType[0] === '满减') return '';
				return this.getCurrentLang() === 'en' ? '% off' : this.$t('productDetail.discountSuffix');
			},
			couponThresholdText(item) {
				return `${this.$t('productDetail.couponThresholdPrefix')}${item.orderAmount[0] / 100}${this.$t('productDetail.couponThresholdSuffix')}`;
			},
			async ressDate() {
				const selected = getDelivery();
				if (selected) {
					if (selected.address_id) return this.chooseDelivery(selected);
					this.ressList = []; this.quoteError = this.$t('shipping.needAddress'); return;
				}
				try {
					const { result } = await db.collection('jlg-goods-address').where({ user_id: this.user_id, is_default: true }).limit(1).get();
					if (result.data[0]) { const value = await deliveryForAddress(result.data[0]); if (!getDelivery()) { setDelivery(value); await this.chooseDelivery(value); } }
				} catch(e) { this.quoteError = this.$t('shipping.addressInvalid'); }
			},
			async loadData(data) {
				this.openid = uni.getStorageSync('uni-pay-weixin-h5-openid');
				try {
					const rows = [];
					for (const selected of data) { const { result } = await db.collection('opendb-mall-goods').doc(selected.id).get(); if (!result.data[0]) throw new Error(); rows.push({ ...result.data[0], goodssuk: selected }); }
					this.goods_id = rows.map(row => row._id); this.goodsList = rows; this.couponData();
				} catch(e) { this.quoteError = this.$t('shipping.stockInvalid'); }
			},
			//判断是否当前用户是否存在上级，如存在，则此订单为分销订单
			distributionData() {
				db.collection("jlg-distribution").where({
					"user_arr": db.command.in([this.user_id])
				}).get().then((res) => {
					if (res.result.data.length > 0) {
						this.is_distr = true;
					}
				})
			},
			couponData() {
				this.$func.myFunction('jlg-cart', {
						functionName: 'getCouponsByTime',
						data: {
							user_id: this.user_id,
							goods_id: this.goods_id
						}
					}).then(res => {
						this.coupomFalse = res.result.coupomFalse;
						this.couponList = res.result.data;
					})
					.catch(error => {
						console.error(error);
					});
			},
			//选择优惠卷
			clearCoupons() {
				this.selectedCoupons = [];
				this.$refs.popup.close();
			},
			selectCoupon(id) {
				this.selectedCoupons = this.selectedCoupons.includes(id) ? this.selectedCoupons.filter(value => value !== id) : [...this.selectedCoupons, id];
				this.$refs.popup.close();
			},
			is_shares() {
				let a = true;
				for (let item of this.couponList) {
					if (item.hasOwnProperty('couponstate')) {
						if (!item.isShare[0]) {
							a = false
						}
					}
				}
				return a
			},
			formatDate(timestamp) {
				const date = new Date(timestamp);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			openpop() {
				this.$refs.popup.open();
			},
			numberChange(data) {
				this.number = data.number;
			},
			changePayType(type) {
				this.payType = type;
			},
			navigator() { this.$refs.deliveryPicker.open(); },
			async submit() {
				if (!this.canSubmit) { uni.showToast({ title: this.quoteError || this.$t('shipping.loading'), icon: 'none' }); return; }
				// #ifndef APP
				if (this.ressList.formatted_address) {
					if (this.openstate) {
						this.openstate = false;
						uni.showLoading({
							title: this.$t('createOrder.loadingEllipsis')
						});
						this.order_no = this.order_no || `${Math.floor(10000 + Math.random() * 90000)}${Date.now()}`;
						this.out_trade_no = `${this.order_no}-1`;

						this.goods_arr = this.orderLines();
						this.open();

					} else {
						uni.showToast({
							title: this.$t('createOrder.resubmit'),
							icon: "none",
							duration: 1600
						})
					}
				} else {
					uni.showToast({
						title: this.$t('createOrder.noAddress'),
						icon: "none",
						duration: 1600
					})
				}
				// #endif
				// #ifdef APP
				uni.showToast({
					title: this.$t('createOrder.appPayUnavailable'),
					icon: "none",
					duration: 1600
				})
				// #endif
			},
			open() {
				uni.hideLoading();
				// 打开支付收银台
				this.$refs.uniPay.open({
					address_id: this.ressList._id, checkout_version: 1, quote_key: this.quoteResult.quote_key,
					total_fee: this.quoteResult.total_fee, // 支付金额，单位分 100 = 1元
					order_no: this.order_no, // 业务系统订单号（即你自己业务系统的订单表的订单号）
					out_trade_no: this.out_trade_no, // 插件支付单号
					description: this.description, // 支付描述
					type: this.type, // 支付回调类型
					goods_arr: this.goods_arr, //商品信息组
					address: this.$t('createOrder.addressName') + this.ressList.name + '；' + this.$t('createOrder.addressPhone') + this.ressList.mobile + '；' + this.$t('createOrder.addressText') + this.ressList
						.formatted_address, //收货地址
					preferential: this.couponname, //使用的优惠卷
					notes: this.desc, //购买备注
					origprice: this.payments, //原始价格
					deduprice: this.payments - this.payment, //优惠卷抵扣的金额
					freight: this.freight, //运费金额
					is_distr: this.is_distr, //是否为分销订单
					audit_status: this.$t('createOrder.auditPending'),
					openid: this.openid,
				});
			},
			onPayFail(res) {
				this.openstate = true;
				uni.hideLoading();
				uni.showToast({ title: checkoutError(res, key => this.$t(key)), icon: 'none' });
				if (['PRICE_CHANGED', 'NOT_DELIVERABLE', 'ADDRESS_INVALID', 'FREIGHT_CONFIG_INVALID', 'COUPON_INVALID'].includes(res.errCode)) this.requestQuote();
			},
			onSuccess(res) {
				console.log('success: ', res);
				if (res.user_order_success) {
					uni.showToast({
						title: this.$t('createOrder.paymentSuccess'),
						icon: "none",
						duration: 1600
					}).then(() => {
						uni.switchTab({
							url: `/pages/ucenter/ucenter`
						})
					})
					// 代表用户已付款，且你自己写的回调成功并正确执行了
				} else {
					uni.showToast({
						title: this.$t('createOrder.paymentSuccess'),
						icon: "none",
						duration: 1600
					}).then(() => {
						uni.switchTab({
							url: `/pages/ucenter/ucenter`
						})
					})
					// 代表用户已付款，但你自己写的回调执行失败（通常是因为你的回调代码有问题）
				}
			},
			// 监听事件 - 支付订单创建成功（此时用户还未支付）
			onCreate(res) {
				console.log('create: ', res);
				// 如果只是想生成支付二维码，不需要组件自带的弹窗，则在这里可以获取到支付二维码 qr_code_image
			},
			//监听用户取消支付
			onCancel(res) {
				this.$refs.messpopup.open()
			},
			confirm() {
				this.$refs.messpopup.close()
				uni.navigateTo({
					url: `/pages/order/order?state=0`
				})
			},
			close() {
				this.$refs.messpopup.close()
				uni.navigateBack();
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
		padding-bottom: 100upx;
	}

	.list-item {
		background-color: #fff;
		border-radius: 19rpx;
		margin: 20rpx 2%;

		padding: 20rpx 25rpx;
		box-sizing: border-box;
	}

	.store-logo {
		width: 68rpx;
		height: 68rpx;
		border-radius: 10rpx;
	}

	.goods-litpic {
		width: 135rpx;
		height: 135rpx;
		border-radius: 20rpx;
	}

	.price {
		height: 50upx;
		line-height: 50upx;

		&:before {
			content: '￥';
			font-size: 24rpx;
			margin: 0 2upx 0 -4upx;
		}
	}



	.desc {
		flex: 1;
		font-size: 28rpx;
		margin-left: 30rpx;
	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 10; // 固定结算栏位于 uni-popup（99）下方。
		display: flex;
		align-items: center;
		width: 100%;
		justify-content: space-between;
		font-size: 30rpx;
		background-color: #fff;
		color: #000;
		padding-left: 30rpx;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
		padding-bottom: 20rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

	}
	.submit {
		@include shop-button(primary);
		width: 208rpx;
		height: 76rpx;
		text-align: center;
		height: 76rpx;
		line-height: 76rpx;
		font-size: 29rpx;
		margin: 20rpx 30rpx;
	}



	.line {
		width: 750rpx;
		background-color: #f5f5f5;
		height: 300rpx;
	}





	.m-bottom {
		position: relative;
		height: 75rpx;
	}

	.m-img {
		position: absolute;
		width: 35px;
		height: 35px;
		right: 30rpx;
		bottom: 6rpx;
	}

	.b-b {
		border-bottom: 1rpx solid #f5f5f5;
	}

	.b-t {
		border-top: 1rpx solid #f5f5f5;
	}

	.coupon-diej {
		position: absolute;
		right: 0;
		top: 0;
		background: #ffaa00;
		color: #fff;
		z-index: 99;
		font-size: 22rpx;
		padding: 5rpx 10rpx;
		border-top-right-radius: 20rpx;
		border-bottom-left-radius: 20rpx;
	}

	.coupon-z {
		font-size: 40rpx;
		font-weight: 600;
	}

	.coupon-cen {
		height: 60vh;
		padding: 20rpx;
		padding-bottom: 150rpx;
		padding-top: 20rpx;
	}

	.coupon-van {
		width: 100%;
		height: 200rpx;
		background: #fff;
		border-radius: 20rpx;
		position: relative;
		margin-top: 20rpx;
	}

	.coupon-letf {
		position: absolute;
		left: 0;
		top: 0;
		width: 67%;
	}

	.coupon-icqc {
		height: 38rpx;
		background: #61A189;
		border-radius: 100rpx;
		color: #fff;
		padding: 0 15rpx;
		line-height: 38rpx;
		font-size: 22rpx;
		margin-top: 30rpx;
		margin-left: 20rpx;
		margin-right: 10rpx;
	}

	.coupon-name {
		font-size: 34rpx;
		top: 30rpx;
		line-height: 85rpx;
		color: #1b1b1b;
	}

	.coupon-righ {
		width: 33%;
		height: 100%;
		background: #61A189;
		position: absolute;
		right: 0;
		border-bottom-right-radius: 20rpx;
		border-top-right-radius: 20rpx;
		color: #fff;
		text-align: center;
	}

	.coupon-qian {
		font-size: 64rpx;
		font-weight: 600;
		margin-top: 8rpx;
	}
	.coupon-lqsy {
		@include shop-button(secondary);
		font-size: 24rpx;
		height: 38rpx;
		line-height: 38rpx;
		margin: 12rpx auto auto auto;
		width: 125rpx;
	}

	.goods-name {
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}
</style>

<style scoped>
.checkout-coupon-heading { display: flex; align-items: center; justify-content: space-between; gap: 20rpx; padding: 20rpx 24rpx 0; }
.checkout-coupon-title { min-width: 0; font-size: 30rpx; font-weight: 600; color: #2a3330; }
.checkout-coupon-clear { flex-shrink: 0; min-height: 44px; margin: 0; padding: 10rpx 16rpx; border-radius: 8rpx; font-size: 26rpx; line-height: 1.5; display: flex; align-items: center; color: #465e53; background: #fff; }
.checkout-coupon-clear::after { border: 0; }
.coupon-van--selected { outline: 2rpx solid #465e53; outline-offset: -2rpx; }
.checkout-freight-help,
.checkout-freight-close,
.checkout-freight-action {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 44px;
	min-height: 44px;
	margin: 0;
	padding: 0;
	background: transparent;
	color: #333;
	font-size: 28rpx;
	line-height: 1.5;
	border-radius: 4px;
}
.checkout-freight-help { gap: 10rpx; }
.checkout-freight-help[disabled] { background: transparent; color: #333; }
.checkout-freight-help::after,
.checkout-freight-close::after,
.checkout-freight-action::after { border: 0; }
.checkout-freight-help:focus-visible,
.checkout-freight-close:focus-visible,
.checkout-freight-action:focus-visible { outline: 2px solid #526057; outline-offset: 2px; }
.checkout-freight-status { color: #595f5b; font-size: 26rpx; line-height: 1.6; }
.checkout-freight-actions { display: flex; flex-wrap: wrap; gap: 24px; }
.checkout-freight-action { color: #465e53; font-size: 26rpx; text-decoration: underline; }
.checkout-freight-sheet {
	background: #fff;
	color: #2a3330;
	border-radius: 16px 16px 0 0;
	padding: 20rpx 30rpx 30rpx;
	padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
}
.checkout-freight-heading { display: flex; align-items: center; justify-content: space-between; gap: 20rpx; margin-bottom: 20rpx; }
.checkout-freight-title { min-width: 0; font-size: 34rpx; font-weight: 600; }
.checkout-freight-close { flex-shrink: 0; font-size: 26rpx; color: #595f5b; padding-inline: 10rpx; }
.checkout-freight-body { height: 55vh; }
.checkout-freight-content { font-size: 26rpx; line-height: 1.7; overflow-wrap: anywhere; }
.checkout-freight-summary,
.checkout-freight-group-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 20rpx; }
.checkout-freight-summary { font-size: 30rpx; font-weight: 600; }
.checkout-freight-amount { flex-shrink: 0; white-space: nowrap; }
.checkout-freight-destination { margin-top: 10rpx; color: #595f5b; font-size: 24rpx; }
.checkout-freight-group { margin-top: 30rpx; }
.checkout-freight-group-heading { margin-bottom: 10rpx; font-weight: 500; }
.checkout-freight-goods { min-width: 0; }
.checkout-freight-explanation { margin-top: 10rpx; }
.checkout-freight-note { margin-top: 20rpx; color: #595f5b; font-size: 24rpx; }
.submit[disabled] { opacity: .5; }
</style>
