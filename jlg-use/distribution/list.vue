<template>
	<view class="container p-r">
		<!-- #ifdef MP-WEIXIN -->
		<view class=" navbar" @click="goBack" :style="{top:(navTop ) + 'px'}">
			<uni-icons type="back" size="27" color="#fff"></uni-icons>
		</view>
		<!-- #endif -->
		<view class="header">
			<view class="flex-dir-row flex-y-center flex-x-between " :style="{marginTop:(navTop +30 ) + 'px'}">
				<view class="flex-dir-row flex-y-center">
					<image :src="data.image?data.image[0].url:'/static/logo.png'" class="litpic" mode=""></image>
					<view class="header-right flex-dir-column ">
						<view class="header-title f-w f-32">
							{{data.name[0]?data.name[0]:'匿名用户'}}
						</view>
						<view class="flex-dir-row mt-5 flex-y-center f-27">
							<text>分销商</text>
						</view>
					</view>
				</view>
				<view class="share-btn" @click="distribuLink">
					邀请好友
				</view>
			</view>

			<view class="header-center  col-ff721c">
				<view class="flex-dir-row flex-x-around flex-y-center header-center-top">
					<view class="flex-dir-column flex-y-center">
						<view class=" f-26 ">
							累计佣金(元)
						</view>
						<view class="f-36 mt-10 flex-y-baseline f-w600">
							<text>￥</text>
							<text>{{data.accu_comm /100?data.accu_comm /100:0}}</text>
						</view>

					</view>
					<view class="flex-dir-column flex-y-center">
						<view class=" f-26 ">
							已提佣金(元)
						</view>
						<view class="f-36 mt-10 flex-y-baseline f-w600">
							<text>￥</text>
							<text>{{data.with_comm /100?data.with_comm /100:0}}</text>
						</view>

					</view>
					<view class="flex-dir-column  flex-y-center">
						<view class=" f-26">
							佣金余额(元)
						</view>
						<view class="f-36 mt-10 f-w600">
							<text>￥</text>
							<text class="">{{data.uodr_comm /100?data.uodr_comm /100:0}}</text>
						</view>

					</view>
				</view>

				<view class="flex-dir-row  pl-30 pr-30 flex-y-center">
					<view class="flex-dir-column pt-20 pb-20  pl-30 f-26 col-6 w-50 f-28"
						style="border-right: 1rpx solid #eee;border-bottom: 1rpx solid #eee;">
						<text>待审核佣金</text>
						<text class="col-0 f-32 mt-10 f-w600">￥{{examprice/100}}</text>
					</view>
					<view class="flex-dir-column  pt-20 pb-20 pl-30 f-26 col-6  w-50 f-28"
						style="border-bottom: 1rpx solid #eee;">
						<text>可提现</text>
						<text class="col-0 f-32 mt-10 f-w600">￥{{data.uodr_comm /100?data.uodr_comm /100:0}}</text>
					</view>
				</view>
				<view class="flex-dir-row pl-30 pr-30  flex-y-center ">
					<view class="flex-dir-column  pt-20 pb-20 pl-30 f-26 col-6  w-50 f-28"
						style="border-right: 1rpx solid #eee;">
						<text>审核中的提现</text>
						<text class="col-0 f-32 mt-10 f-w600">￥{{winprice/100}}</text>
					</view>
					<view class="flex-dir-column  pt-20 pb-20 pl-30 f-26 col-6  w-50 f-28">
						<text>已提现</text>
						<text class="col-0 f-32 mt-10 f-w600">￥{{data.with_comm /100?data.with_comm /100:0}}</text>
					</view>
				</view>
				<view class="flex-dir-row mb-10 plr-30 flex-y-center w-100">
					<view style="flex: 0 0 calc(47%);margin: auto;">
						<view class=" btn1 f-28" @click="navigator(4)">
							提现记录
						</view>
					</view>
					<view style="flex: 0 0 calc(47%);margin: auto;">
						<view class=" btn2  f-28" @click="navigator(2)">
							立即提现
						</view>
					</view>
				</view>
			</view>
			<view class="center flex-dir-column">
				<view class="flex-dir-row b-b pb-25 mb-25 flex-y-center flex-x-between">
					<view class="flex-dir-row flex-y-center">
						<text class="ml-20 mr-10"
							style="color:#3e9dff;font-size: 56rpx;height: 20rpx;line-height: 28rpx;"></text>
						<text class="f-32">更多功能</text>
					</view>
				</view>
				<view class="flex-dir-row b-b pb-25 mb-25 flex-y-center flex-x-between" @click="navigator(0)">
					<view class="flex-dir-row flex-y-center">
						<text class="iconfont ml-20 mr-10 icon-xiangmuchaxun-guanlichengyuan"
							style="color:#3e9dff;font-size: 50rpx;height: 20rpx;line-height: 24rpx;"></text>
						<text class="f-30">成员信息</text>
					</view>
					<text class="iconfont ml-20 icon-uniE003" style="color:#999;"></text>
				</view>
				<view class="flex-dir-row b-b pb-25 mb-25 flex-y-center flex-x-between" @click="navigator(3)">
					<view class="flex-dir-row flex-y-center">
						<text class="iconfont ml-20 icon-xinxi"
							style="color:#d557ff;font-size: 44rpx;height: 20rpx;line-height: 24rpx;margin-right: 14rpx;"></text>
						<text class="f-30">提现信息</text>
					</view>
					<text class="iconfont ml-20 icon-uniE003" style="color:#999;"></text>
				</view>
				<view class="flex-dir-row  flex-y-center flex-x-between" @click="navigator(1)">
					<view class="flex-dir-row flex-y-center">
						<text class="iconfont ml-20 mr-10 icon-dingdan21"
							style="color:#ffaa00;font-size: 50rpx;height: 20rpx;line-height: 24rpx;margin-left: 17rpx;"></text>
						<text class="f-30">分销订单</text>
					</view>
					<text class="iconfont ml-20 icon-uniE003" style="color:#999;"></text>
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
				data: [],
				commpropo: [],
				dataURL: null,
				show: false,
				navTop: -30,
				navHeight: null,
				winprice: 0,
				examprice: 0,
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
						that.data = res.result.data[0]
						uni.hideLoading();
						if (res.result.data.length == 0) {
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

<style>
	page {
		background-color: #f5f5f5;
		color: #fff;
		height: 100%;
	}


	.header {
		background-image: url('/static/temp/back.jpg');
		background-repeat: no-repeat;
		background-size: 100% 130vh;
		width: 100%;
		height: 100vh;
		padding: 40rpx 30rpx 100rpx 30rpx;
		box-sizing: border-box;
	}

	.litpic {
		width: 115rpx;
		height: 115rpx;
		background-color: #fff;
		border-radius: 50%;
	}

	.header-center {
		margin: 30rpx 0 0 0;
		background-color: #fff;
		box-sizing: border-box;
		border-radius: 30rpx;
		box-shadow: 0rpx 16rpx 30rpx -1rpx #bfbfbf;
	}

	.header-right {
		margin-left: 30rpx;
	}

	.center {
		width: 100%;
		margin-top: 60rpx;
		box-sizing: border-box;
		color: #000;
		background: #fff;
		padding: 25rpx 20rpx;
		border-radius: 30rpx;
	}




	.list-item {
		background-color: #fff;
		box-shadow: 0px 1px 14px 1px #f5f5f5;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 50rpx;
		width: 40%;
		color: #000;
		border-radius: 20rpx;
		padding: 40rpx 30rpx;
		box-sizing: border-box;
		font-size: 30rpx;
	}

	.list-item image {
		width: 110rpx;
		height: 110rpx;
		border-radius: 15rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
	}

	.popup {
		top: 390rpx;
		left: 0%;
		width: 100%;
		z-index: 10000000000000000000000;
	}

	.popup-center {
		position: absolute;
		top: 20rpx;
		left: 26%;
	}

	.avatarimg {
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%;
	}

	.popup-name {
		color: #9c684a;
		font-size: 32rpx;
		margin-bottom: 90rpx;
		margin-top: 5px;
	}

	.popup-text {
		color: #9c684a;
		font-size: 42rpx;
		font-weight: 700;
		margin-bottom: 60rpx;
	}

	.popup-join {
		color: #9c684a;
		font-size: 36rpx;
		margin-top: 40rpx
	}

	.p-a {
		position: absolute;
	}

	.p-r {
		position: relative;
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

	.share-btn {
		font-size: 27rpx;
		color: #ec3758;
		background-color: #ffe7c9;
		border-radius: 97rpx;
		padding: 10rpx 30rpx;
	}

	.header-center-top {
		background: linear-gradient(to right, #fff6eb, #ffdfb9);
		padding: 40rpx 30rpx;
		border-radius: 20rpx 20rpx 0 0;
		color: #9c684a;
	}

	.btn1 {
		border: #ec3758 1rpx solid;
		color: #ec3758;
		text-align: center;
		border-radius: 50rpx;
		padding: 22rpx 0rpx;
	}

	.btn2 {
		background-color: #ec3758;
		border: #ec3758 1rpx solid;
		color: #FFF;
		text-align: center;
		border-radius: 50rpx;
		padding: 22rpx 0rpx;
	}

	.b-b {
		border-bottom: 1rpx solid #eee;
	}

	/* 自定义顶部导航 */


	.navbar {
		border-radius: 200rpx;
		position: fixed;
		left: 20rpx;
		z-index: 10;
		padding: 4rpx;
	}

	.navbar .navbar-return {
		width: 70rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		position: fixed;
		left: 0;
	}

	.navbar .icon-arrow-left {
		font-size: 36rpx;
		color: #333;
	}

	.navbar .search-content {
		display: flex;
		flex-direction: row;
		width: 70%;
		height: 60rpx;
		background-color: #eaeaea;
		border-radius: 100rpx;
	}

	.navbar .icon-search {
		font-size: 40rpx;
		color: #A0A0A0;
		padding: 0 5rpx;
	}

	.navbar .search-input {
		font-size: 25rpx;
		color: #666;
		height: 60rpx;
	}
</style>