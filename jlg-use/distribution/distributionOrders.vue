<template>
	<view style="box-sizing: border-box;">
		<uv-sticky bgColor="#fff" custom-nav-height="0">
			<uv-tabs :list="list" @click="tabClick" lineColor="#61A189" :scrollable="false"
				:activeStyle="{color: '#61A189'}"></uv-tabs>
		</uv-sticky>
		<uv-empty v-if="orderList.length ==0" mode="data" icon="/static/temp/shwk.png" text="暂无成员订单"></uv-empty>
		<view v-else class="container">
			<view v-for="(item,index) in orderList" class="flex-x-between list-item "
				v-if="where == true?true:item.audit_status == where">
				<view class=" flex-x-between list-top f-26">
					<view class="flex-dir-row  flex-y-center">
						<text>订单编号：</text>
						<text>{{item.order_no}}</text>
					</view>
					<view>
						<text
							:class="item.audit_status === '审核中' || !item.audit_status ? 'col-blue' : (item.audit_status === '已通过'  ? 'col-2b8779 ' : 'col-ff1115')">{{ item.audit_status?item.audit_status:'审核中' }}</text>
					</view>
				</view>

				<view class="list-bottom f-26 flex-dir-row flex-x-between flex-y-center">
					<view class="flex-dir-row  flex-y-center">
						<image class="litpic" :src="item.avatarimg[0]?item.avatarimg[0].url:`../../static/logo.png`"
							mode="scaleToFill"></image>
						<text class="col-0 f-25 ml-5">{{item.suboname[0]}}</text>
					</view>
					<view class="flex-dir-row  flex-y-center" style="margin-left: 40rpx;">
						<text>预估佣金：</text>
						<jlg-minPrice :minPrice="item.comm"></jlg-minPrice>
					</view>

				</view>
				<view class="list-bottom f-26 flex-dir-row flex-x-between flex-y-center">
					<view class="flex-dir-row mt-10 f-26 col-959595 flex-y-center">
						<text>下单时间：</text>
						<text>{{formatDate(item.create_date)}}</text>
					</view>
					<view class="">
						<text>来源：</text>
						<text style="color: #3ab5a4;">{{ item.grade + '成员'}}</text>
					</view>
				</view>

			</view>
		</view>

	</view>
</template>

<script>
	import Sticky from "@/uni_modules/uv-sticky/components/uv-sticky/uv-sticky.vue";
	import Tabs from "@/uni_modules/uv-tabs/components/uv-tabs/uv-tabs.vue";
	import minPrice from "@/components/jlg-minPrice/jlg-minPrice.vue";
	const db = uniCloud.database();
	export default {
		components: {
			Sticky,
			Tabs,
			minPrice
		},
		data() {
			return {
				user_id: uniCloud.getCurrentUserInfo().uid,
				orderList: [],
				commpropo: [],
				list: [{
						name: '全部',
					},
					{
						name: '已通过',
					},
					{
						name: '审核中',
					},
					{
						name: '未通过',
					}
				],
				where: true,
			}
		},
		onLoad() {
			this.disrrData()
		},
		methods: {
			//顶部tab点击
			tabClick(e) {
				if (e.index == 0) {
					this.where = true;
				} else if (e.index == 1) {
					this.where = '已通过';
				} else if (e.index == 2) {
					this.where = '审核中';
				} else if (e.index == 3) {
					this.where = '未通过';
				}
			},
			disrrData() {
				uni.showLoading({
					title: "加载中..."
				})
				db.collection("jlg-distribution,uni-id-users").where({
						"user_id._id": this.user_id
					}).field(
						"user_arr._id as userid,user_id.nickname as name"
					)
					.get().then((res) => {
						if (res.result.data.length > 0) {
							this.data = res.result.data[0]
							db.collection("jlg-distribution-propor").get().then((res) => {
								this.commpropo = res.result.data[0]
								this.orderDate()
							})
						} else {
							uni.hideLoading();
						}
					})
			},
			orderDate() {
				//遍历下级用户订单
				this.$func.myFunction('jlg-cart', {
						functionName: 'orderDate',
						data: {
							userid: this.data.userid,
							commpropo: this.commpropo
						}
					})
					.then(res => {
						this.orderList = res.result.data
						uni.hideLoading()
					})
					.catch(error => {
						uni.hideLoading()
						console.error(error);
					});
			},
			formatDate(timestamp) {
				const date = new Date(timestamp);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			}
		},
	}
</script>

<style>
	page {
		background-color: #fff;
		color: #fff;
	}

	.col-blue {
		color: blue;
	}

	.container {
		padding: 20rpx 5rpx;
		box-sizing: border-box;
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.h-100 {
		height: 100vh;
	}

	.list-item {
		background-color: #fff;
		box-shadow: 0px 1px 14px 1px #f5f5f5;
		display: flex;
		flex-direction: column;
		margin: 10rpx 20rpx 30rpx 20rpx;
		color: #000;
		border-radius: 20rpx;
		font-size: 30rpx;
		padding-bottom: 35rpx;
		box-sizing: border-box;
	}

	.list-top {
		display: flex;
		flex-direction: row;
		align-items: center;
		box-sizing: border-box;
		background: #ffdfdf87;
		padding: 30rpx;
		border-radius: 20rpx 20rpx 0 0;

	}

	.list-bottom {
		padding-top: 15rpx;
		margin: 0 30rpx;
		margin-top: 15rpx !important;
	}

	.b-f {
		background-color: #fff;
	}

	.col-2b8779 {
		color: #2b8779;
	}

	.col-ff1115 {
		color: #ff1115;
	}

	.col-959595 {
		color: #959595;
	}

	.litpic {
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
	}
</style>