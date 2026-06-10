<template>
	<view class="container">
		<uv-empty v-if="ressList.length == 0" mode="data" icon="/static/temp/shwk.png" text="地址为空"></uv-empty>
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
				<view class="ress_mrtext">默认地址</view>
				<button class="ress_scbut" @click="deleteress(item._id)">删除</button>
			</view>
		</view>
		<button @click="novTo" class="but">新增地址</button>
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
					title: "加载中"
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
					title: "删除提示",
					content: "确认删除此地址？",
					success: function(res) {
						if (res.confirm) {
							db.collection("jlg-goods-address").doc(id).remove().then(() => {
								uni.showToast({
									title: "删除成功",
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
					title: "修改中",
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
							title: "修改成功",
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

<style>
	page {
		background: #f3f3f3;
		height: 100%;
	}

	.container {
		position: relative;
		padding: 30rpx;
		padding-bottom: 200rpx;
	}

	.ress_van {
		width: 100%;
		height: 250rpx;
		background-color: #fff;
		border-radius: 25rpx;
		margin-bottom: 30rpx;
	}

	.ress_top {
		width: 100%;
		height: 175rpx;
		display: flex;
		flex-direction: row;
		border-bottom: 1rpx solid #d8d8d8;
	}

	.ress_dwt {
		width: 58rpx;
		height: 58rpx;
		margin: auto 20rpx;
		border-radius: 50%;
	}

	.ress_text_van {
		margin: auto 0rpx;
		width: 72%;
	}

	.fs_34 {
		font-size: 34rpx
	}

	.ress_mo {
		font-size: 30rpx;
		margin-left: 10rpx;
		color: #4c4c4c;
	}

	.ress_ed {
		margin-top: 6rpx;
		font-size: 30rpx;
		color: #4c4c4c;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.ress_bjt {
		width: 50rpx;
		height: 50rpx;
		margin: auto 20rpx;
	}

	.ress_bot {
		display: flex;
		flex-direction: row;
	}

	.ress_mrt {
		margin: auto 10rpx auto 20rpx;
		font-size: 58rpx;
		color: #d8d8d8;
	}

	.ress_mrtext {
		display: flex;
		flex: 1;
		margin: auto 0rpx;
		font-size: 30rpx;
		color: #4c4c4c;
	}

	.ress_scbut {
		background-color: rgba(255, 255, 255, 0);
		font-size: 30rpx;
		color: #4c4c4c;
	}

	button::after {
		border: none;
	}

	.but {
		width: 94%;
		position: fixed;
		bottom: 16rpx;
		left: 50%;
		transform: translateX(-50%);
		font-size: 32rpx;
		color: #ffffff;
		background-color: #1C7231;
		border-radius: 100rpx;
		height: 84rpx;
		line-height: 84rpx;
		z-index: 9999;
	}

	.checked {
		color: #1C7231;
	}
</style>