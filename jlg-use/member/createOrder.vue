<template>
	<view>
		<!-- 地址 -->
		<view @click="navigator" class="list-item " style="padding: 20rpx 25rpx">
			<view class="flex-dir-row b-b pb-30  flex-x-between flex-y-center">
				<view v-if="ressList.formatted_address" class="flex-dir-column w-100">
					<view class="col-3  f-w f-29">
						{{ressList.formatted_address}}
					</view>
					<view class="col-3 mt-10 f-26 flex-dir-row flex-y-center">
						<text class="">{{ressList.name}}</text>
						<text class="ml-10">{{ressList.mobile}}</text>
					</view>
				</view>
				<view v-else class="flex-dir-row w-100">
					<text class="iconfont icon-uniE03d col-61A189"
						style="font-size: 40rpx;height: 20rpx;line-height: 48rpx;"></text>
					<text class="ml-10 f-28" style="line-height: 46rpx;height: 30rpx;">请选择收货地址</text>
				</view>
				<text class="iconfont f-34 icon-uniE003"></text>
			</view>
			<view class="flex-dir-row mt-20  flex-y-center flex-x-between">
				<text class="f-28 col-3">配送方式</text>
				<text class="f-28 col-0 f-w">快递运输</text>
			</view>
		</view>
		<view class="list-item flex-dir-column" style="padding: 20rpx 25rpx 30rpx 25rpx;">
			<view class="flex-dir-row b-b pb-20 flex-y-center">
				<text class="iconfont  f-32 icon-uniE01f col-61A189"
					style="line-height: 20rpx;font-size: 60rpx;"></text>
				<text class="col-3 f-29 ml-10">山前食养商城</text>
			</view>
			<view class="goods mt-20 flex-dir-column w-100">
				<view class="goods-item mb-20 flex-dir-row flex-y-center flex-x-between"
					v-for="(item,index) in goodsList" :key="index">

					<image class="goods-litpic" :src="item.goods_thumb">
					</image>
					<view class="flex-dir-column flex-1 ml-20">
						<text class="f-28 col-0 goods-name ">{{item.name}}</text>
						<view class="f-24  col-9">
							<text style="margin-right: 15rpx;"
								v-for="goods_suk in item.goodssuk.suk.specs">{{goods_suk}}</text>
						</view>
						<view class="flex-dir-row mt-20 flex-y-center flex-x-between">
							<view class="flex-dir-row flex-y-baseline">
								<text class="f-28 col-0 price">{{item.goodssuk.suk.price/100}}</text>
							</view>

							<text class="f-26 col-9 ml-10">x {{item.goodssuk.num}}</text>
						</view>
					</view>

				</view>
				<view class="flex-dir-row mt-20  flex-y-center flex-x-between">
					<view class="col-3 f-28">运费</view>
					<text class="f-w f-28 col-0">{{freight == 0?'免运费':'￥' + (freight/100).toFixed(2) }}</text>
				</view>
				<view class="flex-dir-row mt-20  flex-y-center flex-x-end">
					<text class="f-28 col-3">商品小计：</text>
					<jlg-minPrice :min-price="payments" maxSize="32rpx"></jlg-minPrice>
				</view>
			</view>
		</view>
		<view class="list-item flex-dir-column">
			<view class="flex-dir-row flex-y-center flex-x-between">
				<view class="col-3 f-28">备注</view>
				<input class="desc f-28" type="text" v-model="desc" placeholder="请填写备注信息"
					placeholder-class="placeholder" />
			</view>
		</view>
		<!-- 占位 -->
		<view class="line">

		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="pl-30 col-61A189  flex-dir-row flex-y-baseline">
				<text class="col-0 f-26">实付款:</text>
				<jlg-minPrice :min-price="(payment) + (freight)" maxSize="40rpx" minSize="27rpx"></jlg-minPrice>
			</view>
			<text class="submit" @click="submit">提交订单</text>
		</view>
		<!-- 优惠卷 -->
		<view>
			<uv-popup bgColor="#eaeaea" ref="popup" :round="10" mode="bottom">
				<view style="font-size: 22rpx;color: #61A189;padding: 11px 0px 0px 12px;">提示：秒杀商品不计优惠</view>
				<!-- <scroll-view></scroll-view> -->
				<scroll-view scroll-y class="coupon-cen">
					<view v-if="item.allowType[0] !== '指定商品' || goods_id.some(id=> item.goodsArr[0].includes(id))"
						v-for="(item,index) in couponList" :key="index"
						@click="selectCoupon(item._id,item.couponType[0],item.Price[0],item.orderAmount[0],item.endTime[0],item.couponstate,item.isShare[0],item.couponName[0],item.goodsArr[0],item.allowType[0])"
						class="coupon-van">
						<view class="coupon-letf">
							<view class="flex-dir-row">
								<view class="coupon-icqc">
									{{item.allowType[0] == '所有商品' && item.userType[0] == '所有人'?'全场通用':(item.allowType[0] == '指定商品' && item.userType[0] == '所有人'?'特定商品':(item.allowType[0] == '指定用户' && item.userType[0] == '所有商品'?'特定用户':'特定用户'))}}
								</view>
								<text class="coupon-name">{{item.couponName[0]}}</text>
							</view>
							<view class="ml-20 mt-30">
								<view class="f-26 col-9">
									有效期为：
								</view>
								<view class="f-26 col-9" style="line-height: 40rpx;">
									{{formatDate(item.startTime[0])+ '-' +formatDate(item.endTime[0])}}
								</view>
							</view>
						</view>
						<view v-if="item.isShare[0]" class="coupon-diej">
							可叠加</view>
						<view class="coupon-righ">
							<view class="mt-10">
								<text v-if="item.couponType[0] == '满减'" class="f-40">￥</text>
								<text v-if="item.couponType[0] == '满减'" class="coupon-qian">{{item.Price[0]/100}}</text>
								<text v-else class="coupon-qian">{{(item.Price[0]/10).toFixed(1)}}<text
										class="coupon-z">折</text></text>
							</view>
							<view style="font-size: 30rpx;">满{{item.orderAmount[0]/100}}可用</view>
							<view class="coupon-lqsy">{{item.couponstate === false?'已抵扣':'立即使用'}}</view>
						</view>
					</view>
				</scroll-view>
			</uv-popup>
		</view>
		<uni-popup ref="messpopup" type="dialog">
			<uni-popup-dialog mode="base" title="支付提示" content="订单已创建,超时未支付将自动取消" :duration="0" confirmText="去支付"
				cancelText="返回" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
		<view><uni-pay ref="uniPay" @success="onSuccess" @create="onCreate" @cancel="onCancel"></uni-pay></view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				goodsList: [],
				goods_id: [],
				payment: null, //使用优惠卷后的总金额
				payments: null, //未使用优惠卷时的总金额
				couponList: [],
				user_id: uniCloud.getCurrentUserInfo().uid,
				couponname: [],
				freight: null, //运费
				desc: '', //备注
				payType: 1, //1微信 2支付宝
				ressList: [],
				//支付参数
				goods_arr: [], //商品信息组
				order_no: "", // 业务系统订单号（即你自己业务系统的订单表的订单号）
				out_trade_no: "", // 插件支付单号
				description: "会员权益商品领取", // 支付描述
				type: "goods", // 支付回调类型 如 recharge 代表余额充值 goods 代表商品订单（可自定义，任意英文单词都可以，只要你在 uni-pay-co/notify/目录下创建对应的 xxx.js文件进行编写对应的回调逻辑即可）
				openstate: true,
				coupomFalse: false, //当前拥有优惠卷在当前商品是否可用
				control: false, //秒杀，false为普通商品
				is_distr: false, //是否为分销订单
				openid: '',
				cid: ''
			}
		},
		onLoad(e) {
			this.cid = e.cid;
			let goodsData = JSON.parse(e.suk);
			this.distributionData();
			this.loadData(goodsData);
			this.ressDate();
			this.couponData();
			if (e.control == 'true') {
				this.control = true;
			}
		},
		methods: {
			ressDate() {
				db.collection("jlg-goods-address").where({
					"user_id": this.user_id
				}).orderBy("is_default desc").get().then((res) => {
					this.ressList = res.result.data[0]
				})
			},
			async loadData(data) {
				uni.showToast({
					title: "加载中",
					icon: 'loading',
					duration: 2000000
				})
				// 获取openid
				this.openid = uni.getStorageSync("uni-pay-weixin-h5-openid");
				let fetchedData = [];
				for (let i = 0; i < data.length; i++) {
					const res = await db.collection("opendb-mall-goods").doc(data[i].id).get();
					fetchedData.push(res.result.data[0]);
					fetchedData[i].goodssuk = data[i];
					this.goods_id.push(fetchedData[i]._id)
				}
				let price = null;
				let maxFreightAmount = 0;
				fetchedData.forEach((item) => {
					price += item.goodssuk.suk.price * item.goodssuk.num;
					if (!item.freight && item.freight_amount > maxFreightAmount) {
						maxFreightAmount = item.freight_amount;
					}
				})
				this.goodsList = fetchedData
				this.payment = price;
				this.payments = price;
				this.freight = maxFreightAmount;
				uni.hideToast()
			},
			//判断是否当前用户是否存在上级，如存在，则此订单为分销订单
			distributionData() {
				db.collection("jlg-distribution").where({
					"user_arr": db.command.in([this.user_id])
				}).get().then((res) => {
					if (res.result.data.length > 0) {
						this.is_distr = true;
					}
				})
			},
			couponData() {
				this.$func.myFunction('jlg-cart', {
						functionName: 'getCouponsByTime',
						data: {
							user_id: this.user_id,
							goods_id: this.goods_id
						}
					}).then(res => {
						this.coupomFalse = res.result.coupomFalse;
						this.couponList = res.result.data;
					})
					.catch(error => {
						console.error(error);
					});
			},
			//选择优惠卷
			selectCoupon(id, type, price, orderAmount, endTime, couponstate, isShare, couponName, goodsarr, alltype) {
				let time = Date.now();
				if (endTime <= time) {
					uni.showToast({
						title: "此券已过期",
						icon: "none",
						duration: 1600
					});
					return;
				}

				if (couponstate === false) {
					uni.showToast({
						title: "已使用",
						icon: "none",
						duration: 1600
					});
					return;
				}

				let num = 0
				if (alltype == '指定商品') {
					this.goodsList.forEach((item) => {
						if (goodsarr.includes(item.goodssuk.id) && !item.goodssuk.seckill) {
							num += item.goodssuk.suk.price * item.goodssuk.num
						}
					})
					if (num <= orderAmount) {

						uni.showToast({
							title: "未达使用门槛",
							icon: "none",
							duration: 1600
						});
						return;
					}
				} else {
					this.goodsList.forEach((item) => {
						if (item.goodssuk.seckill) {
							num += item.goodssuk.suk.price * item.goodssuk.num
						}
					})
					if (this.payments - num <= orderAmount) {
						uni.showToast({
							title: "未达使用门槛",
							icon: "none",
							duration: 1600
						});
						return;
					}
				}


				if (!isShare && !this.is_shares()) {
					uni.showToast({
						title: "此券不可与其他券叠加",
						icon: "none",
						duration: 1600
					});
					return;
				}
				if (alltype == '指定商品') {
					// 如果是指定商品可用,只优惠指定商品金额的百分比
					if (type === "满减") {
						this.payment = this.payment - price;
					} else if (type === "折扣") {
						this.payment = Math.round(this.payment - (num - num * (price / 100)));
					}
				} else {
					if (type === "满减") {
						this.payment = this.payment - price;
					} else if (type === "折扣") {
						this.payment = Math.round(this.payment - (this.payments - this.payments * (price / 100)));
					}
				}

				this.couponList.forEach((item) => {
					if (item._id === id) {
						item.couponstate = false;
					}
				});

				uni.showToast({
					title: "使用成功",
					icon: "none",
					duration: 1600
				});

				this.couponname.push({
					id: id,
					name: couponName
				});
				this.$refs.popup.close();
			},
			is_shares() {
				let a = true;
				for (let item of this.couponList) {
					if (item.hasOwnProperty('couponstate')) {
						if (!item.isShare[0]) {
							a = false
						}
					}
				}
				return a
			},
			formatDate(timestamp) {
				const date = new Date(timestamp);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			openpop() {
				this.$refs.popup.open();
			},
			numberChange(data) {
				this.number = data.number;
			},
			changePayType(type) {
				this.payType = type;
			},
			navigator() {
				let that = this;
				uni.navigateTo({
					url: `/pages/address/list?source=1`,
					events: {
						refreshData: (data) => {
							db.collection("jlg-goods-address").doc(data).get().then((res) => {
								that.ressList = res.result.data[0]
							})
						}
					}
				})
			},
			async submit() {
				// #ifdef APP
				uni.showToast({
					title: "APP暂未开通支付功能,请前往山前食养公众号提交订单",
					icon: "none",
					duration: 1600
				})
				// #endif
				// #ifndef APP
				if (this.ressList.formatted_address) {
					if (this.openstate) {
						this.openstate = false;
						uni.showLoading({
							title: '加载中...'
						});
						this.order_no = `${Math.floor(10000 + Math.random() * 90000)}${Date.now()}`;
						this.out_trade_no = `${this.order_no}-1`;

						// 库存效验
						let remain_count_state = await this.InventoryValidation(this.goodsList);
						if (!remain_count_state) {
							return uni.showToast({
								title: "商品库存不足",
								icon: "none",
								duration: 2000
							})
						}
						for (const item of this.goodsList) {
							await this.processGoodsItem(item);
						}
						this.open();

					} else {
						uni.showToast({
							title: "请返回重新提交",
							icon: "none",
							duration: 1600
						})
					}
				} else {
					uni.showToast({
						title: "未选择收货地址",
						icon: "none",
						duration: 1600
					})
				}
				// #endif
			},
			async InventoryValidation(items) {
				// 对每个商品分组，分组后对同规格商品数量累加，如果商品数量大于库存数量，不提交订单
				let groupedItems = await items.reduce((acc, currentItem) => {
					let group = acc.find(item => item._id === currentItem._id);

					if (group) {
						group.suks.push({
							num: currentItem.goodssuk.num,
							suks: currentItem.goodssuk.suk
						})
					} else {
						// console.log(acc)
						acc.push({
							_id: currentItem._id,
							suks: [{
								num: currentItem.goodssuk.num,
								suks: currentItem.goodssuk.suk
							}]
						});
					}

					return acc;
				}, []);
				let remain_count_state = true;
				let dbPromises = groupedItems.map(async (item) => {
					let res = await db.collection("opendb-mall-goods").doc(item._id).get();
					if (this.control) {
						for (let i = 0; i < res.result.data[0].fs_suks.length; i++) {
							// 获取当前规格组合的规格数组
							const specs = res.result.data[0].fs_suks[i].specs;
							// 判断规格数组长度与已选规格数组长度是否相等，
							// 并且使用 every() 方法逐个比较规格值是否相等
							for (let ii = 0; ii < item.suks.length; ii++) {
								if (specs.length === item.suks[ii].suks.specs.length && specs.every((spec,
										index) => spec === item.suks[ii].suks.specs[index])) {
									if (res.result.data[0].fs_suks[i].inventory < item.suks[ii].num) {
										remain_count_state = false;
									}
								}
							}
						}
					} else {
						for (let i = 0; i < res.result.data[0].suks.length; i++) {
							// 获取当前规格组合的规格数组
							const specs = res.result.data[0].suks[i].specs;
							// 判断规格数组长度与已选规格数组长度是否相等，
							// 并且使用 every() 方法逐个比较规格值是否相等
							for (let ii = 0; ii < item.suks.length; ii++) {
								if (specs.length === item.suks[ii].suks.specs.length && specs.every((spec,
										index) => spec === item.suks[ii].suks.specs[index])) {
									if (res.result.data[0].suks[i].inventory < item.suks[ii].num) {
										remain_count_state = false;
									}
								}
							}
						}
					}
				});

				// 等待所有的 Promise 解决
				await Promise.all(dbPromises);

				return remain_count_state;
			},
			async processGoodsItem(item) {
				const goodsItem = {
					goods_id: item._id,
					goods_name: item.name,
					goods_img: item.goods_thumb,
					goods_suk: item.goodssuk.suk.specs,
					goods_price: item.goodssuk.suk.price,
					goods_num: item.goodssuk.num,
					goods_seckill: item.goodssuk.seckill
				};

				const res = await db.collection("opendb-mall-goods").doc(item._id).get();
				await db.collection("opendb-mall-goods").doc(item._id).update({
					"remain_count": res.result.data[0].remain_count - item.goodssuk.num,
					"total_sell_count": res.result.data[0].total_sell_count + item.goodssuk.num
				});

				this.goods_arr.push(goodsItem);
			},
			async open() {
				//更改优惠卷使用状态
				this.couponList.forEach(item => {
					if (item.couponstate == false) {
						db.collection("jlg-goods-coupon").doc(item._id).update({
							"is_use": true
						})
					}
				})
				// 查看权益商品领取状态及过期时间
				let res = await db.collection("jlg-warehouse").doc(this.cid).get();
				let time = Date.now();
				if (res.result.data[0].start_time > time) {
					return uni.showToast({
						title: "未到领取时间"
					})
				}

				if (res.result.data[0].end_time < time) {
					return uni.showToast({
						title: "权益已过期"
					})
				}

				if (res.result.data[0].state != "待领取") {
					return uni.showToast({
						title: "权益已领取"
					})
				}

				uni.hideLoading();
				// 打开支付收银台
				this.$refs.uniPay.open({
					total_fee: this.payment + this.freight, // 支付金额，单位分 100 = 1元
					order_no: this.order_no, // 业务系统订单号（即你自己业务系统的订单表的订单号）
					out_trade_no: this.out_trade_no, // 插件支付单号
					description: this.description, // 支付描述
					type: this.type, // 支付回调类型
					goods_arr: this.goods_arr, //商品信息组
					address: '姓名：' + this.ressList.name + '；电话：' + this.ressList.mobile + '；地址：' + this
						.ressList
						.formatted_address, //收货地址
					preferential: this.couponname, //使用的优惠卷
					notes: this.desc, //购买备注
					origprice: this.payments, //原始价格
					deduprice: this.payments - this.payment, //优惠卷抵扣的金额
					freight: this.freight, //运费金额
					is_distr: false, //是否为分销订单
					audit_status: '审核中',
					openid: this.openid,
					custom: {
						cid: this.cid
					}
				});
			},
			onSuccess(res) {
				console.log('success: ', res);
				if (res.user_order_success) {
					uni.showToast({
						title: "支付成功",
						icon: "none",
						duration: 1600
					}).then(() => {
						uni.switchTab({
							url: `/pages/ucenter/ucenter`
						})
					})
					// 代表用户已付款，且你自己写的回调成功并正确执行了
				} else {
					uni.showToast({
						title: "支付成功",
						icon: "none",
						duration: 1600
					}).then(() => {
						uni.switchTab({
							url: `/pages/ucenter/ucenter`
						})
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
				this.$refs.messpopup.open()
			},
			confirm() {
				this.$refs.messpopup.close()
				uni.navigateTo({
					url: `/pages/order/order?state=0`
				})
			},
			close() {
				this.$refs.messpopup.close()
				uni.navigateBack();
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
		padding-bottom: 100upx;
	}

	.list-item {
		background-color: #fff;
		border-radius: 19rpx;
		margin: 20rpx 2%;

		padding: 20rpx 25rpx;
		box-sizing: border-box;
	}

	.store-logo {
		width: 68rpx;
		height: 68rpx;
		border-radius: 10rpx;
	}

	.goods-litpic {
		width: 135rpx;
		height: 135rpx;
		border-radius: 20rpx;
	}

	.price {
		height: 50upx;
		line-height: 50upx;

		&:before {
			content: '￥';
			font-size: 24rpx;
			margin: 0 2upx 0 -4upx;
		}
	}



	.desc {
		flex: 1;
		font-size: 28rpx;
		margin-left: 30rpx;
	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		justify-content: space-between;
		font-size: 30rpx;
		background-color: #fff;
		z-index: 998;
		color: #000;
		padding-left: 30rpx;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
		padding-bottom: 20rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

	}
	.submit {
		@include shop-button(primary);
		width: 208rpx;
		height: 76rpx;
		text-align: center;
		height: 76rpx;
		line-height: 76rpx;
		font-size: 29rpx;
		margin: 20rpx 30rpx;
	}



	.line {
		width: 750rpx;
		background-color: #f5f5f5;
		height: 300rpx;
	}





	.m-bottom {
		position: relative;
		height: 75rpx;
	}

	.m-img {
		position: absolute;
		width: 35px;
		height: 35px;
		right: 30rpx;
		bottom: 6rpx;
	}

	.b-b {
		border-bottom: 1rpx solid #f5f5f5;
	}

	.b-t {
		border-top: 1rpx solid #f5f5f5;
	}

	.coupon-diej {
		position: absolute;
		right: 0;
		top: 0;
		background: #ffaa00;
		color: #fff;
		z-index: 99;
		font-size: 22rpx;
		padding: 5rpx 10rpx;
		border-top-right-radius: 20rpx;
		border-bottom-left-radius: 20rpx;
	}

	.coupon-z {
		font-size: 40rpx;
		font-weight: 600;
	}

	.coupon-cen {
		height: 60vh;
		padding: 20rpx;
		padding-bottom: 150rpx;
		padding-top: 20rpx;
	}

	.coupon-van {
		width: 100%;
		height: 200rpx;
		background: #fff;
		border-radius: 20rpx;
		position: relative;
		margin-top: 20rpx;
	}

	.coupon-letf {
		position: absolute;
		left: 0;
		top: 0;
		width: 67%;
	}

	.coupon-icqc {
		height: 38rpx;
		background: #61A189;
		border-radius: 100rpx;
		color: #fff;
		padding: 0 15rpx;
		line-height: 38rpx;
		font-size: 22rpx;
		margin-top: 30rpx;
		margin-left: 20rpx;
		margin-right: 10rpx;
	}

	.coupon-name {
		font-size: 34rpx;
		top: 30rpx;
		line-height: 85rpx;
		color: #1b1b1b;
	}

	.coupon-righ {
		width: 33%;
		height: 100%;
		background: #61A189;
		position: absolute;
		right: 0;
		border-bottom-right-radius: 20rpx;
		border-top-right-radius: 20rpx;
		color: #fff;
		text-align: center;
	}

	.coupon-qian {
		font-size: 64rpx;
		font-weight: 600;
		margin-top: 8rpx;
	}
	.coupon-lqsy {
		@include shop-button(secondary);
		font-size: 24rpx;
		height: 38rpx;
		line-height: 38rpx;
		margin: 12rpx auto auto auto;
		width: 125rpx;
	}

	.goods-name {
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}
</style>