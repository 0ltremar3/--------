<template>
	<view class="uni-popup-share">
		<view class="uni-share-title"><text class="uni-share-title-text">{{shareTitleText}}</text></view>
		<view class="uni-share-content">
			<view class="uni-share-content-box">
				<view class="uni-share-content-item" v-for="(item,index) in bottomData" :key="index"
					@click.stop="select(item,index)">
					<button v-if="item.name=='wx'" class="btn-normal" open-type="share">
						<view class="but-van">
							<!-- <image :class="item.name=='wx'?'uni-share-images ':'uni-share-image'" :src="item.icon"
								mode="aspectFill"></image> -->
							<image class="uni-share-images" :src="item.icon" mode="aspectFill"></image>
							<view class="uni-share-text">{{item.text}}</view>
						</view>
					</button>
					<view v-else style="text-align: center;">
						<image class="uni-share-image" :src="item.icon" mode="aspectFill"></image>
						<!-- <image :class="item.name=='wx'?'uni-share-images':'uni-share-image'" :src="item.icon"
							mode="aspectFill"></image> -->
						<view class="uni-share-text">{{item.text}}</view>
					</view>

				</view>

			</view>
		</view>
		<!-- <view class="uni-share-button-box">
			<button class="uni-share-button" @click="close">{{cancelText}}</button>
		</view> -->
	</view>
</template>

<script>
	import popup from '../uni-popup/popup.js'
	import {
		initVueI18n
	} from '@dcloudio/uni-i18n'
	import messages from '../uni-popup/i18n/index.js'
	const {
		t
	} = initVueI18n(messages)
	export default {
		name: 'UniPopupShare',
		mixins: [popup],
		emits: ['select'],
		props: {
			title: {
				type: String,
				default: ''
			},
			beforeClose: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				bottomData: [{
						text: '微信好友',
						icon: 'https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/微信(1).png',
						name: 'wx'
					},
					{
						text: '海报',
						icon: 'https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/海报2.png',
						name: 'more'
					}
				]
			}
		},
		created() {},
		computed: {
			cancelText() {
				return t("uni-popup.cancel")
			},
			shareTitleText() {
				return this.title || t("uni-popup.shareTitle")
			}
		},
		methods: {
			/**
			 * 选择内容
			 */
			select(item, index) {
				this.$emit('select', {
					item,
					index
				})
				this.close()

			},
			/**
			 * 关闭窗口
			 */
			close() {
				if (this.beforeClose) return
				this.popup.close()
			}
		}
	}
</script>
<style lang="scss">
	.uni-popup-share {
		background-color: #fff;
		border-top-left-radius: 11px;
		border-top-right-radius: 11px;
	}

	.but-van {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.uni-share-title {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 40px;
	}

	.uni-share-title-text {
		font-size: 14px;
		color: #666;
	}

	.uni-share-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		padding-top: 10px;
	}

	.uni-share-content-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		width: 360px;
	}

	.uni-share-content-item {
		width: 90px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		padding: 10px 0;
		align-items: center;
	}

	.uni-share-content-item:active {
		background-color: #f5f5f5;
	}

	.uni-share-image {
		width: 45px;
		height: 45px;
		margin-top: 4rpx;
	}

	.uni-share-images {
		width: 51px;
		height: 51px;
	}

	.uni-share-text {
		margin-top: 5px;
		font-size: 14px;
		color: #3B4144;
	}

	.uni-share-button-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		padding: 10px 15px;
	}

	.uni-share-button {
		flex: 1;
		border-radius: 50px;
		color: #666;
		font-size: 16px;
	}

	.uni-share-button::after {
		border-radius: 50px;
	}
</style>