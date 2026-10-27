<template>
	<view class="order-page order-detail">
		<template v-if="orderList._id">
			<view class="order-state-panel">
				<text class="order-state-title">{{statusPresentation.title}}</text>
				<text class="order-state-hint">{{statusPresentation.hint}}</text>
				<view v-if="[0,1,4,5,7].includes(orderList.status)" class="order-progress">
					<uni-steps :options="progressLabels" :active="active" active-color="#365F4F" deactive-color="#626B65" />
				</view>
			</view>
			<view class="order-section">
				<view v-if="orderList.shippingInfo" class="order-shipping">
					<view class="order-section-heading">
						<text class="order-section-title">{{$t('orders.shippingInfo')}}</text>
						<button class="order-text-button" hover-class="order-pressed" @click="naTvo(logistics,0)">{{$t('orders.viewLogistics')}}<uni-icons type="right" size="14" color="#626B65"></uni-icons></button>
					</view>
					<text class="order-shipping-company">{{orderList.shippingInfo.loginame}}</text>
					<view class="order-info-row">
						<text class="order-waybill" selectable>{{orderList.shippingInfo.loginum}}</text>
						<button class="order-text-button" hover-class="order-pressed" @click="copy(orderList.shippingInfo.loginum)">{{$t('orders.copy')}}</button>
					</view>
					<view v-if="logistics.data && logistics.data.length" class="order-shipping-update">
						<text>{{logistics.data[0].context}}</text>
						<text class="order-hint">{{logistics.data[0].time}}</text>
					</view>
					<text v-else class="order-hint">{{$t('orders.noLogistics')}}</text>
				</view>
				<view class="order-address">
					<uni-icons type="location" size="23" color="#365F4F"></uni-icons>
					<view class="order-address-body">
						<text class="order-hint">{{$t('orders.shippingAddress')}}</text>
						<view class="order-recipient"><text class="order-recipient-name">{{orderList.name}}</text><text>{{orderList.phone}}</text></view>
						<text class="order-address-text" selectable>{{orderList.addressol}}</text>
					</view>
				</view>
			</view>
			<view class="order-section">
				<text class="order-section-title">{{$t('orders.goodsInfo')}}</text>
				<view v-for="(item,index) in orderList.goods_arr" :key="index" class="order-product" hover-class="order-pressed" @click="naTvo(item.goods_id,2)">
					<image class="order-product-image" :src="item.goods_img" mode="aspectFill"></image>
					<view class="order-product-info">
						<text class="order-product-name">{{displayGoodsName(item)}}</text>
						<view class="order-specs"><text v-for="(suk,sukIndex) in item.goods_suk" :key="sukIndex" class="order-spec">{{suk}}</text></view>
						<view class="order-product-price">
							<jlg-minPrice :min-price="item.goods_price" maxSize="30rpx" minSize="24rpx"></jlg-minPrice>
							<text class="order-hint">×{{item.goods_num}}</text>
						</view>
					</view>
				</view>
				<view class="order-price-breakdown">
					<view class="order-info-row"><text class="order-info-label">{{$t('orders.goodsAmount')}}</text><text>￥{{(orderList.origprice/100).toFixed(2)}}</text></view>
					<view class="order-info-row"><text class="order-info-label">{{$t('orders.freight')}}</text><text>{{orderList.freight != null && orderList.freight > 0 ? '+￥' + (orderList.freight/100).toFixed(2) : $t('orders.freeShipping')}}</text></view>
					<view class="order-info-row"><text class="order-info-label">{{$t('orders.coupon')}}</text><text>{{orderList.deduprice != null && orderList.deduprice > 0 ? '-￥' + (orderList.deduprice/100).toFixed(2) : $t('orders.noCoupon')}}</text></view>
					<view class="order-amount"><text>{{orderList.status === 0 ? $t('orders.amountDue') : $t('orders.amountPaid')}}</text><jlg-minPrice :min-price="Number(orderList.total_fee)" maxSize="44rpx" minSize="28rpx" :Weight="500"></jlg-minPrice></view>
				</view>
			</view>
			<view class="order-section">
				<text class="order-section-title">{{$t('orders.orderInfo')}}</text>
				<view class="order-info-row order-id-row"><text class="order-info-label">{{$t('orders.orderNumber')}}</text><text class="order-info-value" selectable>{{orderList.order_no}}</text><button class="order-text-button" hover-class="order-pressed" @click="copy(orderList.order_no)">{{$t('orders.copy')}}</button></view>
				<view class="order-info-row"><text class="order-info-label">{{$t('orders.paymentMethod')}}</text><text class="order-info-value">{{$t('orders.wechatPay')}}</text></view>
				<view class="order-info-row"><text class="order-info-label">{{$t('orders.createdAt')}}</text><text class="order-info-value">{{formatDate(orderList.create_date)}}</text></view>
				<view v-if="orderList.pay_date" class="order-info-row"><text class="order-info-label">{{$t('orders.paidAt')}}</text><text class="order-info-value">{{formatDate(orderList.pay_date)}}</text></view>
				<view class="order-info-row"><text class="order-info-label">{{$t('orders.notes')}}</text><text class="order-info-value">{{orderList.notes || $t('orders.noNotes')}}</text></view>
			</view>
			<view v-if="![-1,2,3,7].includes(orderList.status) && !(orderList.status === 1 && orderList.custom)" class="order-footer">
				<text v-if="orderList.status === 4" class="order-footer-hint">{{$t('orders.receiptHint')}}</text>
				<view class="order-footer-actions">
					<button v-if="orderList.status == 0" class="order-button" hover-class="order-pressed" @click="cancelOrder(orderList)">{{$t('orders.cancelOrder')}}</button>
					<button v-else-if="[1].includes(orderList.status) && !orderList.custom" class="order-button" hover-class="order-pressed" @click="refundClick(orderList)">{{$t('orders.requestRefund')}}</button>
					<button v-else-if="[4].includes(orderList.status)" class="order-button" hover-class="order-pressed" @click="naTvo(logistics,0)">{{$t('orders.viewLogistics')}}</button>
					<button v-if="orderList.status == 0 && !orderList.custom" class="order-button order-button-primary" hover-class="order-pressed" @click="open(orderList)">{{$t('orders.payNow')}}</button>
					<button v-else-if="[4].includes(orderList.status)" class="order-button order-button-primary" hover-class="order-pressed" @click="confirmReceipt(orderList)">{{$t('orders.confirmReceipt')}}</button>
					<button v-else-if="[6].includes(orderList.status)" class="order-button" hover-class="order-pressed" @click="canceClick(orderList)">{{$t('orders.cancelRefund')}}</button>
					<button v-else-if="[5].includes(orderList.status)" class="order-button order-button-primary" hover-class="order-pressed" @click="naTvo(orderList,1)">{{$t('orders.reviewNow')}}</button>
				</view>
			</view>
		</template>
		<view><uni-pay ref="uniPay" @success="onSuccess"></uni-pay></view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				orderList: [],
				stepsList: [],
				active: 0,
				logistics: {},
				orderid: '',
				loginame: '',
			}
		},
		computed: {
			statusPresentation() {
				const statuses = {
					'-1': ['statusClosed', 'closedHint'],
					0: ['statusPendingPay', 'payHint'],
					1: ['statusPendingShip', 'shipHint'],
					2: ['statusPartialRefund', 'partialRefundHint'],
					3: ['statusRefunded', 'refundedHint'],
					4: ['statusPendingReceive', 'receiveHint'],
					5: ['statusPendingReview', 'reviewHint'],
					6: ['statusRefunding', 'refundingHint'],
					7: ['statusCompleted', 'completedHint']
				};
				const keys = statuses[this.orderList.status] || ['orderInfo', ''];
				return { title: this.$t('orders.' + keys[0]), hint: keys[1] ? this.$t('orders.' + keys[1]) : '' };
			},
			progressLabels() {
				return ['statusPendingPay', 'statusPendingShip', 'statusPendingReceive', 'statusPendingReview', 'statusCompleted']
					.map(key => ({ title: this.$t('orders.' + key) }));
			}
		},
		onLoad(e) {
			return this.orderData(e.id, e.out_trade_no);
		},
		methods: {
			displayGoodsName(item) {
				const language = uni.getStorageSync('CURRENT_LANG') || this.$i18n.locale || 'zh-Hans';
				return String(language).indexOf('en') === 0 ? (item.goods_name_en || item.goods_name) : item.goods_name;
			},
			copy(value) {
				uni.setClipboardData({
					data: String(value),
					success: () => uni.showToast({ title: this.$t('orders.copySuccess'), icon: 'none' }),
					fail: () => uni.showToast({ title: this.$t('orders.copyFailed'), icon: 'none' })
				});
			},
			orderData(id, outTradeNo) {
				this.orderList = [];
				this.orderid = '';
				const uid = uniCloud.getCurrentUserInfo().uid;
				if (!uid) {
					uni.showToast({ title: '请先登录后查看订单', icon: 'none' });
					return;
				}
				const query = { user_id: uid };
				if (typeof outTradeNo === 'string' && outTradeNo.trim()) {
					query.out_trade_no = outTradeNo.trim();
				} else if (typeof id === 'string' && id.trim()) {
					query._id = id.trim();
				} else {
					uni.showToast({ title: '缺少有效的订单参数', icon: 'none' });
					return;
				}
				uni.showLoading({
					title: "加载中"
				})
				return db.collection('uni-pay-orders').where(query).limit(1).get().then((res) => {
					const order = res.result.data[0];
					if (!order) {
						uni.showToast({ title: '订单不存在或无权访问', icon: 'none' });
						return;
					}
					this.orderList = order;
					this.orderid = order._id;
					const str = this.orderList.address || '';
					const nameMatch = str.match(/姓名：(.*?)；/);
					const phoneMatch = str.match(/电话：(.*?)；/);
					const addressMatch = str.match(/地址：(.*?)$/);
					this.orderList.name = nameMatch ? nameMatch[1] : '';
					this.orderList.phone = phoneMatch ? phoneMatch[1] : '';
					this.orderList.addressol = addressMatch ? addressMatch[1] : '';
					switch (this.orderList.status) {
						case 0:
							this.active = 0;
							break;
						case 1:
							this.active = 1;
							break;
						case 4:
							this.active = 2;
							switch ((this.orderList.shippingInfo || {}).loginame) {
								case '极兔速递':
									this.loginame = 'jtexpress';
									break;
								case '京东物流':
									this.loginame = 'jd';
									break;
								case '圆通速递':
									this.loginame = 'yuantong';
									break;
								case '中通快递':
									this.loginame = 'zhongtong';
									break;
								case '申通快递':
									this.loginame = 'shentong';
									break;
								case '韵达快递':
									this.loginame = 'yunda';
									break;
								case '百世快递':
									this.loginame = 'huitongkuaidi';
									break;
								case '邮政快递':
									this.loginame = 'youzhengguonei';
									break;
								case '德邦快递':
									this.loginame = 'debangkuaidi';
									break;
							}
							//控制查看物流接口开关
							// this.logisticsInfo()
							break;
						case 5:
							this.active = 3;
							break;
						default:
							this.active = 4;
							break;
					}
					this.stepsList = [{
						title: '待付款'
					}, {
						title: '待发货'
					}, {
						title: '待收货'
					}, {
						title: '待评价'
					}, {
						title: this.orderList.status == 2 ? '已退款' : (this.orderList.status == 3 ? '已退款' : (
							this.orderList.status == 6 ? '退款中' : (this.orderList.status == -1 ?
								'已关闭' : '已完成')))
					}]
				}).catch(() => {
					this.orderList = [];
					this.orderid = '';
					uni.showToast({ title: '订单加载失败，请稍后重试', icon: 'none' });
				}).finally(() => {
					uni.hideLoading();
				});
			},
			//取消订单
			async cancelOrder(item) {
				try {
					uni.showLoading({
						title: '请稍后...'
					});
					await uniCloud.importObject('uni-pay-co').closeOrder({ out_trade_no: item.out_trade_no });

					uni.showToast({
						title: "取消成功",
						icon: "none",
						duration: 1600
					});
					this.getOpenerEventChannel().emit('refreshData')
					setTimeout(() => uni.navigateBack(), 1500)
				} catch (error) {
					console.error(error);
					uni.showToast({ title: error.errMsg || error.message || '取消失败，请刷新后重试', icon: 'none' });
					// 处理错误
				} finally {
					uni.hideLoading();
				}
			},
			//取消退款
			canceClick(item) {
				let that = this;
				uniCloud.importObject('uni-pay-co').orderAction({ id: item._id, action: 'cancelRefund' }).then(() => {
					uni.showToast({
						title: "取消成功",
						icon: "none",
						duration: 1600
					})
					that.orderData(that.orderid)
				})
			},
			formatDate(timestamp) {
				const date = new Date(timestamp);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			logisticsInfo() {
				let that = this;
				uniCloud.callFunction({
					name: "jlg-logistics",
					data: {
						com: that.loginame, // 快递公司编码
						num: that.orderList.shippingInfo.loginum, // 快递单号
					},
					success: function(res) {
						that.logistics = res.result
					}
				})
			},
			//确认收货
			confirmReceipt(item) {
				let that = this;
				uni.showModal({
					title: '收货提示',
					content: "是否确认已收到商品",
					success: function(res) {
						if (res.confirm) {
							uniCloud.importObject('uni-pay-co').orderAction({ id: item._id, action: 'receipt' }).then(() => {
								uni.showToast({
									title: "收货成功",
									icon: "none",
									duration: 1600
								});
								that.orderData(that.orderid)
							})
						}
					}
				})
			},
			//申请退款
			refundClick(item) {
				let that = this;
				uni.navigateTo({
					url: `/pages/order/orderRefund?id=${item._id}`,
					events: {
						refreshData: (data) => {
							that.orderData(that.orderid)
						}
					}
				})
			},
			//支付
			open(item) {
				this.$refs.uniPay.open({
					total_fee: item.total_fee, // 支付金额，单位分 100 = 1元
					type: item.type, // 支付回调类型
					order_no: item.order_no, // 业务系统订单号
					out_trade_no: item.out_trade_no, // 插件支付单号
					openid: item.openid, // 微信公众号需要
					description: item.description, //支付描述
				});
			},
			//查看物流
			naTvo(item, state) {
				let that = this;
				if (state == 0) {
					uni.navigateTo({
						url: `/pages/order/orderLogistic?data=${JSON.stringify(item)}&loginame=${this.orderList.shippingInfo.loginame}&loginum=${this.orderList.shippingInfo.loginum}&address=${this.orderList.addressol}`
					});
				} else if (state == 1) {
					uni.navigateTo({
						url: `/pages/order/orderEvaluate?data=${JSON.stringify(item)}`,
						events: {
							refreshData: (data) => {
								that.orderData(that.orderid)
							}
						}
					});
				} else if (state == 2) {
					uni.navigateTo({
						url: `/pages/product/product?id=${item}`
					});
				}
			},
			//支付回调
			onSuccess(res) {
				console.log('success: ', res);
				let that = this;
				if (res.user_order_success) {
					uni.showToast({
						title: "支付成功",
						icon: "none",
						duration: 1600
					}).then(() => {
						that.orderData(that.orderid)
					})
					// 代表用户已付款，且你自己写的回调成功并正确执行了
				} else {
					uni.showToast({
						title: "支付成功",
						icon: "none",
						duration: 1600
					}).then(() => {
						that.orderData(that.orderid)
					})
					// 代表用户已付款，但你自己写的回调执行失败（通常是因为你的回调代码有问题）
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "./order-ui.scss";
	.order-detail { padding-bottom: calc(220rpx + env(safe-area-inset-bottom)); }
	.order-state-panel { padding: 40rpx 32rpx 32rpx; background: $brand-bg; }
	.order-state-title { display: block; color: $brand-black; font-size: $font-page-title; font-weight: 600; }
	.order-state-hint { display: block; margin-top: 12rpx; color: #626B65; font-size: 26rpx; line-height: 1.6; }
	.order-progress { margin: 32rpx -16rpx 0; }
	.order-section { background: $brand-surface; padding: 28rpx 32rpx; margin-bottom: 16rpx; }
	.order-section-title { display: block; color: $brand-black; font-size: 28rpx; font-weight: 600; }
	.order-section-heading { display: flex; align-items: center; justify-content: space-between; gap: 16rpx; }
	.order-shipping { padding-bottom: 24rpx; margin-bottom: 28rpx; border-bottom: 1rpx solid $brand-border; }
	.order-shipping-company { display: block; margin-top: 8rpx; font-weight: 500; }
	.order-waybill { flex: 1; min-width: 0; overflow-wrap: anywhere; }
	.order-shipping-update { display: flex; flex-direction: column; gap: 8rpx; line-height: 1.6; }
	.order-address { display: flex; align-items: flex-start; gap: 20rpx; }
	.order-address-body { flex: 1; min-width: 0; }
	.order-recipient { display: flex; flex-wrap: wrap; gap: 8rpx 20rpx; margin: 12rpx 0; }
	.order-recipient-name { font-size: 30rpx; font-weight: 500; }
	.order-address-text { display: block; line-height: 1.7; overflow-wrap: anywhere; }
	.order-info-row { display: flex; align-items: baseline; gap: 16rpx; padding: 14rpx 0; line-height: 1.6; }
	.order-info-label { flex-shrink: 0; color: #626B65; }
	.order-info-value { flex: 1; min-width: 0; text-align: right; overflow-wrap: anywhere; }
	.order-id-row { align-items: center; padding: 0; }
	.order-price-breakdown { margin-top: 28rpx; padding-top: 16rpx; border-top: 1rpx solid $brand-border; }
	.order-price-breakdown .order-info-row { justify-content: space-between; }
	.order-amount { display: flex; justify-content: flex-end; align-items: baseline; flex-wrap: wrap; gap: 16rpx; margin-top: 16rpx; padding-top: 24rpx; border-top: 1rpx solid $brand-border; }
	.order-footer { position: fixed; bottom: 0; left: 0; right: 0; z-index: 10; background: $brand-surface; border-top: 1rpx solid $brand-border; padding: 20rpx 32rpx calc(20rpx + env(safe-area-inset-bottom)); }
	.order-footer-actions { display: flex; justify-content: flex-end; flex-wrap: wrap; gap: 16rpx; }
	.order-footer-actions .order-button { flex: 1; min-width: 0; }
	.order-footer-actions .order-button:only-child { flex: 0 1 auto; min-width: 240rpx; }
	.order-footer-hint { display: block; text-align: right; color: #626B65; font-size: 24rpx; line-height: 1.5; margin-bottom: 16rpx; }

</style>
