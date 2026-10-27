<!-- 免密登录页 -->
<template>
	<!-- #ifdef MP-WEIXIN -->
	<view class="uni-content mp-login-page">
		<view class="mp-login-inner">
			<view class="brand-area">
				<view class="login-logo brand-logo">
					<image :src="logo" mode="aspectFit"></image>
				</view>
				<text class="brand-subtitle">NATURAL NOURISHMENT</text>
			</view>
			<view class="login-actions">
				<button class="uni-btn wechat-btn" @click="quickWechatLogin">
					<!-- <text class="wechat-icon"></text> -->
					<text>微信快捷登录</text>
				</button>
				<button open-type="getPhoneNumber|agreePrivacyAuthorization"
					@getphonenumber="quickMobileLogin" class="uni-btn phone-auth-btn">手机号授权登录</button>
				<button class="guest-entry" hover-class="guest-entry-pressed" :hover-stay-time="80" @click="cancelLogin"><text class="guest-entry-label">暂不登录，先逛逛</text></button>
				<uni-id-pages-agreements scope="register" ref="agreements"></uni-id-pages-agreements>
				<!-- 短信验证码登录入口按需恢复
				<view class="inp_text">
					<view class="phone-box">
						<view @click="chooseArea" class="area">+86</view>
						<uni-easyinput :styles="inp_style" :focus="focusPhone" @blur="focusPhone = false"
							class="input-box" type="number" :inputBorder="false" v-model="phone" maxlength="11"
							placeholder="请输入手机号" />
					</view>
				</view>
				<button class="uni-btn" @click="toSmsPage">获取验证码</button>
				-->
			</view>
			<uni-id-pages-fab-login v-show="false" ref="uniFabLogin"></uni-id-pages-fab-login>
		</view>
	</view>
	<!-- #endif -->
	<!-- #ifndef MP-WEIXIN -->
	<view class="uni-content" style="margin-top: 100px;">
		<view class="login-logo">
			<image :src="logo"></image>
		</view>
		<!-- 顶部文字 -->
		<text class="title">请选择登录方式</text>
		<!-- 快捷登录框 当url带参数时有效 -->
		<template v-if="['apple','weixin', 'weixinMobile'].includes(type)">
			<text class="tip">将根据第三方账号服务平台的授权范围获取你的信息</text>
			<view class="quickLogin">
				<image v-if="type !== 'weixinMobile'" @click="quickLogin" :src="imgSrc" mode="widthFix"
					class="quickLoginBtn"></image>
				<button v-else type="primary" open-type="getPhoneNumber" @getphonenumber="quickLogin"
					class="uni-btn">手机号快捷登录</button>
				<uni-id-pages-agreements scope="register" ref="agreements"></uni-id-pages-agreements>
			</view>
		</template>
		<template v-else>
			<text class="tip" style="margin-bottom: 50px;">未注册的账号验证通过后将自动注册</text>
			<view class="phone-box" style="margin-bottom: 6px;">
				<view @click="chooseArea" class="area">+86</view>
				<uni-easyinput :focus="focusPhone" @blur="focusPhone = false" class="input-box" type="number"
					:inputBorder="false" v-model="phone" maxlength="11" placeholder="请输入手机号" />
			</view>
			<uni-id-pages-agreements scope="register" ref="agreements"></uni-id-pages-agreements>
			<button class="uni-btn" type="primary" @click="toSmsPage">获取验证码</button>
		</template>
		<button class="guest-entry" hover-class="guest-entry-pressed" :hover-stay-time="80" @click="cancelLogin"><text class="guest-entry-label">暂不登录，先逛逛</text></button>
		<!-- 固定定位的快捷登录按钮 -->
		<uni-id-pages-fab-login ref="uniFabLogin"></uni-id-pages-fab-login>
	</view>
	<!-- #endif -->
</template>

