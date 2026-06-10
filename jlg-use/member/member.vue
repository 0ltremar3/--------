<template>
	<view>
		<view class="flex-left navbar" :style="{height:(navHeight + 8) + 'px'}">
			<view class="navbar-title" @click="goBack" :style="{top:navTop + 'px'}">
				<uni-icons type="back" size="27" color="#242424"></uni-icons>
			</view>
		</view>
		<view class="content">
			<!-- 广告海报 -->
			<view @click="naTov('./mymember')" style="margin-top: 130rpx;">
				<swiper class="swiper-list" circular>
					<swiper-item>
						<image :src="carouselList.bannerfile.url" class="swiperImg" />
					</swiper-item>
				</swiper>
			</view>
			<!-- 会员开通 -->
			<view class="membership-container">
				<view class="membership-card">
					<view class="header">
						<view class="icon-container">
							<view class="iconfont icon-huiyuandengji mr-10" style="font-size: 40rpx;"></view>
							<view class="title">
								<text>山前食养 </text>
								<text> · VIP会员</text>
							</view>
						</view>
					</view>
					<view class="subtitle">
						<view class="gift-value">
							<text>开卡即领价值{{(vipList.vip/100)}}元开卡礼</text>
						</view>
						<view class="benefits">
							<text>会员礼、优惠券、会员价等超值会员权益等你来领</text>
						</view>
					</view>
					<view class="footer">
						<view class="membership-price"></view>
						<view @click="naTov('./mymember')" class="join-button">
							立即入会
						</view>
					</view>
				</view>
			</view>
			<!-- 铂金会员权益 -->
			<view class="vip-benefits-container">
				<!-- 标题 -->
				<view class="title-container">
					<image class="icon" src="../../static/icon/zxhb2.png"></image>
					<text class="titlevip">VIP会员精选权益</text>
					<image class="icon" src="../../static/icon/zxhb1.png"></image>
				</view>
				<view class="benefits-list">
					<view v-for="(item, index) in vipEquity" :key="index" class="benefit-item">
						<image :src="item.url" class="benefit-image"></image>
						<view class="benefit-title">{{ item.title }}</view>
						<view class="benefit-content">{{ item.content }}</view>
					</view>
				</view>
			</view>
			<!-- 开卡领券 -->
			<view class="vip-coupon-container">
				<view class="coupon-header">
					<view class="header-content">
						<view class="header-title">开卡即领专享券</view>
						<view class="header-subtitle">每次续费可领，有效期一年</view>
					</view>
				</view>
				<scroll-view scroll-x class="coupon-scroll-view">
					<view class="coupon-list">
						<view v-for="(item, index) in vipcouponList" :key="index" class="coupon-item">
							<view class="coupon-info">
								<view class="coupon-price">
									{{ item.type === '满减' ? '￥' : '' }}
									<text
										class="price-text">{{ item.type === '满减' ? item.price / 100 : item.price / 10 }}</text>
									{{ item.type === '满减' ? '' : '折' }}
								</view>
								<view class="coupon-conditions">满{{ item.order_amount / 100 }}可用</view>
							</view>
							<view class="coupon-count">
								{{ 'x' + item.number }}
							</view>
							<view @click="naTov('./mymember')" class="coupon-button">
								<view class="coupon-buttons">去入会</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view style="padding: 20rpx;">
			<!-- 钻石会员权益 -->
			<view class="vip-benefits-container" style="margin-top: 0rpx;">
				<!-- 标题 -->
				<view class="title-container">
					<image class="icon" src="../../static/icon/zxhb2.png"></image>
					<text class="titlevip">SVIP会员精选权益</text>
					<image class="icon" src="../../static/icon/zxhb1.png"></image>
				</view>
				<view class="benefits-list">
					<view v-for="(item, index) in svipEquity" :key="index" class="benefit-item">
						<image :src="item.url" class="benefit-image"></image>
						<view class="benefit-title">{{ item.title }}</view>
						<view class="benefit-content">{{ item.content }}</view>
					</view>
				</view>
			</view>
			<!-- 开卡领券 -->
			<view class="vip-coupon-container">
				<view class="coupon-header">
					<view class="header-content">
						<view class="header-title">开卡即领专享券</view>
						<view class="header-subtitle">每次续费可领，有效期一年</view>
					</view>
				</view>
				<scroll-view scroll-x class="coupon-scroll-view">
					<view class="coupon-list">
						<view v-for="(item, index) in svipcouponList" :key="index" class="coupon-item">
							<view class="coupon-info">
								<view class="coupon-price">
									{{ item.type === '满减' ? '￥' : '' }}
									<text
										class="price-text">{{ item.type === '满减' ? item.price / 100 : item.price / 10 }}</text>
									{{ item.type === '满减' ? '' : '折' }}
								</view>
								<view class="coupon-conditions">满{{ item.order_amount / 100 }}可用</view>
							</view>
							<view class="coupon-count">
								{{ 'x' + item.number }}
							</view>
							<view @click="naTov('./mymember')" class="coupon-button">
								<view class="coupon-buttons">去入会</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 会员每月免费领 -->
		<view class="free-shipping-container">
			<view class="free-shipping-card">
				<view class="shipping-header">
					<view class="header-content">
						<view class="header-title">入会每月免费领，包邮送到家</view>
					</view>
				</view>
				<view v-for="(item, index) in vipgoodsList" :key="index" class="goods-item">
					<image @click="naTov(`/pages/product/product?id=${item._id}`)" :src="item.goods_thumb"
						class="goods-image"></image>
					<view class="goods-details">
						<view @click="naTov(`/pages/product/product?id=${item._id}`)" class="goods-info">
							<view class="goods-name text-element-2">{{ item.name }}</view>
							<view class="price-tag">{{ item.vip_goods === 'vip' ? 'VIP' : 'SVIP' }}售价0.1元</view>
						</view>
						<view class="price-and-button">
							<view class="price-element">
								<jlg-minPrice
									:min-price="item.suks.reduce((min, suk) => parseInt(suk.price) < parseInt(min.price) ? suk : min).price"
									maxSize="32rpx"></jlg-minPrice>
							</view>
							<view @click="naTov('./mymember')" class="get-button">
								入会领取
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 会员精选商品 -->
		<view class="allLike">
			<uv-waterfall ref="waterfall" left-gap="0" right-gap="0" column-gap="8" @changeList="changeList">
				<!-- 第一列数据 -->
				<template v-slot:list1>
					<!-- 为了磨平部分平台的BUG，必须套一层view -->
					<view>
						<view v-for="(item, index) in evengoodsList" :key="index"
							@click="naTov(`/pages/product/product?id=${item._id}`)" class="waterfall-item">
							<view class="waterfall-item__image">
								<image :src="item.goods_thumb" mode="scaleToFill" class="allLike-img">
								</image>
							</view>
							<view class="waterfall-item__ft">
								<view class="mb-10 f-28 ellipsis">
									{{item.name}}
								</view>
								<view class="flex-dir-row flex-y-center col-1C7231" :class="control?'':'mt-20'"
									style="flex-wrap: wrap;">
									<view class="coupon-btn col-1C7231" v-for="(ius, index) in couponList" :key="index"
										v-if="(ius.user_type === '所有人' || ius.user_arr.includes(user_id)) && (ius.allow_type !== '指定商品' || ius.goods_arr.includes(item._id))">
										{{ius.name}}
									</view>
								</view>
								<view class="waterfall-item__ft__desc mt-10 uv-line-2">
									<jlg-minPrice
										:min-price="item.suks.reduce((min, suk) => parseInt(suk.price) < parseInt(min.price) ? suk : min).price"
										maxSize="32rpx"></jlg-minPrice>
								</view>
							</view>
						</view>
					</view>
				</template>
				<!-- 第二列数据 -->
				<template v-slot:list2>
					<!-- 为了磨平部分平台的BUG，必须套一层view -->
					<view>
						<view v-for="(item, index) in oddgoodsList"
							@click="naTov(`/pages/product/product?id=${item._id}`)" :key="index" class="waterfall-item">
							<view class="waterfall-item__image">
								<image :src="item.goods_thumb" mode="scaleToFill" class="allLike-img">
								</image>
							</view>
							<view class="waterfall-item__ft">
								<view class="mb-10 f-28 ellipsis">
									{{item.name}}
								</view>
								<view class="flex-dir-row flex-y-center col-1C7231" :class="control?'':'mt-20'"
									style="flex-wrap: wrap;">
									<view class="coupon-btn col-1C7231" v-for="(ius, index) in couponList" :key="index"
										v-if="(ius.user_type === '所有人' || ius.user_arr.includes(user_id)) && (ius.allow_type !== '指定商品' || ius.goods_arr.includes(item._id))">
										{{ius.name}}
									</view>
								</view>
								<view class="waterfall-item__ft__desc mt-10 uv-line-2">
									<jlg-minPrice
										:min-price="item.suks.reduce((min, suk) => parseInt(suk.price) < parseInt(min.price) ? suk : min).price"
										maxSize="32rpx"></jlg-minPrice>
								</view>
							</view>
						</view>
					</view>
				</template>
			</uv-waterfall>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				navTop: null,
				navHeight: null,
				goodsList: [],
				oddgoodsList: [],
				evengoodsList: [],
				currentPage: 1, // 当前页码
				pageSize: 12,
				loadingType: 'noMore', //加载更多状态
				couponList: [],
				receiveId: [],
				user_id: uniCloud.getCurrentUserInfo().uid,
				carouselList: [],
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
				}, {
					url: 'https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/hy.png',
					title: '会员标识',
					content: '尊贵会员身份'
				}],
				svipEquity: [{
					url: 'https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/zk.png',
					title: '商品9折',
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
				}, {
					url: 'https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/hy.png',
					title: '会员标识',
					content: '尊贵会员身份'
				}],
				vipList: [],
				vipcouponList: [],
				svipcouponList: [],
				vipgoodsList: []
			}
		},
		onLoad() {
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
			this.goodsdata();
			this.receiveData();
			this.bannerdata();
			this.vipData();
			this.vipcouponData();
			this.vipgoodsData();

		},
		onReachBottom() {
			this.currentPage++;
			this.goodsdata();
		},
		methods: {
			goodsdata() {
				let that = this;
				that.loadingType = "loading";
				const skip = (that.currentPage - 1) * that.pageSize;
				// 首页推荐商品
				that.$func.myFunction('jlg-home', {
						functionName: 'goodsdata',
						data: {
							where: {
								is_best: true,
								is_on_sale: true,
							},
							skip: skip,
							pageSize: that.pageSize
						}
					})
					.then(res => {
						const bestItems = res.result; // 获取新的数据
						if (that.currentPage === 1) {
							that.goodsList = bestItems; // 如果是第一页，清空原始数据列表
							that.oddgoodsList = that.goodsList.filter((item, index) => index % 2 === 1);
							that.evengoodsList = that.goodsList.filter((item, index) => index % 2 === 0);
						} else {
							that.goodsList = that.goodsList.concat(bestItems); // 否则追加数据到原始数据列表
							that.oddgoodsList = that.goodsList.filter((item, index) => index % 2 === 1);
							that.evengoodsList = that.goodsList.filter((item, index) => index % 2 === 0);
						}
						if (bestItems.length < that.pageSize) {
							that.loadingType = "noMore";
						} else {
							that.loadingType = "more";
						}
					})
					.catch(error => {
						console.error(error);
					});
			},
			vipData() {
				db.collection("jlg-parameter").get().then((res) => {
					this.vipList = res.result.data[0];
				})
			},
			// 活动图
			bannerdata() {
				db.collection("opendb-banner").where({
					"status": true,
					"category_id": '会员中心'
				}).orderBy("sort asc").get().then((res) => {
					this.carouselList = res.result.data[0];
				})
			},
			// 会员权益券
			vipcouponData() {
				db.collection("jlg-goods-couponrule").where({
					"user_type": db.command.in(['vip', 'svip'])
				}).get().then((res) => {
					this.vipcouponList = res.result.data.filter(item => item.user_type === 'vip');
					this.svipcouponList = res.result.data.filter(item => item.user_type === 'svip');
				})
			},
			// 会员权益商品
			vipgoodsData() {
				db.collection("opendb-mall-goods").where({
					"vip_goods": db.command.in(['vip', 'svip'])
				}).get().then((res) => {
					console.log(res)
					this.vipgoodsList = res.result.data;
				})
			},
			// 优惠卷
			couponData() {
				uni.showLoading({
					title: "加载中"
				})
				this.$func.myFunction('jlg-cart', {
						functionName: 'coupondata',
						data: {
							e: 0
						}
					}).then(res => {
						this.couponList = res.result;
						this.couponList.forEach((item) => {
							if (this.receiveId.includes(item._id)) {
								item.states = false;
							} else {
								item.states = true;
							}
						});
						uni.hideLoading()
					})
					.catch(error => {
						uni.hideLoading()
						console.error(error);
					});
			},
			receiveData() {
				const that = this;
				uni.showLoading({
					title: "加载中"
				})
				db.collection("jlg-goods-coupon").where({
					"user_id": that.user_id,
					"is_use": false
				}).get().then((res) => {
					let Newdata = res.result.data;
					Newdata.forEach((item) => {
						that.receiveId.push(item.coupon_id)
					})
					that.couponData();
				})
			},
			goBack() {
				uni.navigateBack()
			},
			naTov(item) {
				uni.navigateTo({
					url: item
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		min-height: 100%;
		background: #d9f0ff;
	}

	/* 自定义顶部导航 */
	.navbar {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
	}

	.navbar .navbar-title {
		background: #ffffff54;
		border-radius: 200rpx;
		position: fixed;
		left: 20rpx;
		z-index: 10;
		padding: 4rpx;
	}


	.content {
		/* background-image: url('https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/asfasfasf2www.png'); */
		background-size: 100% 100%;
		padding: 30rpx;
	}

	.swiper-list {
		height: 240rpx;
	}

	.swiperImg {
		width: 100%;
		border-radius: 30rpx;
		height: 240rpx;
	}

	$show-lines: 1;
	@import '@/uni_modules/uv-ui-tools/libs/css/variable.scss';

	.waterfall-item {
		width: 103%;
		overflow: hidden;
		margin-top: 10px;
		border-radius: 6px;
		background-color: #fff;
	}

	.waterfall-item__ft {
		padding: 10rpx 10rpx 20rpx 10rpx;
		background: #fff;

		&__title {
			margin-bottom: 10rpx;
			line-height: 48rpx;
			font-weight: 700;

			.value {
				font-size: 32rpx;
				color: #303133;
			}
		}

		&__desc .value {
			font-size: 28rpx;
			color: #606266;
		}

		&__btn {
			padding: 10px 0;
		}
	}

	.allLike-img {
		width: 100%;
		height: 340rpx;
		border-radius: 20rpx 20rpx 0 0;
	}

	.hot-price {
		font-size: 30rpx;
		color: #1C7231;
	}

	.allLike {
		padding: 20rpx;
	}

	.coupon-btn {
		background-color: #ffefef;
		margin-right: 5rpx;
		font-size: 25rpx;
		padding: 6rpx 16rpx;
		border-radius: 10rpx;
		white-space: nowrap;
		margin-top: 10rpx;
	}

	.membership-container {
		margin-top: 50rpx;
	}

	.membership-card {
		border-radius: 20rpx;
		padding: 30rpx;
		margin-top: 50rpx;
		background-image: url('https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/fas22.png');
		background-size: 100% 100%;
	}

	.header {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.icon-container {
		font-size: 40rpx;
		color: #ff7fa9;
		font-weight: 600;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.title {
		font-size: 32rpx;
		color: #ff7fa9;
		font-weight: 600;
	}

	.subtitle {
		margin-top: 20rpx;
		color: #fff;
	}

	.gift-value {
		font-size: 36rpx;
		font-weight: 600;
	}

	.benefits {
		font-size: 28rpx;
		margin-top: 10rpx;
		color: #fff;
	}

	.footer {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;
	}

	.membership-price {
		font-size: 38rpx;
		font-weight: 600;
		color: #067192;
	}

	.join-button {
		border-radius: 2000rpx;
		padding: 10rpx 30rpx;
		background: #fff;
		color: #ff7fa9;
		font-size: 26rpx;
	}

	.vip-benefits-container {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 70rpx;
	}

	.title-container {
		font-size: 38rpx;
		font-weight: 600;
		color: #067192;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 20rpx;
	}

	.icon {
		width: 120rpx;
		height: 25rpx;
		margin-right: 10rpx;
		margin-left: 10rpx;
	}

	.benefits-list {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 20rpx;
		width: 100%;
	}

	.benefit-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.benefit-image {
		width: 95rpx;
		height: 95rpx;
		border-radius: 2000rpx;
	}

	.benefit-title {
		font-size: 24rpx;
		font-weight: 600;
		color: #067192;
		white-space: nowrap;
		margin-top: 10rpx;
	}

	.benefit-content {
		font-size: 22rpx;
		color: #31adca;
		white-space: nowrap;
	}

	.titlevip {
		font-size: 20px;
		font-weight: 600;
		color: #067192;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.vip-coupon-container {
		background: #ffffff;
		border-radius: 20rpx;
		margin-top: 50rpx;
		margin-bottom: 30rpx;
	}

	.coupon-header {
		background: #067192;
		padding: 20rpx;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		text-align: center;
	}

	.header-content {
		font-size: 36rpx;
		color: #d7f6ff;
	}

	.header-title {
		font-size: 36rpx;
		color: #d7f6ff;
	}

	.header-subtitle {
		font-size: 30rpx;
		color: #d7f6ff;
		font-weight: 600;
	}

	.coupon-scroll-view {
		padding: 30rpx 20rpx;
	}

	.coupon-list {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
	}

	.coupon-item {
		background: #ffecb6;
		padding: 20rpx;
		border-radius: 20rpx;
		text-align: center;
		margin-right: 30rpx;
		position: relative;
	}

	.coupon-info {
		padding-bottom: 20rpx;
	}

	.coupon-price {
		color: #067192;
		white-space: nowrap;
		font-size: 26rpx;
		font-weight: 600;
	}

	.price-text {
		font-size: 50rpx;
		font-weight: 600;
	}

	.coupon-conditions {
		font-size: 28rpx;
		white-space: nowrap;
	}

	.coupon-count {
		position: absolute;
		right: 0rpx;
		top: 0rpx;
		background: #067192;
		padding: 0rpx 10rpx;
		border-top-right-radius: 20rpx;
		font-size: 22rpx;
		color: #fff;
		border-bottom-left-radius: 8rpx;
	}

	.coupon-button {
		padding-top: 20rpx;
		border-top: 1rpx dashed #067192;
	}

	.coupon-buttons {
		font-size: 24rpx;
		background: #067192;
		border-radius: 2000rpx;
		padding: 5rpx 30rpx;
		color: #fff;
		white-space: nowrap;
	}

	.free-shipping-container {
		padding: 20rpx;
	}

	.free-shipping-card {
		background: #ffffff;
		border-radius: 20rpx;
		margin-top: 20rpx;
	}

	.shipping-header {
		background: #067192;
		padding: 20rpx;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		text-align: center;
	}

	.header-content {
		font-size: 36rpx;
		color: #d7f6ff;
	}

	.header-title {
		font-size: 36rpx;
		color: #d7f6ff;
	}

	.goods-item {
		display: flex;
		flex-direction: row;
		padding: 20rpx;
	}

	.goods-image {
		width: 200rpx;
		height: 200rpx;
		border-top-left-radius: 20rpx;
		border-bottom-left-radius: 20rpx;
	}

	.goods-details {
		display: flex;
		flex: 1;
		padding: 10rpx 20rpx;
		flex-direction: column;
		justify-content: space-between;
	}

	.goods-info {
		align-items: flex-start;
		flex-direction: column;
		display: flex;
	}

	.goods-name {
		font-size: 28rpx;
	}

	.price-tag {
		font-size: 22rpx;
		padding: 3rpx 10rpx;
		background: #ffd2d2;
		color: #1C7231;
		margin-top: 10rpx;
	}

	.price-and-button {
		display: flex;
		justify-content: space-between;
		align-items: center !important;
		flex-direction: row;
		color: #1C7231;
	}

	.price-element {
		display: flex;
		align-items: center;
	}

	.get-button {
		border-radius: 2000rpx;
		padding: 10rpx 30rpx;
		font-size: 24rpx;
		color: #fff;
		background: #067192;
	}
</style>