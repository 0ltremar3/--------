<template>
	<view class="container">
		<view style="padding-bottom: 200rpx;">
			<view class="list-item" v-for="(item,index) in goodsData.goods_arr">
				<view class="flex-dir-row flex-y-center">
					<image :src="item.goods_img" class="litpic" mode=""></image>
					<view class="flex-dir-column w-440">
						<view class="one-listhiden ">
							{{item.goods_name}}
						</view>
						<view class="gssuk">
							<text style="margin-right: 10rpx;" v-for="suk in item.goods_suk">{{suk}}</text>
						</view>
						<view class="flex-dir-row flex-x-between" style="color: #61A189;">
							<text>￥{{item.goods_price /100}}</text>
							<text style="color: #6d6d6d;font-size: 26rpx;line-height: 43rpx;">×{{item.goods_num}}</text>
						</view>
					</view>
				</view>
				<view class="flex-dir-row mt-20 flex-y-center ">
					<text class="f-32 col-000 mr-20">商品描述</text>
					<view class="mr-20">
						<uni-rate activeColor="#61A189" size="22" v-model="item.value" />
					</view>
				</view>
				<view class="text-area mt-20">
					<uni-easyinput type="textarea" v-model="item.valueText" placeholderStyle="font-size:13px"
						placeholder="亲,您对这个商品满意吗？您的评价会帮助我们选择更好的商品哦~" :inputBorder="false"></uni-easyinput>
				</view>
				<view class="upload mt-20 flex-dir-column ">
					<view class="img-text">
						上传买家秀图片
					</view>
					<view class="uploaditem mt-20 ">
						<uni-file-picker style="width: 50%;height: 50%;" v-model="item.imageValue" mode="grid"
							:imageStyles="imageStyles" file-mediatype="image" :limit="6" />
					</view>
				</view>
			</view>
		</view>
		<view @click="submit(item)" class="footer">
			<view class="btn">
				提交评价
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				imageStyles: {
					width: 94,
					height: 94,
					border: {
						radius: '10%'
					}
				},
				goodsData: [],
			}
		},
		onLoad(e) {
			this.goodsData = JSON.parse(e.data);
			this.goodsData.goods_arr.forEach(item => {
				item.value = 5
			})
		},
		methods: {
			async submit() {
				uni.showLoading({
					title: "请稍后..."
				});

				// 定义一个递归函数
				const addCommentsRecursive = async (index) => {
					if (index < this.goodsData.goods_arr.length) {
						const item = this.goodsData.goods_arr[index];
						try {
							await db.collection("opendb-mall-comments").add({
								"goods_id": item.goods_id,
								"goods_suk": item.goods_suk,
								"order_id": this.goodsData._id,
								"grade": item.value,
								"content": {
									text: item.valueText,
									images: item.imageValue
								}
							});
						} catch (error) {
							uni.showToast({
								title: "请点亮星星",
								icon: "none",
								duration: 1600
							});
							return; // 如果发生错误，结束递归
						}

						// 递归调用下一次循环
						await addCommentsRecursive(index + 1);
					} else {
						// 所有循环完成后更改订单状态
						uniCloud.importObject('uni-pay-co').orderAction({ id: this.goodsData._id, action: 'evaluate' }).then(() => {
							this.getOpenerEventChannel().emit('refreshData')
							setTimeout(() => uni.navigateBack(), 500)
							uni.hideLoading();
						})
					}
				};

				// 调用递归函数，从第一个索引开始
				await addCommentsRecursive(0);
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
		height: 100%;
	}

	.f-32 {
		font-size: 29rpx;
	}

	.mt-20 {
		margin-top: 20rpx;
	}

	.list-item {
		background-color: #fff;
		margin: 20rpx;
		border-radius: 20rpx;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.flex-x-between {
		justify-content: space-between;
	}

	.gssuk {
		font-size: 26rpx;
		color: #6d6d6d;
		margin-bottom: 45rpx;
	}

	.flex-dir-row {
		display: flex;
		flex-direction: row;
	}

	.flex-dir-column {
		display: flex;
		flex-direction: column;
	}

	.flex-y-center {
		align-items: center;
	}

	.uploaditem {
		width: 100%;
	}

	.one-listhiden {
		font-size: 29rpx;
		margin-bottom: 7rpx;
		color: #000;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}

	.footer {
		position: fixed;
		width: 100%;
		bottom: 0;
		background: #fff;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

	}

	.litpic {
		width: 170rpx;
		height: 170rpx;
		border-radius: 15rpx;
		margin-right: 20rpx;
	}

	.text-area {}
	.btn {
		@include shop-button(primary);
		margin: 30rpx;
		width: 690rpx;
		font-size: 29rpx;
		box-sizing: border-box;
		padding: 20rpx 0;
		text-align: center;
	}

	.w-440 {
		width: 70%;
	}

	.mr-20 {
		margin-right: 20rpx;
	}

	.img-text {
		font-size: 26rpx;
		color: #6d6d6d;
	}
</style>