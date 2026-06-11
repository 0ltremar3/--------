<template>
	<view class="container">
		<jlg-bcakColor v-if="a_canvas" style="position: absolute;top:-9999999999px;z-index: -99;"
			:style="{display:canvasDisplay,width:canwid,height:canhei}" ref="bcakColor" @update="UpdateColor"
			:urlList="imgurl" :saturation="4" :brightness="8"></jlg-bcakColor>

		<!-- #ifdef MP-WEIXIN -->
		<!-- 品牌导航（小程序） -->
		<view class="brand-nav" :style="{height:(navHeight + 8) + 'px', backgroundColor: navbarbackground}">
			<view class="brand-nav__bar" :style="{top: navTop + 'px'}">
				<!-- 左侧图标容器 -->
				<view class="brand-nav__left">
					<view class="brand-nav__icon-btn" @click="switchLang">
						<image src="/static/icons/lang.svg" class="brand-nav__icon-img" mode="aspectFit" />
					</view>
					<view class="brand-nav__divider"></view>
					<view class="brand-nav__icon-btn" @click="searchClick">
						<image src="/static/icons/search.svg" class="brand-nav__icon-img" mode="aspectFit" />
					</view>
				</view>
				<text class="brand-nav__title">山前食养</text>
				<!-- 右侧占位，保持标题居中 -->
				<view class="brand-nav__right"></view>
			</view>
		</view>
		<!-- #endif -->

		<!-- #ifndef MP-WEIXIN -->
		<view class="brand-searchbar">
			<text class="brand-searchbar__logo">山前食养</text>
			<uv-search placeholder="搜索商品" v-model="searchData" shape="square" bgColor="#F7F8F5"
				:showAction="false" @search="searchClick" style="flex:1; min-width: 0;"></uv-search>
		</view>
		<!-- #endif -->

		<!-- Hero 首屏轮播 -->
		<view class="hero-wrap">
			<!-- #ifdef MP-WEIXIN -->
			<view class="hero-bg" :style="{backgroundColor:titleBackground}"></view>
			<!-- #endif -->
			<view :style="{marginTop:(navHeight + 10) + 'px'}">
				<swiper :indicator-dots="true" autoplay indicator-active-color="#61A189"
					indicator-color="rgba(255,255,255,0.4)" :duration="1000" class="hero__swiper" circular
					@change="loadImage">
					<swiper-item v-if="item.category_id == 1" v-for="(item, index) in carouselList" :key="index"
						@click="navToDetailPage(item.open_url,0)">
						<image :src="item.bannerfile.url" class="hero__img" mode="aspectFill" />
					</swiper-item>
				</swiper>
			</view>
		</view>

		<!-- 公告 -->
		<view v-if="announce.length > 0" class="announce-bar">
			<text class="announce-bar__label">· 公告 ·</text>
			<view class="announce-bar__track">
				<text class="announce-bar__text">{{announce}}</text>
			</view>
		</view>

		<!-- 分类横向 tab（图标 + 文字，居中） -->
		<view class="cat-tabs">
			<view class="cat-tabs__wrap">
				<view @click="navToDetailPage(item.description,0)" class="cat-tabs__item"
					v-for="(item,index) in cetagoriesList" :key="index">
					<image mode="aspectFill" class="cat-tabs__icon" :src="item.icon"></image>
					<text class="cat-tabs__label">{{item.name}}</text>
				</view>
			</view>
		</view>

		<!-- 广告横滑轮播（统一大小，无缩放） -->
		<view class="ad-swiper">
			<swiper previous-margin="60rpx" next-margin="60rpx" :duration="500" class="ad-swiper__list" circular
				@change="handleSwiperChange">
				<swiper-item v-for="(item, index) in carousetowList" :key="index" class="ad-swiper__item"
					@click="navToDetailPage(item.open_url,0)">
					<image mode="aspectFill" :src="item.bannerfile.url" class="ad-swiper__img" />
				</swiper-item>
			</swiper>
		</view>

		<!-- 限时精选（秒杀）-->
		<view v-if="filteredData[0] != null" class="section">
			<view class="section__hd">
				<text class="text-section-title">限时精选</text>
				<view class="flex-dir-row flex-y-center">
					<text v-if="control" class="text-meta">距结束</text>
					<text v-else class="text-meta">距下场</text>
					<uni-countdown @timeup="delayed" ref="coun" class="ml-10" :hour="hours" :minute="minutes"
						:second="seconds" color="#61A189" background-color="transparent" />
				</view>
			</view>
			<scroll-view class="goods-row" scroll-x="true">
				<view v-if="isSeckillGoods(item)" v-for="(item, index) in msgoodsList"
					:key="index" class="goods-row__item" @click="navToDetailPage(item._id,1,hours,minutes,seconds)">
					<image :src="item.goods_thumb" class="goods-row__img" mode="aspectFill"></image>
					<view class="goods-row__name ellipsis">{{item.name}}</view>
					<view class="goods-row__price">
						<jlg-minPrice
							:min-price="item.fs_suks.reduce((min, suk) => parseInt(suk.price) < parseInt(min.price) ? suk : min).price"
							maxSize="28rpx" min-size="24rpx"></jlg-minPrice>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 本周精选（热销）-->
		<view class="section">
			<view class="section__hd section__hd--3col">
				<view class="flex-1"></view>
				<text class="text-section-title">本周精选</text>
				<view class="flex-1 flex-dir-row flex-y-center flex-x-end" @click="allClick">
					<text class="text-meta">查看更多</text>
					<text class="iconfont ml-10 icon-uniE003 text-meta"></text>
				</view>
			</view>
			<scroll-view class="goods-row" scroll-x="true">
				<view v-for="(item, index) in rxgoodsList" :key="index" class="goods-row__item"
					@click="navToDetailPage(item._id)">
					<image :src="item.goods_thumb" class="goods-row__img" mode="aspectFill"></image>
					<view class="goods-row__name ellipsis">{{item.name}}</view>
					<view class="goods-row__price">
						<jlg-minPrice
							:min-price="item.suks.reduce((min, suk) => parseInt(suk.price) < parseInt(min.price) ? suk : min).price"
							maxSize="28rpx" min-size="24rpx"></jlg-minPrice>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 食养精选（推荐双列）-->
		<view class="section section--grid">
			<view class="section__hd section__hd--center">
				<text class="text-section-title">食养精选</text>
			</view>
			<view class="allLike">
				<uv-waterfall ref="waterfall" left-gap="0" right-gap="0" column-gap="8" @changeList="changeList">
					<!-- 第一列数据 -->
					<template v-slot:list1>
						<!-- 为了磨平部分平台的BUG，必须套一层view -->
						<view>
							<view v-for="(item, index) in evengoodsList" :key="index"
								@click="navToDetailPage(item._id)" class="grid-item">
								<image :src="item.goods_thumb" mode="aspectFill" class="grid-item__img"></image>
								<view class="grid-item__ft">
									<view class="grid-item__name ellipsis">{{item.name}}</view>
									<view class="flex-dir-row flex-y-center f-wrap" :class="control?'':'margin-top-xs'">
										<view class="coupon-tag" v-for="(ius, idx) in couponList" :key="idx"
											v-if="(ius.user_type === '所有人' || ius.user_arr.includes(user_id)) && (ius.allow_type !== '指定商品' || ius.goods_arr.includes(item._id))">
											{{ius.name}}
										</view>
									</view>
									<view class="grid-item__price margin-top-xs uv-line-2">
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
							<view v-for="(item, index) in oddgoodsList" @click="navToDetailPage(item._id)"
								:key="index" class="grid-item">
								<image :src="item.goods_thumb" mode="aspectFill" class="grid-item__img"></image>
								<view class="grid-item__ft">
									<view class="grid-item__name ellipsis">{{item.name}}</view>
									<view class="flex-dir-row flex-y-center f-wrap" :class="control?'':'margin-top-xs'">
										<view class="coupon-tag" v-for="(ius, idx) in couponList" :key="idx"
											v-if="(ius.user_type === '所有人' || ius.user_arr.includes(user_id)) && (ius.allow_type !== '指定商品' || ius.goods_arr.includes(item._id))">
											{{ius.name}}
										</view>
									</view>
									<view class="grid-item__price margin-top-xs uv-line-2">
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
			// 语言切换（占位，后续接入 i18n）
			switchLang() {
				uni.showToast({ title: '语言切换', icon: 'none', duration: 800 });
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
				if (this.$refs.coun) {
					this.$refs.coun.update();
				}

				setTimeout(() => {
					if (this.$refs.coun) {
						this.$refs.coun.update();
					}
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
						const result = res.result || {};
						this.filteredData = Array.isArray(result.filteredData) ? result.filteredData.filter(item => item) : [];
						this.hours = result.hours || 0;
						this.minutes = result.minutes || 0;
						this.seconds = result.seconds || 0;
						this.control = !!result.control;
					})
					.catch(error => {
						console.error(error);
					});
			},
			isSeckillGoods(item) {
				const seckill = this.filteredData[0];
				return !!(item && seckill && Array.isArray(seckill.goods_arr) && seckill.goods_arr.includes(item._id));
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
	@import '@/static/common/common.scss';

	page {
		// background-color: #FFFFFF;
		background-color: #F7F8F5;
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

	/* ── 品牌导航（小程序） ── */
	.brand-nav {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
		transition: background-color 0.3s ease;

		&__bar {
			position: fixed;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 32rpx;
			box-sizing: border-box;
		}

		&__title {
			font-size: 34rpx;
			font-weight: 600;
			color: #202321;
			letter-spacing: 4rpx;
		}

		&__left {
			display: flex;
			align-items: center;
			height: 100%;
		}

		&__right {
			width: 80rpx;
		}

		&__icon-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 56rpx;
			height: 56rpx;
		}

		&__divider {
			width: 1rpx;
			height: 28rpx;
			background: #C8CCC9;
			margin: 0 8rpx;
		}

		&__icon-img {
			width: 40rpx;
			height: 40rpx;
		}
	}

	/* ── 品牌搜索栏（H5） ── */
	.brand-searchbar {
		display: flex;
		align-items: center;
		padding: 16rpx 32rpx;
		// background: #FFFFFF;
		background: #F7F8F5;
		border-bottom: 1rpx solid #E5E6E2;

		&__logo {
			font-size: 32rpx;
			font-weight: 600;
			color: #202321;
			letter-spacing: 4rpx;
			margin-right: 24rpx;
			white-space: nowrap;
		}
	}

	/* ── Hero 首屏轮播 ── */
	.hero-wrap {
		width: 100%;
		position: relative;
		overflow: hidden;
	}

	.hero-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		transition: background-color 0.8s ease;
	}

	.hero__swiper {
		height: 420rpx;
	}

	.hero__img {
		width: 100%;
		height: 420rpx;
	}

	/* ── 公告栏 ── */
	@keyframes marquee {
		0%   { transform: translateX(100%); }
		100% { transform: translateX(-100%); }
	}

	.announce-bar {
		display: flex;
		align-items: center;
		height: 56rpx;
		padding: 0 32rpx;
		background: #FFFFFF;
		// border-top: 1rpx solid #E5E6E2;
		// border-bottom: 1rpx solid #E5E6E2;
		margin-top: 20rpx;
		position: relative;
		z-index: 2;
		overflow: hidden;

		&__label {
			font-size: 20rpx;
			font-weight: 400;
			color: #8E918D;
			letter-spacing: 2rpx;
			flex-shrink: 0;
			margin-right: 20rpx;
		}

		&__track {
			flex: 1;
			overflow: hidden;
		}

		&__text {
			display: inline-block;
			white-space: nowrap;
			font-size: 22rpx;
			font-weight: 400;
			color: #8E918D;
			line-height: 56rpx;
			animation: marquee 14s linear infinite;
		}
	}

	/* ── 分类横向 tab（图标+文字，居中） ── */
	.cat-tabs {
		width: 100%;
		// background: #FFFFFF;
		background: #F7F8F5;
		padding: 40rpx 0 32rpx;

		&__wrap {
			display: flex;
			flex-wrap: nowrap;
			justify-content: space-around;
			padding: 0 8rpx;
		}

		&__item {
			display: flex;
			flex-direction: column;
			align-items: center;
			flex: 1;
		}

		&__icon {
			width: 100rpx;
			height: 100rpx;
			border-radius: 12rpx;
			background: #ECEDE8;
			margin-bottom: 16rpx;
		}

		&__label {
			font-size: 24rpx;
			font-weight: 400;
			color: #2B2F2C;
			letter-spacing: 1rpx;
			white-space: nowrap;
		}
	}

	/* ── 广告横滑轮播（统一大小，无缩放） ── */
	.ad-swiper {
		width: 100%;
		margin: 24rpx 0;

		&__list {
			height: 300rpx;
		}

		&__item {
			padding: 0 12rpx;
			box-sizing: border-box;
		}

		&__img {
			width: 100%;
			height: 300rpx;
			border-radius: 8rpx;
		}
	}

	/* ── 通用分区 ── */
	.section {
		background: #F7F8F5;
		margin-top: 16rpx;
		padding: 32rpx;

		&__hd {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 28rpx;

			&--center {
				justify-content: center;
				margin-bottom: 32rpx;
			}

			&--3col {
				justify-content: space-between;
				margin-bottom: 32rpx;
			}
		}

		&--grid {
			padding: 32rpx 16rpx;
		}
	}

	/* ── 商品横滑列表 ── */
	.goods-row {
		white-space: nowrap;
		width: 100%;

		&__item {
			display: inline-block;
			width: 190rpx;
			margin-right: 24rpx;
			vertical-align: top;
		}

		&__img {
			width: 190rpx;
			height: 190rpx;
			border-radius: 4rpx;
			background: #ECEDE8;
		}

		&__name {
			width: 190rpx;
			margin-top: 14rpx;
			font-size: 26rpx;
			font-weight: 500;
			color: #2B2F2C;
			line-height: 1.45;
		}

		&__price {
			margin-top: 8rpx;
			color: #202321;
		}
	}

	/* ── 推荐双列商品卡 ── */
	$show-lines: 1;
	@import '@/uni_modules/uv-ui-tools/libs/css/variable.scss';

	.grid-item {
		width: 103%;
		overflow: hidden;
		margin-top: 16rpx;
		background: #F7F8F5;
		// border: 1rpx solid #E5E6E2;
		// border-radius: 8rpx;

		&__img {
			width: 100%;
			height: 300rpx;
			background: #ECEDE8;
		}

		&__ft {
			padding: 16rpx;
			background: #FFFFFF;
		}

		&__name {
			font-size: 28rpx;
			font-weight: 500;
			color: #2B2F2C;
			line-height: 1.45;
		}

		&__price {
			color: #202321;
		}
	}

	/* ── 优惠券标签（绿色细边框） ── */
	.coupon-tag {
		border: 1rpx solid #61A189;
		color: #61A189;
		font-size: 22rpx;
		padding: 4rpx 12rpx;
		border-radius: 4rpx;
		white-space: nowrap;
		margin-right: 8rpx;
		margin-top: 8rpx;
	}

	.allLike {
		width: 100%;
	}
</style>
