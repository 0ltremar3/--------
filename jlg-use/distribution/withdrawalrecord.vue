<template>
	<view class="container">
		<uv-empty v-if="winList.length == 0" mode="data" icon="/static/temp/shwk.png" text="记录为空"></uv-empty>
		<view v-else class="flex-dir-column flex-x-center ">
			<view class="bg-header">
				已成功提现金额
				<jlg-minPrice :minPrice="with_comm" col="#ffffff" maxSize="40rpx"></jlg-minPrice>
			</view>
			<view class="list">
				<view class="list-item" v-for="(item,index) in winList" :key="index">
					<view class="flex-dir-row  flex-y-center flex-x-between">
						<view class="flex-dir-row flex-y-center ">
							<image v-if="item.state == '审核中'"
								src="https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/shz.png"
								class="listpic" mode=""></image>
							<image v-else-if="item.state == '已打款'"
								src="https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/ysh2.png"
								class="listpic" mode="">
							</image>
							<image v-else-if="item.state == '审核失败'"
								src="https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/wtg.png"
								class="listpic" mode="">
							</image>
							<view class="flex-dir-column ">
								<view class="name">
									{{item.source + '余额提现'}}
									<text
										:class="item.state == '已打款' ? 'state-item' : (item.state == '审核失败' ? 'state-itemss' : 'state-items')">{{item.state}}</text>
								</view>
								<view class="time">
									{{formatDate(item.create_time)}}
								</view>
							</view>
						</view>
						<view class="">
							<jlg-minPrice :minPrice="item.price" col="#3ab5a4" maxSize="32rpx"></jlg-minPrice>
						</view>
					</view>
					<text v-if="item.state == '已打款'"
						style="margin-left: 90rpx;color: #3ab5a4;font-size: 10px;">{{item.notes}}</text>
					<text v-else-if="item.state == '审核失败'"
						style="margin-left: 90rpx;color: #ff3d3d;font-size: 10px;">{{item.notes}}</text>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	import minPrice from "@/components/jlg-minPrice/jlg-minPrice.vue";
	export default {
		components: {
			minPrice
		},
		data() {
			return {
				user_id: uniCloud.getCurrentUserInfo().uid,
				winList: [],
				with_comm: 0,
			}
		},
		onLoad() {
			this.winData()
		},
		methods: {
			winData() {
				uni.showLoading({
					title: "加载中..."
				})
				let where = {
					"user_id": this.user_id
				}
				db.collection("jlg-withdrawal").where(where).orderBy("create_time desc").get().then((res) => {
					this.winList = res.result.data
					db.collection("jlg-distribution").where(where).field("with_comm").get().then((res) => {
						this.with_comm = res.result.data[0].with_comm
						uni.hideLoading();
					})
				})
			},
			formatDate(timestamp) {
				const date = new Date(timestamp);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			}
		}
	}
</script>

<style>
	page {
		height: 100%;
		background-color: #f5f5f5;
	}

	.bg-header {
		margin: 20rpx;
		background-color: #3ab5a4;
		color: #fff;
		padding: 35rpx;
		border-radius: 19rpx;
	}

	.flex-dir-row {
		display: flex;
		flex-direction: row;
	}

	.flex-dir-column {
		display: flex;
		flex-direction: column;
	}

	.flex-y-center {
		align-items: center;
	}

	.flex-x-between {
		justify-content: space-between;
	}

	.list {
		margin: 20rpx auto;
		width: 94%;
		margin-top: 20rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-sizing: border-box;
	}

	.list-item {
		border-bottom: 1rpx solid #eee;
		padding-bottom: 30rpx;
		box-sizing: border-box;
		padding: 30rpx 20rpx;
	}

	.name {
		font-size: 32rpx;
		color: #000;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 450rpx;
		flex-direction: row;
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.listpic {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.state-item {
		line-height: -12rpx;
		font-size: 20rpx;
		border-radius: 8rpx;
		border: 1rpx solid #3ab5a4;
		padding: 2rpx 8rpx;
		margin-left: 30rpx;
		color: #3ab5a4;
	}

	.state-items {
		line-height: -12rpx;
		font-size: 20rpx;
		border-radius: 8rpx;
		border: 1rpx solid #ffaa00;
		padding: 2rpx 8rpx;
		margin-left: 30rpx;
		color: #ffaa00;
	}

	.state-itemss {
		line-height: -12rpx;
		font-size: 20rpx;
		border-radius: 8rpx;
		border: 1rpx solid #ff3d3d;
		padding: 2rpx 8rpx;
		margin-left: 30rpx;
		color: #ff3d3d;
	}

	.time {
		font-size: 22rpx;
		color: #b6b6b6;
	}
</style>