<script>
	let currentWebview; //当前窗口对象
	import config from '@/uni_modules/uni-id-pages/config.js'
	import mixin from '@/uni_modules/uni-id-pages/common/login-page.mixin.js';
	export default {
		mixins: [mixin],
		data() {
			return {
				type: "", //快捷登录方式
				phone: "", //手机号码
				focusPhone: false,
				logo: "/static/logo.png",
				inp_style: {
					borderRadius: '40px',
					height: '50px'
				}
			}
		},
		computed: {
			async loginTypes() { //读取配置的登录优先级
				return config.loginTypes
			},
			isPhone() { //手机号码校验正则
				return /^1\d{10}$/.test(this.phone);
			},
			imgSrc() { //大快捷登录按钮图
				return this.type == 'weixin' ? '/uni_modules/uni-id-pages/static/login/weixin.png' :
					'/uni_modules/uni-id-pages/static/app-plus/apple.png'
			}
		},
		async onLoad(e) {
			//获取通过url传递的参数type设置当前登录方式，如果没传递直接默认以配置的登录
			let type = e.type || config.loginTypes[0]
			this.type = type
			// #ifdef APP
			this.type = 'weixin'
			// #endif
			// #ifdef MP-WEIXIN
			this.type = 'weixin'
			// #endif

			// console.log("this.type: -----------",this.type);
			if (type != 'univerify') {
				this.focusPhone = true
			}
			this.$nextTick(() => {
				//关闭重复显示的登录快捷方式
				if (['weixin', 'apple'].includes(type)) {
					this.$refs.uniFabLogin.servicesList = this.$refs.uniFabLogin.servicesList.filter(item =>
						item.id != type)
				}
			})
			uni.$on('uni-id-pages-setLoginType', type => {
				this.type = type
			})
		},
		onShow() {
			// #ifdef H5
			document.onkeydown = event => {
				var e = event || window.event;
				if (e && e.keyCode == 13) { //回车键的键值为13
					this.toSmsPage()
				}
			};
			// #endif
		},
		onUnload() {
			uni.$off('uni-id-pages-setLoginType')
		},
		onReady() {
			// 是否优先启动一键登录。即：页面一加载就启动一键登录
			//#ifdef APP-PLUS
			// if (this.type == "univerify") {
			// 	const pages = getCurrentPages();
			// 	currentWebview = pages[pages.length - 1].$getAppWebview();
			// 	currentWebview.setStyle({
			// 		"top": "2000px" // 隐藏当前页面窗体
			// 	})
			// 	this.type == this.loginTypes[1]
			// 	// console.log('开始一键登录');
			// 	this.$refs.uniFabLogin.login_before('univerify')
			// }
			//#endif
		},
		methods: {
			showCurrentWebview() {
				// 恢复当前页面窗体的显示 一键登录，默认不显示当前窗口
				currentWebview.setStyle({
					"top": 0
				})
			},
			quickLogin(e) {
				let options = {}

				if (e?.detail?.code) {
					options.phoneNumberCode = e.detail.code
				}

				if (this.type === 'weixinMobile' && !e?.detail?.code) {
					return uni.showToast({
						title: e?.detail?.errMsg === 'getPhoneNumber:fail user deny' ? '您已拒绝授权手机号' : '获取手机号失败',
						icon: 'none',
						duration: 3000
					})
				}

				this.$refs.uniFabLogin.login_before(this.type, true, options)
			},
			quickWechatLogin() {
				this.type = 'weixin'
				this.quickLogin()
			},
			quickMobileLogin(e) {
				this.type = 'weixinMobile'
				this.quickLogin(e)
			},
			toSmsPage() {
				if (!this.isPhone) {
					this.focusPhone = true
					return uni.showToast({
						title: "手机号码格式不正确",
						icon: 'none',
						duration: 3000
					});
				}
				if (this.needAgreements && !this.agree) {
					return this.$refs.agreements.popup(this.toSmsPage)
				}
				// 发送验证吗
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/login/login-smscode?phoneNumber=' + this.phone
				});
			},
			//去密码登录页
			toPwdLogin() {
				uni.navigateTo({
					url: '../login/password'
				})
			},
			chooseArea() {
				uni.showToast({
					title: '暂不支持其他国家',
					icon: 'none',
					duration: 3000
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/uni_modules/uni-id-pages/common/login-page.scss";

	@media screen and (min-width: 690px) {
		.uni-content {
			height: 350px;
		}
	}

	.uni-content,
	.quickLogin {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
	}

	.phone-box {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
	}

	.area {
		position: absolute;
		left: 10px;
		z-index: 9;
		top: 15px;
		font-size: 14px;
	}

	.area::after {
		content: "";
		border: 3px solid transparent;
		border-top-color: #000;
		top: 12px;
		left: 3px;
		position: relative;
	}

	/* #ifdef MP */
	// 解决小程序端开启虚拟节点virtualHost引起的 class = input-box丢失的问题 [详情参考](https://uniapp.dcloud.net.cn/matter.html#%E5%90%84%E5%AE%B6%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%AE%9E%E7%8E%B0%E6%9C%BA%E5%88%B6%E4%B8%8D%E5%90%8C-%E5%8F%AF%E8%83%BD%E5%AD%98%E5%9C%A8%E7%9A%84%E5%B9%B3%E5%8F%B0%E5%85%BC%E5%AE%B9%E9%97%AE%E9%A2%98)
	.phone-box ::v-deep .uni-easyinput__content,
	/* #endif */
	.input-box {
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
		flex: 1;
		padding-left: 45px;
		border-radius: 0;
	}

	.quickLogin {
		height: 350px;
		align-items: center;
		justify-content: center;
	}

	.quickLoginBtn {
		margin: 20px 0;
		width: 450rpx;
		/* #ifndef APP-NVUE */
		max-width: 230px;
		/* #endif */
		height: 82rpx;
	}

	.tip {
		margin-top: -15px;
		margin-bottom: 200px;
		/* #ifndef MP-WEIXIN */
		margin-bottom: 0px;
		/* #endif */
	}

	.tips {
		margin-top: -15px;
		margin-bottom: 250px;
		display: flex;
		color: #BDBDC0;
		font-size: 11px;
	}

	.qtlogin {
		text-align: center;
		font-size: 27rpx;
		margin-top: 65rpx;
		color: #b7b7b7;
	}


	@media screen and (min-width: 690px) {
		.quickLogin {
			height: auto;
			// height: 900rpx;
		}
	}

	.inp_text {
		padding: 0 20rpx;
		background-color: #F8F8F8;

		border: 2rpx solid #d8d8d8;
		margin-bottom: 10px;
	}

	.uni-btn {


		line-height: 90rpx;
		height: 90rpx;
	}

	.login-actions .uni-btn {
		width: 100%;
		margin-top: 30rpx;
	}

	/* #ifdef MP-WEIXIN */
	.mp-login-page {
		min-height: 100vh;
		height: 100vh;
		background-color: #F7F8F5;
		padding: 0 80rpx !important;
		box-sizing: border-box;
		justify-content: center;
	}

	.mp-login-inner {
		width: 100%;
		min-height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 150rpx 0 96rpx;
	}

	.brand-area {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.brand-logo {
		width: 320rpx;
		height: 320rpx;
		margin: 0 0 44rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.brand-logo image {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.brand-subtitle {
		padding-left: 12rpx;
		color: #8A9A8E;
		font-size: 20rpx;
		font-weight: 300;
		letter-spacing: 8rpx;
		line-height: 1.4;
	}

	.login-actions {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.login-actions .uni-btn {
		width: 100%;
		height: 96rpx;
		margin: 0;

		line-height: 96rpx;
		font-size: 28rpx;
		font-weight: 500;
		letter-spacing: 4rpx;
	}

	.wechat-btn {
		@include shop-button(primary);
		display: flex;
		align-items: center;
		justify-content: center;

		color: #FFFFFF;

	}

	.wechat-icon {
		width: 38rpx;
		height: 38rpx;
		margin-right: 18rpx;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.18);
		color: #FFFFFF;
		font-size: 20rpx;
		line-height: 38rpx;
		text-align: center;
		letter-spacing: 0;
	}

	.phone-auth-btn {
		@include shop-button(secondary);
		margin-top: 24rpx !important;



		box-shadow: none;
	}

	.login-actions ::v-deep .root {
		margin-top: 16rpx;
		justify-content: center;
		color: #8A9A8E;
		font-size: 20rpx;
		line-height: 34rpx;
	}

	.login-actions ::v-deep .agreement {
		color: #61A189;
	}

	.login-actions ::v-deep .checkbox-box {
		margin-right: 4rpx;
	}
	/* #endif */

	.guest-entry {
		// 次级文字入口保留完整触控区域，不与登录按钮争夺视觉层级。
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		margin: 16rpx auto 0;
		padding: 0 32rpx;
		border: 0;
		border-radius: 8rpx;
		background: transparent;
		box-shadow: none;
		// 深鼠尾草绿，保证浅色背景上的小字号可读性。
		color: #487C67;
		font-size: 26rpx;
		font-weight: 400;
		line-height: 1.5;
		letter-spacing: 0;
		transition: transform 150ms ease-out, background-color 150ms ease-out;
	}

	.guest-entry-label {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
	}

	.guest-entry-pressed,
	.guest-entry:active {
		transform: scale(0.96);
		background-color: rgba(0, 0, 0, 0.04);
	}

	.guest-entry:focus-visible {
		outline: 2px solid #487C67;
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.guest-entry { transition: none; }
		.guest-entry-pressed,
		.guest-entry:active { transform: none; }
	}

	button::after {
		border: none !important;
	}
</style>
