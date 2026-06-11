<template>
	<view class="content">
		<view style="background: #fff;padding:10rpx 20rpx;">
			<uv-search placeholder="商品名称(模糊)/订单号(精确)" v-model="keyword" shape="round" :showAction="false"
				@search="searchClick" @clear="clearClick"></uv-search>
		</view>
		<uv-sticky bgColor="#fff" :custom-nav-height="navTop">
			<uv-tabs :list="list" @click="tabClick" lineColor="#61A189" :current="labelIndex" :scrollable="false"
				:activeStyle="{color: '#61A189'}"></uv-tabs>
		</uv-sticky>
		<view class="list">
			<!-- 空白页 -->
			<uv-empty v-if="ordersList.length === 0" mode="data" icon="/static/temp/shwk.png" text="订单为空"></uv-empty>

			<!-- 订单列表 -->
			<!-- 只展示真实支付的订单 -->
			<view v-else v-for="(item,index) in ordersList" v-if="item.status > 0?item.transaction_id:true" :key="index"
				class="list-item flex-dir-column ">
				<view class=" flex-dir-row  flex-y-center pb-30 flex-x-between b-b">
					<text @click="copy(item.order_no)" class="col-9 f-26">{{'订单号：' + item.order_no}}
						<text class="iconfont f-40 ml-20 icon-uniE036"></text></text>
					<text :style="{color: item.stateTipColor}"
						class="col-9 f-28">{{item.status == -1?'已关闭':(item.status == 0?'待付款':(item.status == 1?'待发货':(item.status == 2?'已部分退款':(item.status == 3?'已全额退款':(item.status == 4?'待收货':(item.status == 5?'待评价':(item.status == 6?'退款中...':'已完成')))))))}}</text>
				</view>
				<view @click="navigator(item._id)" class=" mt-30 flex-dir-row flex-y-center flex-x-between w-100"
					style="position: relative;" v-for="(goodsItem, goodsIndex) in item.goods_arr" :key="goodsIndex">
					<!-- <view v-if="goodsItem.goods_seckill" class="seckill_img">
						<image src="../../static/temp/secskill.png"></image>
					</view> -->
					<image class="goods-img" :src="goodsItem.goods_img" mode="aspectFill"></image>
					<view class="flex-dir-column  ml-20 flex-1">
						<text class="f-29 col-0 goods-name">{{goodsItem.goods_name}}</text>
						<view class="flex-dir-row flex-y-center">
							<text class="spec" v-for="(goodsSuk,sukIndex) in goodsItem.goods_suk">{{goodsSuk}}</text>
						</view>
						<view class="flex-dir-row flex-y-center flex-x-between mt-20">
							<jlg-minPrice :min-price="goodsItem.goods_price" maxSize="26rpx" minSize="24rpx"
								col="#000"></jlg-minPrice>
							<text class="spec">x{{goodsItem.goods_num}}</text>
						</view>

					</view>
				</view>

				<view @click="navigator(item._id)" class="mt-10 flex-dir-row flex-x-end flex-y-center">
					<text class="f-26">合计：</text>
					<jlg-minPrice :min-price="item.total_fee" maxSize="32rpx"></jlg-minPrice>
				</view>
				<view class="flex-dir-row b-t   pt-30 mt-30 flex-y-center flex-x-between">
					<view class="flex-dir-row flex-y-center">
						<view class="flex-dir-row" v-if="item.status == 0 && !item.custom">
							<text class="col-9 f-26 mr-10" style="line-height: 42rpx;">支付剩余</text>
							<view v-if="item.a">
								<uv-count-down :time="time" format="HH:mm:ss" @finish="cloudFunc"></uv-count-down>
							</view>
							<view v-else>
								<uv-count-down :time="times" format="HH:mm:ss" @finish="cloudFunc"></uv-count-down>
							</view>
						</view>
					</view>
					<view class=" flex-dir-row flex-x-end flex-y-center" v-if="item.status == 0">
						<view class="btn-1" @click="cancelOrder(item)">取消订单</view>
						<view v-if="!item.custom" class="btn-2" @click="open(item)">立即支付</view>
					</view>

					<view class=" flex-dir-row flex-x-end flex-y-center"
						v-if="[1].includes(item.status) && !item.custom">
						<view class="btn-1" @click="refundClick(item)">申请退款</view>
					</view>
					<view class=" flex-dir-row flex-x-end flex-y-center" v-if="[6].includes(item.status)">
						<view class="btn-1" @click="canceClick(item)">取消退款</view>
					</view>
					<view class=" flex-dir-row flex-x-end flex-y-center" v-if="[5].includes(item.status)">
						<view class="btn-2" @click="naTvo(item)">立即评价</view>
					</view>
					<view class=" flex-dir-row flex-x-end flex-y-center" v-if="[4].includes(item.status)">
						<view class="btn-2" @click="confirmReceipt(item)">确认收货</view>
					</view>
					<view class=" flex-dir-row flex-x-end flex-y-center" v-if="item.status===-1">
						<view class="btn-1" @click="deleteOrder(index)">删除订单</view>
					</view>
				</view>

				<uni-popup ref="popup" type="dialog">
					<uni-popup-dialog type="warn" cancelText="取消" confirmText="确定" title="删除提示"
						content="此操作不可恢复,是否删除此订单？" @confirm="dialogConfirm(item._id)"
						@close="dialogClose(index)"></uni-popup-dialog>
				</uni-popup>
			</view>
			<uni-load-more v-if="ordersList.length > 0" :status="loadingType"></uni-load-more>
		</view>


		<view><uni-pay ref="uniPay" @success="onSuccess"></uni-pay></view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				tabIndex: 0,
				labelIndex: 0,
				keyword: '',
				list: [{
						state: 99,
						name: '全部',
					},
					{
						state: 0,
						name: '待付款',
					},
					{
						state: 1,
						name: '待收货',
					},
					{
						state: 5,
						name: '待评价',
					},
					{
						state: 6,
						name: '售后',
					}
				],
				user_id: uniCloud.getCurrentUserInfo().uid,
				ordersList: [],
				currentPage: 1, // 当前页码
				pageSize: 4, // 每页数据条数
				loadingType: 'more',
				searchState: false, //搜索状态
				time: 30 * 60 * 60 * 1000,
				times: 30 * 60 * 60 * 1000,
				navTop: 0
			};
		},
		onLoad(e) {
			// 获取当前时间
			const now = new Date();
			// 获取明天的日期
			const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
			// 获取明天23:59:59的时间戳
			const endTime = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 23, 59, 59)
				.getTime();
			// 计算当前时间距离明天23:59:59的时间间隔（单位：毫秒）
			this.time = endTime - now.getTime();
			const tomorrows = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0).getTime();
			this.times = tomorrows - now.getTime();
			this.loadData(e.state)
			if (e.state == 99) {
				this.labelIndex = 0;
			} else if (e.state == 0) {
				this.labelIndex = 1;
			} else if (e.state == 1) {
				this.labelIndex = 2;
			} else if (e.state == 5) {
				this.labelIndex = 3;
			} else if (e.state == 6) {
				this.labelIndex = 4;
			}
			this.tabIndex = Number(e.state)
		},
		onReachBottom: function() {
			this.currentPage++; // 滚动到底部，页码加1
			this.loadData(this.tabIndex); // 加载下一页商品数据
		},
		methods: {
			//搜索
			searchClick(e) {
				this.loadData(e, 1);
				this.searchState = true;
				this.currentPage = 1;
			},
			//取消搜索
			clearClick() {
				this.searchState = false;
				this.currentPage = 1;
				this.loadData(this.tabIndex);
			},
			//获取订单列表
			loadData(e, a) {
				if (this.currentPage == 1) {
					uni.showLoading({
						title: '加载中'
					})
				}
				let newWhere = {};
				if (!a && !this.searchState) {
					if (Number(e) == 99) {
						newWhere = {
							"user_id": this.user_id,
							"type": 'goods'
						}
					} else if (Number(e) == 1) {
						newWhere = {
							"user_id": this.user_id,
							"status": db.command.in([1, 4]),
							"type": 'goods'
						}
					} else if (Number(e) == 6) {
						newWhere = {
							"user_id": this.user_id,
							"status": db.command.in([2, 3, 6]),
							"type": 'goods'
						}
					} else {
						newWhere = {
							"user_id": this.user_id,
							"status": Number(e),
							"type": 'goods'
						}
					}
				} else {
					//搜索功能
					// 判断是否是订单号
					const isNumeric = /^\d+$/.test(e) && e.length === 18;
					if (isNumeric) {
						newWhere = {
							"user_id": this.user_id,
							"order_no": e,
							"type": 'goods'
						}
					} else {
						const regExp = new RegExp(e, 'i');
						newWhere = {
							"user_id": this.user_id,
							"goods_arr.goods_name": regExp,
							"type": 'goods'
						}
					}
				}
				this.loadingType = "loading";
				const skip = (this.currentPage - 1) * this.pageSize; // 计算需要跳过的数据量
				db.collection("uni-pay-orders").where(newWhere).orderBy("create_date desc").skip(skip).limit(this.pageSize)
					.get().then((res) => {
						const newData = res.result.data; // 获取新的数据
						if (this.currentPage === 1) {
							this.ordersList = newData; // 如果是第一页，清空原始数据列表
						} else {
							this.ordersList = this.ordersList.concat(newData); // 否则追加数据到原始数据列表
						}
						if (newData.length < 10) {
							this.loadingType = "no-more"
						} else {
							this.loadingType = "more"
						}
						this.ordersList.forEach(item => {
							item.stateTipColor = this.orderStateExp(item.status)
						})
						// 获取当前时间戳（以毫秒为单位）
						var currentTimeStamp = Date.now();
						const today = new Date().toLocaleDateString();
						this.ordersList.forEach(item => {
							const date = new Date(item.create_date).toLocaleDateString();
							if (date === today) {
								item.a = true;
							} else {
								item.a = false;
							}
						});
						uni.hideLoading();
					})
			},
			//顶部tab点击
			tabClick(index) {
				this.tabIndex = index.state;
				this.currentPage = 1;
				this.loadData(index.state);
				this.searchState = false;
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
								that.currentPage = 1;
								that.loadData(that.tabIndex);
							})
						}
					}
				})
			},
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
			//删除订单
			dialogConfirm(id) {
				db.collection("uni-pay-orders").doc(id).remove().then(() => {
					uni.showToast({
						title: "删除成功",
						icon: "none",
						duration: 1600
					})
					this.currentPage = 1;
					this.loadData(this.tabIndex);
				})
			},
			//打开删除弹窗
			deleteOrder(index) {
				this.$refs.popup[index].open()
			},
			// 关闭删除弹窗
			dialogClose(index) {
				this.$refs.popup[index].close()
			},
			// 取消订单
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

					this.currentPage = 1;
					this.loadData(this.tabIndex);
				} catch (error) {
					console.error(error);
					// 处理错误
				} finally {
					uni.hideLoading();
				}
			},
			//评价
			naTvo(item) {
				let that = this;
				uni.navigateTo({
					url: `/pages/order/orderEvaluate?data=${JSON.stringify(item)}`,
					events: {
						refreshData: (data) => {
							that.currentPage = 1;
							that.loadData(that.tabIndex);
						}
					}
				});
			},
			//跳转商品详情
			navigator(id) {
				let that = this;
				uni.navigateTo({
					url: `/pages/order/orderDetail?id=${id}`,
					events: {
						refreshData: (data) => {
							that.currentPage = 1;
							that.loadData(that.tabIndex);
						}
					}
				})
			},
			//跳转退款页
			refundClick(item) {
				let that = this;
				uni.navigateTo({
					url: `/pages/order/orderRefund?id=${item._id}`,
					events: {
						refreshData: (data) => {
							that.currentPage = 1;
							that.loadData(that.tabIndex);
						}
					}
				})
			},
			//取消退款
			canceClick(item) {
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
					this.currentPage = 1;
					this.loadData(this.tabIndex);
				})
			},
			//订单状态颜色
			orderStateExp(state) {
				let stateTipColor = '#61A189';
				switch (state) {
					case 2:
					case 3:
					case 7:
					case -1:
						stateTipColor = '#909399';
						break;
					case 6:
						stateTipColor = '#FF9800';
						break;
						// 更多自定义
				}
				return stateTipColor;
			},
			onSuccess(res) {
				console.log('success: ', res);
				if (res.user_order_success) {
					uni.showToast({
						title: "支付成功",
						icon: "none",
						duration: 1600
					}).then(() => {
						this.currentPage = 1;
						this.loadData(this.tabIndex);
					})
					// 代表用户已付款，且你自己写的回调成功并正确执行了
				} else {
					uni.showToast({
						title: "支付成功",
						icon: "none",
						duration: 1600
					}).then(() => {
						this.currentPage = 1;
						this.loadData(this.tabIndex);
					})
					// 代表用户已付款，但你自己写的回调执行失败（通常是因为你的回调代码有问题）
				}
			},
			// 倒计时结束执行取消订单
			cloudFunc() {
				this.$func.myFunction('delete-order', {
						functionName: '',
						data: {}
					})
					.then(res => {
						this.currentPage = 1;
						this.loadData(this.tabIndex);
					})
					.catch(error => {
						console.error(error);
					});
			},
			copy(item) {
				uni.setClipboardData({
					data: item,
					success() {
						uni.showToast({
							title: "复制成功",
							icon: "icon",
							duration: 1500,
						});
					},
					fail() {
						uni.showToast({
							title: "复制失败",
							icon: "none",
							duration: 1500,
						});
					},
				});
			}
		}
	}
