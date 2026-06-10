<template>
	<page-meta :page-style="'overflow:'+(show?'hidden':'visible')"></page-meta>
	<view class="container">
		<view v-if="goodsdata.name">
			<!-- #ifdef MP-WEIXIN -->
			<qrcode-poster style="position: absolute;z-index: 9999999999;" ref="poster" :title="goodsdata.name"
				:headerImg="goodsdata.goods_banner_imgs[0].fileType == 'image'?goodsdata.goods_banner_imgs[0].url:goodsdata.goods_banner_imgs[1].url"
				:price="minPrice / 100" :username="usname" :avcimgs="usimg" :origprice="goodsdata.crossed_price/100"
				@showClick="showClick"></qrcode-poster>

			<uqrcode :hide="true" ref="uqrcode" canvas-id="qrcode"
				:value="`http://test.slwjd.com?id=${goods_id}&fxsid=${user_id}`" :options="{ margin: 10 }"></uqrcode>
			<view class="flex-left navbar" :style="{height:(navHeight + 8) + 'px'}">
				<view class="navbar-title" @click="goBack" :style="{top:navTop + 'px'}">
					<uni-icons type="back" size="27" color="#242424"></uni-icons>
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<qrcode-poster style="position: absolute;z-index: 9999999999;" ref="poster" :title="goodsdata.name"
				:price="minPrice / 100" :username="usname" :origprice="goodsdata.crossed_price/100"
				@showClick="showClick"></qrcode-poster>
			<view style="position: fixed;left: 900000rpx;">
				<uqrcode :hide="true" ref="uqrcode" canvas-id="qrcode"
					:value="`http://test.slwjd.com/pages/product/product?id=${goods_id}&fxsid=${user_id}`"
					:options="{ margin: 10 }"></uqrcode>
			</view>
			<!-- #endif -->
			<!-- 二维码组件 -->
			<view class="swiper">
				<swiper @change="changeNav" circular=true class="swiper-list" duration="400">
					<swiper-item class="" v-for="(item,indexs) in goodsdata.goods_banner_imgs" :key="indexs">
						<!-- #ifdef APP -->
						<image v-if="item.fileType == 'video'" :src="goodsdata.goods_banner_imgs[indexs + 1].url"
							class="swiperImg" mode="aspectFill"></image>
						<!-- #endif -->
						<!-- #ifndef APP -->
						<video class="swiperImg" v-if="item.fileType == 'video'" :src="item.url"></video>
						<!-- #endif -->
						<image :src="item.url" class="swiperImg" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
				<view class="current flex-dir-row flex-y-center">
					<text>{{currentIndex+1}}</text>
					<text>/</text>
					<text>{{goodsdata.goods_banner_imgs.length}}</text>
				</view>
			</view>
			<view v-if="control" class="search-backurl">
				<view class="flex-dir-row flex-y-center flex-x-between" style="position: relative;">
					<view class="flex-dir-row flex-y-center">
						<view class="flex-x-baseline dis-flex">
							<jlg-minPrice :min-price="minPrice" col="#fff" :Weight="600" maxSize="48rpx" minSize="32rpx"></jlg-minPrice>
						</view>
						<text class="seckill-tag ml-10">限时精选</text>
					</view>
					<text class="f-24 w-nowrap" style="color: #B8BBB6;">距离结束还剩</text>
				</view>
				<view class="flex-dir-row flex-y-center flex-x-between" style="position: relative; margin-top: 12rpx;">
					<view class="flex-dir-row flex-y-center">
						<text class="f-24" style="color: #8E918D; line-height: 48rpx;">原价</text>
					<text class="price-original ml-10">{{(goodsdata.crossed_price/100).toFixed(0)}}</text>
					</view>
					<uni-countdown @timeup="delayed" font-size="12" ref="coun" :hour="hours" :minute="minutes"
						:second="seconds" color="#FFFFFF" background-color="#1C7231" splitorColor="#FFFFFF" />
				</view>
			</view>
			<view class="list-item flex-dir-column">
				<!-- 商品名称 + 分享按钮 -->
				<view class="flex-dir-row flex-y-center flex-x-between">
					<view class="product-name">{{goodsdata.name}}</view>
					<!-- #ifndef APP -->
					<button @click="shareClick" class="share-btn">
						<text class="iconfont icon-uniE044" style="font-size: 40rpx; color: #8E918D;"></text>
					</button>
					<!-- #endif -->
				</view>
				<!-- 价格 + 折扣 + 销量（普通商品） -->
				<view v-if="!control" class="flex-dir-row flex-y-center flex-x-between" style="margin-top: 16rpx;">
					<view class="flex-dir-row flex-y-center">
						<view class="product-price-pair dis-flex">
							<jlg-minPrice :min-price="minPrice" maxSize="48rpx" minSize="32rpx" :Weight="500"></jlg-minPrice>
							<text class="price-original ml-10">{{(goodsdata.crossed_price/100).toFixed(0)}}</text>
						</view>
						<text class="deal-tips ml-10">{{(Math.round((minPrice / goodsdata.crossed_price) * 100)/10)}}折</text>
					</view>
					<text v-if="goodsdata.total_sell_count < 9999" class="text-meta w-nowrap">
						{{'销量: ' + goodsdata.total_sell_count}}</text>
					<text v-else class="text-meta w-nowrap">销量: 9999+</text>
				</view>
				<!-- 优惠券标签 + 查看优惠：有可用优惠或秒杀模式时才显示 -->
				<view v-if="control || couponList.length > 0"
					class="flex-dir-row flex-y-center flex-x-between" style="margin-top: 20rpx;">
					<view class="flex-dir-row flex-wrap">
						<view class="coupon-btn"
							v-if="(item.user_type === '所有人' || item.user_arr.includes(user_id)) && (item.allow_type !== '指定商品' || item.goods_arr.includes(goods_id))"
							v-for="(item, index) in couponList" :key="index">
							{{item.name}}
						</view>
					</view>
					<view class="flex-dir-row flex-y-center" @click="popup">
						<text class="f-26 text-primary">{{control?'秒杀商品不可用':'查看优惠'}}</text>
						<text class="iconfont ml-10 f-24 icon-uniE003 text-primary"></text>
					</view>
				</view>
			</view>
			<view class="list-item" style="margin-top: 2rpx;">
				<view class="flex-dir-row flex-y-center  pb-25 b-b" @click="toggleSpec">
					<text class="list-title-left col-9 f-28 w-nowrap">规格</text>
					<view class="flex-x-betweenflex-y-center flex-dir-row w-100">
						<view class="flex-dir-row flex-y-center flex-1">
							<view class="f-29 col-0" v-if="specSelected.length>0">
								<text class="f-27 col-0 mr-10" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
									{{sItem.name}}
								</text>
								<text v-if="numberl > 1">×{{numberl}}</text>
							</view>
							<view class="f-27 col-0" v-else>
								请选择
							</view>
						</view>
						<text class="iconfont icon-uniE003"></text>
					</view>
				</view>
				<view class="flex-dir-row mt-25 flex-y-center pb-25 b-b w-100">
					<text class="list-title-left col-9 f-28 w-nowrap" style="width: 96rpx;">运费</text>
					<view class="flex-x-between flex-y-center flex-dir-row flex-1">
						<view class="flex-dir-row flex-y-center">
							<view class="bz-list con f-27">
								<text>{{!goodsdata.freight && goodsdata.freight_amount>0?'￥' + (goodsdata.freight_amount /100).toFixed(2):'免运费'}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="flex-dir-row mt-25 flex-y-center  ">
					<text class="list-title-left col-9 f-28 w-nowrap">服务</text>
					<view class="flex-x-between flex-y-center flex-dir-row w-100">
						<view class="flex-dir-row flex-y-center  flex-1">
							<view class="bz-list con f-27" v-for="(item,index) in goodsdata.goods_services"
								:key="index">
								<text>{{item}}</text>
								<text style="margin: 0rpx 8rpx;" v-if="servNum-1 != index">·</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 评价 -->
			<view class="eva-section" @click="naTov(goods_id)">
				<view class="e-header">
					<text class="tit">评价</text>
					<text>({{evaluateNum}})</text>
					<text class="tip">好评率 {{goodrate > 0?goodrate:100}}%</text>
					<text class="iconfont icon-uniE003"></text>
				</view>
				<view v-if="evaluateList.length > 0" class="eva-box">
					<image class="portrait"
						:src="evaluateList[0].usimage[0].url?evaluateList[0].usimage[0].url:`../../static/logo.png`"
						mode="aspectFill"></image>
					<view class="right">
						<text class="name">{{evaluateList[0].usname[0]?evaluateList[0].usname[0]:"匿名用户"}}</text>
						<uni-rate :readonly="true" activeColor="#1C7231" size="17" v-model="evaluateList[0].grade" />
						<text class="con">{{evaluateList[0].content.text}}</text>
						<view class="bot">
							<text class="attr">购买类型：<text style="margin-right: 10rpx;"
									v-for="suk in evaluateList[0].goods_suk">{{suk}}</text></text>
							<text class="time">{{formatDate(evaluateList[0].create_date)}}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="detail-desc">
				<view class="d-header">
					<text>图文详情</text>
				</view>
				<mp-html ref="mpAll" :content="goodsdata.goods_desc" />
			</view>
			<!-- 分享弹窗 -->
			<uni-popup ref="sharepopup" type="share">
				<uni-popup-share title="分享到" @select="select"></uni-popup-share>
			</uni-popup>
			<!-- 底部操作菜单 -->
			<view class="footer">
				<view class="flex-dir-row flex-y-center flex-x-between" style="width: 95%;">
				<view class="flex-dir-row flex-y-center">
					<navigator url="/pages/index/index" open-type="switchTab" class="footer-btn">
						<text class="iconfont icon-shouyeshouye"></text>
						<text>首页</text>
					</navigator>
					<navigator url="/pages/cart/cart" open-type="switchTab" class="footer-btn">
						<text class="iconfont icon-uniE026"></text>
						<text>购物车</text>
					</navigator>
					<view class="footer-btn" :class="{active: favorite}" @click="toFavorite('add')">
						<text :class="favorite?'iconfont icon-uniE023':'iconfont icon-shoucang'"></text>
						<text>收藏</text>
					</view>
				</view>
					<view class="flex-dir-row flex-y-center">
						<button v-if="!control" class="footer-left" @click="toggleSpec(1)">加入购物车</button>

						<button :class="control?'footer-rights':'footer-right'" @click="toggleSpec(0)">立即购买</button>
					</view>
				</view>
			</view>

			<!-- 规格弹窗 -->
			<view>
				<uv-popup bgColor="#ffffff" ref="closepopup" :round="10" mode="bottom">
					<view class="layer  spec-content">
						<view class="spec-top">
							<image :src="suks_img || goodsdata.goods_thumb">
							</image>
							<view class="right">
							<jlg-minPrice v-if="suks_price" :min-price="suks_price * numberl"
								maxSize="40rpx" minSize="28rpx" :Weight="500"></jlg-minPrice>
								<text v-else class="col-1C7231 mb-10 f-29">选择规格</text>
								<text class="f-24 col-3 mt-20">库存: {{suks_inventory}}件</text>
								<view class=" f-24 col-3">
									已选：
									<text class="mr-10" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
										{{sItem.name}}
									</text>
								</view>
							</view>
						</view>
						<view v-for="(item,index) in specList" :key="index" class="spec-list">
							<text>{{item.name}}</text>
							<view class="item-list">
								<text v-for="(childItem, childIndex) in specChildList" v-if="childItem.pid === item.id"
									:key="childIndex" class="tit" :class="{selected: childItem.selected}"
									@click="selectSpec(childIndex, childItem.pid,childItem.name)">
									{{childItem.name}}
								</text>
							</view>
						</view>
						<view class="flex-dir-row mt-10 flex-y-center flex-x-between">
							<text>数量</text>
							<uni-number-box background="#e2e2e2" :step="1" :min="1" :max="suks_inventory"
								v-model="numberl"></uni-number-box>
						</view>
						<view class="popup-footer">
							<view class="makesure" @click="toggleSpecs">完成</view>
						</view>
					</view>
				</uv-popup>
			</view>

			<!-- 优惠卷 -->
			<view>
				<uv-popup bgColor="#eaeaea" ref="popup" :round="10" mode="bottom">
					<scroll-view scroll-y class="coupon-cen">
						<view v-for="(item,index) in couponList" :key="index"
							v-if="(item.user_type === '所有人' || item.user_arr.includes(user_id)) && (item.allow_type !== '指定商品' || item.goods_arr.includes(goods_id))"
							class="coupon-van">
							<view class="coupon-letf">
								<view class="flex-dir-row">
									<view class="coupon-icqc">
										{{item.allow_type == '所有商品' && item.user_type == '所有人'?'全场通用':(item.allow_type == '指定商品' && item.user_type == '所有人'?'特定商品':(item.allow_type == '指定用户' && item.user_type == '所有商品'?'特定用户':'特定用户'))}}
									</view>
									<text class="coupon-name">{{item.name}}</text>
								</view>
								<view class="ml-20 mt-30">
									<view class="f-26 col-9">
										有效期为：
									</view>
									<view class="f-26 col-9" style="line-height: 40rpx;">
										{{formatDate(item.start_time)+ '-' +formatDate(item.end_time)}}
									</view>
								</view>
							</view>
							<view v-if="item.is_share" class="coupon-diej">
								可叠加</view>
							<view class="coupon-righ">
								<view class="mt-10">
									<text v-if="item.type == '满减'" class="f-40">￥</text>
									<text v-if="item.type == '满减'" class="coupon-qian">{{item.price/100}}</text>
									<text v-else class="coupon-qian">{{(item.price/10).toFixed(1)}}<text
											class="coupon-z">折</text></text>
								</view>
								<view style="font-size: 30rpx;">满{{item.order_amount/100}}可用</view>
								<view v-if="item.states"
									@click="addCoupon(item._id,item.max_number,item.received_number,item.number,item.user_type,item.user_arr)"
									class="coupon-lqsy">
									立即领取</view>
								<view v-else class="coupon-lqsy"
									@click="navigator(item.allow_type,item.goods_arr,item.name)">
									立即使用</view>
							</view>
						</view>
					</scroll-view>
				</uv-popup>
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	import QrcodePoster from '@/components/zhangyu-qrcode-poster/zhangyu-qrcode-poster.vue';
	export default {
		components: {
			QrcodePoster
		},
		data() {
			return {
				goodsdata: [],
				minPrice: null,
				specSelected: [],
				numberl: 1,
				favorite: false,
				shareList: [],
				specList: [],
				specChildList: [],
				suks_price: null,
				suks_inventory: 0,
				suks_img: '',
				goods_id: '',
				control: false,
				shopCart: false,
				createOrder: false,
				couponList: [],
				user_id: uniCloud.getCurrentUserInfo().uid,
				servNum: null,
				navTop: null,
				navHeight: null,
				borderColor: '',
				evaluateNum: 0,
				goodrate: null,
				currentIndex: 0,
				evaluateList: [],
				hours: null, //秒杀时间
				minutes: null, //秒杀时间
				seconds: null, //秒杀时间
				where: {},
				receiveId: [],
				uqrcodeurl: '', //二维码临时路径
				usname: '匿名用户',
				usimg: 'https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/logo.png',
				show: false,
			};
		},
		onShareTimeline(res) {
			return {
				title: "山前食养商城,优惠多多！",
				imageUrl: '../../static/logo.png',
			}
		},
		onShareAppMessage(res) {
			this.show = true;
			if (res.from) {
				return {
					title: this.goodsdata.name,
					imageUrl: this.goodsdata.goods_thumb,
					path: '/pages/product/product?id=' + this.goodsdata._id,
					success: () => {
						console.log('分享成功');
					},
					fail: (err) => {
						console.error(err);
					}
				}
			}
		},
		onLoad(e) {
			if (e.q) {
				const q = decodeURIComponent(e.q) // 获取到二维码原始链接内容
				const goodsIdPattern = /id=([^&]+)/;
				const userIdPattern = /fxsid=([^&]+)/;
				const goodsIdMatch = goodsIdPattern.exec(q);
				const userIdMatch = userIdPattern.exec(q);
				let goods_id = goodsIdMatch ? goodsIdMatch[1] : null;
				let user_id = userIdMatch ? userIdMatch[1] : null;
				wx.setStorageSync('dicrID', String(user_id))
				this.goodsList(goods_id);
				this.goods_id = goods_id;
				this.receiveData();
				this.toFavorite();
				this.evaluateData(goods_id);
			}
			if (e.fxsid) {
				wx.setStorageSync('dicrID', e.fxsid)
			}
			if (e.control == "true") {
				this.control = true;
				this.hours = Number(e.hours)
				this.minutes = Number(e.minutes)
				this.seconds = Number(e.seconds)
			} else {
				this.control = false;
			}
			if (e.id) {
				this.goodsList(e.id);
				this.goods_id = e.id;
				this.receiveData();
				this.toFavorite();
				this.evaluateData(e.id);
			}
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
			//获取用户头像、昵称用于分享海报
			if (this.user_id) {
				db.collection("uni-id-users").doc(this.user_id).field("nickname,avatar_file").get().then((res) => {
			const userInfo = res.result.data[0];
				this.usname = userInfo?.nickname || '匿名用户';
				this.usimg = userInfo?.avatar_file?.url ||
					'https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/logo.png';
				})
			}
		},
		methods: {
			changeNav(e) {
				this.currentIndex = e.target.current
			},
			goodsList(id) {
				uni.showLoading({
					title: "加载中"
				})
				db.collection("opendb-mall-goods").doc(id).get().then((res) => {
					this.goodsdata = res.result.data[0]
					if (this.goodsdata.videos != null && this.goodsdata.videos.length > 0) {
						this.goodsdata.goods_banner_imgs.unshift(this.goodsdata.videos[0])
					}
					this.servNum = this.goodsdata.goods_services.length
					if (this.control) {
						this.minPrice = this.goodsdata.fs_suks.reduce(function(min, item) {
							var price = parseInt(item.price);
							return price < min ? price : min;
						}, Infinity);
						for (let i = 0; i < this.goodsdata.orig_fs_suks.length; i++) {
							this.specList.push({
								id: i,
								name: this.goodsdata.orig_fs_suks[i].name
							})
							for (let ii = 0; ii < this.goodsdata.orig_fs_suks[i].values.length; ii++) {
								this.specChildList.push({
									id: ii,
									pid: i,
									name: this.goodsdata.orig_fs_suks[i].values[ii].name
								})
							}
						}
					} else {
						this.minPrice = this.goodsdata.suks.reduce(function(min, item) {
							var price = parseInt(item.price);
							return price < min ? price : min;
						}, Infinity);
						for (let i = 0; i < this.goodsdata.orig_suks.length; i++) {
							this.specList.push({
								id: i,
								name: this.goodsdata.orig_suks[i].name
							})
							for (let ii = 0; ii < this.goodsdata.orig_suks[i].values.length; ii++) {
								this.specChildList.push({
									id: ii,
									pid: i,
									name: this.goodsdata.orig_suks[i].values[ii].name
								})
							}
						}
					}
					uni.hideLoading()
				})
			},
			//获取评价数据
			evaluateData(id) {
				db.collection("opendb-mall-comments,uni-id-users").where({
					"goods_id": id
				}).field(
					"goods_id,goods_suk,grade,content,create_date,user_id.nickname as usname,user_id.avatar_file as usimage"
				).get({
					getCount: true
				}).then((res) => {
					this.evaluateList = res.result.data
					// 评价总数
					this.evaluateNum = res.result.count;
					//好评总数
					db.collection("opendb-mall-comments").where({
						"goods_id": id,
						"grade": db.command.gt(2)
					}).get({
						getCount: true
					}).then((res) => {
						let evaluateGood = res.result.count;
						//好评率
						this.goodrate = Math.round((evaluateGood / this.evaluateNum) * 100);
					})
				})
			},
			//规格弹窗开关
			toggleSpec(e) {
				if (this.tokenData()) {
					uni.showToast({
						title: "未登录或登录状态过期",
						icon: "none",
						duration: 1000
					})
					setTimeout(() => {
						uni.navigateTo({
							url: `/uni_modules/uni-id-pages/pages/login/login-withoutpwd`
						})
					}, 1000)
				} else {
					this.$refs.closepopup.open();
					if (e == 1) {
						this.shopCart = true
					} else {
						this.shopCart = false
					}
					if (e == 0) {
						this.createOrder = true
					} else {
						this.createOrder = false
					}
				}
			},
			toggleSpecs() {
				this.$refs.closepopup.close();
				if (this.createOrder && this.suks_price) {
					let suk = this.specSelected.map(item => item.name)
					let goodsData = [{
						id: this.goods_id,
						num: this.numberl,
						seckill: this.control,
						suk: {
							price: this.suks_price,
							specs: suk
						}
					}]
					uni.navigateTo({
						url: `/pages/order/createOrder?suk=${JSON.stringify(goodsData)}&&motion=${(this.goodsdata.crossed_price * this.numberl)-(this.suks_price*this.numberl)}&control=${this.control}`
					})
				}
				if (this.shopCart && this.suks_price && !this.control) {
					this.$func.myFunction('jlg-cart', {
							functionName: 'addToCart',
							data: {
								user_id: this.user_id,
								goods_id: this.goods_id,
								control: this.control,
								specSelected: this.specSelected,
								suks_price: this.suks_price,
								numberl: this.numberl
							}
						}).then(res => {
							if (res.result.message == '加购成功') {
								this.shopCart = false;
								uni.showToast({
									title: "加购成功",
									icon: "none",
									duration: 1600
								});
							} else {
								uni.showToast({
									title: "加购失败",
									icon: "none",
									duration: 1600
								});
								this.shopCart = false;
							}
						})
						.catch(error => {
							this.shopCart = false;
							uni.showModal({
								content: error || '请求服务失败',
								showCancel: false
							});
							console.error(error);
						});
				} else if (this.shopCart && this.control) {
					uni.showToast({
						title: "秒杀商品不能加购",
						icon: "none",
						duration: 1600
					})
				}
			},
			//选择规格
			selectSpec(index, pid) {
				let list = this.specChildList;
				list.forEach(item => {
					if (item.pid === pid) {
						this.$set(item, 'selected', false);
					}
				})

				this.$set(list[index], 'selected', true);
				this.specSelected = [];
				list.forEach(item => {
					if (item.selected === true) {
						this.specSelected.push(item);
					}
				})
				if (this.control) {
					for (let i = 0; i < this.goodsdata.fs_suks.length; i++) {
						// 获取当前规格组合的规格数组
						const specs = this.goodsdata.fs_suks[i].specs;
						// 判断规格数组长度与已选规格数组长度是否相等，
						// 并且使用 every() 方法逐个比较规格值是否相等
						if (specs.length === this.specSelected.length && specs.every((spec, index) => spec === this
								.specSelected[index].name)) {
							// 若规格组合匹配成功，则设置商品价格为当前规格组合的价格
							this.suks_price = this.goodsdata.fs_suks[i].price;
							// 设置库存为当前规格库存
							this.suks_inventory = this.goodsdata.suks[i].inventory;
							//设置缩略图为当前规格图片
							this.suks_img = this.goodsdata.suks[i].goods_thumb;
							// 跳出循环，因为已找到匹配的规格组合
							break;
						}
					}
				} else {
					for (let i = 0; i < this.goodsdata.suks.length; i++) {
						// 获取当前规格组合的规格数组
						const specs = this.goodsdata.suks[i].specs;
						// 判断规格数组长度与已选规格数组长度是否相等，
						// 并且使用 every() 方法逐个比较规格值是否相等
						if (specs.length === this.specSelected.length && specs.every((spec, index) => spec === this
								.specSelected[index].name)) {
							// 若规格组合匹配成功，则设置商品价格为当前规格组合的价格
							this.suks_price = this.goodsdata.suks[i].price;
							// 设置库存为当前规格库存
							this.suks_inventory = this.goodsdata.suks[i].inventory;
							//设置缩略图为当前规格图片
							this.suks_img = this.goodsdata.suks[i].goods_thumb;
							// 跳出循环，因为已找到匹配的规格组合
							break;
						}
					}
				}
			},
			popup() {
				if (this.tokenData()) {
					uni.showToast({
						title: "未登录或登录状态过期",
						icon: "none",
						duration: 1000
					})
					setTimeout(() => {
						uni.navigateTo({
							url: `/uni_modules/uni-id-pages/pages/login/login-withoutpwd`
						})
					}, 1000)
				} else {
					this.$refs.popup.open();
				}
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
			async addCoupon(id, maxnum, yl_num, fx_num, usertype, usarr) {
				if (this.tokenData()) {
					uni.showToast({
						title: "未登录或登录状态过期",
						icon: "none",
						duration: 1000
					})
					setTimeout(() => {
						uni.navigateTo({
							url: `/uni_modules/uni-id-pages/pages/login/login-withoutpwd`
						})
					}, 1000)
				} else {
					this.$func.myFunction('jlg-cart', {
							functionName: 'addCoupon',
							data: {
								"id": id,
								"maxnum": maxnum,
								"yl_num": yl_num,
								"fx_num": fx_num,
								"usertype": usertype,
								"usarr": usarr,
								"user_id": this.user_id
							}
						}).then(res => {
							if (res.result.message == '领取成功') {
								setTimeout(() => this.receiveData(), 1600)
							}
							uni.showToast({
								title: res.result.message,
								icon: "none",
								duration: 1600
							});
							return;
						})
						.catch(error => {
							console.error(error);
						});
				}
			},
			formatDate(timestamp) {
				const date = new Date(timestamp);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			//收藏
			toFavorite(add) {
				db.collection("jlg-goods-collect").where({
					"user_id": this.user_id,
					"article_id": this.goods_id
				}).get().then((res) => {
					if (res.result.data.length == 0) {
						this.favorite = false
						if (add) {
							if (this.tokenData()) {
								uni.showToast({
									title: "未登录或登录状态过期",
									icon: "none",
									duration: 1000
								})
								setTimeout(() => {
									uni.navigateTo({
										url: `/uni_modules/uni-id-pages/pages/login/login-withoutpwd`
									})
								}, 1000)
							} else {
								db.collection("jlg-goods-collect").add({
									"article_id": this.goods_id
								}).then(() => {
									uni.showToast({
										title: "收藏成功",
										icon: "none",
										duration: 1600
									})
									this.favorite = true
								})
							}
						}
					} else {
						this.favorite = true
						if (add) {
							if (this.tokenData()) {
								uni.showToast({
									title: "未登录或登录状态过期",
									icon: "none",
									duration: 1000
								})
								setTimeout(() => {
									uni.navigateTo({
										url: `/uni_modules/uni-id-pages/pages/login/login-withoutpwd`
									})
								}, 1000)
							} else {
								db.collection("jlg-goods-collect").where({
									"user_id": this.user_id,
									"article_id": this.goods_id
								}).remove().then(() => {
									uni.showToast({
										title: "取消收藏",
										icon: "none",
										duration: 1600
									})
									this.favorite = false
								})
							}
						}
					}
				})
			},
			//分享
			shareClick() {
				this.$refs.sharepopup.open()
			},
			select(e) {
				let that = this;
				if (e.index == 0) {

				} else {
					if (this.tokenData()) {
						uni.showToast({
							title: "未登录或登录状态过期",
							icon: "none",
							duration: 1000
						})
						setTimeout(() => {
							uni.navigateTo({
								url: `/uni_modules/uni-id-pages/pages/login/login-withoutpwd`
							})
						}, 1000)
					} else {
						that.$refs.uqrcode.toTempFilePath({
							success: res => {
								this.show = true;
								that.$refs.poster.showCanvas(res.tempFilePath);
								that.uqrcodeurl = res.tempFilePath;
							}
						});
					}
				}
			},
			delayed() {
				uni.showToast({
					title: "秒杀结束",
					icon: "none",
					duration: 2000
				})
				setTimeout(() => uni.navigateBack(), 2000)
			},
			//商品评价
			naTov(id) {
				uni.navigateTo({
					url: `/pages/order/refundDetail?id=${id}`
				})
			},
			tokenData() {
				//效验当前token是否已过期
				let xtime = Date.now();
				let ttime = uniCloud.getCurrentUserInfo().tokenExpired;
				let uid = uniCloud.getCurrentUserInfo().uid;
				if (xtime > ttime || uid == null) {
					return true
				} else {
					return false
				}
			},
			navigator(type, goodsArr, name) {
				if (this.tokenData()) {
					uni.showToast({
						title: "未登录或登录状态过期",
						icon: "none",
						duration: 1000
					})
					setTimeout(() => {
						uni.navigateTo({
							url: `/uni_modules/uni-id-pages/pages/login/login-withoutpwd`
						})
					}, 1000)
				} else {
					if (type == "所有商品") {
						uni.navigateTo({
							url: `/pages/coupon/prefeList?goodsArr=${null}&&name=${name}`
						})
					} else {
						uni.navigateTo({
							url: `/pages/coupon/prefeList?goodsArr=${JSON.stringify(goodsArr)}&&name=${name}`
						})
					}
				}
			},
			buy() {
				uni.navigateTo({
					url: `/pages/order/createOrder`
				})
			},
			goBack() {
				uni.navigateBack()
			},
			showClick(e) {
				this.show = e;
			}
		},
	}
</script>

<style lang='scss'>
	page {
		background: $brand-surface;
		padding-bottom: 160rpx;
	}

	.b-b {
		border-bottom: 1rpx solid $brand-border;
	}

	.icon-uniE003 {
		font-size: 26rpx;
		color: $brand-muted;
	}

	.name {
		margin-bottom: 11rpx;
	}

	.swiper-list {
		height: 750rpx;
	}

	.swiper {
		height: 750rpx;
		position: relative;
	}

	/* 秒杀信息条 */
	.search-backurl {
		position: relative;
		padding: 20rpx 32rpx;
		background: $brand-black;
	}

	.backimg {
		width: 100%;
		height: 125rpx;
		/* #ifdef MP-WEIXIN */
		height: 120rpx;
		/* #endif */
		position: absolute;
		left: 0;
		top: 0;
		z-index: 0;
	}

	/* 轮播图数字指示器 */
	.current {
		position: absolute;
		bottom: 24rpx;
		right: 24rpx;
		background-color: rgba(32, 35, 33, 0.45);
		color: $brand-surface;
		text-align: center;
		border-radius: 999rpx;
		padding: 4rpx 20rpx;
		box-sizing: border-box;
		font-size: 24rpx;
	}

	.swiperImg {
		width: 100%;
		height: 100%;
	}

	/* 信息卡片 */
	.list-item {
		width: 100%;
		padding: 28rpx 32rpx;
		box-sizing: border-box;
		background: $brand-surface;
	}

	/* 商品名称 */
	.product-name {
		font-size: 30rpx;
		font-weight: $font-product-title-weight;
		color: $brand-black;
		line-height: 1.45;
		flex: 1;
	}

	/* 分享按钮 */
	.share-btn {
		background: transparent !important;
		width: 56rpx;
		height: 56rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		margin-left: 16rpx;
		flex-shrink: 0;
		border: none !important;
	}

	/* 限时秒杀标签 */
	.deal-tip {
		font-size: $font-meta;
		color: $brand-primary;
		border: 1rpx solid $brand-primary;
		line-height: 1;
		padding: 5rpx 12rpx;
		margin-left: 16rpx;
	}

	/* 秒杀区白色小标签 */
	.seckill-tag {
		font-size: $font-meta;
		color: $brand-surface;
		border: 1rpx solid rgba(255, 255, 255, 0.5);
		line-height: 1;
		padding: 5rpx 12rpx;
	}

	/* 折扣标签 */
	.deal-tips {
		font-size: $font-meta;
		color: $brand-muted;
		border: 1rpx solid $brand-light-muted;
		line-height: 1;
		padding: 5rpx 12rpx;
	}

	.list-title-left {
		width: 110rpx;
		text-align: left;
		color: $brand-muted;
		font-size: $font-body;
	}

	/* 加入购物车按钮（次按钮） */
	.footer-left {
		width: 210rpx;
		font-size: $font-product-title;
		font-weight: $font-product-title-weight;
		background-color: $brand-bg !important;
		color: $brand-text;
		border-radius: 0;
		height: 88rpx;
		line-height: 88rpx;
	}

	/* 立即购买按钮（主按钮） */
	.footer-right {
		width: 210rpx;
		font-size: $font-product-title;
		font-weight: $font-product-title-weight;
		background-color: $brand-primary !important;
		color: $brand-surface;
		border-radius: 0;
		height: 88rpx;
		line-height: 88rpx;
	}

	/* 秒杀立即购买按钮 */
	.footer-rights {
		width: 360rpx;
		font-size: $font-product-title;
		font-weight: $font-product-title-weight;
		background: $brand-primary !important;
		color: $brand-surface;
		border-radius: 0;
		height: 88rpx;
		line-height: 88rpx;
	}

	/* 优惠券标签 */
	.coupon-btn {
		background-color: transparent;
		border: 1rpx solid $brand-primary;
		margin-right: 10rpx;
		font-size: $font-meta;
		padding: 5rpx 12rpx;
		color: $brand-primary;
		line-height: 1;
	}

	/* 评价区域 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 28rpx 32rpx;
		background: $brand-surface;
		margin-top: 2rpx;

		.e-header {
			display: flex;
			align-items: center;
			height: 60rpx;
			font-size: $font-meta;
			color: $brand-muted;

			.tit {
				font-size: $font-product-title;
				font-weight: $font-product-title-weight;
				color: $brand-black;
				margin-right: 6rpx;
			}

			.tip {
				flex: 1;
				text-align: right;
				color: $brand-muted;
			}

			.icon-uniE003 {
				margin-left: 8rpx;
			}
		}
	}

	.eva-box {
		display: flex;
		padding: 20rpx 0;

		.portrait {
			width: 72rpx;
			height: 72rpx;
			border-radius: 50%;
			flex-shrink: 0;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding-left: 24rpx;
			font-size: $font-body;
			color: $brand-text;

			.con {
				font-size: $font-body;
				padding: 14rpx 0;
				color: $brand-text;
				line-height: 1.6;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				color: $brand-muted;
				font-size: $font-meta;
			}
		}
	}

	/* 图文详情 */
	.detail-desc {
		background: $brand-surface;
		margin-top: 2rpx;
		padding-bottom: 100rpx;

		.d-header {
			display: flex;
			font-size: $font-body;
			font-weight: $font-body-weight;
			letter-spacing: 2rpx;
			align-items: center;
			justify-content: center;
			color: $brand-muted;
			position: relative;
			height: 88rpx;

			text {
				background: $brand-surface;
				padding: 0 24rpx;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300rpx;
				height: 0;
				content: '';
				border-bottom: 1rpx solid $brand-border;
			}
		}
	}

	/* 规格选择弹窗 */
	.spec-content {
		padding: 32rpx;

		.spec-top {
			display: flex;

			image {
				width: 160rpx;
				height: 160rpx;
				border-radius: 4rpx;
				background-color: $brand-image-bg;
				flex-shrink: 0;
			}

			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24rpx;
				font-size: $font-product-title;
				color: $brand-black;
				line-height: 44rpx;
			}
		}

		.spec-list {
			display: flex;
			flex-direction: column;
			font-size: $font-product-title;
			font-weight: $font-product-title-weight;
			color: $brand-black;
			padding-top: 32rpx;
			padding-left: 0;
		}

		.item-list {
			padding: 20rpx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: $brand-bg;
				border: none;
				margin-right: 16rpx;
				margin-bottom: 16rpx;
				border-radius: 32rpx;
				min-width: 60rpx;
				height: 60rpx;
				padding: 0 32rpx;
				font-size: $font-body;
				color: $brand-text;
			}

			.selected {
				background: rgba($brand-primary, 0.08);
				color: $brand-primary;
				border: 1rpx solid $brand-primary;
			}
		}
	}

	/* 底部操作栏 */
	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		padding-top: 16rpx;
		background: $brand-surface;
		border-top: 1rpx solid $brand-border;
		padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
	}

	/* 底部快捷入口图标 */
	.footer-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: $font-meta;
		color: $brand-muted;
		width: 80rpx;
		height: 80rpx;

		.iconfont {
			font-size: 40rpx;
			line-height: 40rpx;
			color: $brand-muted;
		}

		&.active,
		&.active .iconfont {
			color: $brand-primary;
		}
	}

	/* 规格弹窗确认按钮 */
	.makesure {
		width: 100%;
		background-color: $brand-primary;
		border-radius: 0;
		font-size: $font-product-title;
		font-weight: $font-product-title-weight;
		color: $brand-surface;
		text-align: center;
		margin-top: 40rpx;
		padding: 28rpx 0;
		box-sizing: border-box;
	}

	/* 优惠券弹窗 */
	.coupon-diej {
		position: absolute;
		right: 0;
		top: 0;
		background: $brand-muted;
		color: $brand-surface;
		z-index: 99;
		font-size: $font-meta;
		padding: 5rpx 10rpx;
		border-top-right-radius: 8rpx;
		border-bottom-left-radius: 8rpx;
	}

	.coupon-z {
		font-size: 36rpx;
		font-weight: 600;
	}

	.coupon-cen {
		height: 60vh;
		padding: 20rpx;
	}

	.coupon-van {
		width: 100%;
		height: 200rpx;
		background: $brand-surface;
		border-radius: 8rpx;
		border: 1rpx solid $brand-border;
		position: relative;
		margin-top: 16rpx;
	}

	.coupon-letf {
		position: absolute;
		left: 0;
		top: 0;
		width: 67%;
	}

	.coupon-icqc {
		height: 36rpx;
		background: $brand-primary;
		border-radius: 4rpx;
		color: $brand-surface;
		padding: 0 12rpx;
		line-height: 36rpx;
		font-size: $font-meta;
		margin-top: 30rpx;
		margin-left: 20rpx;
		margin-right: 10rpx;
	}

	.coupon-name {
		font-size: 30rpx;
		line-height: 85rpx;
		color: $brand-black;
		font-weight: $font-product-title-weight;
	}

	.coupon-righ {
		width: 33%;
		height: 100%;
		background: $brand-primary;
		position: absolute;
		right: 0;
		border-bottom-right-radius: 8rpx;
		border-top-right-radius: 8rpx;
		color: $brand-surface;
		text-align: center;
	}

	.coupon-qian {
		font-size: 52rpx;
		font-weight: 600;
		margin-top: 8rpx;
	}

	.coupon-lqsy {
		font-size: $font-meta;
		height: 36rpx;
		background: $brand-surface;
		border-radius: 4rpx;
		color: $brand-primary;
		line-height: 36rpx;
		margin: 12rpx auto auto auto;
		width: 120rpx;
		text-align: center;
	}

	button::after {
		border: none;
	}

	/* 微信小程序自定义顶部返回 */
	.navbar {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
	}

	.navbar .navbar-title {
		background: rgba(255, 255, 255, 0.82);
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		position: fixed;
		left: 20rpx;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		overflow: hidden;
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
		color: $brand-black;
	}

	.minprice {
		&:before {
			content: '￥';
			font-size: $font-meta;
			margin: 0 2rpx 0 -4rpx;
		}
	}

	/* 覆盖 jlg-minPrice 组件内 ¥ 前缀字号，与 maxSize 比例协调 */
	.list-item .minprices::before {
		font-size: 28rpx;
	}

	.product-price-pair {
		align-items: flex-end;
		line-height: 1;

		.price-original {
			margin-bottom: 6rpx;
		}
	}

	/* 划线原价 */
	.price-original {
		font-family: $brand-price-font;
		font-size: 26rpx;
		font-weight: $font-meta-weight;
		color: $brand-muted;
		text-decoration: line-through;
		line-height: 32rpx;

		&::before {
			content: '¥';
			font-family: inherit;
			font-size: 24rpx;
			margin-right: 1rpx;
		}
	}
</style>
