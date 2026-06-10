<template>
	<view class="container">
		<image style="position: absolute;top: 0;z-index: -1;" class="user-bgimg" src="../../static/temp/grzx.jpg">
		</image>
		<!-- #ifdef MP-WEIXIN -->
		<view style="padding: 30rpx;padding-top: 180rpx;">
		<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<view style="padding: 30rpx;">
			<!-- #endif -->
				<view class="user-section flex-dir-column" @click.capture="toUserInfo">
					<view class="user-top">
						<view class="portrait-box">
							<image class="portrait" v-if="hasLogin&&userInfo.avatar_file&&userInfo.avatar_file.url"
								:src="userInfo.avatar_file.url"></image>
							<view v-else class="defaultAvatarUrl">
								<image class="portrait" src="../../static/logo.png"></image>
							</view>
						</view>
						<view class="info-box">
							<text class="username"
								v-if="hasLogin">{{userInfo.nickname||userInfo.username||userInfo.mobile || '匿名用户'}}</text>
							<text class="username" v-else>{{$t('mine.notLogged')}}</text>
						</view>
					</view>
					<view class="col-f pl-30 flex-dir-row flex-y-center" style="margin-top: 16rpx;">
						<text class="iconfont f-44 mr-10 icon-uniE040"></text>
						<text class="f-28"
							style="height: 40rpx;">{{hasLogin && !membershipLevel?'普通用户':(hasLogin && membershipLevel == 0?'SVIP会员':(hasLogin && membershipLevel == 1?'VIP会员':'用户登陆'))}}</text>
					</view>
				</view>
				<view class="list-center">
					<view class="list-item">
						<view class="flex-dir-row pt-20 pl-20 pr-20 b-b pb-20 flex-y-center flex-x-between "
							@click="navTo('/pages/order/order?state=99')">
							<view class="col-0 f-28">
								我的订单
							</view>
							<view class="flex-dir-row flex-y-center">
								<text class="col-9 f-26">全部</text>
								<text class="iconfont ml-20 icon-uniE003"></text>
							</view>
						</view>
						<view class="flex-dir-row b-f pt-20  pb-20   flex-y-center flex-x-around bb-rl-rad20">
							<view class="order-item p-r flex-dir-column flex-y-center"
								@click="navTo('/pages/order/order?state=0')" hover-class="common-hover"
								:hover-stay-time="50">
								<view class="badge">
									<uv-badge type="error" max="99" :value="items[0]">
									</uv-badge>
								</view>
								<view style="padding-top: 5rpx;">
									<text class="iconfont icon-qianbao4 "
										style="font-size: 58rpx;font-weight: 100;"></text>
								</view>
								<text class="f-29">待付款</text>
							</view>

							<view v-if="" class="order-item p-r flex-dir-column flex-y-center"
								@click="navTo('/pages/order/order?state=1')" hover-class="common-hover"
								:hover-stay-time="50">
								<view class="badge">
									<uv-badge type="error" max="99" :value="items[1]">
									</uv-badge>
								</view>

								<text class="iconfont f-60 icon-uniE00C" style="color: #363636;;"></text>
								<text class="f-29">待收货</text>
							</view>
							<view class="order-item flex-dir-column p-r flex-y-center"
								@click="navTo('/pages/order/order?state=5')" hover-class="common-hover"
								:hover-stay-time="50">
								<view class="badge">
									<uv-badge type="error" max="99" :value="items[2]">
									</uv-badge>
								</view>

								<text class="iconfont icon-xiaoxi2 " style="font-size: 58rpx;"></text>
								<text class="f-29">待评价</text>
							</view>
							<view class="order-item flex-dir-column  p-r flex-y-center"
								@click="navTo('/pages/order/order?state=6')" hover-class="common-hover"
								:hover-stay-time="50">
								<view style="right: 30rpx;" class="badge">
									<uv-badge type="error" max="99" :value="items[3]">
									</uv-badge>
								</view>
								<text class="iconfont icon-tuikuan" style="font-size: 60rpx;"></text>
								<text class="f-29">退款/售后</text>
							</view>
						</view>
					</view>
					<view class="list-item  mb-60 f-28 bt-rl-rad20">
						<view class="flex-dir-column b-b b-f pt-20 bt-rl-rad20">
							<view class="pl-30 flex-dir-row flex-y-center">
								<text class="iconfont mr-10 f-50 icon-uniE01e"
									style="color: #5eba8f;font-size: 42rpx;"></text>
								<text style="height: 39rpx;">浏览历史</text>
							</view>
							<scroll-view class="lsimg-list" scroll-x>
								<image @click="navigator(item.goodsId[0])" mode="aspectFill"
									v-for="(item,index) in recordList" :key="index" :src="item.image[0]">
								</image>
							</scroll-view>
						</view>
						<view @tap="jumpToUrl" :data-url="vipurl"
							class="flex-dir-row   b-f pb-20  pt-20   b-b flex-y-center flex-x-between">
							<view class="flex-dir-row pl-30 flex-y-center ">
								<text class="iconfont mr-10 icon-huiyuandengji"
									style="color:#ffaa00;font-size: 40rpx;"></text>
								<text style="height: 40rpx;">会员中心</text>
							</view>
							<view class="flex-dir-row flex-y-center pr-30">
								<text class="col-9 f-24">会员享5大特权</text>
								<text class="iconfont ml-20 icon-uniE003" style="color:#999;"></text>
							</view>
						</view>
						<view @tap="jumpToUrl" data-url="/pages/coupon/coupon"
							class="flex-dir-row   b-f pb-20  pt-20   b-b flex-y-center flex-x-between">
							<view class="flex-dir-row pl-30 flex-y-center ">
								<text class="iconfont mr-10 icon-youhuiquan1"
									style="color:#e07472;font-size: 44rpx;"></text>
								<text style="height: 40rpx;">领劵中心</text>
							</view>
							<view class="flex-dir-row flex-y-center pr-30">
								<text class="col-9 f-24">领劵购物更优惠</text>
								<text class="iconfont ml-20 icon-uniE003" style="color:#999;"></text>
							</view>
						</view>
						<view @tap="jumpToUrl" data-url="/pages/address/list"
							class="flex-dir-row   b-f pb-20  pt-20   b-b flex-y-center flex-x-between">
							<view class="flex-dir-row pl-30 flex-y-center ">
								<text class="iconfont f-40 mr-10 icon-uniE03d" style="color:#5fcda2;"></text>
								<text style="height: 39rpx;">地址管理</text>
							</view>
							<view class="flex-dir-row flex-y-center pr-30">
								<text class="iconfont ml-20 icon-uniE003" style="color:#999;"></text>
							</view>
						</view>
						<!-- #ifndef APP -->
						<view @tap="jumpToUrl" data-url="/jlg-use/distribution/list"
							class="flex-dir-row   b-f pb-20  pt-20   b-b flex-y-center flex-x-between">
							<view class="flex-dir-row pl-30 flex-y-center ">
								<text class="iconfont f-40 mr-10 icon-Njifenxiao-2" style="color:#9789f7;"></text>
								<text style="height: 39rpx;">分销中心</text>
							</view>
							<view class="flex-dir-row flex-y-center pr-30">
								<text class="col-9 f-24">邀请好友赢好礼</text>
								<text class="iconfont ml-20 icon-uniE003" style="color:#999;"></text>
							</view>
						</view>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<button class="btn-normal " open-type="contact" @contact="contactClick">
							<view class="flex-dir-row flex-y-center pb-20 b-b flex-x-between pt-20">
								<view class="flex-dir-row pl-30 flex-y-center ">
									<text class="iconfont mr-10 f-44 icon-uniE029" style="color:#ee883b; "></text>
									<text style="height: 39rpx;">联系客服</text>
								</view>
								<view class="flex-dir-row flex-y-center pr-30">
									<text class="col-9 f-24">有问题请及时联系我们哦</text>
									<text class="iconfont ml-20 icon-uniE003" style="color:#999;"></text>
								</view>
							</view>

						</button>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<button class="btn-normal " @click="gzhClick">
							<view class="flex-dir-row flex-y-center pb-20 b-b flex-x-between pt-20">
								<view class="flex-dir-row pl-30 flex-y-center ">
									<text class="iconfont mr-10 f-44 icon-uniE029" style="color:#ee883b; "></text>
									<text style="height: 39rpx;">联系客服</text>
								</view>
								<view class="flex-dir-row flex-y-center pr-30">
									<text class="col-9 f-24">有问题请及时联系我们哦</text>
									<text class="iconfont ml-20 icon-uniE003" style="color:#999;"></text>
								</view>
							</view>

						</button>
						<!-- #endif -->
						<view @tap="jumpToUrl" data-url="/pages/collect/collect"
							class="flex-dir-row   b-f pb-20  pt-20   b-b flex-y-center flex-x-between">
							<view class="flex-dir-row pl-30 flex-y-center ">
								<text class="iconfont mr-10 icon-uniE023"
									style="color:#54b4ef;font-size: 46rpx;"></text>
								<text style="height: 39rpx;">我的收藏</text>
							</view>
							<view class="flex-dir-row flex-y-center pr-30">
								<text class="iconfont ml-20 icon-uniE003" style="color:#999;"></text>
							</view>
						</view>
						<view @tap="jumpToUrl" data-url="/jlg-use/problem/problem"
							class="flex-dir-row   b-f pb-20  pt-20   b-b flex-y-center flex-x-between">
							<view class="flex-dir-row pl-30 flex-y-center ">
								<text class="iconfont mr-10 icon-bangzhu"
									style="color:#ffcc70;font-size: 42rpx;"></text>
								<text style="height: 39rpx;">常见问题</text>
							</view>
							<view class="flex-dir-row flex-y-center pr-30">
								<text class="iconfont ml-20 icon-uniE003" style="color:#999;"></text>
							</view>
						</view>
						<view @tap="jumpToUrl" data-url="/pages/ucenter/settings/settings"
							class="flex-dir-row b-f pb-20  pt-20    flex-y-center flex-x-between bb-rl-rad20">
							<view class="flex-dir-row pl-30 flex-y-center ">
								<text class="iconfont mr-10 icon-uniE00f"
									style="color:#e07472;font-size: 46rpx;"></text>
								<text style="height: 39rpx;">设置</text>
							</view>
							<view class="flex-dir-row flex-y-center pr-30">
								<text class="iconfont ml-20 icon-uniE003" style="color:#999;"></text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js';
	export default {
		data() {
			return {
				user_id: uniCloud.getCurrentUserInfo().uid,
				recordList: [],
				items: [],
				uservipList: [],
				membershipLevel: null,
				vipurl: '/jlg-use/member/mymember'

			}
		},
		onShow() {
			this.recordData();
			this.uservipData();
			let a = [];
			let b = [];
			let c = [];
			let d = [];
			db.collection('uni-pay-orders').where({
				'user_id': this.user_id,
				'type': "goods",
			}).field('type,status,custom').get().then((res) => {
				for (let i = 0; i < res.result.data.length; i++) {
					if (res.result.data[i].status == 0 && !res.result.data[i].custom) {
						a.push(res.result.data[i])
					}
					if ([1, 4].includes(res.result.data[i].status)) {
						b.push(res.result.data[i])
					}
					if (res.result.data[i].status == 5) {
						c.push(res.result.data[i])
					}
					if (res.result.data[i].status == 6) {
						d.push(res.result.data[i])
					}
				}
				this.items[0] = a.length
				this.items[1] = b.length
				this.items[2] = c.length
				this.items[3] = d.length
			})
		},
		computed: {
			userInfo() {
				return store.userInfo
			},
			hasLogin() {
				return store.hasLogin
			}
		},
		methods: {
			// 用户会员数据
			uservipData() {
				db.collection("jlg-member").where({
					user_id: this.user_id
				}).get().then((res) => {
					this.uservipList = res.result.data;
					if (this.uservipList.length > 0) {
						if (this.uservipList[0].failure_time > Date.now()) {
							this.membershipLevel = this.uservipList[0].grade;
							this.vipurl = '/jlg-use/member/mymemberkt'
						}
					}
				})
			},
			recordData() {
				db.collection("jlg-goods-record,opendb-mall-goods").where({
					"user_id": this.user_id,
					"goods_id.is_on_sale": true
				}).field("goods_id.goods_thumb as image,modify_date,goods_id._id as goodsId").orderBy(
					"modify_date desc").limit(50).get().then((res) => {
					this.recordList = res.result.data
				})
			},
			jumpToUrl(e) {
				console.log(e)
				uni.navigateTo({
					url: e.currentTarget.dataset.url
				})
			},
			navigator(id) {
				const self = this;
				uniCloud.callFunction({
					name: "jlg-record",
					data: {
						user_id: self.user_id,
						id: id
					}
				}).then((res) => {

				}).catch((err) => {
					uni.navigateTo({
						url: `/pages/product/product?id=${id}`
					});
					uni.showToast({
						title: "浏览记录未成功更新",
						icon: "none",
						duration: 600
					});
				});
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				});
			},
			gzhClick() {
				uni.showModal({
					title: "跳转提示",
					content: "即将跳转至微信公众号，点击头像关注后输入您的问题！",
					success: function(res) {
						if (res.confirm) {
							window.location.href =
								`https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzkwNzUyMjMxOQ==#wechat_redirect`
						}
					}
				})
			},
			navTo(url) {
				uni.navigateTo({
					url: url
				})
			},
			toUserInfo() {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/userinfo/userinfo'
				})
			},
			contactClick(e) {
				console.log(e)
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #fafafa;
	}

	.container {
		position: relative;
		z-index: 0;
	}

	.user-bgimg {
		width: 100%;
		height: 505rpx;
	}

	.user-section {
		display: flex;
		background: #faa28e;
		width: 100%;
		height: 296rpx;
		border-radius: 20rpx;
		box-sizing: border-box;
		color: #fff;
		margin-bottom: 25rpx;
	}

	.lsimg-list {
		padding: 20rpx 30rpx 30rpx 30rpx;
		white-space: nowrap;

		image {
			border-radius: 10rpx;
			height: 160rpx;
			width: 160rpx;
			margin-right: 20rpx;
		}
	}

	.bg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		filter: blur(1px);
		opacity: .7;
	}

	.uni-list-item {
		border-top-left-radius: 10upx;
		border-top-right-radius: 10upx;
	}

	.user-top {
		display: flex;
		align-items: center;
		z-index: 1;
		background: #ffffff;
		width: 100%;
		border-radius: 20rpx;
		height: 220rpx;
		box-sizing: border-box;
		padding: 0 30rpx;

		.portrait {
			width: 115upx;
			height: 115upx;
			border: 5upx solid #fff;
			border-radius: 50%;
		}

		.username {
			font-size: 32upx;
			color: #303133;
			margin-left: 20upx;
		}
	}

	.badge {
		position: absolute;
		top: -3rpx;
		right: 3px;
	}

	.list-item {
		background-color: #fff;
		border-radius: 20rpx;
		margin-bottom: 25rpx;
	}

	.b-b {
		border-bottom: 1rpx solid #f5f5f5;
	}



	.list-center {
		padding-bottom: 100rpx;
	}
</style>