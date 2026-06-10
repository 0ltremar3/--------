<template>
	<view class="center">
		<view class="">
			<uv-sticky bgColor="#fff" :custom-nav-height="0">
				<uv-tabs :list="list" @click="tabClick" lineColor="#1C7231" :scrollable="false"
					:activeStyle="{color: '#1C7231'}"></uv-tabs>
			</uv-sticky>
			<uv-empty v-if="couponList.length ==0" mode="data" icon="/static/temp/shwk.png" text="暂无优惠"></uv-empty>
			<view v-else class="coupon-cen">
				<view v-for="(item,index) in couponList" :key="index" class="coupon-van">
					<view class="coupon-letf">
						<view class="flex-dir-row">
							<view class="coupon-icqc">
								{{item.user_type == '会员权益'?'会员权益':(item.allow_type == '所有商品' && item.user_type == '所有人'?'全场通用':(item .allow_type == '指定商品' && item .user_type == '所有人'?'特定商品':(item .user_type == '指定用户' && item .allow_type == '所有商品'?'特定用户':'其他')))}}
							</view>
							<text class="coupon-name">{{item.name}}</text>
						</view>
						<view class="ml-20 mt-30">
							<view class="f-26 col-9">
								有效期为：
							</view>
							<view class="f-26 col-9" style="line-height: 40rpx;">
								{{formatDate(item.start_time)+ '-' +formatDate(item.end_time)}}
							</view>
						</view>
					</view>
					<view v-if="item.is_share" class="coupon-diej">
						可叠加</view>
					<view class="coupon-righ">
						<view class="mt-10">
							<text v-if="item.type == '满减'" class="f-40">￥</text>
							<text v-if="item.type == '满减'" class="coupon-qian">{{item.price/100}}</text>
							<text v-else class="coupon-qian">{{(item.price/10).toFixed(1)}}<text
									class="coupon-z">折</text></text>
						</view>
						<view style="font-size: 30rpx;">满{{item.order_amount/100}}可用</view>
						<view v-if="item.states"
							@click="addCoupon(item._id,item.max_number,item.received_number,item.number,item.user_type,item.user_arr)"
							class="coupon-lqsy">
							立即领取</view>
						<view v-else class="coupon-lqsy" @click="navigator(item.allow_type,item.goods_arr,item.name)">
							立即使用</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="but" @click="naTov('./mycoupon')">
				我的优惠券
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				couponList: [],
				user_id: uniCloud.getCurrentUserInfo().uid,
				list: [{
						name: '全部',
					},
					{
						name: '通用券',
					},
					{
						name: '商品券',
					},
					{
						name: '专享券',
					}
				],
				where: {},
				receiveId: [],
			}
		},
		onLoad() {
			this.receiveData(0);
		},
		methods: {
			tabClick(e) {
				this.couponData(e.index);
			},
			couponData(e) {
				uni.showLoading({
					title: "加载中"
				})
				this.$func.myFunction('jlg-cart', {
						functionName: 'coupondata',
						data: {
							e: e
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
					title: "加载中"
				})
				db.collection("jlg-goods-coupon").where({
					"user_id": this.user_id,
					"is_use": false
				}).get().then((res) => {
					let Newdata = res.result.data;
					Newdata.forEach((item) => {
						this.receiveId.push(item.coupon_id)
					})
					this.couponData(0);
				})
			},
			async addCoupon(id, maxnum, yl_num, fx_num, usertype, usarr) {
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
							title: res.result.message,
							icon: "none",
							duration: 1600
						});
						return;
					})
					.catch(error => {
						console.error(error);
					});
			},
			navigator(type, goodsArr, name) {
				if (type == "所有商品") {
					uni.navigateTo({
						url: `/pages/coupon/prefeList?goodsArr=${null}&&name=${name}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/coupon/prefeList?goodsArr=${JSON.stringify(goodsArr)}&&name=${name}`
					})
				}
			},
			formatDate(timestamp) {
				const date = new Date(timestamp);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}/${month}/${day}`;
			},
			naTov(item) {
				uni.navigateTo({
					url: item
				})
			}
		}
	}
</script>

<style>
	page {
		background: #f3f3f3;
		height: 100%;
	}

	.center {}

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
		padding: 20rpx;
		padding-bottom: 200rpx;
		padding-top: 0rpx;
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
		background: #1C7231;
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
		background: #1C7231;
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
		font-size: 24rpx;
		height: 38rpx;
		background: #fff;
		border-radius: 100rpx;
		color: #1C7231;
		line-height: 38rpx;
		margin: 12rpx auto auto auto;
		width: 125rpx;
	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		width: 100%;
		font-size: 30rpx;
		background-color: #fff;
		text-align: center;
		padding: 30rpx;
		box-sizing: border-box;
		z-index: 998;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
		padding-bottom: 20rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

	}

	.but {
		width: 100%;
		font-size: 32rpx;
		color: #ffffff;
		background-color: #1C7231;
		border-radius: 100rpx;
		height: 84rpx;
		line-height: 84rpx;
	}
</style>