<template>
	<view style="background-color: #efefef;min-height: 1000px;padding:0rpx 24rpx;">
		<view style="background-color: #efefef; height: 24rpx;width: 100%;"></view>
		<view class="cell_van">
			<uni-list-item title="申请类型" rightText="未发货仅退款"></uni-list-item>
			<uni-list-item title="申请金额" :rightText="(data.total_fee/100).toFixed(2)"></uni-list-item>
		</view>
		<view style="margin-top: 24rpx;" class="cell_van">
			<uni-list-item title="申请理由"></uni-list-item>
			<uni-easyinput type="textarea" v-model="message" placeholder="请输入退款理由" maxlength="50"></uni-easyinput>
		</view>
		<view class="btn_van">
			<button class="but" color="#61A189" block @click="submit(data._id)">提交申请</button>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		data() {
			return {
				data: [],
				message: '',
				refund_fee: 0,
			}
		},
		onLoad(e) {
			db.collection("uni-pay-orders").doc(e.id).get().then((res) => {
				this.data = res.result.data[0]
			})
		},
		methods: {
			submit(id) {
				let array = [];
				array.push(this.message)
				if (this.message != '') {
					db.collection('uni-pay-orders').doc(id).update({
						"status": 6,
						"refund_fee": this.data.total_fee,
						"refund_list": array,
						"origstate": this.data.status
					}).then(() => {
						uni.showToast({
							title: "已提交申请",
							icon: "none",
							duration: 1000
						})
						this.getOpenerEventChannel().emit('refreshData', id)
						setTimeout(() => uni.navigateBack(), 1000)
					})
				} else {
					uni.showToast({
						title: "请输入退款理由",
						icon: "none",
						duration: 1600
					})
				}
			}
		}
	}
</script>

<style>
	button::after {
		border: none;
	}

	.but {
		height: 80rpx;
		width: 100%;
		margin: auto;
		border-radius: 50px;
		line-height: 80rpx;
		color: #fff;
		background-color: #61A189;
	}

	.btn_van {
		position: absolute;
		bottom: 10px;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 95%;
	}

	.cell_van {
		margin-bottom: 15px;
		width: 100%;
		background-color: #fff;
		margin: 0 auto 0 auto;
		border-radius: 15rpx !important;
	}

	.uni-list-item {
		border-radius: 15rpx !important;
	}

	.is-input-border {
		border-bottom-left-radius: 15rpx !important;
		border-bottom-right-radius: 15rpx !important;
		border: none !important;
	}
</style>