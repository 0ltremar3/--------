<template>
	<view class="container">
		<uv-empty v-if="ressList.length == 0" mode="data" icon="/static/temp/shwk.png" :text="$t('address.empty')"></uv-empty>
		<view v-else class="ress_van" v-for="(item,index) in ressList" :key="index">
			<view class="ress_top">

				<image @click="selected(item._id,source)" class="ress_dwt" src="../../static/icon/wzdw.png"></image>
				<view @click="selected(item._id,source)" class="ress_text_van">
					<view>
						<text class="fs_34">{{item.name}}</text>
						<text class="ress_mo">{{item.mobile}}</text>
					</view>
					<view class="ress_ed">
						{{item.formatted_address}}
					</view>
				</view>
				<image @click="modifyress(item._id)" class="ress_bjt" src="../../static/icon/wzbj.png">
				</image>
			</view>
			<view class="ress_bot">
				<view class="iconfont icon-uniE00d ress_mrt" :class="{checked: item.is_default}"
					@click="defaultress(item._id)">
				</view>
				<!-- <image @click="defaultress(item._id)" class="ress_mrt"
					:src="item.is_default?`../../static/selected.png`:`../../static/select.png`">
				</image> -->
				<view class="ress_mrtext">{{ $t('address.defaultAddress') }}</view>
				<button class="ress_scbut" @click="deleteress(item._id)">{{ $t('address.delete') }}</button>
			</view>
		</view>
		<button @click="novTo" class="but">{{ $t('address.addAddress') }}</button>
	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		data() {
			return {
				user_id: uniCloud.getCurrentUserInfo().uid,
				ressList: [],
				source: '',
			}
		},
		onLoad(e) {
			if (e.source) {
				this.source = e.source;
			}
		},
		onShow() {
			this.ressData()
		},
		methods: {
			ressData() {
				uni.showLoading({
					title: this.$t('address.loading')
				})
				db.collection("jlg-goods-address").where({
					"user_id": this.user_id
				}).orderBy("is_default desc").get().then((res) => {
					let data = res.result.data;
					if (data.length > 0) {
						if (data.length == 1 && !data[0].is_default) {
							db.collection(
									"jlg-goods-address"
								)
								.doc(data[0]._id)
								.update({
									"is_default": true
								}).then(() => {
									data[0].is_default =
										true;
									this.ressList = data;
								});
						} else {
							this.ressList = data;
						}
					} else {
						this.ressList = []
					}
					uni.hideLoading()
				});
			},
			deleteress(id) {
				let that = this
				uni.showModal({
					title: this.$t('address.deleteTitle'),
					content: this.$t('address.deleteContent'),
					success: function(res) {
						if (res.confirm) {
							db.collection("jlg-goods-address").doc(id).remove().then(() => {
								uni.showToast({
									title: that.$t('address.deleteSuccess'),
									icon: "none",
									duration: 1000
								})
								setTimeout(() => {
									that.ressData()
								}, 1600)
							})
						}
					}
				})
			},
			defaultress(id) {
				uni.showToast({
					title: this.$t('address.updating'),
					icon: "loading",
					duration: 200000
				})
				db.collection("jlg-goods-address").where({
					"user_id": this.user_id,
					"is_default": true
				}).update({
					"is_default": false
				}).then(() => {
					db.collection("jlg-goods-address").doc(id).update({
						"is_default": true
					}).then((res) => {
						this.ressData()
						uni.hideToast()
						uni.showToast({
							title: this.$t('address.updateSuccess'),
							icon: "none",
							duration: 1600
						})
					})
				})
			},
			modifyress(id) {
				uni.navigateTo({
					url: `./edit?id=${id}`
				})
			},
			selected(id, source) {
				if (source == '1') {
					this.getOpenerEventChannel().emit('refreshData', id)
					setTimeout(() => uni.navigateBack(), 500)
				}
			},
			novTo() {
				uni.navigateTo({
					url: `./add`
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: $brand-bg;
		height: 100%;
	}

	.container {
		position: relative;
		padding: 32rpx;
		padding-bottom: 160rpx;
	}

	.ress_van {
		width: 100%;
		background-color: $brand-surface;
		border: 1rpx solid $brand-border;
		border-radius: $uni-border-radius-base;
		margin-bottom: 24rpx;
	}

	.ress_top {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		padding: 24rpx 0;
		border-bottom: 1rpx solid $brand-border;
	}

	.ress_dwt {
		width: 40rpx;
		height: 40rpx;
		margin: 4rpx 20rpx 0;
		flex-shrink: 0;
	}

	.ress_text_van {
		flex: 1;
		min-width: 0;
	}

	.fs_34 {
		font-size: $font-section-title;
		font-weight: $font-section-title-weight;
		color: $brand-black;
	}

	.ress_mo {
		font-size: $font-body;
		margin-left: 16rpx;
		color: $brand-muted;
	}

	.ress_ed {
		margin-top: 8rpx;
		font-size: $font-body;
		color: $brand-muted;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.ress_bjt {
		width: 40rpx;
		height: 40rpx;
		margin: 0 20rpx;
		flex-shrink: 0;
	}

	.ress_bot {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 16rpx 20rpx;
	}

	.ress_mrt {
		font-size: 44rpx;
		color: $brand-light-muted;
	}

	.ress_mrtext {
		flex: 1;
		margin-left: 8rpx;
		font-size: $font-body;
		color: $brand-muted;
	}
	.ress_scbut {
		@include shop-button(secondary);
		font-size: $font-meta;
		padding: 0 24rpx;
		height: 56rpx;
		line-height: 56rpx;
	}

	button::after {
		border: none;
	}
	.but {
		@include shop-button(primary);
		width: calc(100% - 64rpx);
		position: fixed;
		bottom: env(safe-area-inset-bottom, 32rpx);
		left: 32rpx;
		font-size: $font-product-title;
		font-weight: $font-product-title-weight;
		height: 88rpx;
		line-height: 88rpx;
	}

	.checked {
		color: $brand-primary;
	}
</style>
