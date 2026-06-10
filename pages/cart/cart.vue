<template>
	<view class="container">
		<view class="edit-van" @click="manageClick">
			<view class="flex-dir-row">
				<text class="iconfont icon-uniE01f col-1C7231" style="font-size: 70rpx;"></text>
				<view>
					<text>山前食养</text>
				</view>
			</view>
			<text style="flex: 1;text-align: right;" :class="manage?'col-1C7231':''">{{manage?'完成':'管理'}}</text>
		</view>
		<!-- 空白页 -->
		<uv-empty marginTop="150" v-if="empty" mode="data" icon="/static/temp/shwk.png" text="购物车为空">
			<view @click="naTov" class="qgg">去逛逛</view>
		</uv-empty>

		<!-- 列表 -->
		<view v-else class="list">
			<view v-for="(item, index) in cartList" :key="index">
				<view v-if="!item.efficacy" class="flex-dir-column list-item">
					<view class="flex-dir-row flex-y-center">
						<view class="flex-dir-row flex-y-center">
							<image style="opacity: 0.4 !important" class="litpic"
								@click="navigator(item.id[0],item.goods_seckill)" :src="item.image[0]"
								mode="aspectFill">
							</image>
							<view class="efficay_text">已失效
							</view>
						</view>
						<view class="flex-dir-column w-430  ml-20">
							<text class="title" style="color: #c0c4cc;"
								@click="navigator(item.id[0],item.goods_seckill)">{{item.title[0]}}</text>
							<view class="attr" style="color: #c0c4cc;"
								@click="navigator(item.id[0],item.goods_seckill)">
								<text class="suk_text" v-for="items in item.goods_suk.specs">{{items}}</text>
							</view>
							<scroll-view @click="navigator(item.id[0],item.goods_seckill)" style="white-space: nowrap;"
								:show-scrollbar="false" scroll-x>
								<view class="services_van">
									<view class="services_vans" style="border: 1rpx solid #ff9494;"
										v-for="give in item.services[0]">
										<view class="goods_services" style="color: #ff9494;">{{give}}</view>
									</view>
								</view>
							</scroll-view>
							<view @click="navigator(item.id[0],item.goods_seckill)" v-if="item.goods_seckill"
								class="attr_van">
								<text class="suk_prompt">秒杀结束后商品将被删除</text>
							</view>
							<view class="flex-dir-row mt-10 flex-y-center flex-x-between">
								<jlg-minPrice @click="navigator(item.id[0],item.goods_seckill)"
									:min-price="item.goods_suk.price" maxSize="32rpx"></jlg-minPrice>
								<view>
									<uni-number-box background="#f5f5f5" class="step" :step="1" :min="1"
										:max="item.stock[0]" v-model="item.goods_number" @change="calcTotal"
										disabled="false"></uni-number-box>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else class="flex-dir-column list-item">
					<view class="  flex-dir-row flex-y-center">
						<view class=" flex-dir-row flex-y-center">
							<view class="iconfont icon-uniE00d checkbox" :class="{checked: item.checked}"
								@click="check('item', index)"></view>
							<image @click="navigator(item.id[0],item.goods_seckill)" class="litpic" :src="item.image[0]"
								mode="aspectFill">
							</image>

						</view>
						<!-- #ifdef MP-WEIXIN -->
						<view class=" flex-dir-column  ml-20  w-55">
						<!-- #endif -->
							<!-- #ifndef MP-WEIXIN  -->
							<view class=" flex-dir-column  ml-20 w-60">
							<!-- #endif -->
								<text class="title"
									@click="navigator(item.id[0],item.goods_seckill)">{{item.title[0]}}</text>
								<view class="attr" @click="navigator(item.id[0],item.goods_seckill)">
									<text class="suk_text" v-for="items in item.goods_suk.specs">{{items}}</text>
								</view>
								<scroll-view @click="navigator(item.id[0],item.goods_seckill)"
									style="white-space: nowrap;margin-bottom: 25rpx;" :show-scrollbar="false"
									class="w-100" scroll-x>
									<view class="services_van">
										<view class="services_vans" v-for="give in item.services[0]">
											<view class="goods_services">{{give}}</view>
										</view>
									</view>
								</scroll-view>
								<view class="flex-dir-row mt-10 flex-y-center flex-x-between">
									<jlg-minPrice @click="navigator(item.id[0],item.goods_seckill)"
										:min-price="item.goods_suk.price" maxSize="32rpx"></jlg-minPrice>
									<uni-number-box background="#e2e2e2" class="step" :step="1" :min="1"
										:max="item.stock[0]" v-model="item.goods_number"
										@change="calcTotal"></uni-number-box>

								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 底部菜单栏 -->
			<view class="footer">
				<view class="flex-dir-row flex-y-center flex-x-between" style="flex: 1;">
					<view class="flex-dir-row flex-y-center">
						<view class="checkbox flex-dir-row flex-y-center">
							<view class="iconfont icon-uniE00d checkbox" style="height: 72rpx;"
								:class="{checked: allChecked}" @click="check('all')"></view>
							<text class="ml-10 f-27 col-0 select-all">全选</text>
						</view>
						<view v-if="!manage" class=" ml-40 flex-dir-column ">
							<view class="flex-dir-row">
								<text class="f-28" style="line-height: 46rpx;">合计：</text>
								<jlg-minPrice :min-price="total" maxSize="34rpx" minSize="26rpx"></jlg-minPrice>
							</view>
							<text class="coupon">
								已优惠
								<text style="color: #1C7231;">{{crossed_total/100}}</text>
								元
							</text>
						</view>
					</view>
					<button v-if="!manage" class="no-border confirm-btn" @click="createOrder">结算商品</button>
					<button v-else style="background: #ffffff;color: #1C7231;border: 1rpx solid #1C7231;box-shadow:none"
						class="no-border confirm-btn" @click="deleteCartItem()">移除商品</button>
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

