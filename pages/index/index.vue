<template>
	<view class="container">
		<jlg-bcakColor v-if="a_canvas" style="position: absolute;top:-9999999999px;z-index: -99;"
			:style="{display:canvasDisplay,width:canwid,height:canhei}" ref="bcakColor" @update="UpdateColor"
			:urlList="imgurl" :saturation="4" :brightness="8"></jlg-bcakColor>
		<!-- #ifdef MP-WEIXIN -->
		<view class="flex-left searchbar" :style="{height:(navHeight + 8) + 'px', backgroundColor:navbarbackground}">
			<view class="searchbar-title" :style="{top:navTop + 'px'}">
				<view class="flex-left search-content">
					<uv-search placeholder="请输入商品名称" v-model="searchData" shape="round" :showAction="false"
						@search="searchClick"></uv-search>
				</view>
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<uv-search placeholder="请输入商品名称" v-model="searchData" shape="round" bgColor="#fff" :showAction="false"
			@search="searchClick"></uv-search>
		<!-- #endif -->
		<!-- 头部轮播 -->
		<view class="swiper">
			<!-- #ifdef MP-WEIXIN -->
			<view class="title-background" :style="{backgroundColor:titleBackground}">
			</view>
			<!-- #endif -->
			<view :style="{marginTop:(navHeight + 10) + 'px'}">
				<swiper :indicator-dots="true" autoplay indicator-active-color="red" indicator-color="#fff"
					:duration="1000" class="swiper-list" circular @change="loadImage">
					<swiper-item v-if="item.category_id == 1" v-for="(item, index) in carouselList" :key="index"
						class="carousel-item" @click="navToDetailPage(item.open_url,0)">
						<image :src="item.bannerfile.url" class="swiperImg" />
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!-- 消息滚动 -->
		<view v-if="announce.length > 0" style="margin-bottom: 20rpx;">
			<uni-notice-bar :speed="60" showIcon="true" background-color="#fff" color="#000" scrollable
				:text="announce" />
		</view>
		<!-- 分类 -->
		<view class="navbar b-f flex-dir-row flex-y-center f-wrap  flex-x-between">
			<view @click="navToDetailPage(item.description,0)" class="nav-item" v-for="(item,index) in cetagoriesList">
				<image mode="scaleToFill" class="nav-img" :src="item.icon"></image>
				<text>{{item.name}}</text>
			</view>
		</view>
		<!-- 广告优惠轮播 -->
		<view style="width: 100%;">
			<swiper previous-margin="70px" next-margin="70px" :duration="1000" class="current-list" circular
				@change="handleSwiperChange">
				<swiper-item v-for="(item, index) in carousetowList" :key="index"
					:class="index === current ? 'current-img' : 'adv-img'" @click="navToDetailPage(item.open_url,0)">
					<image mode="scaleToFill" :src="item.bannerfile.url" />
				</swiper-item>
			</swiper>
		</view>

		<!-- 秒杀-->

		<view v-if="filteredData[0] != null" class="seckill">
			<view class="seckill-top flex-dir-row flex-y-center flex-x-between">
				<view class="flex-dir-row">
					<image class="seckill-imgs" src="/static/temp/xsmss.png" mode="widthFix"></image>
					<image class="seckill-img" src="/static/temp/secskill-img.png" mode="widthFix"></image>
				</view>
				<view class="flex-dir-row flex-y-center">
					<text v-if="control" class="seckill-tip">距离结束</text>
					<text v-else class="seckill-tip">距离下一场</text>
					<uni-countdown @timeup="delayed" ref="coun" class="ml-20" :hour="hours" :minute="minutes"
						:second="seconds" color="#FFFFFF" background-color="#1C7231" />
				</view>

			</view>
			<scroll-view class="seckill-list " scroll-x="true">
				<view v-if="filteredData[0].goods_arr.includes(item._id)" v-for="(item, index) in msgoodsList"
					:key="index" class="seckill-item mt-20 " @click="navToDetailPage(item._id,1,hours,minutes,seconds)">
					<view class=" flex-dir-column flex-x-start">
						<image :src="item.goods_thumb" class="seckill-list-img" mode="aspectFill"></image>
						<view class="seckill-title">{{item.name}}</view>
						<view class="seckill-price">
							<jlg-minPrice
								:min-price="item.fs_suks.reduce((min, suk) => parseInt(suk.price) < parseInt(min.price) ? suk : min).price"
								maxSize="27rpx" min-size="24rpx"></jlg-minPrice>
						</view>
					</view>

				</view>
			</scroll-view>
		</view>
		<!-- 热销-->

		<view class="hot mt-30">
			<view @click="allClick" class="hot-top flex-dir-row flex-y-center flex-x-between">
				<text class="f-32 col-0 f-w ">商城热销</text>
				<view class="flex-dir-row flex-y-center col-9 f-26">
					<text class="f-24 col-9">查看更多</text>
					<text class="iconfont ml-10 icon-uniE003"></text>
				</view>

			</view>
			<scroll-view class="seckill-list " scroll-x="true">
				<view v-for="(item, index) in rxgoodsList" :key="index" class="seckill-item mt-20 "
					@click="navToDetailPage(item._id)">
					<view class=" flex-dir-column flex-x-start">
						<image :src="item.goods_thumb" class="seckill-list-img" mode="aspectFill"></image>
						<view class="seckill-title">{{item.name}}</view>
						<view class="seckill-price">
							<jlg-minPrice
								:min-price="item.suks.reduce((min, suk) => parseInt(suk.price) < parseInt(min.price) ? suk : min).price"
								maxSize="27rpx" min-size="24rpx"></jlg-minPrice>
						</view>
					</view>

				</view>
			</scroll-view>
		</view>

		<!-- 强烈推荐 -->
		<view class="allLike">
			<uv-waterfall ref="waterfall" left-gap="0" right-gap="0" column-gap="8" @changeList="changeList">
				<!-- 第一列数据 -->
				<template v-slot:list1>
					<!-- 为了磨平部分平台的BUG，必须套一层view -->
					<view>
						<view v-for="(item, index) in evengoodsList" :key="index" @click="navToDetailPage(item._id)"
							class="waterfall-item">
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
						<view v-for="(item, index) in oddgoodsList" @click="navToDetailPage(item._id)" :key="index"
							class="waterfall-item">
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
		<uni-pay ref="uniPay"></uni-pay>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import BcakColor from '@/components/jlg-bcakColor/jlg-bcakColor.vue';
	const db = uniCloud.database();
	const collection = db.collection("jlg-goods-record");
	export default {
		components: {
			BcakColor
		},
		data() {
			return {
				imgurl: [], //图片链接
				searchData: '', //搜索框的值
				titleBackground: '', //识别的背景颜色
				swiperCurrent: 0, //轮播图索引
				carouselList: [], //轮播图数据
				carousetowList: [],
				cetagoriesList: [], //分类数据
				current: 0,
				goodsList: [], //商品数据
				oddgoodsList: [],
				evengoodsList: [],
				filteredData: [], //秒杀商品数据
				msgoodsList: [],
				rxgoodsList: [],
				carouselLength: [], //轮播图数据条数
				hours: null, //秒杀时间
				minutes: null, //秒杀时间
				seconds: null, //秒杀时间
				control: false, //是否为秒杀
				a_canvas: true,
				canwid: '100%',
				canhei: '300px',
				colorCache: [], // 颜色结果缓存对象
				canvasDisplay: 'flex',
				user_id: uniCloud.getCurrentUserInfo().uid,
				navTop: null,
				navHeight: null,
				scrollTop: 0, // 页面滚动位置
				navbarbackground: '', // 搜索栏背景色
				announce: '', //消息通告
				loadingType: 'noMore', //加载更多状态
				couponList: [],
				receiveId: [],
				currentPage: 1, // 当前页码
				pageSize: 10,
			};
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
		onPageScroll(e) {
			const scrollTop = e.scrollTop; // 获取当前滚动位置
			const backgroundColor = scrollTop > 0 ? '#ffffff' : ''; // 根据滚动位置设置背景色
			this.navbarbackground = backgroundColor;
		},
		onLoad(options = {}) {
			this.titleBackground = "rgb(221, 221, 221)";
			this.bannerdata();
			this.cetagories();
			this.goodsdata();
			this.seckilldata();
			this.announceData();
			this.receiveData();
			this.mrgoodsdata();
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
			// #ifdef H5
			// 微信公众号特殊逻辑开始-----------------------------------------------------------
			if (this.h5Env === 'h5-weixin') {
				let openid = uni.getStorageSync("uni-pay-weixin-h5-openid");
				let code = uni.getStorageSync("uni-pay-weixin-h5-code");
				if (openid) {
					this.openid = openid;
				}
				// 如果code和state有值，且此code没有被使用过，则执行获取微信公众号的openid
				if (options.code && options.state && code !== options.code) {
					// 获取微信公众号的openid
					setTimeout(() => {
						this.getOpenid({
							provider: "wxpay",
							code: options.code
						});
					}, 300);
				} else if (!openid) {
					// 如果openid为空，则执行微信公众号的网页授权登录逻辑
					setTimeout(() => {
						this.getWeiXinJsCode();
					}, 300);
				}
			}
			// 微信公众号特殊逻辑结束-----------------------------------------------------------
			// #endif
		},
		//加载更多
		onReachBottom() {
			this.currentPage++;
			this.goodsdata();
		},
		onShow() {
			if (this.colorCache.length == 0) {
				this.$refs.bcakColor.open();
			}
		},
		methods: {
			async getWeiXinJsCode() {
				let res = await this.$refs.uniPay.getProviderAppId({
					provider: "wxpay",
					provider_pay_type: "jsapi"
				});
				if (res.appid) {
					let appid = res.appid;
					let redirect_uri = window.location.href.split("?")[0];
					let url =
						`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
					window.location.href = url;
				}
			},
			// 获取公众号openid
			async getOpenid(data = {}) {
				let res = await this.$refs.uniPay.getOpenid(data);
				if (res) {
					this.openid = res.openid;
					// 将openid缓存到本地
					uni.setStorageSync("uni-pay-weixin-h5-openid", this.openid);
					uni.setStorageSync("uni-pay-weixin-h5-code", data.code);
				}
			},
			//搜索
			searchClick() {
				uni.navigateTo({
					url: `/pages/coupon/prefeList?search=${this.searchData}`
				})
			},
			allClick() {
				uni.navigateTo({
					url: `/pages/coupon/prefeList?hot=hot`
				})
			},
			handleSwiperChange(event) {
				this.current = event.detail.current;
			},
			bannerdata() {
				db.collection("opendb-banner").where({
					"status": true
				}).orderBy("sort asc").get().then((res) => {
					this.carouselList = res.result.data
					res.result.data.forEach(item => {
						if (item.category_id === "2") {
							this.carousetowList.push(item)
						} else if (item.category_id === "1") {
							this.imgurl.push(item.bannerfile.url)
						}
					})
					// #ifdef MP-WEIXIN
					let myIntive = setInterval(() => {
						if (this.imgurl.length == this.carouselLength.length) {
							clearInterval(myIntive)
							this.$refs.bcakColor.open();
						}
					}, 100)
					// #endif
					this.carouselLength = this.carouselList.filter(item => item.category_id === "1");
				})
			},
			delayed() {
				this.seckilldata()
				this.$refs.coun.update();

				setTimeout(() => {
					this.$refs.coun.update();
				}, 1500); // 延迟1秒后再次执行
			},
			cetagories() {
				this.$func.myFunction('jlg-home', {
						functionName: 'cetagories',
						data: {}
					})
					.then(res => {
						this.cetagoriesList = res.result
					})
					.catch(error => {
						console.error(error);
					});
			},
			seckilldata() {
				this.$func.myFunction('jlg-home', {
						functionName: 'seckilldata',
						data: {}
					})
					.then(res => {
						this.filteredData = res.result.filteredData;
						this.hours = res.result.hours;
						this.minutes = res.result.minutes;
						this.seconds = res.result.seconds;
						this.control = res.result.control;
					})
					.catch(error => {
						console.error(error);
					});
			},
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
					.then(async res => {
						const bestItems = res.result; // 获取新的数据
						if (that.currentPage === 1) {
							that.goodsList = await bestItems; // 如果是第一页，清空原始数据列表
							that.oddgoodsList = await that.goodsList.filter((item, index) => index % 2 === 1);
							that.evengoodsList = await that.goodsList.filter((item, index) => index % 2 === 0);
						} else {
							that.goodsList = await that.goodsList.concat(bestItems); // 否则追加数据到原始数据列表
							that.oddgoodsList = await that.goodsList.filter((item, index) => index % 2 === 1);
							that.evengoodsList = await that.goodsList.filter((item, index) => index % 2 === 0);
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
			mrgoodsdata() {
				let that = this;
				// 秒杀商品
				that.$func.myFunction('jlg-home', {
						functionName: 'mrgoodsdata',
						data: {}
					})
					.then(res => {
						that.msgoodsList = res.result.ms; // 获取新的数据
						that.rxgoodsList = res.result.rx; // 获取新的数据
					})
					.catch(error => {
						console.error(error);
					});
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
				uni.showLoading({
					title: "加载中"
				})
				db.collection("jlg-goods-coupon").where({
					"user_id": this.user_id,
					"is_use": false
				}).get().then((res) => {
					let Newdata = res.result.data;
					Newdata.forEach((item) => {
						this.receiveId.push(item.coupon_id)
					})
					this.couponData();
				})
			},
			//浏览记录
			navToDetailPage(id, e, h, m, s) {
				if (e == 1 || e != 0) {
					const self = this;
					uniCloud.callFunction({
						name: "jlg-record",
						data: {
							user_id: self.user_id,
							id: id
						}
					}).then((res) => {}).catch((err) => {
						self.navigateToPage(id, e);
						uni.showToast({
							title: "浏览记录未成功更新",
							icon: "none",
							duration: 600
						});
					});
					self.navigateToPage(id, e, h, m, s);
				} else {
					uni.navigateTo({
						url: `${id}`
					});
				}
			},
			//详情页
			navigateToPage(id, e, h, m, s) {
				if (e == 1) {
					if (this.control) {
						uni.navigateTo({
							url: `/pages/product/product?id=${id}&control=${this.control}&hours=${h}&minutes=${m}&seconds=${s}`
						});
					} else {
						uni.showToast({
							title: "秒杀未开始",
							icon: "none",
							duration: 2000
						});
					}
				} else {
					uni.navigateTo({
						url: `/pages/product/product?id=${id}`
					});
				}
			},
			loadImage(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
				// #ifdef MP-WEIXIN
				this.titleBackground = this.colorCache[index];
				// #endif
				if (this.colorCache.length > 0 && this.a_canvas) {
					this.a_canvas = false;
					this.canvasDisplay =
						'none';
					this.canwid = 0;
					this.canhei = 0;
				}
			},
			announceData() {
				db.collection("jlg-announce").get().then((res) => {
					this.announce = res.result.data[0].content;
				})
			},
			UpdateColor(value) {
				this.colorCache = value;
			},
		},
		computed: {
			h5Env() {
				// #ifdef H5
				let ua = window.navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == 'micromessenger' && (ua.match(/miniprogram/i) == 'miniprogram')) {
					// 微信小程序
					return "mp-weixin";
				}
				if (ua.match(/MicroMessenger/i) == 'micromessenger') {
					// 微信公众号
					return "h5-weixin";
				}
				if (ua.match(/alipay/i) == 'alipay' && ua.match(/miniprogram/i) == 'miniprogram') {
					return "mp-alipay";
				}
				if (ua.match(/alipay/i) == 'alipay') {
					return "h5-alipay";
				}
				// 外部 H5
				return "h5";
				// #endif
			},
			// 计算当前是否是ios app
			isIosAppCom() {
				// #ifdef H5
				let info = uni.getSystemInfoSync();
				return info.uniPlatform === 'app' && info.osName === 'ios' ? true : false;
				// #endif
			},
			// 计算当前是否是PC环境
			isPcCom() {
				// #ifdef H5
				let info = uni.getSystemInfoSync();
				return info.deviceType === 'pc' ? true : false;
				// #endif
				return false;
			}
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
		padding: 20rpx;
		box-sizing: border-box;
	}

	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		-webkit-appearance: none;
		background: transparent;
		color: transparent;
	}

	/* 自定义顶部导航 */
	.searchbar {
		width: 100%;
		overflow: hidden;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
		flex-shrink: 0;
		transition: background-color 0.3s ease;
	}

	.searchbar .searchbar-title {
		width: 100%;
		position: fixed;
		left: 20rpx;
		z-index: 10;
	}

	.searchbar .searchbar-return {
		width: 70rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		position: fixed;
		left: 0;
	}

	.searchbar .icon-arrow-left {
		font-size: 36rpx;
		color: #333;
	}

	.searchbar .search-content {
		display: flex;
		flex-direction: row;
		width: 70%;
		height: 60rpx;
		background-color: #eaeaea;
		border-radius: 100rpx;
	}

	.searchbar .icon-search {
		font-size: 40rpx;
		color: #A0A0A0;
		padding: 0 5rpx;
	}

	.searchbar .search-input {
		font-size: 25rpx;
		color: #666;
		height: 60rpx;
	}



	.swiper-list {
		height: 300rpx;
	}

	.current-list {
		height: 520rpx;
	}

	.swiper {
		margin-top: 30rpx;
		height: 320rpx;
	}

	.swiperImg {
		width: 100%;
		border-radius: 30rpx;
		height: 300rpx;
	}

	.title-background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 260rpx;
		/* #ifdef MP-WEIXIN */
		height: 400rpx;
		/* #endif */
		transition: .4s;
		border-radius: 0 0 65rpx 65rpx;
		transition: background-color 1s ease;
	}

	/* 分类 */
	.navbar {
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		border-radius: 20rpx;
	}

	.nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 26rpx;
		color: #303133;
	}

	.nav-img {
		width: 88upx;
		height: 88upx;
		margin-bottom: 14upx;
		border-radius: 20rpx;
	}

	/* 广告轮播 */
	.adv {
		margin: 10rpx 30rpx;
		width: 690rpx;
		padding: 30rpx;
		box-sizing: border-box;
		border-radius: 20rpx;
		height: 200px;
		/* 设置轮播图的高度 */
	}

	/* 设置当前指示点对应的图片放大样式 */
	.current-img {
		width: 100%;
		height: 100%;
		padding: 20rpx 25rpx;
		transition: padding 1s;

		image {
			width: 100%;
			height: 100%;
			border-radius: 15rpx;
		}
	}


	.adv-img {
		width: 100%;
		height: 100%;
		padding: 45rpx 0;
		transition: padding 1s;

		image {
			width: 100%;
			height: 100%;
			border-radius: 15rpx;
		}
	}

	// 限时秒杀
	.seckill {
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		border-radius: 20rpx;
		height: 200px;
		background: linear-gradient(to top, #ffffff, #ffd8d8);
	}

	.seckill-list {
		white-space: nowrap;
		width: 100%;
	}

	.seckill-item {
		display: inline-block;
		width: 140rpx;
		font-size: 29rpx;
		margin-right: 30rpx;
	}

	.seckill-img {
		width: 140rpx;
	}

	.seckill-imgs {
		width: 38rpx;
		margin-right: 7rpx;
		margin-top: -1rpx;
	}

	.seckill-list-img {
		width: 150rpx;
		height: 150rpx;
		border-radius: 15rpx;
	}

	.seckill-title {
		width: 140rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		-o-text-overflow: ellipsis;
		font-size: 28rpx;
		margin-top: 10rpx;
	}

	.seckill-tip {
		font-size: 26rpx;
		color: #737373;
	}

	.seckill-price {
		color: #1C7231;
		margin-top: 5rpx;
		font-size: 26rpx;
	}

	// 限时秒杀
	.hot {
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		border-radius: 20rpx;
		height: 200px;
		background: #fff;
		margin-bottom: 10rpx;
	}

	.allLike-header {
		margin: auto;
		color: #d21515;
		width: 94.5%;
		height: 40rpx;
		padding: 40rpx;
		background: #fff;
		border-radius: 20rpx;
		font-weight: 600;
		margin-bottom: 10rpx;
	}

	.allLike-header image {
		width: 290rpx;
		height: 85rpx;
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

	.coupon-btn {
		background-color: #ffefef;
		margin-right: 5rpx;
		font-size: 25rpx;
		padding: 6rpx 16rpx;
		border-radius: 10rpx;
		white-space: nowrap;
		margin-top: 10rpx;
	}

	.allLike {}
</style>