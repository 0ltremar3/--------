<template>
	<view>
		<text class="minprices" :style="{'color':col,'fontSize':maxSize,'fontWeight':Weight}">
			<text>{{(minPrice / 100).toFixed(2).split('.')[0]}}</text>
			<text :style="{'color':col,'fontSize':minSize,'fontWeight':Weight}">
				<text>.{{(minPrice / 100).toFixed(2).split('.')[1]}}</text>
			</text>
		</text>
	</view>
</template>

<script>
	export default {
		name: "jlg-minPrice",
		props: {
			minPrice: {
				type: Number,
				required: true,
			},
			col: {
				type: String,
				default: '#1C7231'
			},
			maxSize: {
				type: String,
				default: '30rpx'
			},
			Weight: {
				type: Number,
				default: 400
			},
			minSize: {
				type: String,
				default: '26rpx'
			},
		},
		computed: {},
	}
</script>

<style lang="scss">
	.minprices {
		font-size: 24rpx;

		&:before {
			content: '￥';
			font-size: 24rpx;
			margin: 0 2rpx 0 -4rpx;
		}
	}
</style>