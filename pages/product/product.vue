<template>
	<page-meta :page-style="'overflow:'+(show?'hidden':'visible')"></page-meta>
	<view class="container">
		<view v-if="entryError" style="padding:80rpx 30rpx">{{ entryError }}<button @click="goBack">返回</button></view>
		<view v-if="goodsdata.name">
			<qrcode-poster style="position:absolute;z-index:9999" ref="poster" :title="displayLangText(goodsdata, 'name')"
				:goods-id="goods_id" :identity="user_id || ''" :header-img="posterImage" :price="minPrice / 100"
				:username="usname" :origprice="Number(goodsdata.crossed_price || 0) / 100" @showClick="showClick" />
			<!-- #ifdef MP-WEIXIN -->
			<view class="flex-left navbar" :style="{height:(navHeight + 8) + 'px'}">
				<view class="navbar-title" @click="goBack" :style="{top:navTop + 'px'}">
					<uni-icons type="back" size="27" color="#242424"></uni-icons>
				</view>
			</view>
			<!-- #endif -->
			<!-- 二维码组件 -->
			<view class="swiper">
				<swiper @change="changeNav" circular=true class="swiper-list" duration="400">
					<swiper-item class="" v-for="(item,indexs) in goodsdata.goods_banner_imgs" :key="indexs">
						<!-- #ifdef APP -->
						<image v-if="item.fileType == 'video'" :src="goodsdata.goods_banner_imgs[indexs + 1].url"
							class="swiperImg" mode="aspectFill"></image>
						<!-- #endif -->
						<!-- #ifndef APP -->
						<video class="swiperImg" v-if="item.fileType == 'video'" :src="item.url"></video>
						<!-- #endif -->
						<image :src="item.url" class="swiperImg" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
				<view class="current flex-dir-row flex-y-center">
					<text>{{currentIndex+1}}</text>
					<text>/</text>
					<text>{{goodsdata.goods_banner_imgs.length}}</text>
				</view>
			</view>
			<view v-if="control" class="search-backurl">
				<view class="flex-dir-row flex-y-center flex-x-between" style="position: relative;">
					<view class="flex-dir-row flex-y-center">
						<view class="flex-x-baseline dis-flex">
							<jlg-minPrice :min-price="minPrice" col="#fff" :Weight="600" maxSize="48rpx" minSize="32rpx"></jlg-minPrice>
						</view>
						<text class="seckill-tag ml-10">{{ $t('productDetail.limitedPick') }}</text>
					</view>
					<text class="f-24 w-nowrap" style="color: #B8BBB6;">{{ $t('productDetail.endsIn') }}</text>
				</view>
				<view class="flex-dir-row flex-y-center flex-x-between" style="position: relative; margin-top: 12rpx;">
					<view class="flex-dir-row flex-y-center">
						<text class="f-24" style="color: #8E918D; line-height: 48rpx;">{{ $t('productDetail.originalPrice') }}</text>
					<text class="price-original ml-10">{{(goodsdata.crossed_price/100).toFixed(0)}}</text>
					</view>
					<uni-countdown @timeup="delayed" font-size="12" ref="coun" :hour="hours" :minute="minutes"
						:second="seconds" color="#FFFFFF" background-color="#61A189" splitorColor="#FFFFFF" />
				</view>
			</view>
			<view class="list-item flex-dir-column">
				<!-- 商品名称 + 分享按钮 -->
					<view class="flex-dir-row flex-y-center flex-x-between">
						<view class="product-name">{{ displayLangText(goodsdata, 'name') }}</view>
					<!-- #ifndef APP -->
					<button @click="shareClick" class="share-btn">
						<text class="iconfont icon-uniE044" style="font-size: 40rpx; color: #8E918D;"></text>
					</button>
					<!-- #endif -->
				</view>
				<!-- 价格 + 折扣 + 销量（普通商品） -->
				<view v-if="!control" class="flex-dir-row flex-y-center flex-x-between" style="margin-top: 16rpx;">
					<view class="flex-dir-row flex-y-center">
						<view class="product-price-pair dis-flex">
							<jlg-minPrice :min-price="minPrice" maxSize="48rpx" minSize="32rpx" :Weight="500"></jlg-minPrice>
							<text v-if="goodsdata.crossed_price > 0" class="price-original ml-10">{{(goodsdata.crossed_price/100).toFixed(0)}}</text>
						</view>
							<text v-if="discountText" class="deal-tips ml-10">{{ discountText }}</text>
						</view>
						<text v-if="goodsdata.total_sell_count < 9999" class="text-meta w-nowrap">
							{{ $t('productDetail.salesPrefix') }} {{goodsdata.total_sell_count}}</text>
						<text v-else class="text-meta w-nowrap">{{ $t('productDetail.salesPrefix') }} 9999+</text>
				</view>
				<!-- 优惠券标签 + 查看优惠：有可用优惠或秒杀模式时才显示 -->
				<view v-if="control || couponList.length > 0"
					class="flex-dir-row flex-y-center flex-x-between" style="margin-top: 20rpx;">
					<view class="flex-dir-row flex-wrap">
						<view class="coupon-btn"
							v-if="(item.user_type === '所有人' || item.user_arr.includes(user_id)) && (item.allow_type !== '指定商品' || item.goods_arr.includes(goods_id))"
							v-for="(item, index) in couponList" :key="index">
								{{ displayLangText(item, 'name') }}
						</view>
					</view>
					<view class="flex-dir-row flex-y-center" @click="popup">
							<text class="f-26 text-primary">{{control ? $t('productDetail.seckillCouponUnavailable') : $t('productDetail.viewCoupons')}}</text>
						<text class="iconfont ml-10 f-24 icon-uniE003 text-primary"></text>
					</view>
				</view>
			</view>
			<view class="list-item" style="margin-top: 2rpx;">
				<view class="flex-dir-row flex-y-center  pb-25 b-b" @click="toggleSpec">
						<text class="list-title-left col-9 f-28 w-nowrap">{{ $t('productDetail.specs') }}</text>
					<view class="flex-x-betweenflex-y-center flex-dir-row w-100">
						<view class="flex-dir-row flex-y-center flex-1">
							<view class="f-29 col-0" v-if="specSelected.length>0">
								<text class="f-27 col-0 mr-10" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
										{{ displayLangText(sItem, 'name') }}
								</text>
								<text v-if="numberl > 1">×{{numberl}}</text>
							</view>
							<view class="f-27 col-0" v-else>
									{{ $t('productDetail.pleaseSelect') }}
							</view>
						</view>
						<text class="iconfont icon-uniE003"></text>
					</view>
				</view>
				<view class="delivery-row" role="button" @click="$refs.deliveryPicker.open()"><text>{{$t('shipping.to')}}</text><text class="delivery-region-name">{{delivery ? delivery.region_name : $t('shipping.choose')}}</text><text>›</text></view>
				<view class="freight-row" :class="{ 'freight-row--border': visibleServices.length > 0 }" role="button" :aria-label="$t('productDetail.freight') + '，' + freightText + '，' + freightHint" :aria-disabled="freightLoading" tabindex="0" @click="openFreightInfo" @keydown.enter.prevent="openFreightInfo" @keydown.space.prevent="openFreightInfo">
					<text class="freight-label">{{$t('productDetail.freight')}}</text>
					<view class="freight-content">
						<text class="freight-price">{{freightText}}</text>
						<text v-if="freightHint" class="freight-hint">{{freightHint}}</text>
					</view>
					<text v-if="!freightLoading" class="freight-arrow" aria-hidden="true">›</text>
				</view>
				<view v-if="visibleServices.length" class="flex-dir-row mt-25 flex-y-center">
						<text class="list-title-left col-9 f-28 w-nowrap">{{ $t('productDetail.service') }}</text>
					<view class="flex-x-between flex-y-center flex-dir-row w-100">
						<view class="flex-dir-row flex-y-center  flex-1">
							<view class="bz-list con f-27" v-for="(item,index) in visibleServices"
								:key="index">
									<text>{{ item }}</text>
								<text style="margin: 0rpx 8rpx;" v-if="index < visibleServices.length - 1">·</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 评价 -->
			<view class="eva-section" @click="naTov(goods_id)">
				<view class="e-header">
					<text class="tit">{{ $t('productDetail.reviews') }}</text>
					<text>({{evaluateNum}})</text>
					<text class="tip">{{ $t('productDetail.favorableRate') }} {{goodrate > 0?goodrate:100}}%</text>
					<text class="iconfont icon-uniE003"></text>
				</view>
				<view v-if="evaluateList.length > 0" class="eva-box">
					<image class="portrait"
						:src="evaluateList[0].usimage[0].url?evaluateList[0].usimage[0].url:`../../static/logo.png`"
						mode="aspectFill"></image>
					<view class="right">
						<text class="name">{{evaluateList[0].usname[0]?evaluateList[0].usname[0]:$t('productDetail.anonymousUser')}}</text>
						<uni-rate :readonly="true" activeColor="#61A189" size="17" v-model="evaluateList[0].grade" />
						<text class="con">{{evaluateList[0].content.text}}</text>
						<view class="bot">
							<text class="attr">{{ $t('productDetail.purchaseType') }}<text style="margin-right: 10rpx;"
									v-for="suk in evaluateList[0].goods_suk">{{suk}}</text></text>
							<text class="time">{{formatDate(evaluateList[0].create_date)}}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="detail-desc">
				<view class="d-header">
					<text>{{ $t('productDetail.details') }}</text>
				</view>
				<mp-html ref="mpAll" :content="displayLangText(goodsdata, 'goods_desc')" />
			</view>
			<!-- 分享弹窗 -->
			<uni-popup ref="sharepopup" type="share">
				<uni-popup-share :title="$t('productDetail.shareTo')" @select="select"></uni-popup-share>
			</uni-popup>
			<!-- 底部操作菜单 -->
			<view class="footer">
				<view class="footer-content">
				<view class="footer-shortcuts">
					<navigator url="/pages/index/index" open-type="switchTab" class="footer-btn">
						<image src="@/static/tabbar/home.svg" style="width: 40rpx; height: 40rpx; display: block; margin: 0 auto;" mode="aspectFit"></image>
						<text>{{ $t('productDetail.home') }}</text>
					</navigator>
					<navigator url="/pages/cart/cart" open-type="switchTab" class="footer-btn">
						<image src="@/static/tabbar/cart.svg" style="width: 40rpx; height: 40rpx; display: block; margin: 0 auto;" mode="aspectFit"></image>
						<text>{{ $t('productDetail.bag') }}</text>
					</navigator>
					<view class="footer-btn" :class="{active: favorite}" @click="toFavorite('add')">
						<text :class="favorite?'iconfont icon-uniE023':'iconfont icon-shoucang'"></text>
						<text>{{ $t('productDetail.favorite') }}</text>
					</view>
				</view>
					<view class="footer-actions">
							<button v-if="!control" class="footer-left" @click="openCartSpec">{{ $t('productDetail.addToBag') }}</button>

							<button :class="control?'footer-rights':'footer-right'" :disabled="freightLoading || !!(freightPreview && !freightPreview.deliverable)" @click="toggleSpec(0)">{{ $t('productDetail.buyNow') }}</button>
					</view>
				</view>
			</view>

			<!-- 规格弹窗（统一品牌风格组件） -->
			<jlg-spec-popup ref="buySpecPopup" :userId="user_id" action="select" :confirm-text="$t('common.complete')"
				:seckill="control" @confirm="handleSpecConfirm" />
			<jlg-spec-popup ref="cartSpecPopup" :userId="user_id" />

			<!-- 优惠卷 -->
			<view>
				<uv-popup bgColor="#eaeaea" ref="popup" :round="10" mode="bottom">
					<scroll-view scroll-y class="coupon-cen">
						<view v-for="(item,index) in couponList" :key="index"
							v-if="(item.user_type === '所有人' || item.user_arr.includes(user_id)) && (item.allow_type !== '指定商品' || item.goods_arr.includes(goods_id))"
							class="coupon-van">
							<view class="coupon-letf">
								<view class="flex-dir-row">
										<view class="coupon-icqc">
											{{ couponScopeLabel(item) }}
										</view>
										<text class="coupon-name">{{ displayLangText(item, 'name') }}</text>
								</view>
								<view class="ml-20 mt-30">
									<view class="f-26 col-9">
											{{ $t('productDetail.validPeriod') }}
									</view>
									<view class="f-26 col-9" style="line-height: 40rpx;">
										{{formatDate(item.start_time)+ '-' +formatDate(item.end_time)}}
									</view>
								</view>
							</view>
							<view v-if="item.is_share" class="coupon-diej">
									{{ $t('productDetail.stackable') }}</view>
							<view class="coupon-righ">
								<view class="mt-10">
										<text v-if="couponValuePrefix(item)" class="f-40">{{ couponValuePrefix(item) }}</text>
										<text class="coupon-qian">{{ couponValueText(item) }}<text v-if="couponValueSuffix(item)"
												class="coupon-z">{{ couponValueSuffix(item) }}</text></text>
									</view>
									<view style="font-size: 30rpx;">{{ couponThresholdText(item) }}</view>
									<view v-if="item.states"
										@click="addCoupon(item._id,item.max_number,item.received_number,item.number,item.user_type,item.user_arr)"
										class="coupon-lqsy">
										{{ $t('productDetail.claimNow') }}</view>
									<view v-else class="coupon-lqsy"
										@click="navigator(item.allow_type,item.goods_arr,displayLangText(item, 'name'))">
										{{ $t('productDetail.useNow') }}</view>
							</view>
						</view>
					</scroll-view>
				</uv-popup>
			</view>
		</view>
		<uni-popup ref="freightInfo" type="bottom" background-color="#fff" border-radius="16px 16px 0 0">
			<view class="freight-sheet">
				<view class="freight-sheet-heading"><text class="freight-sheet-title">{{$t('shipping.rulesTitle')}}</text><button class="freight-close" size="mini" @click="$refs.freightInfo.close()">{{$t('shipping.close')}}</button></view>
				<scroll-view scroll-y class="freight-sheet-body">
					<view class="freight-rule"><text class="freight-rule-label">{{$t('shipping.destination')}}</text><text>{{delivery ? delivery.region_name : $t('shipping.choose')}}</text><button class="freight-change-address" size="mini" @click="changeFreightAddress">{{$t('shipping.changeAddress')}}</button></view>
					<template v-if="freightPreview && freightPreview.deliverable">
						<view v-if="freightPreview.threshold" class="freight-rule">
							<text class="freight-rule-label">{{$t('shipping.freeCondition')}}</text>
							<text>{{$t('shipping.threshold', { amount: formatFreightAmount(freightPreview.threshold) })}}</text>
							<text class="freight-rule-note">{{$t('shipping.currentRegion')}}</text>
						</view>
						<view v-if="freightPreview.threshold" class="freight-rule"><text class="freight-rule-label">{{$t('shipping.eligibleGoods')}}</text><text>{{$t('shipping.eligibleGoodsNote')}}</text></view>
						<view v-if="freightPreview.threshold" class="freight-rule"><text class="freight-rule-label">{{$t('shipping.amountBasis')}}</text><text>{{$t('shipping.amountBasisNote')}}</text></view>
						<view v-else class="freight-rule"><text class="freight-rule-label">{{$t('productDetail.freight')}}</text><text>{{freightPreview.base_fee === 0 ? $t('shipping.regionFree') : $t('shipping.regionFixed')}}</text></view>
						<text class="freight-rule-note">{{$t('shipping.checkoutNote')}}</text>
					</template>
					<text v-else class="freight-rule-note">{{freightText}}</text>
				</scroll-view>
				<button v-if="freightPreview && !freightPreview.exact" class="freight-confirm" @click="chooseFreightSpecs">{{$t('shipping.chooseSpecs')}}</button>
				<button v-else class="freight-confirm" @click="$refs.freightInfo.close()">{{$t('shipping.gotIt')}}</button>
			</view>
		</uni-popup>
		<jlg-delivery-picker ref="deliveryPicker" @change="chooseDelivery" />
	</view>
