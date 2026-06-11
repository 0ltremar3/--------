<template>
	<uni-popup ref="popup" :type="openType" :border-radius="borderRadius" :safe-area="safeArea" @maskClick="maskClick"
		:is-mask-click="isMaskClick" :mask-background-color="maskBackgroundColor">
		<view class="login-condition" :style="[loginStyle]">
			<view class="top">
				<view class="left"></view>
				<view class="title">{{title}}</view>
				<view class="close" @click="maskClick">x</view>
			</view>
			<view class="contentBox">
				<button v-if="radioChecked || !showPrivacy" :style="btnCustomStyle" class="login-class" id="agree-btn1" slot="confirmButton"
					open-type="getPhoneNumber|agreePrivacyAuthorization" @getphonenumber="handleGetPhoneNumber"
					@agreeprivacyauthorization="handleAgreePrivacyAuthorization">
					<text class="login-class-text">{{btnTip}}</text>
				</button>
				<button v-else class="login-class" :style="btnCustomStyle" slot="confirmButton" @click="showAgreeAnimation">
					<text class="login-class-text">{{btnTip}}</text>
				</button>
			</view>
			<view :class="['agree-box ' + animation]" v-if="showPrivacy">
				<radio style="transform:scale(0.7)" value="r1" color="#0066FF" :checked="radioChecked" @click="() => radioChecked = !radioChecked" /></label>
				<text class="tipColor">{{agreeTip}}</text>
				<text class="textColor" @click="gotoPrivacy">{{privacyName}}</text>
				<text class="textColor">、</text>
				<text class="textColor" @click="gotoUserAgreement">{{userAgreementName}}</text>
			</view>
		</view>
	</uni-popup>
</template>



<script>
	/**
	 * phone-login 微信小程序手机号快捷登录弹窗  此组件依赖官方uni-popup弹窗
	 * @description 支持微信小程序
	 * @description 支持传入用户隐私协议 用户服务协议
	 * @description 支持未勾选 用户隐私协议 用户服务协议增加抖动效果
	 * @description uni-popup弹窗props属性均已对外放开 可以传入覆盖
	 * @property {Boolean} show 登录弹窗是否展示
	 * @property {Boolean} safeArea 是否启用底部安全区域
	 * @property {String} openType 登录弹窗弹出位置 默认bottom 可选位置 同uni-popup官方
	 * @property {String} title 弹窗标题
	 * @property {String} btnTip 登录按钮提示
	 * @property {String} btnCustomStyle 登录按钮自定义样式
	 * @property {String} backColor 弹窗背景颜色
	 * @property {String} height 弹窗高度
	 * @property {String} borderRadius 弹窗圆角
	 * @property {String} showPrivacy 是否展示隐私协议 为true时privacyUrl、userAgreementUrl必传
	 * @property {String} agreeTip 隐私协议提示语
	 * @property {String} privacyName 隐私协议名称
	 * @property {String} privacyUrl 隐私协议跳转页面url
	 * @property {String} userAgreementName 用户服务协议名称
	 * @property {String} userAgreementUrl 用户服务协议url
	 * @event {Function} loginSuccessFun 获取手机号code成功的回调，e=code
	 * @event {Function} maskClick 点击遮罩触发
	 * 
	 **/
	export default {
		name: "phone-login",
		props: {
			show: {
				type: Boolean,
				default: false,
				required: true
			},
			openType: {
				type: String,
				default: 'bottom',
				required: false
			},
			title: {
				type: String,
				default: '登录或注册',
				required: false
			},
			btnTip: {
				type: String,
				default: '手机号快捷登录',
				required: false
			},
			btnCustomStyle: {
				type: String,
				default: '',
				required: false
			},
			backColor: {
				type: String,
				default: '#ffffff',
				required: false
			},
			height: {
				type: String,
				default: '450rpx',
				required: false
			},
			borderRadius: {
				type: String,
				default: '10px 10px 0 0',
				required: false
			},
			agreeTip: {
				type: String,
				default: '我已阅读并同意',
				required: false
			},
			safeArea: {
				type: Boolean,
				default: false,
				required: false
			},
			isMaskClick: {
				type: Boolean,
				default: true,
				required: false
			},
			maskBackgroundColor: {
				type: String,
				default: 'rgba(0,0,0,0.4)',
				required: false
			},
			showPrivacy: {
				type: Boolean,
				default: true,
				required: false
			},
			privacyName: {
				type: String,
				default: '《隐私政策》',
				required: false
			},
			privacyUrl: {
				type: String,
				default: '',
				required: false
			},
			userAgreementName: {
				type: String,
				default: '《用户服务协议》',
				required: false
			},
			userAgreementUrl: {
				type: String,
				default: '',
				required: false
			},
		},
		data() {
			return {
				radioChecked: false,
				animation: '' //左右摆动动画
			};
		},
		computed: {
			// 登录样式
			loginStyle() {
				return {
					backgroundColor: this.backColor,
					backgroundSize: '100% 100%',
					borderRadius: this.borderRadius,
					height: this.height ? this.height : '450rpx'
				}
			}
		},
		watch: {
			show(newValue, oldValue) {
				if (!newValue) {
					this.radioChecked = false;
					this.animation = '';
					this.$refs.popup.close()
				} else {
					this.$refs.popup.open()
				}
			}
		},
		methods: {
			/**
			 * 点击遮罩关闭
			 */
			maskClick() {
				this.$emit('maskClick');
			},

			//隐私协议
			gotoPrivacy() {
				if (this.privacyUrl) {
					console.error('请传入隐私协议跳转URL');
					return;
				}
				uni.navigateTo({
					url: this.privacyUrl
				});
			},
			//用户协议
			gotoUserAgreement() {
				if (this.userAgreementUrl) {
					console.error('请传入隐私协议跳转URL');
					return;
				}
				uni.navigateTo({
					url: this.userAgreementUrl
				});
			},

			/**
			 * 展示抖动效果
			 */
			showAgreeAnimation() {
				this.animation = 'animation-shake';
				setTimeout(() => {
					this.animation = ''
				}, 1000);
			},
			/**
			 * 用户已阅读隐私协议
			 */
			handleAgreePrivacyAuthorization() {
				console.log('用户已同意隐私协议');
			},
			//快速获取手机号
			handleGetPhoneNumber(e) {
				// 获取手机号成功
				let phoneCode = '';
				// 这里获取手机号的code
				if (e.detail.errMsg === 'getPhoneNumber:ok') {
					// 登陆成功之后拿着信息走后台的登录
					phoneCode = e.detail.code;
					this.$emit('loginSuccessFun', phoneCode)
				} else if (e.detail.errno === 1400001) {
					console.error('该功能使用次数已达当前小程序上限，暂时无法使用');
					uni.showToast({
						icon: 'none',
						title: '获取手机号次数已达当前小程序上限'
					});
				} else if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
					console.error('您已拒绝登录');
					uni.showToast({
						icon: 'none',
						title: '您已拒绝登录'
					});
				} else {
					uni.showToast({
						icon: 'none',
						title: '获取手机号失败111'
					});
					console.error('e', e);
				}
			}
		},

	}