<style lang='scss'>
	page {
		background-color: #f5f5f5;
	}

	.container {
		padding-bottom: 134upx;
	}

	.list {
		margin-top: 120rpx;
	}

	.edit-van {
		position: fixed;
		display: flex;
		top: 0;
		height: 80rpx;
		width: 100%;
		line-height: 80rpx;
		background: #fff;
		padding: 0 33rpx;
		font-size: 27rpx;
		z-index: 9999;
	}

	.qgg {
		text-align: center;
		margin-top: 20rpx;
		font-size: 27rpx;
		color: #f32020;
	}

	.efficay_text {
		position: absolute;
		left: 65rpx;
		top: 143rpx;
		z-index: 8;
		font-size: 34rpx;
		color: #fff;
		background-color: rgba(62, 62, 62, 0.5);
		padding: 4rpx 26rpx;
		border-radius: 41rpx;
	}

	/* 购物车列表项 */
	.list-item {
		display: flex;
		position: relative;
		padding: 20upx 15upx;
		background-color: #fff;
		border-radius: 20rpx;
		margin: 30rpx 20rpx;
	}

	.checkbox {
		z-index: 8;
		font-size: 60rpx;
		line-height: 1;
		padding: 4upx;
		color: #c7c7c7;
		background: #fff;
		border-radius: 50px;
	}

	.litpic {
		width: 200rpx;
		height: 200rpx;
		border-radius: 15rpx;
		margin-left: 20rpx;
	}

	.title {
		font-size: 29rpx;
		color: #000;
		height: 40upx;
		line-height: 40upx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;

	}

	.price {
		font-size: 29rpx;
		height: 50upx;
		line-height: 50upx;

		&:before {
			content: '￥';
			font-size: 24rpx;
			margin: 0 2upx 0 -4upx;
		}
	}

	.attr {
		font-size: 24rpx;
		color: #909399;
		height: 42rpx;
		line-height: 37rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		.suk_text {
			margin-right: 20rpx;
		}
	}

	.Delete {
		padding: 4rpx 10rpx;
		font-size: 29rpx;
		height: 50rpx;
		color: #909399;
		background: #fff;
		display: flex;
		justify-content: flex-end;
	}

	.services_van {
		display: flex;
		flex-direction: row;
		text-align: center;

		.services_vans {
			border: 1rpx solid #ff3b3b;
			height: 35rpx;
			margin-bottom: 10rpx;
			margin-right: 10rpx;
			border-radius: 8rpx;
			line-height: 34rpx;

			.goods_services {
				color: #ff3b3b;
				font-size: 19rpx;
				padding: 0 8rpx;
			}
		}
	}

	.attr_van {
		border: 1rpx solid #1C7231;
		height: 40rpx;
		width: 64%;
		border-radius: 8rpx;
		line-height: 27rpx;
		margin-bottom: 13rpx;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		.suk_prompt {
			color: #1C7231;
			font-size: 21rpx;
		}
	}

	/* 底部栏 */
	.footer .checkbox.checked,
	.list-item .checkbox.checked {
		color: #1C7231;
	}

	.footer {
		position: fixed;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 100rpx;
		height: 100rpx;
		padding: 0 30rpx;
		background: #fff;
		bottom: 0px;
		/* #ifdef H5 */
		bottom: 50px;
		/* #endif */
		width: 100%;
		border-top: 1rpx solid #f5f5f5;
	}

	.checkbox {
		height: 48upx;
		position: relative;

		image {
			width: 44rpx;
			height: 100%;
			position: relative;
			z-index: 5;
		}
	}


	.price {
		font-size: 29rpx;
		color: #1C7231;
	}

	.coupon {
		font-size: 24rpx;
		color: #bdbdbd;

		text {
			color: #bdbdbd;
		}
	}

	.confirm-btn {
		padding: 0 38upx;
		margin: 0;
		border-radius: 100px;
		height: 65upx;
		line-height: 65upx;
		font-size: 27rpx;
		color: #fff;
		background: #1C7231;
		box-shadow: 1px 2px 5px rgba(217, 137, 138, 0.7)
	}
</style>