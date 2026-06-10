<script>
	import initApp from '@/common/appInit.js';
	import openApp from '@/common/openApp.js';
	import uniIdPageInit from '@/uni_modules/uni-id-pages/init.js';
	export default {
		globalData: {
			searchText: '',
			appVersion: {},
			config: {},
			$i18n: {},
			$t: {}
		},
		onLaunch: function(e) {
			console.log('App Launch')
			this.globalData.$i18n = this.$i18n
			this.globalData.$t = str => this.$t(str)
			initApp();
			uniIdPageInit()
		},
		onShow: function() {
			// #ifndef MP-WEIXIN
			if (/MicroMessenger/i.test(navigator.userAgent)) {
				// 是微信内置浏览器，什么都不做
			} else {
				// 不是微信内置浏览器，弹出提示
				document.head.innerHTML =
					'<title>抱歉，出错了</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"><link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/open/libs/weui/0.4.1/weui.css">';
				document.body.innerHTML =
					'<div class="weui_msg"><div class="weui_icon_area"><i class="weui_icon_info weui_icon_msg"></i></div><div class="weui_text_area"><h4 class="weui_msg_title">请在手机微信客户端打开链接</h4></div></div>';
			}
			// #endif
			// #ifdef MP-WEIXIN
			//判断版本
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				// console.log('请求完新版本信息的回调', res.hasUpdate)
			});
			updateManager.onUpdateReady(function() {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});
			});
			updateManager.onUpdateFailed(function() {
				// 新版本下载失败
			});
			// #endif
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang='scss'>
	/*
		全局公共样式和字体图标
	*/
	@font-face {
		font-family: "iconfont";
		/* Project id 4231601 */
		src: url('https://at.alicdn.com/t/c/font_4231601_4rpb3fwv8e3.woff2?t=1693399237571') format('woff2'),
			url('https://at.alicdn.com/t/c/font_4231601_4rpb3fwv8e3.woff?t=1693399237571') format('woff'),
			url('https://at.alicdn.com/t/c/font_4231601_4rpb3fwv8e3.ttf?t=1693399237571') format('truetype');
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-uniE002:before {
		content: "\e647";
	}

	.icon-uniE005:before {
		content: "\e648";
	}

	.icon-z-alipay:before {
		content: "\e6cc";
	}

	.icon-dingdan:before {
		content: "\e606";
	}

	.icon-bianji:before {
		content: "\e613";
	}

	.icon-youhuiquan:before {
		content: "\e8c0";
	}

	.icon-youhuiquan1:before {
		content: "\e611";
	}

	.icon-Njifenxiao-2:before {
		content: "\e7b2";
	}

	.icon-arrow-left:before {
		content: "\e645";
	}

	.icon-uniE003:before {
		content: "\e646";
	}

	.icon-uniE00E:before {
		content: "\e6a1";
	}

	.icon-uniE00B:before {
		content: "\e724";
	}

	.icon-uniE00C:before {
		content: "\e604";
	}

	.icon-uniE00d:before {
		content: "\e600";
	}

	.icon-31yiguanzhudianpu:before {
		content: "\e601";
	}

	.icon-uniE049:before {
		content: "\e602";
	}

	.icon-fenxiang:before {
		content: "\e6d5";
	}

	.icon-quanjushezhi_o:before {
		content: "\eb80";
	}

	.icon-uniE00f:before {
		content: "\e60f";
	}

	.icon-uniE008:before {
		content: "\e61c";
	}

	.icon-caiyouduo_zhifu-qianbaozhifu:before {
		content: "\e686";
	}

	.icon-xiazai:before {
		content: "\e64e";
	}

	.icon-xunzhang:before {
		content: "\fb00";
	}

	.icon-uniE047:before {
		content: "\e76e";
	}

	.icon-uniE016:before {
		content: "\e653";
	}

	.icon-gengduo:before {
		content: "\e60a";
	}

	.icon-xiaoxi:before {
		content: "\e61e";
	}

	.icon-qianbao2:before {
		content: "\e86d";
	}

	.icon-bangzhu:before {
		content: "\e603";
	}

	.icon-icon-question:before {
		content: "\e66b";
	}

	.icon-oA:before {
		content: "\e605";
	}

	.icon-miaosha:before {
		content: "\e607";
	}

	.icon-miaosha1:before {
		content: "\eebb";
	}

	.icon-uniE01c:before {
		content: "\e772";
	}

	.icon-uniE01e:before {
		content: "\e61f";
	}

	.icon-uniE021:before {
		content: "\e608";
	}

	.icon-bianji1:before {
		content: "\e609";
	}

	.icon-uniE01f:before {
		content: "\e60b";
	}

	.icon-sousuo:before {
		content: "\e621";
	}

	.icon-tianchongxing-:before {
		content: "\e644";
	}

	.icon-uniE001:before {
		content: "\e6fb";
	}

	.icon-huiyuandengji:before {
		content: "\e774";
	}

	.icon-uniE023:before {
		content: "\e60c";
	}

	.icon-shoucang:before {
		content: "\e60d";
	}

	.icon-uniE03d:before {
		content: "\e87e";
	}

	.icon-uniE04a:before {
		content: "\e8ba";
	}

	.icon-like:before {
		content: "\e69c";
	}

	.icon-uniE027:before {
		content: "\e69d";
	}

	.icon-gouwuche-tianchong:before {
		content: "\e70c";
	}

	.icon-uniE026:before {
		content: "\e70b";
	}

	.icon-dianhua:before {
		content: "\e797";
	}

	.icon-xiaoxi1:before {
		content: "\e884";
	}

	.icon-hua:before {
		content: "\e62c";
	}

	.icon-hua1:before {
		content: "\e62d";
	}

	.icon-uniE029:before {
		content: "\e614";
	}

	.icon-dianzan:before {
		content: "\e60e";
	}

	.icon-uniE044:before {
		content: "\e72f";
	}

	.icon-uniE02D:before {
		content: "\e620";
	}

	.icon-jiantou_xiangyou:before {
		content: "\eb08";
	}

	.icon-jiantou_xiangzuo:before {
		content: "\eb09";
	}

	.icon-jiantou_xiangxia:before {
		content: "\eb0a";
	}

	.icon-jiantou_xiangshang:before {
		content: "\eb0b";
	}

	.icon-jiantou_youshang:before {
		content: "\eb0c";
	}

	.icon-jiantou_zuoshang:before {
		content: "\eb0d";
	}

	.icon-jiantou_youxia:before {
		content: "\eb0e";
	}

	.icon-jiantou_zuoxia:before {
		content: "\eb0f";
	}

	.icon-uniE03a:before {
		content: "\e610";
	}

	.icon-E034:before {
		content: "\e6c0";
	}

	.icon-dingdanyuan:before {
		content: "\e612";
	}

	.icon-dingdan2:before {
		content: "\e672";
	}

	.icon-uniE036:before {
		content: "\10102";
	}

	.icon-uniE03c:before {
		content: "\e649";
	}

	.icon-zuanshihuiyuan:before {
		content: "\e6e6";
	}

	.icon-wodewo:before {
		content: "\e6e0";
	}

	.icon-zuanshi:before {
		content: "\e622";
	}

	.icon-uniE048:before {
		content: "\e685";
	}

	.icon-VIP:before {
		content: "\e876";
	}

	.icon-uniE040:before {
		content: "\e623";
	}

	.icon-uniE046:before {
		content: "\e643";
	}

	.icon-uniE045:before {
		content: "\e634";
	}

	.icon-uniE04c:before {
		content: "\e62e";
	}

	.icon-uniE04b:before {
		content: "\e6c5";
	}

	.icon-shenhezhong:before {
		content: "\e627";
	}

	.icon-miaosha2:before {
		content: "\ec52";
	}

	.icon-uniE025:before {
		content: "\e8ae";
	}

	.icon-tuikuan:before {
		content: "\e615";
	}

	.icon-daifukuan:before {
		content: "\e617";
	}

	.icon-qianbao:before {
		content: "\e851";
	}

	.icon-qianbao1:before {
		content: "\e616";
	}

	.icon-qianbao3:before {
		content: "\e70a";
	}

	.icon-qianbao4:before {
		content: "\1010f";
	}

	.icon-iconfontevaluate:before {
		content: "\e624";
	}

	.icon-pingjiaguanli:before {
		content: "\e63c";
	}

	.icon-xiaoxi2:before {
		content: "\100a9";
	}

	.icon-shenqingshouhou:before {
		content: "\e67a";
	}

	.icon-shouye:before {
		content: "\e655";
	}

	.icon-shouyeshouye:before {
		content: "\e625";
	}

	.icon-ditu_dingwei_o:before {
		content: "\ebbb";
	}

	.icon-gerenxinxi:before {
		content: "\e61d";
	}

	.icon-xinxi:before {
		content: "\e628";
	}

	.icon-xiangmuchaxun-guanlichengyuan:before {
		content: "\e683";
	}

	.icon-dingdan21:before {
		content: "\e6bd";
	}

	.icon-erweima:before {
		content: "\e6c6";
	}


	view,
	swiper-item,
	scroll-view,
	text,
	input,
	button,
	cover-image,
	cover-view,
	image,
	form,
	label,
	progress,
	switch,
	textarea,
	rich-text,
	audio,
	video {
		box-sizing: border-box;
	}

	.placeholder {
		color: #999999;
	}

	.flex-dir-row {
		flex-direction: row;
		display: flex !important;
	}

	.flex-dir-column {
		flex-direction: column;
		display: flex;
	}

	.flex-y-center {

		align-items: center;
	}

	.flex-y-end {

		align-items: flex-end;
	}

	.flex-y-baseline {
		align-items: baseline;
	}

	.flex-x-center {
		justify-content: center;
	}

	.flex-x-start {
		justify-content: start;
	}

	.flex-x-baseline {
		justify-content: baseline;
	}

	.flex-x-between {
		justify-content: space-between;
	}

	.flex-x-around {
		justify-content: space-around;
	}

	/* 文字超过2行 */
	.text-element-2 {
		display: -webkit-box !important;
		-webkit-box-orient: vertical;
		overflow: hidden;
		-webkit-line-clamp: 2;
		/* 控制显示的行数 */
	}

	/* 文字超过1行 */
	.text-element-1 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
		-webkit-line-clamp: 1;
		/* 控制显示的行数 */
	}

	.flex-x-end {
		justify-content: flex-end;
	}

	.f-wrap {
		flex-wrap: wrap;
	}

	.flex-1 {
		flex: 1;
	}

	.text-with-line {
		text-decoration: line-through;
	}

	.flex-dir-row {
		flex-direction: row;
		display: flex;
	}

	.bb-rl-rad20 {
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
	}

	.bt-rl-rad20 {
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}

	.dis-flex {
		display: flex;
	}

	.f-70 {
		font-size: 70rpx;
	}

	.f-60 {
		font-size: 60rpx;
	}

	.f-50 {
		font-size: 50rpx;
	}

	.f-44 {
		font-size: 44rpx;
	}

	.f-40 {
		font-size: 40rpx;
	}

	.f-36 {
		font-size: 36rpx;
	}

	.f-34 {
		font-size: 34rpx;
	}

	.f-32 {
		font-size: 32rpx;
	}

	.f-29 {
		font-size: 29rpx;
	}

	.f-28 {
		font-size: 28rpx;
	}

	.f-27 {
		font-size: 27rpx;
	}

	.f-26 {
		font-size: 26rpx;
	}

	.f-24 {
		font-size: 24rpx;
	}

	.f-22 {
		font-size: 22rpx;
	}

	.f-20 {
		font-size: 20rpx;
	}

	.f-w {
		font-weight: blod;
	}

	.f-w600 {
		font-weight: 600;
	}

	.col-0 {
		color: #000
	}

	.col-3 {
		color: #333
	}

	.col-6 {
		color: #666
	}

	.col-9 {
		color: #999;
	}

	.col-f {
		color: #fff;
	}

	.col-1C7231 {
		color: #1C7231;
	}

	.col-505050 {
		color: #505050;
	}

	.col-e6e6e6 {
		color: #e6e6e6;
	}

	.b-f {
		background-color: #fff;
	}

	.mb-60 {
		margin-bottom: 60rpx;
	}

	.mb-40 {
		margin-bottom: 40rpx;
	}

	.mb-30 {
		margin-bottom: 30rpx;
	}

	.mb-25 {
		margin-bottom: 25rpx;
	}

	.mb-20 {
		margin-bottom: 20rpx;
	}

	.mb-10 {
		margin-bottom: 10rpx;
	}

	.mt-30 {
		margin-top: 30rpx;
	}

	.mt-25 {
		margin-top: 25rpx;
	}

	.mt-20 {
		margin-top: 20rpx;
	}

	.mt-15 {
		margin-top: 15rpx;
	}

	.mt-10 {
		margin-top: 10rpx;
	}

	.ml-60 {
		margin-left: 60rpx;
	}

	.ml-40 {
		margin-left: 40rpx;
	}

	.ml-30 {
		margin-left: 30rpx;
	}

	.ml-20 {
		margin-left: 20rpx;
	}

	.ml-15 {
		margin-left: 15rpx;
	}

	.ml-10 {
		margin-left: 10rpx;
	}

	.ml-5 {
		margin-left: 5px;
	}

	.mr-10 {
		margin-right: 10rpx;
	}

	.mr-20 {
		margin-right: 20rpx;
	}

	.pb-sp {
		padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
	}

	.pb-100 {
		padding-bottom: 100rpx !important;
	}

	.pb-25 {
		padding-bottom: 25rpx;
	}

	.pb-30 {
		padding-bottom: 30rpx;
	}

	.pb-20 {
		padding-bottom: 20rpx;
	}

	.pt-30 {
		padding-top: 30rpx;
	}

	.pt-20 {
		padding-top: 20rpx;
	}

	.pr-30 {
		padding-right: 30rpx;
	}

	.pr-20 {
		padding-right: 20rpx;
	}

	.pl-30 {
		padding-left: 30rpx;
		box-sizing: border-box;
	}

	.pl-20 {
		padding-left: 20rpx;
	}

	.plr-20 {
		padding: 20rpx;

	}

	.plr-30 {
		padding: 30rpx;

	}

	.w-50 {
		width: 50% !important;
	}

	.w-55 {
		width: 55% !important;
	}

	.w-60 {
		width: 60% !important;
	}

	.w-76 {
		width: 76% !important;
	}

	.w-100 {
		width: 100% !important;
	}

	.w-710 {
		width: 710rpx !important;
	}

	.w-690 {
		width: 690rpx !important;
	}

	.w-590 {
		width: 590rpx !important;
	}

	.w-510 {
		width: 510rpx !important;
	}

	.w-480 {
		width: 480rpx !important;
	}

	.w-430 {
		width: 430rpx !important;
	}

	.w-380 {
		width: 380rpx !important;
	}

	.w-315 {
		width: 315rpx !important;
	}

	.w-nowrap {
		white-space: nowrap;
	}

	.p-r {
		position: relative
	}

	.p-a {
		position: absolute
	}

	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		/* 设置宽度和高度 */
		width: 100%;
	}

	.oneEllipsis {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.btn-normal {
		display: block;
		margin: 0;
		padding: 0;
		line-height: normal;
		background: none;
		border-radius: 0;
		box-shadow: none;
		border: none;
		font-size: unset;
		text-align: unset;
		overflow: visible;
		color: inherit;
	}

	.btn-normal:after {
		border: none;
	}

	.btn-normal.button-hover {
		color: #fff;
	}

	button:after {
		content: none;
		border: none;
	}
</style>