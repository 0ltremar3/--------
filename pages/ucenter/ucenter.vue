<template>
	<view class="uc-page">

		<!-- ── Hero 沉浸式头图 ── -->
		<view class="uc-hero">
			<image class="uc-hero-img" src="../../static/temp/grzx.jpg" mode="aspectFill"/>
			<view class="uc-hero-gradient"/>
			<view class="uc-hero-content" @click="toUserInfo">
				<text class="uc-hi">Hi,</text>
				<view class="uc-name-row">
					<text class="uc-name">
						<!-- #ifdef MP-WEIXIN -->
						<block v-if="hasLogin">{{ userDisplayName }}</block>
						<block v-else>{{ $t('ucenter.login') }}</block>
						<!-- #endif -->
						<!-- #ifndef MP-WEIXIN -->
						{{ hasLogin ? userDisplayName : $t('ucenter.login') }}
						<!-- #endif -->
					</text>
					<image class="uc-edit-icon" src="/static/icons/edit.svg" mode="aspectFit"/>
				</view>
			</view>
		</view>

		<view class="uc-body">

			<!-- ── 我的订单 ── -->
			<view class="uc-card">
				<view class="uc-card-header" @click="navTo('/pages/order/order?state=99')">
					<text class="text-section-title">{{ $t('ucenter.myOrders') }}</text>
					<view class="uc-header-right">
						<text class="text-meta">{{ $t('ucenter.all') }}</text>
						<image class="uc-chevron" src="/static/icons/chevron.svg" mode="aspectFit"/>
					</view>
				</view>
				<view class="uc-order-row">
					<view class="uc-order-item" @click="navTo('/pages/order/order?state=0')" hover-class="uc-hover" :hover-stay-time="50">
						<view class="uc-order-icon">
							<image class="ds-icon-lg" src="/static/icons/payment.svg" mode="aspectFit"/>
							<view v-if="items[0] > 0" class="uc-badge-wrap">
								<uv-badge type="error" :max="99" :value="items[0]" :custom-style="orderBadgeStyle"/>
							</view>
						</view>
						<text class="uc-order-label">{{ $t('ucenter.pendingPay') }}</text>
					</view>
					<view class="uc-order-item" @click="navTo('/pages/order/order?state=1')" hover-class="uc-hover" :hover-stay-time="50">
						<view class="uc-order-icon">
							<image class="ds-icon-lg" src="/static/icons/delivery.svg" mode="aspectFit"/>
							<view v-if="items[1] > 0" class="uc-badge-wrap">
								<uv-badge type="error" :max="99" :value="items[1]" :custom-style="orderBadgeStyle"/>
							</view>
						</view>
						<text class="uc-order-label">{{ $t('ucenter.pendingReceive') }}</text>
					</view>
					<view class="uc-order-item" @click="navTo('/pages/order/order?state=5')" hover-class="uc-hover" :hover-stay-time="50">
						<view class="uc-order-icon">
							<image class="ds-icon-lg" src="/static/icons/review.svg" mode="aspectFit"/>
							<view v-if="items[2] > 0" class="uc-badge-wrap">
								<uv-badge type="error" :max="99" :value="items[2]" :custom-style="orderBadgeStyle"/>
							</view>
						</view>
						<text class="uc-order-label">{{ $t('ucenter.pendingReview') }}</text>
					</view>
					<view class="uc-order-item" @click="navTo('/pages/order/order?state=6')" hover-class="uc-hover" :hover-stay-time="50">
						<view class="uc-order-icon">
							<image class="ds-icon-lg" src="/static/icons/refund.svg" mode="aspectFit"/>
							<view v-if="items[3] > 0" class="uc-badge-wrap">
								<uv-badge type="error" :max="99" :value="items[3]" :custom-style="orderBadgeStyle"/>
							</view>
						</view>
						<text class="uc-order-label">{{ $t('ucenter.refund') }}</text>
					</view>
				</view>
			</view>

			<!-- ── 浏览历史（有记录才显示） ── -->
			<view class="uc-card" v-if="recordList.length > 0">
				<view class="uc-history-header">
					<image class="ds-icon-sm" src="/static/icons/history.svg" mode="aspectFit"/>
					<text class="uc-history-title">{{ $t('ucenter.browsingHistory') }}</text>
				</view>
				<scroll-view class="uc-history-scroll" scroll-x>
					<image
						v-for="(item, index) in recordList" :key="index"
						class="uc-history-img"
						:src="item.image[0]"
						mode="aspectFill"
						@click="navigator(item.goodsId[0])"
					/>
				</scroll-view>
			</view>

			<!-- ── 服务功能网格 ── -->
			<view class="uc-card uc-grid-card">
				<view class="uc-grid">

				<!-- 会员中心（暂时隐藏）
				<view class="uc-grid-item" @tap="jumpToUrl" :data-url="vipurl" hover-class="uc-hover" :hover-stay-time="50">
					<image class="ds-icon-md" src="/static/icons/member.svg" mode="aspectFit"/>
					<text class="uc-grid-label">会员中心</text>
				</view>
				-->

					<view class="uc-grid-item" @tap="jumpToUrl" data-url="/pages/coupon/coupon" hover-class="uc-hover" :hover-stay-time="50">
						<image class="ds-icon-md" src="/static/icons/coupon.svg" mode="aspectFit"/>
						<text class="uc-grid-label">{{ $t('ucenter.couponCenter') }}</text>
					</view>

					<view class="uc-grid-item" @tap="jumpToUrl" data-url="/pages/address/list" hover-class="uc-hover" :hover-stay-time="50">
						<image class="ds-icon-md" src="/static/icons/address.svg" mode="aspectFit"/>
						<text class="uc-grid-label">{{ $t('ucenter.addressManage') }}</text>
					</view>

					<!-- #ifndef APP -->
					<view class="uc-grid-item" @tap="jumpToUrl" data-url="/jlg-use/distribution/list" hover-class="uc-hover" :hover-stay-time="50">
						<image class="ds-icon-md" src="/static/icons/distribution.svg" mode="aspectFit"/>
						<text class="uc-grid-label">{{ $t('ucenter.distributionCenter') }}</text>
					</view>
					<!-- #endif -->

				<!-- #ifdef MP-WEIXIN -->
				<view class="uc-grid-item" hover-class="uc-hover" :hover-stay-time="50">
					<button class="uc-btn-reset" open-type="contact" @contact="contactClick">
						<image class="ds-icon-md" src="/static/icons/service.svg" mode="aspectFit"/>
						<text class="uc-grid-label">{{ $t('ucenter.contactService') }}</text>
					</button>
				</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="uc-grid-item" hover-class="uc-hover" :hover-stay-time="50">
					<button class="uc-btn-reset" @click="gzhClick">
						<image class="ds-icon-md" src="/static/icons/service.svg" mode="aspectFit"/>
						<text class="uc-grid-label">{{ $t('ucenter.contactService') }}</text>
					</button>
				</view>
				<!-- #endif -->

					<view class="uc-grid-item" @tap="jumpToUrl" data-url="/pages/collect/collect" hover-class="uc-hover" :hover-stay-time="50">
						<image class="ds-icon-md" src="/static/icons/favorites.svg" mode="aspectFit"/>
						<text class="uc-grid-label">{{ $t('ucenter.myFavorites') }}</text>
					</view>

					<view class="uc-grid-item" @tap="jumpToUrl" data-url="/jlg-use/problem/problem" hover-class="uc-hover" :hover-stay-time="50">
						<image class="ds-icon-md" src="/static/icons/faq.svg" mode="aspectFit"/>
						<text class="uc-grid-label">{{ $t('ucenter.faq') }}</text>
					</view>

				<view class="uc-grid-item" @tap="jumpToUrl" data-url="/pages/ucenter/settings/settings" hover-class="uc-hover" :hover-stay-time="50">
					<image class="ds-icon-md" src="/static/icons/settings.svg" mode="aspectFit"/>
					<text class="uc-grid-label">{{ $t('ucenter.settings') }}</text>
				</view>

				<view class="uc-grid-item" @tap="jumpToUrl" data-url="/pages/ucenter/about/about" hover-class="uc-hover" :hover-stay-time="50">
					<image class="ds-icon-md" src="/static/icons/about.svg" mode="aspectFit"/>
					<text class="uc-grid-label">{{ $t('ucenter.aboutUs') }}</text>
				</view>

			</view>
		</view>

			<view style="height: 120rpx;"/>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	import { store } from '@/uni_modules/uni-id-pages/common/store.js';

	export default {
		data() {
			return {
				orderBadgeStyle: {
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					boxSizing: 'border-box',
					minWidth: '32rpx',
					height: '32rpx',
					padding: '0 7rpx',
					border: '3rpx solid #FFFFFF',
					fontSize: '20rpx',
					fontWeight: '500',
					lineHeight: '1',
					textAlign: 'center',
					fontVariantNumeric: 'tabular-nums',
					backgroundColor: '#F06464'
				},
				user_id: uniCloud.getCurrentUserInfo().uid,
				recordList: [],
				items: [0, 0, 0, 0],
				uservipList: [],
				membershipLevel: null,
				vipurl: '/jlg-use/member/mymember'
			}
		},
		onShow() {
			const session = uniCloud.getCurrentUserInfo();
			this.user_id = session.tokenExpired > Date.now() ? session.uid : '';
			this.recordList = [];
			this.items = [0, 0, 0, 0];
			this.uservipList = [];
			this.membershipLevel = null;
			this.vipurl = '/jlg-use/member/mymember';
			if (!this.user_id) return;
			this.recordData();
			this.uservipData();
			this.loadOrderBadges();
		},
		computed: {
			userInfo() { return store.userInfo },
			hasLogin()  { return store.hasLogin && !!this.user_id },
			userDisplayName() {
				const userInfo = this.userInfo || {};
				return userInfo.nickname || userInfo.username || userInfo.mobile || this.$t('ucenter.guestName');
			}
		},
		methods: {
			loadOrderBadges() {
				const counts = [0, 0, 0, 0];
				db.collection('uni-pay-orders').where({
					user_id: this.user_id,
					type: 'goods'
				}).field('type,status,custom').get().then(res => {
					res.result.data.forEach(o => {
						if (o.status === 0 && !o.custom)          counts[0]++;
						if ([1, 4].includes(o.status))            counts[1]++;
						if (o.status === 5)                       counts[2]++;
						if (o.status === 6)                       counts[3]++;
					});
					this.items = counts;
				});
			},
			uservipData() {
				db.collection('jlg-member').where({ user_id: this.user_id }).get().then(res => {
					this.uservipList = res.result.data;
					if (this.uservipList.length > 0 && this.uservipList[0].failure_time > Date.now()) {
						this.membershipLevel = this.uservipList[0].grade;
						this.vipurl = '/jlg-use/member/mymemberkt';
					}
				});
			},
			recordData() {
				db.collection('jlg-goods-record,opendb-mall-goods').where({
					user_id: this.user_id,
					'goods_id.is_on_sale': true
				}).field('goods_id.goods_thumb as image,modify_date,goods_id._id as goodsId')
				  .orderBy('modify_date desc').limit(20).get().then(res => {
					this.recordList = res.result.data;
				});
			},
			jumpToUrl(e) {
				uni.navigateTo({ url: e.currentTarget.dataset.url });
			},
			navTo(url) {
				uni.navigateTo({ url });
			},
			toUserInfo() {
				uni.navigateTo({ url: '/uni_modules/uni-id-pages/pages/userinfo/userinfo' });
			},
			navigator(id) {
				uniCloud.callFunction({ name: 'jlg-record', data: { user_id: this.user_id, id } })
					.catch(() => {});
				uni.navigateTo({ url: `/pages/product/product?id=${id}` });
			},
			gzhClick() {
				uni.showModal({
					title: this.$t('ucenter.jumpTitle'),
					content: this.$t('ucenter.jumpContent'),
					success(res) {
						if (res.confirm) {
							window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzkwNzUyMjMxOQ==#wechat_redirect';
						}
					}
				});
			},
			contactClick(e) { console.log(e); }
		}
	}
