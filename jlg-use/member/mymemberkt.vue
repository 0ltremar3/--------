<template>
	<view class="container">
		<!-- 用户信息 -->
		<view class="box">
			<view class=" header-center">
				<view class="flex-dir-row mt-10 col-252525 flex-y-center flex-x-between">
					<view class="flex-dir-row mt-10 flex-y-center">
						<view class="user-header-avatar">
							<image :src="userInfo.avatar_file?userInfo.avatar_file.url:'./../static/logo.png'"
								class="avatar"></image>
						</view>
						<view class="flex-dir-column col-f ml-20 ">
							<view class="flex-dir-row flex-y-center">
								<text
									class="f-32">{{userInfo.nickname||userInfo.username||userInfo.mobile || '匿名用户'}}</text>
								<view class="buy_btn f-20 ml-10" style="padding: 5rpx 15rpx;">
									{{uservipList[0].grade == 0?'SVIP':'VIP'}}
								</view>
							</view>
							<view class="f-24 col-7e7e7e  mt-10">
								{{uservipList[0].failure_time > time?formatDate(uservipList[0].failure_time):'已'}}到期
							</view>
						</view>
					</view>
					<view @click="open()" class="buy_btn f-24">
						立即续费
					</view>
				</view>
				<view class=" flex-dir-row flex-y-center flex-x-start f-wrap  " style="padding-bottom: 20rpx;">
					<view v-for="(item,index) in vipEquity" class="flex-dir-column mt-40 flex-y-center"
						style="width: 25%;">
						<view class="vipIcon">
							<image :src="item.url" class="vipIconImg" mode=""></image>
						</view>
						<text class="col-f mt-5 f-28">{{item.title}}</text>
						<text class="f-20 mt-5 col-7e7e7e">{{item.content}}</text>
					</view>
				</view>
			</view>
			<view class="mlr-4">
				<view class="f-34 flex-dir-column mt-40 col-0">
					<text class="f-32 col-0 f-w">会员专享券</text>
					<text class="f-24 mt-5 col-9">开卡即领，会员全场通用，预计年省704元</text>
				</view>
				<view class="flex-dir-row flex-y-center flex-x-start f-wrap  mb-40  ">
					<view class="mt-30 flex-dir-column  flex-y-center coupon" :data-index="index"
						v-for="(item, index) in uservipList[0].grade == 0?svipcouponList:vipcouponList" :key="index">
						<view class="f-20  typeBtn ">{{item.type}}</view>
						<view class="f-42 flex-dir-row  f-w mt-20 flex-y-baseline">
							<text class="f-24">{{ item.type === '满减' ? '￥' : '' }}</text>
							<text>{{item.type === '满减' ?item.price / 100:item.price / 10}}</text>
							<text class="f-24">{{ item.type === '满减' ? '' : '折' }}</text>
						</view>
						<view class="f-24 mt-5">
							满{{item.order_amount / 100}}可用
						</view>
						<view class="coupon-line">

						</view>
						<view @click="naTov('/pages/coupon/mycoupon')" class="f-24 mt-10 mb-10"
							style="color:#8F4E3D ;font-weight: ;">
							立即查看
						</view>
					</view>
				</view>
			</view>
			<view class="line">

			</view>
			<view class="mlr-4">
				<view class="f-34 flex-dir-column mt-40 col-0">
					<text class="f-32 col-0 f-w">会员每月免费领</text>
					<text class="f-24 mt-5 col-9">精选优质商品</text>
				</view>
				<view class="flex-dir-row flex-y-center flex-x-start f-wrap  mb-40  ">
					<view class="mt-30 flex-dir-column   product" :data-index="index"
						v-for="(item, index) in vipgoodsList" :key="index">
						<image :src="item.goods_thumb" class="product-img" mode="aspectFill"></image>
						<view class="f-26 twolist-hidden w-100  col-0 text-element-2">
							{{item.name}}
						</view>
						<view class="flex-dir-row mt-10 flex-y-center">
							<view class="price-bg col-0 f-28 f-w">
								<text class="f-20">￥</text>
								<text>{{0.1}}</text>
							</view>
							<view class="vBg">
								{{item.vip_goods == 'svip'?'SVIP':'VIP'}}
							</view>
						</view>
						<view class="flex-dir-row flex-y-center flex-x-between">
							<view class="flex-dir-row mt-5 f-w  f-32 col-ff0101 flex-y-baseline">
								<view>
									<jlg-minPrice
										:min-price="item.suks.reduce((min, suk) => parseInt(suk.price) < parseInt(min.price) ? suk : min).price"
										maxSize="32rpx"></jlg-minPrice>
								</view>
							</view>
							<view @click="naTov('./membergoods')" class="product_btn f-20 w-nowrap">
								领取
							</view>
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
				uservipList: [],
				vipgoodsList: [],
				time: Date.now(),
				user_id: uniCloud.getCurrentUserInfo().uid,
				vipEquity: [{
					url: 'https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/zk.png',
					title: '商品9.5折',
					content: '全场可用'
				}, {
					url: 'https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/lw.png',
					title: '专属商品',
					content: '每月免费送'
				}, {
					url: 'https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/lq.png',
					title: '会员专享券',
					content: '等值优惠券'
				}, {
					url: 'https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/kf.png',
					title: '专属客服',
					content: '1v1专属客服'
				}],
				vipcouponList: [],
				svipcouponList: [],
				openid: '',
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
			}
		},
		onLoad() {
			this.uservipData();
			this.vipcouponData();
			this.vipgoodsData();
			this.vipData();
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
			// 会员权益券
			vipcouponData() {
				db.collection("jlg-goods-couponrule").where({
					"user_type": db.command.in(['vip', 'svip'])
				}).get().then((res) => {
					this.vipcouponList = res.result.data.filter(item => item.user_type === 'vip');
					this.svipcouponList = res.result.data.filter(item => item.user_type === 'svip');
				})
			},
			// 用户会员数据
			uservipData() {
				db.collection("jlg-member").where({
					user_id: this.user_id
				}).get().then((res) => {
					this.uservipList = res.result.data;
				})
			},
			// 会员免费商品
			vipgoodsData() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				db.collection("opendb-mall-goods").where({
					"vip_goods": db.command.in(['vip', 'svip'])
				}).get().then((res) => {
					this.vipgoodsList = res.result.data;
					uni.hideLoading()
				})
			},
			// 会员价格
			vipData() {
				db.collection("jlg-parameter").get().then((res) => {
					this.typeList[0].value = res.result.data[0].vip;
					this.typeList[1].value = res.result.data[0].svip;
					uni.hideLoading()
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
					total_fee: this.uservipList[0].grade == 0 ? this.typeList[1].value : this.typeList[0]
						.value, // 支付金额，单位分 100 = 1元
					order_no: 'V-' + order_no, // 业务系统订单号（即你自己业务系统的订单表的订单号）
					out_trade_no: out_trade_no, // 插件支付单号
					description: '山前食养商城' + this.uservipList[0].grade == 0 ? 'SVIP' : 'VIP' + '会员开通', // 支付描述
					type: 'vip', // 支付回调类型
					goods_arr: [], //商品信息组
					address: '', //收货地址
					preferential: '', //使用的优惠卷
					notes: '山前食养商城' + this.uservipList[0].grade == 0 ? 'SVIP' : 'VIP' + '会员开通', //购买备注
					origprice: this.payment, //原始价格
					deduprice: 0, //优惠卷抵扣的金额
					freight: 0, //运费金额
					is_distr: false, //是否为分销订单
					audit_status: '审核中',
					openid: this.openid,
					custom: {
						grade: this.uservipList[0].grade
					}
				});
			},
			naTov(item) {
				uni.navigateTo({
					url: item
				})
			},
			formatDate(timestamp) {
				const date = new Date(timestamp);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}.${month}.${day}`;
			},
			onSuccess(res) {
				uni.hideLoading();
				if (res.user_order_success) {
					uni.showToast({
						title: res.user_order_success.msg,
						icon: "none",
						duration: 1600
					})
					setTimeout(() => this.uservipData(), 1600)
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
<style>
	/* pages/user/index.wxss */
	/* 用户信息 */
	page {
		background: #2E251C;
	}

	.w-100 {
		width: 100%;
	}

	.mlr-4 {
		margin: 0 4%;
	}

	.mlr-55 {
		margin: 0 55rpx;
	}

	.mt-10 {
		margin-top: 10rpx !important;
	}

	.col-ff0101 {
		color: #ff0101;
	}

	.col-7e7e7e {
		color: #7e7e7e;
	}

	.col-252525 {
		color: #FBDAA8
	}

	.col-0 {
		color: #000 !important
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

	.line {
		width: 100%;
		height: 20rpx;
		background-color: #F6F6F8;
	}


	.buy_btn {
		background: linear-gradient(to right, #FECD81, #FED89B);
		color: #2f2214;
		padding: 10rpx 30rpx;
		border-radius: 50rpx;
	}

	.header-center {
		margin: 30rpx 4%;
		background: linear-gradient(to right, #424242, #2C2C2E);
		border-radius: 20rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		color: #856239;
		margin-top: -180rpx;
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
		width: 95rpx;
		height: 95rpx;
		border-radius: 50%;
		background-color: #656156;
		text-align: center;
		line-height: 100rpx;
	}

	.vipIconImg {
		width: 90rpx;
		height: 90rpx;
		border-radius: 50%;
	}

	.box {
		background: #fff;
		border-radius: 20rpx 20rpx 0 0;
		position: relative;
		top: 210rpx;
		width: 100%;
		min-height: 100vh;
		padding-top: 10rpx;
	}

	.coupon {
		background: linear-gradient(to bottom, #FEF1CF, #FFE3B5);
		border-radius: 10rpx;
		color: #8F4E3D;
		width: 22.8%;
		margin-right: 20rpx;
	}


	.coupon:nth-child(4n) {
		margin-right: 0;
	}

	.product {

		border-radius: 10rpx;
		color: #8F4E3D;
		width: 31.3%;
		margin-right: 20rpx;
	}

	.product-img {
		width: 100%;
		height: 195rpx !important;
		border-radius: 15rpx;
		margin-bottom: 10rpx;

	}

	.product:nth-child(3n) {
		margin-right: 0;
	}

	.product_btn {
		color: #fff;
		background: linear-gradient(to right, #ff3a3a, #61A189);
		border-radius: 8rpx;
		box-sizing: border-box;
		text-align: center;
		padding: 5rpx 15rpx;
	}

	.typeBtn {
		font-size: 20rpx;
		background-color: #FDDDB1;
		padding: 4rpx 12rpx;
		border-radius: 0 0 10rpx 10rpx;
		color: #9B5B38;
	}

	.coupon-line {
		width: 100%;
		border-top: 1rpx dashed #9b8675;
		margin-top: 20rpx;
	}

	.price-bg {
		background-color: #FDEBD0;
		padding: 2rpx 6rpx;
		box-sizing: border-box;
		border-radius: 10rpx 0 0 10rpx;
	}

	.vBg {
		background-color: #33393F;
		color: #FEE6CB;
		font-size: 22rpx;
		padding: 6rpx 10rpx 4rpx 3px;
		box-sizing: border-box;
		font-style: initial;
		border-radius: 0 10rpx 10rpx 0;
	}
</style>