</template>

<script>
	import { mainImage, resolveProductEntry, bindPendingReferral } from '@/common/product-share.js';
	import { getDelivery, defaultDelivery, checkoutApi, shippingText, shippingHint, checkoutError } from '@/common/delivery.js';
	const db = uniCloud.database();
	import QrcodePoster from '@/components/zhangyu-qrcode-poster/zhangyu-qrcode-poster.vue';
	export default {
		components: {
			QrcodePoster
		},
		data() {
			return {
				goodsdata: [],
				entryError: '',
				delivery: null, freightPreview: null, freightLoading: false, freightError: '', freightRequest: 0, selectedSkuId: '',
				minPrice: null,
				specSelected: [],
				numberl: 1,
				favorite: false,
				shareList: [],
				goods_id: '',
				control: false,
				createOrder: false,
				couponList: [],
				user_id: uniCloud.getCurrentUserInfo().uid,
				navTop: null,
				navHeight: null,
				borderColor: '',
				evaluateNum: 0,
				goodrate: null,
				currentIndex: 0,
				evaluateList: [],
				hours: null, //秒杀时间
				minutes: null, //秒杀时间
				seconds: null, //秒杀时间
				where: {},
				receiveId: [],
				uqrcodeurl: '', //二维码临时路径
				usname: '',
				usimg: 'https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/logo.png',
				show: false,
			};
		},
		onShareTimeline(res) {
			return {
				title: this.$t('home.shareTitle'),
				imageUrl: '../../static/logo.png',
			}
		},
		onShareAppMessage(res) {
			if (res.from) {
				return {
					title: this.displayLangText(this.goodsdata, 'name'),
					imageUrl: this.goodsdata.goods_thumb,
					path: '/pages/product/product?id=' + this.goodsdata._id,
					success: () => {
						console.log(this.$t('productDetail.shareSuccess'));
					},
					fail: (err) => {
						console.error(err);
					}
				}
			}
			return {
				title: this.$t('home.shareTitle'),
				imageUrl: '../../static/logo.png',
			}
		},
		onShow() { this.refreshShareIdentity(); this.delivery = getDelivery(); this.initDelivery(); },
		onUnload() { this.freightRequest++; this._entryClosed = true; if (this.$refs.poster) this.$refs.poster.invalidate(); },
		onLoad(e) {
			this.usname = this.$t('productDetail.anonymousUser');
			this._entryTask = resolveProductEntry(e).then(async ({ goodsId, sharerId }) => {
				if (this._entryClosed) return;
				this.goods_id = goodsId;
				await this.goodsList(goodsId);
				if (this._entryClosed) return;
				if (sharerId) uni.setStorageSync('dicrID', sharerId);
				bindPendingReferral();
				this.receiveData();
				this.toFavorite();
				this.evaluateData(goodsId);
			}).catch(error => {
				if (!this._entryClosed) this.entryError = error.message || '商品码解析失败，请重试';
			});
			if (e.control == "true") {
				this.control = true;
				this.hours = Number(e.hours)
				this.minutes = Number(e.minutes)
				this.seconds = Number(e.seconds)
			} else {
				this.control = false;
			}
			// #ifdef MP-WEIXIN
			//获取搜索栏高度
			let menuButtonObject = wx.getMenuButtonBoundingClientRect();
			wx.getSystemInfo({
				success: res => {
					//导航高度
					let statusBarHeight = res.statusBarHeight;
					this.navTop = menuButtonObject.top;
					this.navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top -
						statusBarHeight) * 2;
				},
				fail(err) {
					console.log(err);
				}
			})
			// #endif

		},
		computed: {
			posterImage() { return mainImage(this.goodsdata); },
			visibleServices() {
				const services = this.goodsdata.goods_services;
				if (!Array.isArray(services)) return [];
				return services.map((service, index) => this.displayGoodsService(service, index))
					.filter(service => typeof service === 'string' && service.trim())
					.map(service => service.trim());
			},
			discountText() {
				const crossedPrice = Number(this.goodsdata.crossed_price || 0);
				const price = Number(this.minPrice);
				if (!Number.isFinite(crossedPrice) || !Number.isFinite(price) || price <= 0 || crossedPrice <= price) return '';
				const discount = Math.round((this.minPrice / crossedPrice) * 100) / 10;
				if (this.getCurrentLang() === 'en') {
					const percentOff = Math.max(0, Math.round((1 - this.minPrice / crossedPrice) * 100));
					return `${percentOff}% ${this.$t('productDetail.discountSuffix')}`;
				}
				return `${discount}${this.$t('productDetail.discountSuffix')}`;
			},
			freightText() {
				if (this.freightLoading) return this.$t('shipping.loading');
				if (this.freightError) return this.freightError;
				if (!this.delivery) return this.$t('shipping.selectRegion');
				if (!this.freightPreview) return this.$t('shipping.selectSku');
				return shippingText(this.freightPreview, (key, args) => this.$t(key, args));
			},
			freightHint() {
				if (!this.delivery || this.freightLoading || this.freightError) return '';
				return shippingHint(this.freightPreview, (key, args) => this.$t(key, args));
			}
		},
		methods: {
			openFreightInfo() {
				if (this.freightLoading) return;
				if (!this.delivery || this.freightPreview && !this.freightPreview.deliverable) { this.$refs.deliveryPicker.open(); return; }
				if (this.freightError) { this.refreshFreight(); return; }
				if (!this.freightPreview) { this.toggleSpec(1); return; }
				this.$refs.freightInfo.open();
			},
			changeFreightAddress() { this.$refs.freightInfo.close(); this.$refs.deliveryPicker.open(); },
			chooseFreightSpecs() { this.$refs.freightInfo.close(); this.toggleSpec(1); },
			formatFreightAmount(cents) { return (cents / 100).toFixed(2).replace(/\.00$/, ''); },
			refreshShareIdentity() {
				const uid = uniCloud.getCurrentUserInfo().uid || '';
				if (this.user_id !== uid && this.$refs.poster) this.$refs.poster.invalidate();
				this.user_id = uid;
				this.usname = this.$t('productDetail.anonymousUser');
				if (!uid) return;
				db.collection('uni-id-users').doc(uid).field('nickname').get().then(res => {
					if (this.user_id === uid) this.usname = (res.result.data[0] || {}).nickname || this.$t('productDetail.anonymousUser');
				}).catch(() => {});
			},
			async initDelivery() { try { this.delivery = await defaultDelivery(); await this.refreshFreight(); } catch(e) { this.freightError = this.$t('shipping.addressInvalid'); } },
			chooseDelivery(value) { this.delivery = value; this.refreshFreight(); },
			async refreshFreight() {
				const request = ++this.freightRequest;
				this.freightPreview = null; this.freightError = ''; this.freightLoading = false;
				if (!this.goodsdata._id || !this.delivery) return true;
				this.freightLoading = true;
				const uid = uniCloud.getCurrentUserInfo().uid || '';
				try {
					const result = await checkoutApi().previewFreight({ goods_id: this.goodsdata._id, sku_id: this.selectedSkuId || undefined, goods_suk: this.specSelected.length ? this.specSelected.map(v => v.name) : undefined, goods_num: this.numberl, goods_seckill: this.control, address_id: this.delivery.address_id || undefined, area_code: this.delivery.area_code });
					if (request !== this.freightRequest || uid !== (uniCloud.getCurrentUserInfo().uid || '')) return false;
					this.freightPreview = result;
					return result.deliverable;
				} catch(e) { if (request === this.freightRequest) this.freightError = checkoutError(e, key => this.$t(key)); return false; }
				finally { if (request === this.freightRequest) this.freightLoading = false; }
			},
			changeNav(e) {
				this.currentIndex = e.target.current
			},
			getCurrentLang() {
				const language = uni.getStorageSync('CURRENT_LANG') || this.$i18n.locale || 'zh-Hans';
				return String(language).indexOf('en') === 0 ? 'en' : 'zh-Hans';
			},
			displayLangText(item, key) {
				if (!item) return '';
				if (typeof item === 'string') return item;
				const langKey = this.getCurrentLang() === 'en' ? `${key}_en` : key;
				return item[langKey] || item[key] || '';
			},
			displayGoodsService(service, index) {
				const services = this.goodsdata.goods_services_en || [];
				return this.getCurrentLang() === 'en' ? (services[index] || service) : service;
			},
			couponScopeLabel(item) {
				if (item.allow_type === '所有商品' && item.user_type === '所有人') {
					return this.$t('productDetail.couponFullStore');
				}
				if (item.allow_type === '指定商品' && item.user_type === '所有人') {
					return this.$t('productDetail.couponSpecificGoods');
				}
				return this.$t('productDetail.couponSpecificUser');
			},
			couponValuePrefix(item) {
				return item.type === '满减' ? '￥' : '';
			},
			couponValueText(item) {
				if (item.type === '满减') {
					return item.price / 100;
				}
				if (this.getCurrentLang() === 'en') {
					return Math.max(0, Math.round(100 - Number(item.price || 0)));
				}
				return (item.price / 10).toFixed(1);
			},
			couponValueSuffix(item) {
				if (item.type === '满减') return '';
				return this.getCurrentLang() === 'en' ? '% off' : this.$t('productDetail.discountSuffix');
			},
			couponThresholdText(item) {
				return `${this.$t('productDetail.couponThresholdPrefix')}${item.order_amount / 100}${this.$t('productDetail.couponThresholdSuffix')}`;
			},
			couponMessage(message) {
				const messageMap = {
					'领取成功': this.$t('productDetail.claimSuccess')
				};
				return messageMap[message] || message;
			},
			showLoginExpired() {
				uni.showToast({
					title: this.$t('productDetail.loginExpired'),
					icon: 'none',
					duration: 1000
				});
				setTimeout(() => {
					uni.navigateTo({
						url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'
					});
				}, 1000);
			},
			goodsList(id) {
				uni.showLoading({
					title: this.$t('home.loading')
				})
				return db.collection("opendb-mall-goods").doc(id).get().then((res) => {
					const goods = res.result.data[0];
					if (!goods || goods.is_on_sale !== true) throw new Error('商品不存在或已下架');
					if (this._entryClosed) return;
					this.goodsdata = goods;
					if (!Array.isArray(this.goodsdata.goods_banner_imgs)) this.goodsdata.goods_banner_imgs = [];
					this.initDelivery()
					if (this.goodsdata.videos != null && this.goodsdata.videos.length > 0) {
						this.goodsdata.goods_banner_imgs.unshift(this.goodsdata.videos[0])
					}
					if (this.control) {
						this.minPrice = this.goodsdata.fs_suks.reduce(function(min, item) {
							var price = parseInt(item.price);
							return price < min ? price : min;
						}, Infinity);
					} else {
						this.minPrice = this.goodsdata.suks.reduce(function(min, item) {
							var price = parseInt(item.price);
							return price < min ? price : min;
						}, Infinity);
					}
				}).finally(() => uni.hideLoading());
			},
			//获取评价数据
			evaluateData(id) {
				db.collection("opendb-mall-comments,uni-id-users").where({
					"goods_id": id
				}).field(
					"goods_id,goods_suk,grade,content,create_date,user_id.nickname as usname,user_id.avatar_file as usimage"
				).get({
					getCount: true
				}).then((res) => {
					this.evaluateList = res.result.data
					// 评价总数
					this.evaluateNum = res.result.count;
					//好评总数
					db.collection("opendb-mall-comments").where({
						"goods_id": id,
						"grade": db.command.gt(2)
					}).get({
						getCount: true
					}).then((res) => {
						let evaluateGood = res.result.count;
						//好评率
						this.goodrate = Math.round((evaluateGood / this.evaluateNum) * 100);
					})
				})
			},
			// 加入购物车 —— 使用统一规格弹窗组件
			openCartSpec() {
				if (this.tokenData()) {
					this.showLoginExpired();
					return;
				}
				this.$refs.cartSpecPopup.open(this.goodsdata, this.goodsdata);
			},
			//规格弹窗开关（立即购买/规格选择）
			toggleSpec(e) {
				if (this.tokenData()) {
					this.showLoginExpired();
				} else {
					this.createOrder = e == 0;
					this.$refs.buySpecPopup.open(this.goodsdata, this.goodsdata, {
						specSelected: this.specSelected,
						numberl: this.numberl
					});
				}
			},
			async handleSpecConfirm(payload) {
				this.specSelected = payload.specSelected;
				this.numberl = payload.numberl;
				this.selectedSkuId = payload.sku_id || '';
				const deliverable = await this.refreshFreight();
				if (this.createOrder && !deliverable) { uni.showToast({ title: this.freightError || this.$t('shipping.blocked'), icon: 'none' }); return; }
				if (this.createOrder && payload.suks_price) {
					let suk = this.specSelected.map(item => item.name)
					let goodsData = [{
						id: this.goods_id,
						num: this.numberl,
						seckill: this.control,
						suk: {
							sku_id: payload.sku_id,
							price: payload.suks_price,
							specs: suk
						}
					}]
					uni.navigateTo({
						url: `/pages/order/createOrder?suk=${JSON.stringify(goodsData)}&&motion=${(this.goodsdata.crossed_price * this.numberl)-(payload.suks_price*this.numberl)}&control=${this.control}&delivery=1`
					})
				}
			},
			popup() {
				if (this.tokenData()) {
					this.showLoginExpired();
				} else {
					this.$refs.popup.open();
				}
			},
			// 优惠卷
			couponData() {
				uni.showLoading({
					title: this.$t('home.loading')
				})
				this.$func.myFunction('jlg-cart', {
						functionName: 'coupondata',
						data: {
							e: 0
						}
					}).then(res => {
						this.couponList = res.result;
						this.couponList.forEach((item) => {
							if (this.receiveId.includes(item._id)) {
								item.states = false;
							} else {
								item.states = true;
							}
						});
						uni.hideLoading()
					})
					.catch(error => {
						uni.hideLoading()
						console.error(error);
					});
			},
			receiveData() {
				uni.showLoading({
					title: this.$t('home.loading')
				})
				db.collection("jlg-goods-coupon").where({
					"user_id": this.user_id,
					"is_use": false
				}).get().then((res) => {
					let Newdata = res.result.data;
					Newdata.forEach((item) => {
						this.receiveId.push(item.coupon_id)
					})
					this.couponData();
				})
			},
			async addCoupon(id, maxnum, yl_num, fx_num, usertype, usarr) {
				if (this.tokenData()) {
					this.showLoginExpired();
				} else {
					this.$func.myFunction('jlg-cart', {
							functionName: 'addCoupon',
							data: {
								"id": id,
								"maxnum": maxnum,
								"yl_num": yl_num,
								"fx_num": fx_num,
								"usertype": usertype,
								"usarr": usarr,
								"user_id": this.user_id
							}
						}).then(res => {
							if (res.result.message == '领取成功') {
								setTimeout(() => this.receiveData(), 1600)
							}
								uni.showToast({
									title: this.couponMessage(res.result.message),
									icon: "none",
									duration: 1600
							});
							return;
						})
						.catch(error => {
							console.error(error);
						});
				}
			},
			formatDate(timestamp) {
				const date = new Date(timestamp);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			//收藏
			toFavorite(add) {
				db.collection("jlg-goods-collect").where({
					"user_id": this.user_id,
					"article_id": this.goods_id
				}).get().then((res) => {
					const hasFavorite = res.result.data.length > 0;
					this.favorite = hasFavorite;
					if (!add) return;
					if (this.tokenData()) {
						this.showLoginExpired();
						return;
					}
					if (!hasFavorite) {
						db.collection("jlg-goods-collect").add({
							"article_id": this.goods_id
						}).then(() => {
							uni.showToast({
								title: this.$t('productDetail.favoriteAdded'),
								icon: "none",
								duration: 1600
							})
							this.favorite = true
						})
						return;
					}
					db.collection("jlg-goods-collect").where({
						"user_id": this.user_id,
						"article_id": this.goods_id
					}).remove().then(() => {
						uni.showToast({
							title: this.$t('productDetail.favoriteRemoved'),
							icon: "none",
							duration: 1600
						})
						this.favorite = false
					})
				})
			},
			//分享
			shareClick() {
				this.$refs.sharepopup.open()
			},
			select(e) {
				if (e.index == 0) return;
				if (this.tokenData()) { this.showLoginExpired(); return; }
				this.$refs.sharepopup.close();
				return this.$refs.poster.open();
			},
			delayed() {
				uni.showToast({
					title: this.$t('productDetail.seckillEnded'),
					icon: "none",
					duration: 2000
				})
				setTimeout(() => uni.navigateBack(), 2000)
			},
			//商品评价
			naTov(id) {
				uni.navigateTo({
					url: `/pages/order/refundDetail?id=${id}`
				})
			},
			tokenData() {
				//效验当前token是否已过期
				let xtime = Date.now();
				let ttime = uniCloud.getCurrentUserInfo().tokenExpired;
				let uid = uniCloud.getCurrentUserInfo().uid;
				if (xtime > ttime || uid == null) {
					return true
				} else {
					return false
				}
			},
			navigator(type, goodsArr, name) {
				if (this.tokenData()) {
					this.showLoginExpired();
				} else {
					const couponName = encodeURIComponent(name);
					if (type == "所有商品") {
						uni.navigateTo({
							url: `/pages/coupon/prefeList?goodsArr=${null}&&name=${couponName}`
						})
					} else {
						uni.navigateTo({
							url: `/pages/coupon/prefeList?goodsArr=${JSON.stringify(goodsArr)}&&name=${couponName}`
						})
					}
				}
			},
			buy() {
				uni.navigateTo({
					url: `/pages/order/createOrder`
				})
			},
			goBack() {
				uni.navigateBack()
			},
			showClick(e) {
				this.show = e;
			}
		},
	}