</script>

<style lang="scss">
	@import '@/static/common/common.scss';

	page { background-color: $brand-bg; }

	/* ── Hero ── */
	.uc-hero {
		position: relative;
		width: 100%;
		height: 460rpx;
		overflow: hidden;
	}
	.uc-hero-img {
		width: 100%;
		height: 100%;
	}
	.uc-hero-gradient {
		position: absolute;
		left: 0; right: 0; bottom: 0;
		height: 220rpx;
		background: linear-gradient(to top, rgba(0,0,0,.52) 0%, transparent 100%);
	}
	.uc-hero-content {
		position: absolute;
		left: 40rpx;
		bottom: 44rpx;
	}
	.uc-hi {
		display: block;
		font-size: 28rpx;
		font-weight: 400;
		color: rgba(255,255,255,.75);
		letter-spacing: 0.06em;
		line-height: 1.4;
	}
	.uc-name-row {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-top: 4rpx;
	}
	.uc-name {
		font-size: 40rpx;
		font-weight: 600;
		color: #ffffff;
		letter-spacing: 0.02em;
		line-height: 1.25;
	}
	.uc-edit-icon {
		width: 32rpx;
		height: 32rpx;
		opacity: .65;
		/* 小程序 SVG 中 stroke 颜色是 #202321，叠在白色文字旁需要提亮，用 filter 反色 */
		filter: invert(1) brightness(2);
	}

	/* ── Body ── */
	.uc-body {
		padding: 0;
	}
	.uc-card {
		background: $brand-surface;
		margin-bottom: 16rpx;
	}

	/* ── 卡片标题行 ── */
	.uc-card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 32rpx 32rpx 24rpx;
		border-bottom: 0.5rpx solid $brand-border;
	}
	.uc-header-right {
		display: flex;
		align-items: center;
		gap: 6rpx;
	}
	.uc-chevron {
		width: 28rpx;
		height: 28rpx;
		opacity: .45;
	}

	/* ── 订单状态行 ── */
	.uc-order-row {
		display: flex;
		align-items: flex-start;
		justify-content: space-around;
		padding: 32rpx 16rpx 36rpx;
	}
	.uc-order-item {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14rpx;
		flex: 1;
	}
	.uc-order-label {
		font-size: 24rpx;
		color: $brand-text;
		line-height: 1;
	}
	.uc-order-icon {
		position: relative;
		width: 52rpx;
		height: 52rpx;
		flex-shrink: 0;
	}
	.uc-badge-wrap {
		position: absolute;
		top: 0;
		right: 0;
		transform: translate(45%, -30%);
		pointer-events: none;
	}

	/* ── 浏览历史 ── */
	.uc-history-header {
		display: flex;
		align-items: center;
		gap: 14rpx;
		padding: 28rpx 32rpx 20rpx;
		border-bottom: 0.5rpx solid $brand-border;
	}
	.uc-history-title {
		font-size: 28rpx;
		font-weight: 500;
		color: $brand-text;
	}
	.uc-history-scroll {
		padding: 20rpx 32rpx 28rpx;
		white-space: nowrap;
	}
	.uc-history-img {
		display: inline-block;
		width: 140rpx;
		height: 140rpx;
		border-radius: 4rpx;
		margin-right: 16rpx;
		background: $brand-image-bg;
	}

	/* ── 服务网格 ── */
	.uc-grid-card {
		padding: 8rpx 0 16rpx;
	}
	.uc-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
	}
	.uc-grid-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16rpx;
		padding: 36rpx 12rpx;
		background: transparent;
	}
	.uc-grid-label {
		font-size: 24rpx;
		color: $brand-text;
		line-height: 1;
	}

	/* button reset（客服按钮内层） */
	.uc-btn-reset {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16rpx;
		background: transparent !important;
		border: none !important;
		padding: 0 !important;
		margin: 0 !important;
		line-height: 1 !important;
		font-size: 24rpx !important;
		color: $brand-text !important;
		width: 100%;
	}
	.uc-btn-reset::after { border: none !important; }

	/* hover 反馈 */
	.uc-hover { opacity: .55; }
</style>
