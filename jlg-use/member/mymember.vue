<template>
	<view class="container">
		<!-- 用户信息 -->
		<view class="mybg-box">
			<view class="header-Top flex-dir-row flex-y-center header-center">
				<view class="user-header-avatar">
					<image :src="userInfo.avatar_file?userInfo.avatar_file.url:'/static/logo.png'" class="avatar">
					</image>
				</view>
				<view class="flex-dir-column ml-20 ">
					<view class="flex-dir-row flex-y-center">
						<text class="f-30">{{userInfo.nickname||userInfo.username||userInfo.mobile || '匿名用户'}}</text>
					</view>
					<view class="f-30 f-w mt-10">
						限时特惠，开通即享会员专属权益
					</view>
				</view>
			</view>
		</view>
		<view class="box pt-10 ">
			<view class="mlr-4">
				<view class="f-34 mt-10 col-0">选择会员套餐</view>
				<view class=" flex-dir-row flex-y-center flex-x-between f-wrap  ">
					<view
						:class="' mt-30 flex-dir-column  flex-y-center ' + (price == index ? 'price_active' : 'priceChoice')"
						@tap.stop.prevent="onSwitchType" :data-index="index" v-for="(item, index) in typeList"
						:key="index">
						<view class="f-50 f-w600 flex-dir-row flex-y-baseline" style="padding: 50rpx;">
							<text>{{item.uls}}</text>
						</view>
						<view :class="'f-24 ' + (price == index ? 'price_active_bottom' : 'price_bottom')">
							<text><text class="f-40 f-w600">{{item.value/100}}</text>/年</text>
						</view>
					</view>
				</view>
				<view class="flex-dir-row mt-50 flex-y-center flex-x-between">
					<view class="f-34 mt-10 col-0">支付方式</view>
					<view class="flex-dir-row flex-y-center">
						<view class="iconfont icon-uniE016 f-44" style="color: #09bb07;"></view>
						<view class="ml-10">微信支付</view>
					</view>
				</view>
				<view @click="open(price)" class="f-32 mt-50 buy_btn">
					立即开通
				</view>
				<view class="tips mt-40">
					<view class="f-34 mt-30 col-0">购买说明</view>
					<view class="flex-dir-column mt-30 f-26 col-9">
						<text class="mt-10">1.付款后，不支持退款；</text>
						<text class="mt-10">2.付款后，过期未使用不补；</text>
						<text class="mt-10">3.警告：此为测试会员权益功能，付款后不发货，不生效</text>
					</view>
				</view>
				<view class="">
					<view class="f-34 mt-30 col-0">VIP特权</view>
					<view class=" flex-dir-row flex-y-center flex-x-start f-wrap  ">
						<view v-for="(item,index) in vipEquity" class="flex-dir-column mt-40 flex-y-center"
							style="width: 25%;">
							<image :src="item.url" class="vipIcon" mode=""></image>
							<text class="f-26 mt-10">{{item.title}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view><uni-pay ref="uniPay" @success="onSuccess" @create="onCreate" @cancel="onCancel"></uni-pay></view>
	</view>
	<!-- 会员中心 end -->
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
				vipEquity: [{
					url: 'https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/zk.png',
					title: '商品折扣',
				}, {
					url: 'https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/lw.png',
					title: '免费商品',
				}, {
					url: 'https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/lq.png',
					title: '会员专享券',
				}, {
					url: 'https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/kf.png',
					title: '专属客服',
				}, {
					url: 'https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/hy.png',
					title: '会员标识',
				}],
				openid: '',
				vipList: [],
				typeList: [{
						name: '每年',
						value: null,
						uls: 'VIP会员'
					},
					{
						name: '每年',
						value: null,
						uls: 'SVIP会员'
					},
				],
				price: '0',
				user_id: uniCloud.getCurrentUserInfo().uid
			}
		},
		async onLoad() {
			this.vipData();
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			// 检查当前用户会员身份，如果已开通且未过期跳转到开通页面
			let uservip = await db.collection("jlg-member").where({
				user_id: this.user_id
			}).get();
			// 如果会员数据存在
			if (uservip.result.data.length > 0) {
				// 如果会员还未过期
				if (uservip.result.data[0].failure_time > Date.now()) {
					uni.redirectTo({
						url: "/jlg-use/member/mymemberkt"
					})
				}
			}
			uni.hideLoading()
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
			onSwitchType(e) {
				let _this = this;
				_this.price = e.currentTarget.dataset.index;
			},
			// 会员价格
			vipData() {
				db.collection("jlg-parameter").get().then((res) => {
					this.typeList[0].value = res.result.data[0].vip;
					this.typeList[1].value = res.result.data[0].svip;
				});
			},
			open(e) {
				uni.showLoading({
					title: '支付中',
					mask: true
				})
				// 获取openid
				this.openid = uni.getStorageSync("uni-pay-weixin-h5-openid");
				let order_no = `${Math.floor(10000 + Math.random() * 90000)}${Date.now()}`;
				let out_trade_no = `${order_no}-1`;
				// 打开支付收银台
				this.$refs.uniPay.open({
					total_fee: e == 0 ? this.typeList[0].value : this.typeList[1].value, // 支付金额，单位分 100 = 1元
					order_no: 'V-' + order_no, // 业务系统订单号（即你自己业务系统的订单表的订单号）
					out_trade_no: out_trade_no, // 插件支付单号
					description: '山前食养商城' + e == 0 ? 'VIP' : 'SVIP' + '会员开通', // 支付描述
					type: 'vip', // 支付回调类型
					goods_arr: [], //商品信息组
					address: '', //收货地址
					preferential: '', //使用的优惠卷
					notes: '山前食养商城' + e == 0 ? 'VIP' : 'SVIP' + '会员开通', //购买备注
					origprice: this.payment, //原始价格
					deduprice: 0, //优惠卷抵扣的金额
					freight: 0, //运费金额
					is_distr: false, //是否为分销订单
					audit_status: '审核中',
					openid: this.openid,
					custom: {
						grade: e == 0 ? 1 : 0
					}
				});
			},
			onSuccess(res) {
				uni.hideLoading();
				if (res.user_order_success) {
					uni.showToast({
						title: res.user_order_success.mag,
						icon: "none",
						mask: true,
						duration: 1600
					})
					setTimeout(() => {
						uni.navigateTo({
							url: './mymemberkt'
						}, 1600)
					})
					// 代表用户已付款，且你自己写的回调成功并正确执行了
				} else {
					uni.showToast({
						title: "开通失败，请联系客服",
						icon: "none",
						duration: 1600
					})
					// 代表用户已付款，但你自己写的回调执行失败（通常是因为你的回调代码有问题）
				}
			},
			// 监听事件 - 支付订单创建成功（此时用户还未支付）
			onCreate(res) {
				console.log('create: ', res);
				// 如果只是想生成支付二维码，不需要组件自带的弹窗，则在这里可以获取到支付二维码 qr_code_image
			},
			//监听用户取消支付
			onCancel(res) {
				uni.hideLoading();
				uni.showToast({
					title: "取消支付",
					icon: "none",
					duration: 1600
				})
			},

		},
	}
