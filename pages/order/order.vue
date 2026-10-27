<template>
	<view class="order-page">
		<view class="order-search">
			<uv-search :placeholder="$t('orders.searchPlaceholder')" v-model="keyword" shape="square" :showAction="false"
				bgColor="#F7F8F5" color="#202321" placeholderColor="#626B65" @search="searchClick" @clear="clearClick"></uv-search>
		</view>
		<uv-sticky bgColor="#fff" :custom-nav-height="navTop">
			<uv-tabs :list="tabList" @click="tabClick" lineColor="#61A189" :current="labelIndex" :scrollable="false"
				:activeStyle="{color: '#365F4F', fontWeight: '600'}" :inactiveStyle="{color: '#626B65'}"></uv-tabs>
		</uv-sticky>
		<view class="order-list">
			<view v-if="ordersList.length === 0" class="order-empty">
				<uv-empty mode="data" icon="/static/temp/shwk.png" :text="$t('orders.empty')"></uv-empty>
				<text class="order-hint">{{$t('orders.emptyHint')}}</text>
			</view>
			<view v-else v-for="(item,index) in ordersList" v-if="item.status > 0?item.transaction_id:true" :key="index" class="order-card">
				<view class="order-card-header">
					<text class="order-status" :class="{'is-muted': [-1,2,3,7].includes(item.status), 'is-refunding': item.status === 6}">{{orderStatusText(item.status)}}</text>
					<button class="order-text-button" hover-class="order-pressed" @click="navigator(item._id)">
						{{$t('orders.viewDetail')}}<uni-icons type="right" size="14" color="#626B65"></uni-icons>
					</button>
				</view>
				<view class="order-number-row">
					<text class="order-number">{{$t('orders.orderNo') + item.order_no}}</text>
					<button class="order-text-button" hover-class="order-pressed" @click="copy(item.order_no)">{{$t('orders.copy')}}</button>
				</view>
				<view v-for="(goodsItem, goodsIndex) in item.goods_arr" :key="goodsIndex" class="order-product" hover-class="order-pressed" @click="navigator(item._id)">
					<image class="order-product-image" :src="goodsItem.goods_img" mode="aspectFill"></image>
					<view class="order-product-info">
						<text class="order-product-name">{{displayGoodsName(goodsItem)}}</text>
						<view class="order-specs"><text v-for="(goodsSuk,sukIndex) in goodsItem.goods_suk" :key="sukIndex" class="order-spec">{{goodsSuk}}</text></view>
						<view class="order-product-price">
							<jlg-minPrice :min-price="goodsItem.goods_price" maxSize="30rpx" minSize="24rpx" col="#202321"></jlg-minPrice>
							<text class="order-hint">×{{goodsItem.goods_num}}</text>
						</view>
					</view>
				</view>
				<view class="order-total" @click="navigator(item._id)">
					<text>{{$t('orders.total')}}</text>
					<jlg-minPrice :min-price="item.total_fee" maxSize="38rpx" minSize="26rpx" :Weight="500"></jlg-minPrice>
				</view>
				<view v-if="item.status == 0 && !item.custom" class="order-countdown">
					<uni-icons type="clock" size="16" color="#626B65"></uni-icons>
					<text>{{$t('orders.payRemaining')}}</text>
					<uv-count-down v-if="item.a" :time="time" format="HH:mm:ss" @finish="cloudFunc"></uv-count-down>
					<uv-count-down v-else :time="times" format="HH:mm:ss" @finish="cloudFunc"></uv-count-down>
				</view>
				<view v-if="item.status == 0 || (item.status == 1 && !item.custom) || [-1,4,5,6].includes(item.status)" class="order-actions">
					<template v-if="item.status == 0">
						<button class="order-button" hover-class="order-pressed" @click="cancelOrder(item)">{{$t('orders.cancelOrder')}}</button>
						<button v-if="!item.custom" class="order-button order-button-primary" hover-class="order-pressed" @click="open(item)">{{$t('orders.payNow')}}</button>
					</template>
					<button v-if="[1].includes(item.status) && !item.custom" class="order-button" hover-class="order-pressed" @click="refundClick(item)">{{$t('orders.requestRefund')}}</button>
					<button v-if="[6].includes(item.status)" class="order-button" hover-class="order-pressed" @click="canceClick(item)">{{$t('orders.cancelRefund')}}</button>
					<button v-if="[5].includes(item.status)" class="order-button order-button-primary" hover-class="order-pressed" @click="naTvo(item)">{{$t('orders.reviewNow')}}</button>
					<button v-if="[4].includes(item.status)" class="order-button order-button-primary" hover-class="order-pressed" @click="confirmReceipt(item)">{{$t('orders.confirmReceipt')}}</button>
					<button v-if="item.status===-1" class="order-button" hover-class="order-pressed" @click="deleteOrder(index)">{{$t('orders.deleteOrder')}}</button>
				</view>
				<uni-popup ref="popup" type="dialog">
					<uni-popup-dialog type="warn" :cancelText="$t('orders.cancel')" :confirmText="$t('orders.confirm')" :title="$t('orders.deleteTitle')"
						:content="$t('orders.deleteContent')" @confirm="dialogConfirm(item._id)" @close="dialogClose(index)"></uni-popup-dialog>
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
				tabIndex: 99,
				labelIndex: 0,
				keyword: '',
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
		computed: {
			tabList() {
				return [{
						state: 99,
						name: this.$t('orders.all'),
					},
					{
						state: 0,
						name: this.$t('orders.pendingPay'),
					},
					{
						state: 1,
						name: this.$t('orders.pendingReceive'),
					},
					{
						state: 5,
						name: this.$t('orders.pendingReview'),
					},
					{
						state: 6,
						name: this.$t('orders.afterSales'),
					}
				]
			}
		},
		onLoad(e = {}) {
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
			// 订单中心入口不带参数时，默认展示全部订单。
			const state = e.state == null || String(e.state).trim() === '' ? 99 : Number(e.state);
			const index = this.tabList.findIndex(tab => tab.state === state);
			this.labelIndex = index === -1 ? 0 : index;
			this.tabIndex = this.tabList[this.labelIndex].state;
			this.loadData(this.tabIndex);
		},
		onReachBottom: function() {
			this.currentPage++; // 滚动到底部，页码加1
			this.loadData(this.tabIndex); // 加载下一页商品数据
		},
		methods: {
			getCurrentLang() {
				const language = uni.getStorageSync('CURRENT_LANG') || this.$i18n.locale || 'zh-Hans';
				return String(language).indexOf('en') === 0 ? 'en' : 'zh-Hans';
			},
			displayGoodsName(item) {
				return this.getCurrentLang() === 'en' ? (item.goods_name_en || item.goods_name) : item.goods_name;
			},
			orderStatusText(status) {
				const statusMap = {
					'-1': this.$t('orders.statusClosed'),
					'0': this.$t('orders.statusPendingPay'),
					'1': this.$t('orders.statusPendingShip'),
					'2': this.$t('orders.statusPartialRefund'),
					'3': this.$t('orders.statusRefunded'),
					'4': this.$t('orders.statusPendingReceive'),
					'5': this.$t('orders.statusPendingReview'),
					'6': this.$t('orders.statusRefunding')
				};
				return statusMap[String(status)] || this.$t('orders.statusCompleted');
			},
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
						title: this.$t('orders.loading')
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
					title: this.$t('orders.receiptTitle'),
					content: this.$t('orders.receiptContent'),
					success: function(res) {
						if (res.confirm) {
							uniCloud.importObject('uni-pay-co').orderAction({ id: item._id, action: 'receipt' }).then(() => {
								uni.showToast({
									title: that.$t('orders.receiptSuccess'),
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
						title: this.$t('orders.deleteSuccess'),
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
						title: this.$t('orders.waiting')
					});
					await uniCloud.importObject('uni-pay-co').closeOrder({ out_trade_no: item.out_trade_no });

					uni.showToast({
						title: this.$t('orders.cancelSuccess'),
						icon: "none",
						duration: 1600
					});

					this.currentPage = 1;
					this.loadData(this.tabIndex);
				} catch (error) {
					console.error(error);
					uni.showToast({ title: error.errMsg || error.message || '取消失败，请刷新后重试', icon: 'none' });
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
				uniCloud.importObject('uni-pay-co').orderAction({ id: item._id, action: 'cancelRefund' }).then(() => {
					uni.showToast({
						title: this.$t('orders.cancelSuccess'),
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
						title: this.$t('orders.paymentSuccess'),
						icon: "none",
						duration: 1600
					}).then(() => {
						this.currentPage = 1;
						this.loadData(this.tabIndex);
					})
					// 代表用户已付款，且你自己写的回调成功并正确执行了
				} else {
					uni.showToast({
						title: this.$t('orders.paymentSuccess'),
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
				const that = this;
				uni.setClipboardData({
					data: item,
					success() {
						uni.showToast({
							title: that.$t('orders.copySuccess'),
							icon: "icon",
							duration: 1500,
						});
					},
					fail() {
						uni.showToast({
							title: that.$t('orders.copyFailed'),
							icon: "none",
							duration: 1500,
						});
					},
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "./order-ui.scss";
	.order-search { padding: 20rpx 32rpx 12rpx; background: $brand-surface; }
	.order-list { padding: 20rpx 0 calc(32rpx + env(safe-area-inset-bottom)); }
	.order-card { margin-bottom: 20rpx; padding: 12rpx 32rpx 28rpx; background: $brand-surface; }
	.order-card-header { display: flex; align-items: center; justify-content: space-between; gap: 16rpx; }
	.order-status { color: #365F4F; font-size: 30rpx; font-weight: 600; }
	.is-muted { color: #626B65; }
	.is-refunding { color: #87541E; }
	.order-number-row { display: flex; align-items: center; gap: 12rpx; border-bottom: 1rpx solid $brand-border; }
	.order-number { flex: 1; min-width: 0; color: #626B65; font-size: 24rpx; overflow-wrap: anywhere; }
	.order-total { display: flex; justify-content: flex-end; align-items: baseline; gap: 12rpx; padding: 24rpx 0 8rpx; }
	.order-countdown { display: flex; align-items: center; flex-wrap: wrap; gap: 12rpx; background: $brand-bg; padding: 16rpx 20rpx; margin-top: 16rpx; color: #626B65; font-size: 24rpx; }
	.order-actions { display: flex; justify-content: flex-end; flex-wrap: wrap; gap: 16rpx; margin-top: 20rpx; }
	.order-empty { display: flex; flex-direction: column; align-items: center; gap: 24rpx; padding: 96rpx 32rpx; text-align: center; }

</style>