</script>

<style lang='scss'>
	page {
		background: $brand-surface;
		padding-bottom: 160rpx;
	}

	.b-b {
		border-bottom: 1rpx solid $brand-border;
	}

	.icon-uniE003 {
		font-size: 26rpx;
		color: $brand-muted;
	}

	.name {
		margin-bottom: 11rpx;
	}

	.swiper-list {
		height: 750rpx;
	}

	.swiper {
		height: 750rpx;
		position: relative;
	}

	/* 秒杀信息条 */
	.search-backurl {
		position: relative;
		padding: 20rpx 32rpx;
		background: $brand-black;
	}

	.backimg {
		width: 100%;
		height: 125rpx;
		/* #ifdef MP-WEIXIN */
		height: 120rpx;
		/* #endif */
		position: absolute;
		left: 0;
		top: 0;
		z-index: 0;
	}

	/* 轮播图数字指示器 */
	.current {
		position: absolute;
		bottom: 24rpx;
		right: 24rpx;
		background-color: rgba(32, 35, 33, 0.45);
		color: $brand-surface;
		text-align: center;
		border-radius: 999rpx;
		padding: 4rpx 20rpx;
		box-sizing: border-box;
		font-size: 24rpx;
	}

	.swiperImg {
		width: 100%;
		height: 100%;
	}

	/* 信息卡片 */
	.list-item {
		width: 100%;
		padding: 28rpx 32rpx;
		box-sizing: border-box;
		background: $brand-surface;
	}

	/* 商品名称 */
	.product-name {
		font-size: 30rpx;
		font-weight: $font-product-title-weight;
		color: $brand-black;
		line-height: 1.45;
		flex: 1;
	}

	/* 分享按钮 */
	.share-btn {
		background: transparent !important;
		width: 56rpx;
		height: 56rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		margin-left: 16rpx;
		flex-shrink: 0;
		border: none !important;
	}

	/* 限时秒杀标签 */
	.deal-tip {
		font-size: $font-meta;
		color: $brand-primary;
		border: 1rpx solid $brand-primary;
		line-height: 1;
		padding: 5rpx 12rpx;
		margin-left: 16rpx;
	}

	/* 秒杀区白色小标签 */
	.seckill-tag {
		font-size: $font-meta;
		color: $brand-surface;
		border: 1rpx solid rgba(255, 255, 255, 0.5);
		line-height: 1;
		padding: 5rpx 12rpx;
	}

	/* 折扣标签 */
	.deal-tips {
		font-size: $font-meta;
		color: $brand-muted;
		border: 1rpx solid $brand-light-muted;
		line-height: 1;
		padding: 5rpx 12rpx;
	}

	.list-title-left {
		width: 110rpx;
		text-align: left;
		color: $brand-muted;
		font-size: $font-body;
	}

	/* 外层只画一次轮廓，让双按钮接缝和两端弧线保持连续。 */
	.footer-actions {
		display: flex;
		flex: 1;
		min-width: 0;
		border: 1rpx solid $brand-action;
		border-radius: $brand-button-radius;
		overflow: hidden;
		background: $brand-surface;
	}

	/* 加入购物车按钮（次按钮） */
	.footer-left {
		@include shop-button(secondary);
	}

	/* 立即购买按钮（主按钮） */
	.footer-right {
		@include shop-button(primary);
	}

	/* 秒杀立即购买按钮 */
	.footer-rights {
		@include shop-button(primary);
	}

	.footer-actions button {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		min-width: 0;
		min-height: 88rpx;
		margin: 0;
		padding: 20rpx 12rpx;
		border: 0;
		border-radius: 0;
		font-size: $font-product-title;
		font-weight: $font-product-title-weight;
		line-height: 1.4;
		// 焦点环放在按钮内部，避免被胶囊裁切。
		&:focus-visible { outline-offset: -6rpx; outline-color: $brand-black; }
	}

	/* 优惠券标签 */
	.coupon-btn {
		background-color: transparent;
		border: 1rpx solid $brand-primary;
		margin-right: 10rpx;
		font-size: $font-meta;
		padding: 5rpx 12rpx;
		color: $brand-primary;
		line-height: 1;
	}

	/* 评价区域 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 28rpx 32rpx;
		background: $brand-surface;
		margin-top: 2rpx;

		.e-header {
			display: flex;
			align-items: center;
			height: 60rpx;
			font-size: $font-meta;
			color: $brand-muted;

			.tit {
				font-size: $font-product-title;
				font-weight: $font-product-title-weight;
				color: $brand-black;
				margin-right: 6rpx;
			}

			.tip {
				flex: 1;
				text-align: right;
				color: $brand-muted;
			}

			.icon-uniE003 {
				margin-left: 8rpx;
			}
		}
	}

	.eva-box {
		display: flex;
		padding: 20rpx 0;

		.portrait {
			width: 72rpx;
			height: 72rpx;
			border-radius: 50%;
			flex-shrink: 0;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding-left: 24rpx;
			font-size: $font-body;
			color: $brand-text;

			.con {
				font-size: $font-body;
				padding: 14rpx 0;
				color: $brand-text;
				line-height: 1.6;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				color: $brand-muted;
				font-size: $font-meta;
			}
		}
	}

	/* 图文详情 */
	.detail-desc {
		background: $brand-surface;
		margin-top: 2rpx;
		padding-bottom: 100rpx;

		.d-header {
			display: flex;
			font-size: $font-body;
			font-weight: $font-body-weight;
			letter-spacing: 2rpx;
			align-items: center;
			justify-content: center;
			color: $brand-muted;
			position: relative;
			height: 88rpx;

			text {
				background: $brand-surface;
				padding: 0 24rpx;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300rpx;
				height: 0;
				content: '';
				border-bottom: 1rpx solid $brand-border;
			}
		}
	}

	/* 底部操作栏 */
	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		padding: 20rpx 24rpx;
		background: $brand-surface;
		border-top: 1rpx solid $brand-border;
		padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	}
	.footer-content { display: flex; align-items: center; gap: 24rpx; width: 100%; }
	.footer-shortcuts { display: flex; flex-shrink: 0; }

	/* 底部快捷入口图标 */
	.footer-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: $font-meta;
		color: $brand-muted;
		width: 72rpx;
		min-height: 88rpx;
		gap: 4rpx;

		.iconfont {
			font-size: 40rpx;
			line-height: 40rpx;
			color: $brand-muted;
		}

		&.active,
		&.active .iconfont {
			color: $brand-primary;
		}
	}

	/* 优惠券弹窗 */
	.coupon-diej {
		position: absolute;
		right: 0;
		top: 0;
		background: $brand-muted;
		color: $brand-surface;
		z-index: 99;
		font-size: $font-meta;
		padding: 5rpx 10rpx;
		border-top-right-radius: 8rpx;
		border-bottom-left-radius: 8rpx;
	}

	.coupon-z {
		font-size: 36rpx;
		font-weight: 600;
	}

	.coupon-cen {
		height: 60vh;
		padding: 20rpx;
	}

	.coupon-van {
		width: 100%;
		height: 200rpx;
		background: $brand-surface;
		border-radius: 8rpx;
		border: 1rpx solid $brand-border;
		position: relative;
		margin-top: 16rpx;
	}

	.coupon-letf {
		position: absolute;
		left: 0;
		top: 0;
		width: 67%;
	}

	.coupon-icqc {
		height: 36rpx;
		background: $brand-primary;
		border-radius: 4rpx;
		color: $brand-surface;
		padding: 0 12rpx;
		line-height: 36rpx;
		font-size: $font-meta;
		margin-top: 30rpx;
		margin-left: 20rpx;
		margin-right: 10rpx;
	}

	.coupon-name {
		font-size: 30rpx;
		line-height: 85rpx;
		color: $brand-black;
		font-weight: $font-product-title-weight;
	}

	.coupon-righ {
		width: 33%;
		height: 100%;
		background: $brand-primary;
		position: absolute;
		right: 0;
		border-bottom-right-radius: 8rpx;
		border-top-right-radius: 8rpx;
		color: $brand-surface;
		text-align: center;
	}

	.coupon-qian {
		font-size: 52rpx;
		font-weight: 600;
		margin-top: 8rpx;
	}

	.coupon-lqsy {
		font-size: $font-meta;
		height: 36rpx;
		background: $brand-surface;
		border-radius: 4rpx;
		color: $brand-primary;
		line-height: 36rpx;
		margin: 12rpx auto auto auto;
		width: 120rpx;
		text-align: center;
	}

	button::after {
		border: none;
	}

	/* 微信小程序自定义顶部返回 */
	.navbar {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
	}

	.navbar .navbar-title {
		background: rgba(255, 255, 255, 0.82);
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		position: fixed;
		left: 20rpx;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		overflow: hidden;
	}

	.navbar .navbar-return {
		width: 70rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		position: fixed;
		left: 0;
	}

	.navbar .icon-arrow-left {
		font-size: 36rpx;
		color: $brand-black;
	}

	.minprice {
		&:before {
			content: '￥';
			font-size: $font-meta;
			margin: 0 2rpx 0 -4rpx;
		}
	}

	/* 覆盖 jlg-minPrice 组件内 ¥ 前缀字号，与 maxSize 比例协调 */
	.list-item .minprices::before {
		font-size: 28rpx;
	}

	.product-price-pair {
		align-items: flex-end;
		line-height: 1;

		.price-original {
			margin-bottom: 6rpx;
		}
	}

	/* 划线原价 */
	.price-original {
		font-family: $brand-price-font;
		font-size: 26rpx;
		font-weight: $font-meta-weight;
		color: $brand-muted;
		text-decoration: line-through;
		line-height: 32rpx;

		&::before {
			content: '¥';
			font-family: inherit;
			font-size: 24rpx;
			margin-right: 1rpx;
		}
	}
