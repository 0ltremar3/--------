<template>
	<view class="content">
		<view class="top_van">
			<uni-steps :options="stepsList" :active="active" active-color="#ffffff" deactive-color="#f1f1f1" />
		</view>
		<view class="page_van">
			<view class="logistics_van">
				<view @click="naTvo(logistics,0)" class="title_van">
					<view class="icon_logistic">
						<text style="color: #414141;margin-left: 6rpx;" class="iconfont icon-uniE00C"></text>
					</view>
					<view style="flex: 1;" v-if="logistics.data != null">
						<view style="color: #1c87dc;;" class="goods_name">
							{{logistics.data[0].context}}
						</view>
						<view class="logistic_time">{{logistics.data[0].time}}</view>
					</view>
					<view style="flex: 1;" v-else>
						<view style="color: #969696;height: 72rpx;line-height: 72rpx;" class="goods_name">
							暂无物流信息
						</view>
					</view>
					<view class="icon_logistic" style="line-height: 56rpx;">
						<text class="iconfont icon-uniE003"></text>
					</view>
				</view>
				<view class="title_van address_van">
					<view class="icon_user">
						<text class="iconfont icon-ditu_dingwei_o" style="font-size: 57rpx;"></text>
					</view>
					<view>
						<view>
							<text class="user_name">{{orderList.name}}</text>
							<text class="logistic_text">{{orderList.phone}}</text>
						</view>
						<text class="logistic_texts">{{orderList.addressol}}</text>
					</view>
				</view>
			</view>
			<view class="logistics_vans">
				<view class="goods_van">
					商品信息
				</view>
				<view @click="naTvo(item.goods_id,2)" class="title_van" style="margin-top: 22rpx;"
					v-for="(item,index) in orderList.goods_arr" :key="index">
					<view class="img_van">
						<image class="goods_img" :src="item.goods_img"></image>
					</view>
					<view class="goods_info">
						<view class="goods_name">{{item.goods_name}}</view>
						<text class="goods_suk" v-for="suk in item.goods_suk">{{suk}}</text>
						<view class="goods_price">
							<jlg-minPrice class="price_text" :min-price="item.goods_price"
								maxSize="30rpx"></jlg-minPrice>
							<text class="goods_num">×{{item.goods_num}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="goods_vans">
				<view class="goods_title">订单编号
					<text class="text">{{orderList.order_no}}</text>
				</view>
				<view class="goods_title">支付方式
					<text class="text">微信支付</text>
				</view>
				<view class="goods_title">{{orderList.status > 1?'支付时间':'创建时间'}}
					<text
						class="text">{{formatDate(orderList.status > 1?orderList.pay_date:orderList.create_date)}}</text>
				</view>
				<view class="goods_title">购买备注
					<text class="text">{{orderList.notes}}</text>
				</view>
			</view>
			<view class="goods_vans">
				<view class="goods_title">商品金额
					<text class="texts">￥{{orderList.origprice/100}}</text>
				</view>
				<view class="goods_title">运费
					<text v-if="orderList.freight != null && orderList.freight>0"
						class="texts">+￥{{orderList.freight/100}}</text>
					<text v-else style="color: #828282;" class="texts">免运费</text>
				</view>
				<view class="goods_title">优惠卷
					<text v-if="orderList.deduprice != null && orderList.deduprice >0"
						class="texts">-￥{{orderList.deduprice/100}}</text>
					<text v-else style="color: #828282;" class="texts">未使用优惠卷</text>
				</view>
				<view class="goods_title">
					<text class="texts" style="line-height: 50rpx;">实付金额：
					</text>
					<jlg-minPrice :min-price="Number(orderList.total_fee)" maxSize="34rpx"></jlg-minPrice>
				</view>
			</view>
		</view>
		<view v-if="![-1,2,3,7].includes(orderList.status)" class="footer pb-sp">
			<view v-if="orderList.status == 0" class="btn1" @click="cancelOrder(orderList)">
				取消订单
			</view>
			<view v-else-if="[1].includes(orderList.status) && !orderList.custom" class="btn1"
				@click="refundClick(orderList)">
				申请退款
			</view>
			<view v-else-if="[4].includes(orderList.status)" class="btn1" @click="naTvo(logistics,0)">
				查看物流
			</view>
			<view v-if="orderList.status == 0 && !orderList.custom" class="btn2" @click="open(orderList)">
				立即支付
			</view>
			<view v-else-if="[4].includes(orderList.status)" class="btn2" @click="confirmReceipt(orderList)">
				确认收货
			</view>
			<view v-else-if="[6].includes(orderList.status)" class="btn2" @click="canceClick(orderList)">
				取消退款
			</view>
			<view v-else-if="[5].includes(orderList.status)" class="btn2" @click="naTvo(orderList,1)">
				立即评价
			</view>
		</view>
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
		onLoad(e) {
			this.orderData(e.id);
			this.orderid = e.id;
		},
		methods: {
			orderData(id) {
				uni.showLoading({
					title: "加载中"
				})
				db.collection("uni-pay-orders").doc(id).get().then((res) => {
					this.orderList = res.result.data[0]
					const str = this.orderList.address;
					const nameMatch = str.match(/姓名：(.*?)；/);
					const phoneMatch = str.match(/电话：(.*?)；/);
					const addressMatch = str.match(/地址：(.*?)$/);
					this.orderList.name = nameMatch ? nameMatch[1] : '';
					this.orderList.phone = phoneMatch ? phoneMatch[1] : '';
					this.orderList.addressol = addressMatch ? addressMatch[1] : '';
					uni.hideLoading()
					switch (this.orderList.status) {
						case 0:
							this.active = 0;
							break;
						case 1:
							this.active = 1;
							break;
						case 4:
							this.active = 2;
							switch (this.orderList.shippingInfo.loginame) {
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
				})
			},
			//取消订单
			async cancelOrder(item) {
				try {
					uni.showLoading({
						title: '请稍后...'
					});
					// 还原优惠卷使用状态
					for (const items of item.preferential) {
						await db.collection("jlg-goods-coupon").doc(items.id).update({
							"is_use": false
						});
					}

					// 还原商品库存及销量
					for (const items of item.goods_arr) {
						const res = await db.collection("opendb-mall-goods").doc(items.goods_id).get();
						await db.collection("opendb-mall-goods").doc(items.goods_id).update({
							"remain_count": res.result.data[0].remain_count + items.goods_num,
							"total_sell_count": res.result.data[0].total_sell_count - items.goods_num
						});
					}

					// 取消订单
					await db.collection("uni-pay-orders").doc(item._id).update({
						"status": -1
					});

					uni.showToast({
						title: "取消成功",
						icon: "none",
						duration: 1600
					});
					this.getOpenerEventChannel().emit('refreshData')
					setTimeout(() => uni.navigateBack(), 1500)
				} catch (error) {
					console.error(error);
					// 处理错误
				} finally {
					uni.hideLoading();
				}
			},
			//取消退款
			canceClick(item) {
				let that = this;
				db.collection("uni-pay-orders").doc(item._id).update({
					"status": item.origstate,
					"refund_fee": 0,
					"refund_list": []
				}).then(() => {
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
							db.collection("uni-pay-orders").doc(item._id).update({
								"status": 5
							}).then(() => {
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

<style lang="scss">
	page,
	.content {
		background: #f3f3f3;
		height: 100%;
	}

	.top_van {
		width: 100%;
		background: #ff7391;
		padding: 30rpx 0rpx 90rpx 0rpx;
	}

	.page_van {
		padding: 0rpx 20rpx 20rpx 20rpx;
		position: absolute;
		width: 100%;
		top: 112rpx;
		z-index: 999;
		padding-bottom: 200rpx;
	}

	.logistics_van {
		width: 100%;
		background: #fff;
		border-radius: 20rpx;
		padding: 25rpx 20rpx;
		margin-top: 20rpx;
	}

	.logistics_vans {
		width: 100%;
		background: #fff;
		border-radius: 20rpx;
		padding: 20rpx;
		margin-top: 20rpx;
	}

	.title_van {
		display: flex;
		flex-direction: row;
	}

	.address_van {
		margin-top: 11px;
		border-top: 1rpx solid #efefef;
		padding-top: 8px;
	}

	.icon_logistic {
		height: 20rpx;
		line-height: 76rpx;
	}

	.icon_user {
		height: 20rpx;
		line-height: 80rpx;
	}

	.iconfont {
		font-size: 45rpx;
		margin-right: 20rpx;
		color: #000;
	}

	.logistic_time {
		font-size: 24rpx;
		color: #afafaf;
		margin-top: 6rpx;
	}

	.logistic_text {
		font-size: 26rpx;
		color: #3c3c3c;
	}

	.logistic_texts {
		font-size: 26rpx;
		color: #3c3c3c;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.user_name {
		font-size: 30rpx;
		margin-right: 12rpx;
	}

	.goods_van {
		height: 58rpx;
		font-size: 30rpx;
		border-bottom: 1rpx solid #efefef;
	}

	.img_van {
		width: 150rpx;
		height: 150rpx;
		margin-right: 20rpx;
	}

	.goods_img {
		width: 100%;
		height: 100%;
		border-radius: 20rpx;
	}

	.goods_info {
		width: 74%;
	}

	.goods_name {
		font-size: 27rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}

	.goods_suk {
		margin-top: 11rpx;
		font-size: 25rpx;
		color: #a0a0a0;
		margin-right: 20rpx;
	}

	.goods_price {
		display: flex;
		flex-direction: row;
		margin-top: 32rpx;
		font-size: 27rpx;
	}

	.price_text {
		flex: 1;
		color: #1C7231;
	}

	.icon-uniE003 {
		margin-right: 0rpx !important;
		color: #717171 !important;
		font-size: 40rpx;
	}

	.goods_num {
		color: #a0a0a0;
	}

	.goods_vans {
		width: 100%;
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx 20rpx 0rpx 20rpx;
		margin-top: 20rpx;
	}

	.goods_title {
		height: 62rpx;
		font-size: 26rpx;
		display: flex;
	}

	.text {
		color: #828282;
		margin-left: 50rpx;
	}

	.texts {
		color: #000000;
		margin-left: 50rpx;
		flex: 1;
		text-align: right;


	}

	.goods_title:last-child {
		border: none !important;
		margin-bottom: 0rpx !important;
	}

	.footer {
		width: 750rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		padding-right: 30rpx;
		box-sizing: border-box;
		z-index: 9999999999;
	}

	.btn1 {
		border: 1rpx solid #b5b5b5;
		color: #545454;
		font-size: 28rpx;
		padding: 11rpx 26rpx 13rpx 26rpx;
		border-radius: 42rpx;
		margin-top: 20rpx;
		box-sizing: border-box;
	}

	.btn2 {
		border: 1rpx solid #ff97ad;
		background-color: #fff8fa;
		color: #f75275;
		font-size: 28rpx;
		padding: 11rpx 26rpx 13rpx 26rpx;
		border-radius: 42rpx;
		margin-top: 20rpx;
		box-sizing: border-box;
		margin-left: 30rpx;

	}
</style>