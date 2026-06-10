<template>
	<view class="cart-page">

		<!-- 顶部导航 -->
		<view class="cart-nav">
			<text class="cart-nav__title">山前食养</text>
			<text class="cart-nav__action" :class="manage ? 'cart-nav__action--active' : ''" @click="manageClick">
				{{ manage ? '完成' : '管理' }}
			</text>
		</view>

		<!-- 空状态 -->
		<view v-if="empty" class="cart-empty">
			<uv-empty marginTop="150" mode="data" icon="/static/temp/shwk.png" text="购物袋为空">
				<view @click="naTov" class="cart-empty__btn">去逛逛</view>
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
							<view class="cart-item__expired-badge">已失效</view>
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
								<text>秒杀结束后商品将被删除</text>
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
							<text class="cart-footer__all-label">全选</text>
						</view>
						<view v-if="!manage" class="cart-footer__total">
							<view class="cart-footer__total-row">
								<text class="cart-footer__total-label">合计：</text>
								<jlg-minPrice :min-price="total" maxSize="32rpx" minSize="24rpx"></jlg-minPrice>
							</view>
							<text class="cart-footer__discount">已优惠 {{ crossed_total / 100 }} 元</text>
						</view>
					</view>
					<button v-if="!manage"
					class="no-border cart-footer__btn"
					:class="{ 'cart-footer__btn--disabled': total <= 0 }"
					:disabled="total <= 0"
					@click="createOrder">结算商品</button>
					<button v-else class="no-border cart-footer__btn cart-footer__btn--ghost"
						@click="deleteCartItem()">移除商品</button>
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
				user_id: uniCloud.getCurrentUserInfo().uid,
				manage: false
			};
		},
		onLoad() {
			this.loadData();
		},
		onPullDownRefresh() {
			this.cartList = [];
			this.loadData();
			this.total = 0;
			this.crossed_total = 0;
		},
		onShow() {
			//效验当前token是否已过期
			let xtime = Date.now();
			let ttime = uniCloud.getCurrentUserInfo().tokenExpired;
			let uid = uniCloud.getCurrentUserInfo().uid;
			if (xtime > ttime || uid == null) {
				uni.showToast({
					title: "未登录或登录状态过期",
					icon: "none",
					duration: 1000
				})
				setTimeout(() => {
					uni.navigateTo({
						url: `/uni_modules/uni-id-pages/pages/login/login-withoutpwd`
					})
				}, 1000)
			}
			this.cartList = [];
			this.loadData();
			this.total = 0;
			this.crossed_total = 0;
		},
		methods: {
			//请求数据
			loadData() {
				uni.showLoading({
					title: "加载中"
				})
				this.$func.myFunction('jlg-cart', {
						functionName: 'cartdata',
						data: {
							user_id: this.user_id
						}
					})
					.then(res => {
						this.cartList = res.result.cartList;
						this.empty = res.result.empty;
						uni.hideLoading()
						uni.stopPullDownRefresh();
					})
					.catch(error => {
						uni.hideLoading()
						console.error(error);
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
					title: "删除中..."
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
						title: "删除成功",
						icon: "none",
						duration: 1600
					});
					that.loadData();
					that.total = 0;
					that.crossed_total = 0;
				} else {
					uni.hideLoading()
					uni.showToast({
						title: "请选择删除的商品",
						icon: "none",
						duration: 1600
					});
				}
			},
			//清空
			clearCart() {
				uni.showModal({
					content: '清空购物车？',
					success: (e) => {
						if (e.confirm) {
							db.collection("jlg-goods-cart").where({
								"user_id": this.user_id
							}).remove().then(() => {
								uni.showToast({
									title: "删除成功",
									icon: "none",
									duration: 1600
								})
								this.loadData();
								this.calcTotal();
								this.total = 0;
								this.crossed_total = 0;
							})
						}
					}
				})
			},
			//计算总价
			calcTotal() {
				let list = this.cartList;
				if (list.length === 0) {
					this.empty = true;
					return;
				}
				let total = 0;
				let crossed_total = 0;
				let checked = true;
				list.forEach(item => {
					if (item.efficacy) {
						if (item.checked === true) {
							total += item.goods_suk.price * item.goods_number;
							crossed_total += item.crossed_price[0] * item.goods_number;
						} else if (checked === true) {
							checked = false;
						}
					}
				})
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
				this.crossed_total = Number((crossed_total - total).toFixed(2));
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
						title: "浏览记录未成功更新",
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
						if (item.checked) {
							goodsData.push({
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
						title: "未选中任何商品",
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
		border-bottom: 1rpx solid #E5E6E2;

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
				color: #1C7231;
			}
		}
	}

	/* ── 空状态 ── */
	.cart-empty {
		&__btn {
			margin-top: 32rpx;
			padding: 20rpx 64rpx;
			font-size: 28rpx;
			color: #FFFFFF;
			background: #1C7231;
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
		border-bottom: 1rpx solid #E5E6E2;

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
			border: 1rpx solid #1C7231;
			align-self: flex-start;

			text {
				font-size: 20rpx;
				color: #1C7231;
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
			color: #1C7231;
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
		border-top: 1rpx solid #E5E6E2;
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
			min-width: 192rpx;
			height: 88rpx;
			line-height: 88rpx;
			padding: 0 44rpx;
			margin: 0;
			font-size: 30rpx;
			font-weight: 600;
			color: #FFFFFF;
			background: #1C7231;
			border-radius: 0;
			box-shadow: none;
			transition: background 0.2s, color 0.2s;

			&--ghost {
				background: #FFFFFF;
				color: #1C7231;
				border: 1rpx solid #1C7231;
			}

			&--disabled {
				background: #C8CBC4;
				color: #FFFFFF;
			}
		}

	}
</style>