</style>

<style scoped>
.delivery-row { display: flex; align-items: center; gap: 20rpx; padding: 26rpx 0 0; font-size: 28rpx; color: #515c56; min-height: 48rpx; }.delivery-region-name { flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: #252b28; }
</style>

<style scoped>
.freight-row { display: flex; align-items: flex-start; gap: 0; padding: 26rpx 0 0; min-height: 80rpx; }
.freight-row--border { padding-bottom: 25rpx; border-bottom: 1px solid #ededed; }
.freight-label { width: 96rpx; flex-shrink: 0; color: #68736c; font-size: 28rpx; line-height: 42rpx; }
.freight-content { flex: 1; min-width: 0; }
.freight-price { display: block; color: #252b28; font-size: 28rpx; line-height: 42rpx; }
.freight-hint { display: block; margin-top: 4rpx; color: #3e775c; font-size: 24rpx; line-height: 36rpx; }
.freight-arrow { margin-left: 20rpx; color: #77817a; line-height: 42rpx; font-size: 36rpx; }
.freight-row:focus-visible { outline: 2px solid #3e775c; outline-offset: 4px; }
.freight-sheet { padding: 32rpx; padding-bottom: calc(32rpx + env(safe-area-inset-bottom)); color: #252b28; }
.freight-sheet-heading { display: flex; align-items: center; justify-content: space-between; gap: 24rpx; margin-bottom: 28rpx; }
.freight-sheet-title { font-size: 34rpx; font-weight: 600; }
.freight-close { margin: 0; color: #526057; background: transparent; font-size: 26rpx; }
.freight-sheet-body { max-height: 60vh; }
.freight-rule { padding-bottom: 26rpx; font-size: 28rpx; line-height: 1.6; }
.freight-rule-label { display: block; margin-bottom: 8rpx; font-size: 24rpx; color: #647168; }
.freight-rule-note { display: block; margin-top: 8rpx; font-size: 24rpx; color: #647168; line-height: 1.6; }
.freight-change-address { display: block; width: fit-content; margin: 10rpx 0 0; padding: 0; background: transparent; font-size: 26rpx; color: #3e775c; text-align: left; }
.freight-confirm { margin-top: 28rpx; background: #3e775c; color: #fff; font-size: 28rpx; border-radius: 12rpx; }
</style>
