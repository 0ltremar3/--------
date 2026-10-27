<template>
	<view class="center">
		<view class="">
			<uv-sticky bgColor="#fff" :custom-nav-height="0">
				<uv-tabs :list="list" @click="tabClick" lineColor="#61A189" :scrollable="false"
					:activeStyle="{color: '#61A189'}"></uv-tabs>
			</uv-sticky>
			<uv-empty v-if="couponList.length ==0" mode="data" icon="/static/temp/shwk.png" text="暂无优惠"></uv-empty>
			<view v-else class="coupon-cen">
				<view v-for="(item,index) in couponList" :key="index" class="coupon-van">
					<view class="coupon-letf">
						<view class="flex-dir-row">
							<view class="coupon-icqc">
								{{item.couponList[0].user_type == '会员权益'?'会员权益':(item.couponList[0].allow_type == '所有商品' && item.couponList[0].user_type == '所有人'?'全场通用':(item.couponList[0].allow_type == '指定商品' && item.couponList[0].user_type == '所有人'?'特定商品':(item.couponList[0].user_type == '指定用户' && item.couponList[0].allow_type == '所有商品'?'特定用户':'其他')))}}
							</view>
							<text class="coupon-name">{{item.couponList[0].name}}</text>
						</view>
						<view class="ml-20 mt-30">
							<view class="f-26 col-9">
								有效期为：
							</view>
							<view class="f-26 col-9" style="line-height: 40rpx;">
								{{formatDate(item.couponList[0].start_time)+ '-' +formatDate(item.couponList[0].end_time)}}
							</view>
						</view>
					</view>
					<view v-if="item.couponList[0].is_share" class="coupon-diej">
						可叠加</view>
					<view class="coupon-righ">
						<view class="mt-10">
							<text v-if="item.couponList[0].type == '满减'" class="f-40">￥</text>
							<text v-if="item.couponList[0].type == '满减'"
								class="coupon-qian">{{item.couponList[0].price/100}}</text>
							<text v-else class="coupon-qian">{{(item.couponList[0].price/10).toFixed(1)}}<text
									class="coupon-z">折</text></text>
						</view>
						<view style="font-size: 30rpx;">满{{item.couponList[0].order_amount/100}}可用</view>
						<view class="coupon-lqsy"
							@click="navigator(item.couponList[0].allow_type,item.couponList[0].goods_arr,item.couponList[0].name)">
							立即使用</view>
					</view>
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
				couponList: [],
				user_id: uniCloud.getCurrentUserInfo().uid,
				list: [{
						name: '全部',
					},
					{
						name: '未使用',
					},
					{
						name: '已使用',
					},
					{
						name: '已过期',
					}
				],
				where: {},
				receiveId: [],
			}
		},
		onLoad() {
			this.myCoupon(0);
		},
		methods: {
			tabClick(e) {
				this.myCoupon(e.index);
			},
			myCoupon(e) {
				uni.showLoading({
					title: "加载中"
				})
				console.log(e)
				this.$func.myFunction('jlg-cart', {
						functionName: 'myCoupon',
						data: {
							current: e,
							userid: this.user_id
						}
					}).then(res => {
						console.log(res)
						this.couponList = res.result;
						uni.hideLoading()
					})
					.catch(error => {
						uni.hideLoading()
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
			}
		}
	}
</script>

<style lang="scss">
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
</style>