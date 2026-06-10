<template>
	<view class="container">
		<view class="flex-dir-colum container h-100  ">
			<uv-empty v-if="disrrList.length ==0" mode="data" icon="/static/temp/shwk.png" text="暂无下级成员"></uv-empty>
			<view class="flex-dir-column list-item" v-for="(item,index) in disrrList" :key="index">
				<view class="flex-dir-row flex-y-center flex-x-between">
					<view class="flex-dir-row flex-y-center">
						<image :src="item[1] == '无头像'?'../../static/logo.png':item[1]" class="litpic" mode=""></image>
						<text class="col-0 ml-15 f-32">{{item[0]?item[0]:'匿名用户'}}</text>
					</view>

				</view>
				<view class="nav-bottom flex-dir-row flex-y-center flex-x-between ">
					<view class="flex-dir-column  f-26 flex-y-center">
						<text class="col-9">全部订单</text>
						<text class="col-0 mt-5 f-32">{{item[2]}}</text>
					</view>
					<view class="flex-dir-column  f-26 flex-y-center">
						<text class="col-9">有效订单</text>
						<text class="col-0 mt-5 f-32">{{item[3]}}</text>
					</view>
					<view class="flex-dir-column  f-26 flex-y-center">
						<text class="col-9">无效订单</text>
						<text class="col-0 mt-5 f-32">{{item[4]}}</text>
					</view>
					<view class="flex-dir-column  f-26 flex-y-center">
						<text class="col-9">审核中订单</text>
						<text class="col-0 mt-5 f-32">{{item[5]}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				user_id: uniCloud.getCurrentUserInfo().uid,
				disrrList: []
			}
		},
		onLoad() {
			this.disrrData()
		},
		methods: {
			//分销成员
			disrrData() {
				uni.showLoading({
					title: "加载中..."
				})
				db.collection("jlg-distribution,uni-id-users")
					.where({
						"user_id._id": this.user_id
					})
					.field(
						"user_id._id as usersid,user_arr._id as userids"
					)
					.get()
					.then(async (res) => {
						let newdata = res.result.data[0];
						let xjuser = await db.collection('uni-id-users').where({
							"_id": db.command.in(newdata.userids)
						}).field('nickname,avatar_file').get();
						let array = [];
						for (let i = 0; i < xjuser.result.data.length; i++) {
							if (xjuser.result.data[i].nickname != null) {
								array.push([xjuser.result.data[i].nickname]);
							} else {
								array.push(["匿名用户"]);
							}
							if (xjuser.result.data[i].avatar_file == null) {
								array[i].push("无头像");
							} else {
								array[i].push(xjuser.result.data[i].avatar_file.url);
							}
							// 使用await等待异步操作完成
							await db
								.collection("uni-pay-orders")
								.where({
									"user_id": xjuser.result.data[i]._id,
									"is_distr": true,
									"status": db.command.gt(0).and(db.command.neq(2, 3, 6))
								})
								.groupBy("audit_status")
								.groupField(" sum(1) as count")
								.get()
								.then((res) => {
									let sygnum = 0;
									let tgnum = 0;
									let wxnum = 0;
									let shznum = 0;
									res.result.data.forEach((item) => {
										sygnum += item.count;
										if (item.audit_status == "已通过") {
											tgnum = item.count;
										} else if (item.audit_status == "未通过") {
											wxnum = item.count;
										} else if (item.audit_status == "审核中") {
											shznum = item.count;
										}
									});
									array[i].push(sygnum);
									array[i].push(tgnum);
									array[i].push(wxnum);
									array[i].push(shznum);
								});
						}
						this.disrrList = array;
						uni.hideLoading();
					});
			},
		},
	}
</script>

<style>
	page {
		background-color: #f5f5f5;
	}

	.list-item {
		margin: 0 3%;
		width: 94%;
		background-color: #fff;
		border-radius: 20px;
		margin-top: 30rpx;
		padding: 40rpx 30rpx;
		box-sizing: border-box;
	}

	.litpic {
		width: 90rpx;
		border-radius: 50%;
		height: 90rpx;
	}


	.btn {
		background-color: #ffe4ed57;
		color: #ff0252;
		font-size: 24rpx;
		padding: 10rpx 24rpx 13rpx 28rpx;
		border-radius: 25rpx;
	}

	.b-f {
		background-color: #fff;
	}

	.col-ff721c {
		color: #2b8779;
	}

	.col-959595 {
		color: #959595;
	}

	.nav-bottom {
		background-color: #eeeeee7d;
		padding: 20rpx;
		border-radius: 19rpx;
		margin-top: 20rpx;
	}
</style>