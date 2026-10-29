<template>
	<view class="cart-page">

		<!-- 顶部导航 -->
		<view class="cart-nav">
			<text class="cart-nav__title">{{ $t('cart.brandName') }}</text>
			<text class="cart-nav__action" :class="manage ? 'cart-nav__action--active' : ''" @click="manageClick">
				{{ manage ? $t('cart.done') : $t('cart.manage') }}
			</text>
		</view>

		<!-- 空状态 -->
		<view v-if="empty" class="cart-empty">
			<uv-empty marginTop="150" mode="data" icon="/static/temp/shwk.png" :text="$t('cart.empty')">
				<view @click="naTov" class="cart-empty__btn">{{ $t('cart.goShopping') }}</view>
			</uv-empty>
		</view>

		<!-- 商品列表 -->
		<view v-else class="cart-list">
			<view v-for="(item, index) in cartList" :key="index">

				<!-- 失效商品 -->
				<view v-if="!item.efficacy" class="cart-item cart-item--expired">
					<view class="cart-item__inner">
						<view class="cart-item__img-wrap">
							<image class="cart-item__img" @click="navigator(item.id[0], item.goods_seckill)"
								:src="item.image[0]" mode="aspectFill" style="opacity: 0.4;"></image>
							<view class="cart-item__expired-badge">{{ $t('cart.expired') }}</view>
						</view>
						<view class="cart-item__body">
							<text class="cart-item__name cart-item__name--expired"
								@click="navigator(item.id[0], item.goods_seckill)">{{ item.title[0] }}</text>
							<view class="cart-item__attr" @click="navigator(item.id[0], item.goods_seckill)">
								<text class="cart-item__suk" v-for="(items, si) in item.goods_suk.specs" :key="si">{{ items }}</text>
							</view>
							<view class="cart-item__bottom">
								<jlg-minPrice @click="navigator(item.id[0], item.goods_seckill)"
									:min-price="item.goods_suk.price" maxSize="30rpx"></jlg-minPrice>
								<uni-number-box background="#F7F8F5" class="step" :step="1" :min="1"
									:max="item.stock[0]" v-model="item.goods_number" @change="calcTotal"
									disabled="false"></uni-number-box>
							</view>
						</view>
					</view>
				</view>

				<!-- 正常商品 -->
				<view v-else class="cart-item">
					<view class="cart-item__inner">
						<view class="cart-item__check-wrap">
							<view class="cart-checkbox iconfont icon-uniE00d"
								:class="{ checked: item.checked }"
								@click="check('item', index)"></view>
						</view>
						<image @click="navigator(item.id[0], item.goods_seckill)"
							class="cart-item__img" :src="item.image[0]" mode="aspectFill"></image>
						<!-- #ifdef MP-WEIXIN -->
						<view class="cart-item__body">
						<!-- #endif -->
						<!-- #ifndef MP-WEIXIN -->
						<view class="cart-item__body cart-item__body--h5">
						<!-- #endif -->
							<text class="cart-item__name"
								@click="navigator(item.id[0], item.goods_seckill)">{{ item.title[0] }}</text>
							<view class="cart-item__attr" @click="navigator(item.id[0], item.goods_seckill)">
								<text class="cart-item__suk" v-for="(items, si) in item.goods_suk.specs" :key="si">{{ items }}</text>
							</view>
							<scroll-view @click="navigator(item.id[0], item.goods_seckill)"
								style="white-space: nowrap;" :show-scrollbar="false" scroll-x
								class="cart-item__services-scroll">
								<view class="cart-item__services">
									<view class="cart-item__service-tag" v-for="(give, gi) in item.services[0]" :key="gi">
										<text>{{ give }}</text>
									</view>
								</view>
							</scroll-view>
							<view v-if="item.goods_seckill" class="cart-item__seckill-tip"
								@click="navigator(item.id[0], item.goods_seckill)">
								<text>{{ $t('cart.seckillTip') }}</text>
							</view>
							<view class="cart-item__bottom">
								<jlg-minPrice @click="navigator(item.id[0], item.goods_seckill)"
									:min-price="item.goods_suk.price" maxSize="30rpx"></jlg-minPrice>
								<uni-number-box background="#F7F8F5" class="step" :step="1" :min="1"
									:max="item.stock[0]" v-model="item.goods_number"
									@change="calcTotal"></uni-number-box>
							</view>
						</view>
					</view>
				</view>

			</view>

			<!-- 底部结算栏 -->
			<view class="cart-footer">
				<view class="cart-footer__inner">
					<view class="cart-footer__left">
						<view class="cart-footer__all-check">
							<view class="cart-checkbox iconfont icon-uniE00d"
								:class="{ checked: allChecked }" @click="check('all')"></view>
							<text class="cart-footer__all-label">{{ $t('cart.selectAll') }}</text>
						</view>
						<view v-if="!manage" class="cart-footer__total">
							<view class="cart-footer__total-row">
								<text class="cart-footer__total-label">{{ $t('cart.total') }}</text>
								<jlg-minPrice :min-price="total" maxSize="32rpx" minSize="24rpx"></jlg-minPrice>
							</view>
							<text v-if="crossed_total > 0" class="cart-footer__discount">{{ $t('cart.discountPrefix') }} {{ (crossed_total / 100).toFixed(2) }} {{ $t('cart.yuan') }}</text>
						</view>
					</view>
					<button v-if="!manage"
					class="no-border cart-footer__btn"
					:class="{ 'cart-footer__btn--disabled': total <= 0 }"
					:disabled="total <= 0"
					@click="createOrder">{{ $t('cart.checkout') }}</button>
					<button v-else class="no-border cart-footer__btn cart-footer__btn--ghost"
						@click="deleteCartItem()">{{ $t('cart.remove') }}</button>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				total: 0, //总价格
				crossed_total: 0, //总优惠价
				allChecked: false, //全选状态  true|false
				empty: false, //空白页显示  true|false
				cartList: [], //购物车数据
				cartRequest: 0,
				user_id: uniCloud.getCurrentUserInfo().uid,
				manage: false
			};
		},
		onPullDownRefresh() {
			return this.loadData();
		},
		onShow() {
			//效验当前token是否已过期
			let xtime = Date.now();
			let ttime = uniCloud.getCurrentUserInfo().tokenExpired;
			let uid = uniCloud.getCurrentUserInfo().uid;
			if (xtime > ttime || uid == null) {
				this.cartRequest++;
				this.cartList = [];
				this.calcTotal();
				uni.hideLoading();
				uni.stopPullDownRefresh();
				uni.showToast({
					title: this.$t('cart.loginExpired'),
					icon: "none",
					duration: 1000
				})
				setTimeout(() => {
					uni.navigateTo({
						url: `/uni_modules/uni-id-pages/pages/login/login-withoutpwd`
					})
				}, 1000)
				return;
			}
			return this.loadData();
		},
		onUnload() { this.cartRequest++; },
		methods: {
			//请求数据
			loadData() {
				const request = ++this.cartRequest;
				const uid = uniCloud.getCurrentUserInfo().uid;
				if (this.user_id !== uid) {
					this.user_id = uid;
					this.cartList = [];
					this.calcTotal();
				}
				uni.showLoading({
					title: this.$t('home.loading'),
					mask: true
				})
				return this.$func.myFunction('jlg-cart', {
						functionName: 'cartdata',
						data: {
							user_id: this.user_id
						}
					})
					.then(res => {
						if (request !== this.cartRequest || uid !== uniCloud.getCurrentUserInfo().uid) return;
						// 刷新价格和库存时按购物袋记录 ID 保留选择，不依赖列表顺序。
						const selected = new Set(this.cartList.filter(item => item.checked).map(item => item._id));
						this.cartList = res.result.cartList.map(item => ({
							...item, checked: !!item.efficacy && selected.has(item._id)
						}));
						this.calcTotal();
					})
					.catch(error => {
						console.error(error);
					})
					.finally(() => {
						if (request !== this.cartRequest) return;
						uni.hideLoading();
						uni.stopPullDownRefresh();
					});
			},
			//选中状态处理
			check(type, index) {
				if (type === 'item') {
					this.cartList[index].checked = !this.cartList[index].checked;
				} else {
					const checked = !this.allChecked;
					const list = this.cartList;
					list.forEach(item => {
						if (item.efficacy) {
							item.checked = checked;
						}
					})
					this.allChecked = checked;
				}
				this.calcTotal();
			},
			//删除
			async deleteCartItem() {
				uni.showLoading({
					title: this.$t('cart.deleting')
				})
				let that = this;
				let a = 0;
				for (let item of that.cartList) {
					if (item.checked) {
						a++;
						await db.collection("jlg-goods-cart").doc(item._id).remove();
					}
				}
				if (a > 0) {
					uni.hideLoading()
					uni.showToast({
						title: this.$t('cart.deleteSuccess'),
						icon: "none",
						duration: 1600
					});
					that.loadData();
				} else {
					uni.hideLoading()
					uni.showToast({
						title: this.$t('cart.selectDeleteGoods'),
						icon: "none",
						duration: 1600
					});
				}
			},
			//清空
			clearCart() {
				uni.showModal({
					content: this.$t('cart.clearConfirm'),
					success: (e) => {
						if (e.confirm) {
							db.collection("jlg-goods-cart").where({
								"user_id": this.user_id
							}).remove().then(() => {
								uni.showToast({
									title: this.$t('cart.deleteSuccess'),
									icon: "none",
									duration: 1600
								})
								this.loadData();
							})
						}
					}
				})
			},
			//计算总价
			calcTotal() {
				let list = this.cartList;
				this.empty = list.length === 0;
				if (list.length === 0) {
					this.total = 0;
					this.crossed_total = 0;
					this.allChecked = false;
					return;
				}
				let total = 0;
				let crossed_total = 0;
				let checked = list.some(item => item.efficacy);
				list.forEach(item => {
					if (item.efficacy) {
						if (item.checked === true) {
							total += item.goods_suk.price * item.goods_number;
							const crossedPrice = Number((item.crossed_price || [])[0]);
							// 划线价只作参考；无效价差不应抵消其他商品的优惠。
							if (Number.isFinite(crossedPrice) && crossedPrice > item.goods_suk.price) {
								crossed_total += (crossedPrice - item.goods_suk.price) * item.goods_number;
							}
						} else if (checked === true) {
							checked = false;
						}
					}
				})
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
				this.crossed_total = Number(crossed_total.toFixed(2));
			},
			navigator(id, seckill) {
				const self = this;
				uniCloud.callFunction({
					name: "jlg-record",
					data: {
						user_id: self.user_id,
						id: id[0]
					}
				}).then((res) => {

				}).catch((err) => {
					uni.navigateTo({
						url: `/pages/product/product?id=${id}&&control=${seckill}`
					})
					uni.showToast({
						title: this.$t('home.recordUpdateFailed'),
						icon: "none",
						duration: 600
					});
				});
				uni.navigateTo({
					url: `/pages/product/product?id=${id}&&control=${seckill}`
				})
			},
			//创建订单
			createOrder() {
				if (this.total > 0) {
					let list = this.cartList;
					let goodsData = [];
					list.forEach(item => {
						if (item.checked && item.efficacy) {
							goodsData.push({
								cart_id: item._id,
								id: item.id[0],
								suk: item.goods_suk,
								num: item.goods_number,
								seckill: item.goods_seckill
							})
						}
					})
					uni.navigateTo({
						url: `/pages/order/createOrder?suk=${JSON.stringify(goodsData)}&&motion=${this.crossed_total}`
					})
				} else {
					uni.showToast({
						title: this.$t('cart.noSelectedGoods'),
						icon: "none",
						duration: 1600
					})
				}
			},
			manageClick() {
				this.manage = !this.manage
			},
			naTov() {
				uni.switchTab({
					url: "/pages/index/index"
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F7F8F5;
	}

	.cart-page {
		min-height: 100vh;
		padding-bottom: 184rpx;
		background: #F7F8F5;

		/* #ifdef H5 */
		padding-bottom: 136rpx;
		/* #endif */
	}

	/* ── 顶部导航 ── */
	.cart-nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		height: 96rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 32rpx;
		background: #FFFFFF;
		border-bottom: 0.5rpx solid $brand-border;

		&__title {
			font-size: 34rpx;
			font-weight: 600;
			color: #202321;
			letter-spacing: 2rpx;
		}

		&__action {
			font-size: 28rpx;
			color: #8E918D;

			&--active {
				color: #61A189;
			}
		}
	}

	/* ── 空状态 ── */
	.cart-empty {
		&__btn {
			@include shop-button(primary, $static: false);
			margin-top: 32rpx;
			padding: 20rpx 64rpx;
			font-size: 28rpx;
			text-align: center;
		}
	}

	/* ── 列表区域 ── */
	.cart-list {
		margin-top: 96rpx;
	}

	/* ── 商品行 ── */
	.cart-item {
		background: #FFFFFF;
		border-bottom: 0.5rpx solid $brand-border;

		&--expired {
			background: #FFFFFF;
		}

		&__inner {
			display: flex;
			flex-direction: row;
			align-items: flex-start;
			padding: 32rpx;
			gap: 20rpx;
		}

		&__check-wrap {
			display: flex;
			align-items: center;
			padding-top: 64rpx;
		}

		&__img-wrap {
			position: relative;
			flex-shrink: 0;
		}

		&__img {
			width: 180rpx;
			height: 180rpx;
			flex-shrink: 0;
			background: #ECEDE8;
		}

		&__expired-badge {
			position: absolute;
			bottom: 10rpx;
			left: 50%;
			transform: translateX(-50%);
			font-size: 22rpx;
			color: #FFFFFF;
			background: rgba(32, 35, 33, 0.55);
			padding: 4rpx 20rpx;
			white-space: nowrap;
		}

		&__body {
			flex: 1;
			display: flex;
			flex-direction: column;
			min-width: 0;

			&--h5 {
				flex: 1;
			}
		}

		&__name {
			font-size: 28rpx;
			font-weight: 500;
			color: #202321;
			line-height: 1.45;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;

			&--expired {
				color: #B8BBB6;
			}
		}

		&__attr {
			margin-top: 8rpx;
			font-size: 24rpx;
			color: #8E918D;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		&__suk {
			margin-right: 16rpx;
		}

		&__services-scroll {
			margin-top: 12rpx;
		}

		&__services {
			display: flex;
			flex-direction: row;
		}

		&__service-tag {
			border: 1rpx solid #E5E6E2;
			border-radius: 4rpx;
			height: 36rpx;
			margin-right: 10rpx;
			margin-bottom: 8rpx;
			padding: 0 12rpx;
			line-height: 34rpx;
			font-size: 20rpx;
			color: #8E918D;
			white-space: nowrap;
		}

		&__seckill-tip {
			margin-top: 8rpx;
			padding: 4rpx 12rpx;
			border: 1rpx solid #61A189;
			align-self: flex-start;

			text {
				font-size: 20rpx;
				color: #61A189;
			}
		}

		&__bottom {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			margin-top: 20rpx;
		}
	}

	/* ── 复选框 ── */
	.cart-checkbox {
		font-size: 48rpx;
		line-height: 1;
		color: #C8CBC4;
		margin-right: 16rpx;

		&.checked {
			color: #61A189;
		}
	}

	/* ── 底部结算栏 ── */
	.cart-footer {
		position: fixed;
		bottom: 0;
		/* #ifdef H5 */
		bottom: 50px;
		/* #endif */
		left: 0;
		right: 0;
		z-index: 99;
		background: #FFFFFF;
		border-top: 0.5rpx solid $brand-border;
		box-shadow: 0 -6rpx 20rpx rgba(32, 35, 33, 0.025);

		&__inner {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			height: 136rpx;
			padding: 0 36rpx;
		}

		&__left {
			display: flex;
			flex-direction: row;
			align-items: center;
			flex: 1;
		}

		&__all-check {
			display: flex;
			flex-direction: row;
			align-items: center;
		}

		&__all-label {
			font-size: 30rpx;
			color: #202321;
		}

		&__total {
			margin-left: 40rpx;
			display: flex;
			flex-direction: column;
		}

		&__total-row {
			display: flex;
			flex-direction: row;
			align-items: baseline;
		}

		&__total-label {
			font-size: 26rpx;
			color: #8E918D;
		}

		&__discount {
			margin-top: 6rpx;
			font-size: 22rpx;
			color: #B8BBB6;
		}
		&__btn {
			@include shop-button(primary, $static: false);
			min-width: 192rpx;
			height: 88rpx;
			line-height: 88rpx;
			padding: 0 44rpx;
			margin: 0;
			font-size: 30rpx;
			font-weight: 600;

			&--ghost {
				@include shop-button(secondary, $static: false);
			}

			&--disabled {
				background: $brand-border;
				border-color: $brand-border;
				color: #626B65;
			}
		}

	}
</style>
