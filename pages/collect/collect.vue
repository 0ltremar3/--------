<template>
	<view>
		<uv-empty v-if="data.length == 0" mode="data" icon="/static/temp/shwk.png" text="暂无收藏商品"></uv-empty>
		<view v-else class="swipe-cell">
			<view v-for="item in data" :key="item._id">
				<uni-swipe-action>
					<uni-swipe-action-item :right-options="options" @click="beforeClose(item._id)">
						<view @click="navigator(item.id,item.goods_seckill)"
							class="flex-dir-row flex-x-between list flex-y-center">
							<image :src="item.thumbgoods" class="litpic" mode="aspectFill"></image>
							<view class="flex-dir-column list-right">
								<view class="title text-product-title">
									{{item.goodsname[0]}}
								</view>
								<view class="mt-20 services_van">
									<view class="services_vans" v-for="give in item.services[0]" :key="give">
										<view class="goods_services">{{give}}</view>
									</view>
								</view>
								<text class="price mt-20" style="justify-content: flex-end;display: flex;">{{(item.gssuks[0].reduce((min, suk) => parseInt(suk.price) < parseInt(min.price) ? suk : min).price / 100).toFixed(2)}}</text>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database()
	const favorcloud = db.collection('jlg-goods-collect,opendb-mall-goods');
	const user_id = uniCloud.getCurrentUserInfo().uid;
	export default {
		data() {
			return {
				data: [],
				options: [{
					text: '取消收藏',
					style: {
						backgroundColor: '#ff4949'
					}
				}]
			}
		},
		onLoad() {
			this.favordata()
		},
		methods: {
			favordata() {
				uni.showToast({
					title: '加载中',
					icon: 'loading',
					duration: 20000
				});
				favorcloud.where({
					"user_id": user_id
				}).field(
					"create_date,article_id._id as id,article_id.name as goodsname,article_id.seller_note as sellergoods,article_id.suks as gssuks,article_id.goods_thumb as thumbgoods,article_id.goods_services as services"
				).orderBy("create_date desc").get().then((res) => {
					this.data = res.result.data
					uni.hideToast();
				})
			},
			beforeClose(id) {
				let that = this
				uni.showModal({
					content: "确认取消吗？",
					success: function(res) {
						if (res.confirm) {
							db.collection('jlg-goods-collect').doc(id).remove().then(() => {
								that.favordata()
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			navigator(id) {
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/common/common.scss";

	.list {
		padding: 28rpx 32rpx;
		border-bottom: 1rpx solid $brand-border;
	}

	.mt-20 {
		margin-top: 20rpx;
	}

	.flex-dir-row {
		display: flex;
		flex-direction: row;
	}

	.flex-dir-column {
		display: flex;
		flex-direction: column;
	}

	.flex-x-between {
		justify-content: space-between;
	}

	.flex-y-center {
		align-items: center;
	}

	.litpic {
		width: 200rpx;
		height: 200rpx;
		border-radius: $uni-border-radius-sm;
		background: $brand-image-bg;
		flex-shrink: 0;
	}

	.list-right {
		flex: 1;
		margin-left: 24rpx;
		overflow: hidden;
	}

	.title {
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		color: $brand-text;
		font-size: $font-product-title;
		font-weight: $font-product-title-weight;
		line-height: 1.45;
	}

	.price {
		font-size: $font-price;
		font-weight: $font-price-weight;
		color: $brand-primary;
		line-height: 1;
	}

	.services_van {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 10rpx;

		.services_vans {
			border: 1rpx solid $brand-border;
			height: 40rpx;
			border-radius: $uni-border-radius-sm;
			line-height: 38rpx;
			white-space: nowrap;
			flex-shrink: 0;

			.goods_services {
				color: $brand-muted;
				font-size: 20rpx;
				padding: 0 10rpx;
			}
		}
	}
</style>