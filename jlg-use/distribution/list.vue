<template>
	<view class="container p-r">
		<!-- #ifdef MP-WEIXIN -->
		<view class="navbar" @click="goBack" :style="{top:(navTop ) + 'px'}">
			<uni-icons type="back" size="27" color="#202321"></uni-icons>
		</view>
		<!-- #endif -->
		<view class="header">
			<view class="flex-dir-row flex-y-center flex-x-between user-row" :style="{marginTop:(navTop +30 ) + 'px'}">
				<view class="flex-dir-row flex-y-center">
					<image :src="avatarUrl" class="litpic" mode="aspectFill" @error="avatarLoadError = true"></image>
					<view class="header-right flex-dir-column">
						<view class="header-title f-w f-32">
							{{userName}}
						</view>
						<view class="flex-dir-row mt-5 flex-y-center user-badge">
							<text>分销商</text>
						</view>
					</view>
				</view>
				<view class="share-btn" @click="distribuLink">
					邀请好友
				</view>
			</view>

			<view class="header-center">
				<view class="flex-dir-row flex-x-around flex-y-center header-center-top">
					<view class="flex-dir-column flex-y-center comm-stat">
						<view class="comm-label">累计佣金(元)</view>
						<view class="comm-amount flex-y-baseline f-w600">
							<text>￥</text>
							<text>{{data.accu_comm /100?data.accu_comm /100:0}}</text>
						</view>
					</view>
					<view class="flex-dir-column flex-y-center comm-stat">
						<view class="comm-label">已提佣金(元)</view>
						<view class="comm-amount flex-y-baseline f-w600">
							<text>￥</text>
							<text>{{data.with_comm /100?data.with_comm /100:0}}</text>
						</view>
					</view>
					<view class="flex-dir-column flex-y-center comm-stat">
						<view class="comm-label">佣金余额(元)</view>
						<view class="comm-amount f-w600">
							<text>￥</text>
							<text>{{data.uodr_comm /100?data.uodr_comm /100:0}}</text>
						</view>
					</view>
				</view>

				<view class="flex-dir-row flex-y-center comm-grid">
					<view class="flex-dir-column comm-cell cell-rb">
						<text class="comm-cell-label">待审核佣金</text>
						<text class="comm-cell-value">￥{{examprice/100}}</text>
					</view>
					<view class="flex-dir-column comm-cell cell-b">
						<text class="comm-cell-label">可提现</text>
						<text class="comm-cell-value">￥{{data.uodr_comm /100?data.uodr_comm /100:0}}</text>
					</view>
				</view>
				<view class="flex-dir-row flex-y-center comm-grid">
					<view class="flex-dir-column comm-cell cell-r">
						<text class="comm-cell-label">审核中的提现</text>
						<text class="comm-cell-value">￥{{winprice/100}}</text>
					</view>
					<view class="flex-dir-column comm-cell">
						<text class="comm-cell-label">已提现</text>
						<text class="comm-cell-value">￥{{data.with_comm /100?data.with_comm /100:0}}</text>
					</view>
				</view>
				<view class="flex-dir-row comm-btns flex-y-center">
					<view class="comm-btn-wrap">
						<view class="btn-ghost f-28" @click="navigator(4)">提现记录</view>
					</view>
					<view class="comm-btn-wrap">
						<view class="btn-primary f-28" @click="navigator(2)">立即提现</view>
					</view>
				</view>
			</view>

			<view class="center flex-dir-column">
				<view class="flex-dir-row b-b pb-25 mb-25 flex-y-center flex-x-between">
					<view class="flex-dir-row flex-y-center">
						<text class="f-32 entry-title">更多功能</text>
					</view>
				</view>
				<view class="flex-dir-row b-b pb-25 mb-25 flex-y-center flex-x-between" @click="navigator(0)">
					<view class="flex-dir-row flex-y-center">
						<text class="iconfont icon-xiangmuchaxun-guanlichengyuan entry-icon ml-20 mr-10"></text>
						<text class="f-30 entry-text">成员信息</text>
					</view>
					<text class="iconfont icon-uniE003 icon-chevron ml-20"></text>
				</view>
				<view class="flex-dir-row b-b pb-25 mb-25 flex-y-center flex-x-between" @click="navigator(3)">
					<view class="flex-dir-row flex-y-center">
						<text class="iconfont icon-xinxi entry-icon ml-20 mr-14"></text>
						<text class="f-30 entry-text">提现信息</text>
					</view>
					<text class="iconfont icon-uniE003 icon-chevron ml-20"></text>
				</view>
				<view class="flex-dir-row flex-y-center flex-x-between" @click="navigator(1)">
					<view class="flex-dir-row flex-y-center">
						<text class="iconfont icon-dingdan21 entry-icon ml-20 mr-10"></text>
						<text class="f-30 entry-text">分销订单</text>
					</view>
					<text class="iconfont icon-uniE003 icon-chevron ml-20"></text>
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
				user_id: uniCloud.getCurrentUserInfo().uid,
				data: {},
				commpropo: [],
				dataURL: null,
				show: false,
				defaultAvatar: '/static/logo.png',
				avatarLoadError: false,
				navTop: -30,
				navHeight: null,
				winprice: 0,
				examprice: 0,
			}
		},
		computed: {
			avatarUrl() {
				if (this.avatarLoadError) {
					return this.defaultAvatar
				}
				return this.getAvatarUrl(this.data.image)
			},
			userName() {
				const name = this.data.name
				if (Array.isArray(name)) {
					return name[0] || '匿名用户'
				}
				return name || '匿名用户'
			}
		},
		onLoad() {
			this.disrrData()
			// #ifdef MP-WEIXIN
			//获取搜索栏高度
			let menuButtonObject = wx.getMenuButtonBoundingClientRect();
			wx.getSystemInfo({
				success: res => {
					//导航高度
					let statusBarHeight = res.statusBarHeight;
					this.navTop = menuButtonObject.top;
					this.navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top -
						statusBarHeight) * 2;
				},
				fail(err) {
					console.log(err);
				}
			})
			// #endif
		},
		methods: {
			distribuLink() {
				uni.navigateTo({
					url: "./distrList"
				})
			},
			disrrData() {
				uni.showLoading({
					title: "加载中..."
				})
				let that = this;
				let where = {
					"user_id": that.user_id
				}
				db.collection("jlg-distribution-propor").get().then((res) => {
					that.commpropo = res.result.data[0]
				})
				that.examprice = 0;
				//遍历审核中的分销订单累计订单的佣金
				db.collection("jlg-distribution").where(where).get().then((res) => {
					let newdata = res.result.data[0];
					that.$func.myFunction('jlg-cart', {
							functionName: 'orderDate',
							data: {
								userid: newdata.user_arr,
								commpropo: that.commpropo
							}
						})
						.then(res => {
							let orderList = res.result.data
							orderList.forEach(item => {
								if (item.audit_status == '审核中') {
									that.examprice += item.comm
								}
							})
						})
						.catch(error => {
							console.error(error);
						});
				})
				// 遍历审核中的提现请求
				that.winprice = 0;
				db.collection("jlg-withdrawal").where(where).get().then((res) => {
					let winList = res.result.data;
					winList.forEach(item => {
						if (item.state == '审核中') {
							that.winprice += item.price
						}
					})
				})
				// 查询当前用户的分销数据
				db.collection("jlg-distribution,uni-id-users").where({
						"user_id._id": that.user_id
					}).field(
						"user_id.avatar_file as image,level,user_id.nickname as name,user_arr.avatar_file as images,user_arr.nickname as names,user_arr._id as userid,accu_comm,with_comm,uodr_comm"
					)
					.get().then((res) => {
						uni.hideLoading();
						if (res.result.data.length > 0) {
							that.avatarLoadError = false
							that.data = res.result.data[0]
						} else {
							db.collection("jlg-distribution").add({
								"user_arr": [],
								"level": 0,
								"accu_comm": 0,
								"uodr_comm": 0
							}).then(() => {
								setTimeout(() => that.disrrData(), 500)
							})
						}
					})
			},
			goBack() {
				uni.navigateBack()
			},
			getAvatarUrl(image) {
				if (Array.isArray(image)) {
					const avatar = image.find(item => item && (typeof item === 'string' || item.url))
					return avatar ? this.getAvatarUrl(avatar) : this.defaultAvatar
				}
				if (typeof image === 'string') {
					return image || this.defaultAvatar
				}
				if (image && typeof image === 'object') {
					return image.url || this.defaultAvatar
				}
				return this.defaultAvatar
			},
			navigator(e) {
				if (e == 0) {
					uni.navigateTo({
						url: "./memberInforma"
					})
				} else if (e == 1) {
					uni.navigateTo({
						url: "./distributionOrders"
					})
				} else if (e == 3) {
					uni.navigateTo({
						url: "/uni_modules/uni-id-pages/pages/userinfo/userinfo"
					})
				} else if (e == 4) {
					uni.navigateTo({
						url: "./withdrawalrecord"
					})
				} else if (e == 2) {
					db.collection('uni-id-users').doc(this.user_id).field("withdrawal").get().then((res) => {
						if (res.result.data[0].withdrawal == null) {
							uni.navigateTo({
								url: "/uni_modules/uni-id-pages/pages/userinfo/bind-mobile/bind-mobile?statu=bangding"
							})
						} else {
							if (this.data.uodr_comm <= 0) {
								uni.showToast({
									title: "余额不足",
									icon: "none",
									duration: 1600
								})
							} else {
								db.collection('uni-id-users').doc(this.user_id).field("withdrawal").get().then((
									res) => {
									if (res.result.data[0].withdrawal == null) {
										uni.navigateTo({
											url: "/uni_modules/uni-id-pages/pages/userinfo/bind-mobile/bind-mobile?statu=bangding"
										})
									} else {
										uni.showLoading({
											title: "提交申请中"
										})
										db.collection("jlg-withdrawal").add({
											"price": this.data.uodr_comm,
											"state": '审核中',
											"source": '分销'
										}).then(() => {
											db.collection("jlg-distribution").where({
												"user_id": this.user_id
											}).get().then((res) => {
												let withcomm = res.result.data[0]
													.with_comm ? res.result.data[0]
													.with_comm + this.data.uodr_comm : this
													.data.uodr_comm;
												db.collection("jlg-distribution").where({
														"user_id": this.user_id
													})
													.update({
														"with_comm": withcomm,
														"uodr_comm": 0
													}).then(() => {
														uni.hideLoading();
														uni.showToast({
															title: "申请已提交，等待审核",
															icon: "none",
															duration: 2000
														})
														this.disrrData()
													})
											})
										})
									}
								})
							}
						}
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $brand-bg;
		color: $brand-text;
		height: 100%;
	}

	.header {
		width: 100%;
		min-height: 100vh;
		padding: 40rpx 32rpx 100rpx 32rpx;
		box-sizing: border-box;
		background-color: $brand-bg;
	}

	.user-row {
		margin-bottom: 4rpx;
	}

	.litpic {
		width: 112rpx;
		height: 112rpx;
		background-color: $brand-image-bg;
		border-radius: $uni-border-radius-circle;
	}

	.header-right {
		margin-left: 24rpx;
	}

	.user-badge {
		font-size: $font-meta;
		color: $brand-muted;
		margin-top: 8rpx;
	}

	/* 邀请按钮 — ghost 风格 */
	.share-btn {
		@include shop-button(secondary);
		font-size: $font-meta;
		padding: 12rpx 28rpx;
	}

	/* 佣金数据卡 */
	.header-center {
		margin: 32rpx 0 0 0;
		background-color: $brand-surface;
		box-sizing: border-box;
		border-radius: $uni-border-radius-lg;
		border: 1rpx solid $brand-border;
	}

	.header-center-top {
		padding: 40rpx 24rpx;
		border-bottom: 1rpx solid $brand-border;
		border-radius: $uni-border-radius-lg $uni-border-radius-lg 0 0;
	}

	.comm-stat {
		flex: 1;
		align-items: center;
	}

	.comm-label {
		font-size: $font-meta;
		color: $brand-muted;
		font-weight: $font-meta-weight;
	}

	.comm-amount {
		font-size: 36rpx;
		color: $brand-primary;
		margin-top: 12rpx;
	}

	/* 四格明细区 */
	.comm-grid {
		padding: 0 32rpx;
	}

	.comm-cell {
		flex: 1;
		padding: 24rpx 0 24rpx 24rpx;
	}

	.cell-r  { border-right: 1rpx solid $brand-border; }
	.cell-b  { border-bottom: 1rpx solid $brand-border; }
	.cell-rb { border-right: 1rpx solid $brand-border; border-bottom: 1rpx solid $brand-border; }

	.comm-cell-label {
		font-size: $font-meta;
		color: $brand-muted;
	}

	.comm-cell-value {
		font-size: $font-price;
		font-weight: $font-price-weight;
		color: $brand-text;
		margin-top: 10rpx;
	}

	/* 操作按钮区 */
	.comm-btns {
		padding: 24rpx 32rpx 28rpx 32rpx;
		gap: 16rpx;
	}

	.comm-btn-wrap {
		flex: 1;
	}
	.btn-ghost {
		@include shop-button(secondary);
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: $font-body;
		font-weight: $font-product-title-weight;
	}
	.btn-primary {
		@include shop-button(primary);
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: $font-body;
		font-weight: $font-product-title-weight;
	}

	/* 功能入口卡 */
	.center {
		width: 100%;
		margin-top: 32rpx;
		box-sizing: border-box;
		color: $brand-text;
		background: $brand-surface;
		padding: 28rpx 24rpx;
		border-radius: $uni-border-radius-lg;
		border: 1rpx solid $brand-border;
	}

	.entry-icon {
		font-size: 48rpx;
		height: 28rpx;
		line-height: 28rpx;
		color: $brand-primary;
	}

	.entry-title {
		font-size: $font-section-title;
		font-weight: $font-section-title-weight;
		color: $brand-black;
	}

	.entry-text {
		font-size: $font-product-title;
		color: $brand-text;
	}

	.icon-chevron {
		font-size: 32rpx;
		color: $brand-light-muted;
	}

	.b-b {
		border-bottom: 1rpx solid $brand-border;
	}

	.mr-14 {
		margin-right: 14rpx;
	}

	/* 定位辅助 */
	.p-a { position: absolute; }
	.p-r { position: relative; }

	button::after {
		border: none;
	}

	/* 自定义顶部返回按钮 */
	.navbar {
		position: fixed;
		left: 20rpx;
		z-index: 10;
		padding: 4rpx;
	}
</style>