</script>

<style scoped lang="scss">
	.login-condition {
		width: 100%;
		height: 450rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		border-radius: 10px 10px 0 0;

		.top {
			width: 100%;
			height: 120rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 0px 32rpx;
			box-sizing: border-box;

			.title {
				flex: 1;
				text-align: center;
				font-size: 32rpx;
				color: rgba(0, 0, 0, 0.90);
				font-weight: 500;
			}
			
			.close {
				font-size: 48rpx;
				color: #858585;
			}
		}

		.contentBox {
			width: 100%;
			padding: 0px 50rpx;
			box-sizing: border-box;
			padding-top: 20px;
			margin-bottom: 16px;
		}

		.login-class {
			border-radius: 36rpx;
			height: 80rpx;
			line-height: 80rpx;
			background-color: rgba(0, 102, 255, 0.8);
			width: 100%;

			.login-class-text {
				font-size: 32rpx;
				color: #FFFFFF;
				font-weight: 400;
			}
		}

		.agree-box {
			display: flex;
			align-items: center;
			justify-content: center;

			.tipColor {
				font-family: PingFangSC-Regular;
				font-size: 24rpx;
				color: rgba(0, 0, 0, 0.5);
				font-weight: 400;
			}

			.textColor {
				font-family: PingFangSC-Regular;
				font-size: 28rpx;
				color: rgba(0, 0, 0, 0.9);
				font-weight: 500;
			}

		}

		.animation-shake {
			animation: shake 0.3s !important;
		}

		@keyframes shake {

			0% {
				transform: translateX(0)
			}

			100% {
				transform: translateX(0)
			}

			10% {
				transform: translateX(-9px)
			}

			20% {
				transform: translateX(8px)
			}

			30% {
				transform: translateX(-7px)
			}

			40% {
				transform: translateX(6px)
			}

			50% {
				transform: translateX(-5px)
			}

			60% {
				transform: translateX(4px)
			}

			70% {
				transform: translateX(-3px)
			}

			80% {
				transform: translateX(2px)
			}

			90% {
				transform: translateX(-1px)
			}
		}
	}
</style>