<template>
	<view class="content">
		<uv-empty v-if="flist.length == 0" mode="data" icon="/static/temp/shwk.png" text="暂无分类"></uv-empty>
		<uv-vtabs v-else :chain="true" :list="flist" :height="height" hdHeight="15"
			:barItemActiveStyle="{color:'#1C7231'}" :barItemActiveLineStyle="{background:'#1C7231'}">
			<template v-for="(item,index) in flist">
				<uv-vtabs-item :index="index" :key="index">
					<view class="item-title ml-30 mt-30">
						<text class="col-0 f-29 ">{{item.name}}</text>
					</view>
					<view class="flex-dir-row ml-30  mt-20 flex-x-start f-wrap">
						<view class="item mb-20 mt-10 " v-for="(item2,index2) in item.childrens" :key="index2"
							@click="navToList(item2._id)">
							<view class="item-content" style="margin: auto;">
								<image :src="item2.icon"></image>
							</view>
							<view class="item-title">
								{{item2.name}}
							</view>
						</view>
					</view>

					<view class="gap mt-20 mb-20" v-if="index<flist.length-1">
						<uv-gap bg-color="#f1f1f1" height="4"></uv-gap>
					</view>
				</uv-vtabs-item>
			</template>
			<uv-gap bg-color="#fff" height="600"></uv-gap>
		</uv-vtabs>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				flist: []
			}
		},
		computed: {
			height() {
				return uni.getSystemInfoSync().windowHeight;
			}
		},
		onShareTimeline(res) {
			return {
				title: "山前食养商城,优惠多多！",
				imageUrl: '../../static/logo.png',
			}
		},
		onShareAppMessage(res) {
			return {
				title: "山前食养商城,优惠多多！"
			}
		},
		onLoad() {
			this.cateData();
		},
		methods: {
			cateData() {
				uni.showLoading({
					title: '加载中'
				})
				this.$func.myFunction('jlg-home', {
						functionName: 'catedata',
						data: {}
					})
					.then(res => {
						uni.hideLoading();
						this.flist = res.result.flist;
					})
					.catch(error => {
						uni.hideLoading();
						console.error(error);
					});
			},
			navToList(id) {
				uni.navigateTo({
					url: `/pages/product/list?id=${id}`
				})
			}
		}
	}
</script>
<style scoped lang="scss">
	.item {
		width: 180rpx;
		text-align: center;
		flex: 0 0 calc(35.33% - 10px);
	}

	.item-content {
		width: 120rpx;
		height: 120rpx;
	}

	.item-content image {
		width: 100%;
		height: 100%;
	}

	.item-title {
		font-size: 25rpx;
		color: #777;
	}
</style>