</script>

<style lang="scss">
	.seckill_img {
		position: absolute;
		left: -1rpx;
		top: 7rpx;
		z-index: 999;

		image {
			width: 62rpx;
			height: 62rpx;
		}
	}

	page {
		background: #f3f3f3;
		height: 100%;
	}

	.list {
		height: 100%;
	}

	.list-item {
		border-radius: 20rpx;
		background-color: #fff;
		padding: 30rpx;
		box-sizing: border-box;
		margin: 30rpx 20rpx;
	}

	.goods-img {
		display: block;
		width: 150rpx;
		height: 150rpx;
		border-radius: 12rpx;
	}

	.spec {
		font-size: 26rpx;
		color: #8e8e8e;
		padding: 10rpx 12rpx 10rpx 0rpx;
	}

	.btn-1 {
		width: 160rpx;
		height: 60rpx;
		margin: 0;
		margin-left: 24rpx;
		padding: 0;
		text-align: center;
		font-size: 28rpx;
		color: #1a1a1a;
		border-radius: 100px;
		border: 1rpx solid #c6c6c6;
		line-height: 56rpx;
	}

	.btn-2 {
		width: 160rpx;
		height: 60rpx;
		margin: 0;
		margin-left: 24rpx;
		padding: 0;
		text-align: center;
		font-size: 28rpx;
		color: #61A189;
		border-radius: 100px;
		border: 1rpx solid #61A189;

		background-color: #fff7fa;
		line-height: 56rpx;
	}

	.price {
		&:before {
			content: '￥';
			font-size: 24rpx;
			margin: 0 2upx 0 -4upx;
		}
	}

	.b-b {
		border-bottom: 1rpx solid #eee;
	}

	.b-t {
		border-top: 1rpx solid #eee;
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