</script>
<style lang="scss">
	/* pages/user/index.wxss */
	/* 用户信息 */
	page {
		background: #444153;
	}

	.mlr-4 {
		padding: 30rpx;
	}

	.mlr-55 {
		margin: 0 55rpx;
	}

	.mt-10 {
		margin-top: 10rpx !important;
	}

	.mt-30 {
		margin-top: 30rpx !important;
	}

	.mt-40 {
		margin-top: 40rpx !important;
	}

	.mt-50 {
		margin-top: 50rpx !important;
	}

	.f-42 {
		font-size: 42rpx;
	}

	.ml-10 {
		margin-left: 10rpx;
	}

	.ml-20 {
		margin-left: 20rpx;
	}

	.mybg-box {
		width: 100%;
		height: 22.5vh;
		display: block;
		overflow-x: hidden;
	}
	.buy_btn {
		@include shop-button(primary);
		line-height: 90rpx;
		height: 90rpx;
		text-align: center;
	}

	.header-center {
		margin: 30rpx 4%;
		background: linear-gradient(to right, #FFE9D1, #F3C894);
		height: 270rpx;
		border-radius: 20rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		color: #856239;
	}

	.avatar {
		width: 110rpx;
		height: 110rpx;
		border-radius: 50%;
		border: 1rpx solid #ecc69b;
	}

	.vip {
		width: 40rpx;
		height: 40rpx;
		margin-left: 1%;
	}

	.vipIcon {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}

	.box {
		background: #fff;
		border-radius: 20rpx 20rpx 0 0;
		position: relative;
		top: 0;
		width: 100%;
		height: 100%;
	}

	.priceChoice {
		width: 48%;
		border: 4rpx solid #ececec;
		box-sizing: border-box;
		border-radius: 20rpx;

	}

	.price_active {
		border: 4rpx solid #F0E0C6;
		width: 48%;
		background-color: #FCF9F4;
		box-sizing: border-box;
		border-radius: 20rpx;
	}

	.price_bottom {
		width: 100%;
		text-align: center;
		padding: 10rpx 0;
		border-top: 1rpx solid #ccc;
		box-sizing: border-box;
	}

	.price_active_bottom {
		background-color: #F0E0C6;
		width: 100%;
		text-align: center;
		padding: 10rpx 0;
		box-sizing: border-box;
	}
</style>