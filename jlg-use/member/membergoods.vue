<template>
	<view>
		<view style="padding: 40rpx;">
			<view style="margin-top: 30rpx;display: flex;flex-direction: column;align-items: flex-start;">
				<view
					style="font-size: 24rpx; padding: 0rpx 20rpx;color: #f6ccb7;border: 1rpx solid #f6ccb7;border-radius: 200rpx;">
					{{myvipList.grade == 0?'SVIP':'VIP'}}专享权益
				</view>
				<view style="font-size: 38rpx;margin-top: 20rpx;color: #f6ccb7;">
					每月领一件 包邮送到家
				</view>
				<view style="font-size: 22rpx; color: #f6ccb7;margin-top: 10rpx;">
					请在会员有效期内领取完毕，过期后权益失效，无法领取
				</view>
				<view style="font-size: 20rpx; color: #f6ccb7;margin-top: 10rpx;">
					会员有效期至：{{formatDate(myvipList.failure_time)}}
				</view>
			</view>
		</view>
		<view
			style="min-height: 90vh;background: #f7f7f7;border-top-left-radius: 20rpx;border-top-right-radius: 20rpx;padding: 20rpx;width: 100%;">
			<view
				style="display: flex;flex-direction: row;background: #fff;width: 100%;margin-bottom: 20rpx;border-radius: 20rpx;"
				v-for="(item,index) in goodsList">
				<view>
					<image class="goods-img" :src="item.goods_id[0].goods_thumb"></image>
				</view>
				<view style="padding: 20rpx;display: flex;flex-direction: column;width: 100%;" class="flex-x-between">
					<view style="font-size: 28rpx;">
						<view class="text-element-2">{{item.goods_id[0].name}}</view>
						<view style="font-size: 24rpx;color: #878787;margin-top: 10rpx;">
							领取日期：{{formatDate(item.start_time)+'-'+formatDate(item.end_time)}}</view>
					</view>
					<view style="display: flex;flex-direction: row;align-items: center;" class="flex-x-between">
						<view style="color: #ff2929;font-size: 26rpx;align-items: center; display: flex;"
							class="flex-x-between"><text style="margin-right: 10rpx;">价值</text><jlg-minPrice
								:min-price="item.goods_id[0].suks.reduce((min, suk) => parseInt(suk.price) < parseInt(min.price) ? suk : min).price"
								maxSize="32rpx"></jlg-minPrice>
						</view>
						<view
							style="font-size: 24rpx;background: #ff2929;color: #fff;padding: 10rpx 20rpx;border-radius: 200rpx;"
							v-if="item.start_time <= time && item.end_time>=time && (item.state == '待领取' || item.state == null)"
							@click="naTov(item.goods_id[0],item._id)">
							立即领取</view>
						<view v-else-if="item.state == '已领取'" style="font-size: 24rpx; color: #878787;">
							已领取</view>
						<view v-else-if=" item.end_time <=time && item.state=='待领取'"
							style=" font-size: 24rpx; color: #878787;">已过期</view>
						<view v-else style="font-size: 24rpx; color: #878787;">未到领取时间</view>
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
				myvipList: [],
				goodsList: [],
				time: Date.now(),
				user_id: uniCloud.getCurrentUserInfo().uid,
			}
		},
		onLoad() {
			this.myvipData();
			this.teaWarehouseData();
		},
		methods: {
			// 我的会员数据
			myvipData() {
				db.collection("jlg-member").where({
					user_id: this.user_id
				}).get().then((res) => {
					if (res.result.data.length > 0) {
						this.myvipList = res.result.data[0];
					}
				})
			},
			teaWarehouseData() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				db.collection("jlg-warehouse,opendb-mall-goods").where({
					user_id: this.user_id
				}).field("user_id,goods_id,start_time,end_time,state").get().then((res) => {
					this.goodsList = res.result.data;
					uni.hideLoading()
				})
			},
			formatDate(timestamp) {
				const date = new Date(timestamp);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}.${month}.${day}`;
			},
			naTov(goods, cid) {
				let goodsData = [{
					id: goods._id,
					num: 1,
					seckill: false,
					suk: {
						price: 10,
						specs: goods.suks[0].specs
					}
				}]
				uni.navigateTo({
					url: `/jlg-use/member/createOrder?suk=${JSON.stringify(goodsData)}&control=${false}&cid=${cid}`
				})
			}
		}
	}
</script>

<style>
	page {
		background: #3d3b3e;
		height: 100%;
	}

	.goods-img {
		width: 240rpx;
		height: 240rpx;
		border-top-left-radius: 20rpx;
		border-bottom-left-radius: 20rpx;
	}
</style>