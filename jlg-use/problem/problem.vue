<template>
	<view class="center">
		<view class="img-dw">
			<image class="img-van"
				src="https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/wenti2.jpg">
			</image>
		</view>
		<view style="width: 150rpx;">
			<button open-type="contact" class="but">联系客服</button>
		</view>
		<view style="margin-top: 40rpx;">
			<uv-tabs :list="list" lineColor="#55aaff" @click="loadData" :activeStyle="{color: '#55aaff'}"
				:scrollable="true">
			</uv-tabs>
		</view>
		<view class="mt-20">
			<view class="f-27" @click="navTo(item._id)"
				style="height: 80rpx;line-height: 80rpx;border-bottom: 1rpx solid #e8e8e8;padding: 0rpx 20rpx;"
				v-for="(item,index) in loadList" :key="index">
				<text>{{item.title}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				list: [],
				loadList: [],
			}
		},
		onLoad() {
			this.listData()
		},
		onShareTimeline() {
			return {
				title: "山前食养商城常见问题说明"
			}
		},
		onShareAppMessage(res) {
			return {
				title: "山前食养商城常见问题说明"
			}
		},
		methods: {
			listData() {
				db.collection("opendb-news-articles").where({
					"category_id": '64cb3e83337a9f4db7bcb3a2'
				}).field("excerpt,category_id").distinct().get().then((res) => {
					res.result.data.forEach(item => {
						this.list.push({
							name: item.excerpt
						})
					})
					this.loadData(this.list[0])
				})
			},
			loadData(e) {
				db.collection("opendb-news-articles").where({
					"excerpt": e.name
				}).get().then((res) => {
					this.loadList = res.result.data
				})
			},
			navTo(id) {
				uni.navigateTo({
					url: `./probileDetail?id=${id}`
				})
			}
		}
	}
</script>

<style>
	page {
		height: 100%;
	}

	.center {
		padding: 30rpx;
		box-sizing: border-box;
	}

	.img-dw {
		position: absolute;
		top: 20rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 92.5%;
		height: 300rpx;
	}

	.but {
		width: 128rpx;
		font-size: 22rpx;
		color: #0052cc;
		background: #fff;
		border-radius: 10rpx;
		height: 40rpx;
		line-height: 40rpx;
		margin-left: 58rpx;
		margin-top: 125rpx;
		padding: 0 !important;
	}

	.img-van {
		width: 100%;
		height: 200rpx;
		border-radius: 20rpx;
	}
</style>