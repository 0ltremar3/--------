<template>
	<view class="content" v-if="isShow">
		<canvas style="position: absolute;top:-9999999999px;" :style="{ width: canvasW + 'px', height: canvasH + 'px' }"
			canvas-id="my-canvas"></canvas>
	</view>
</template>

<script>
	export default {
		name: "jlg-bcakColor",
		data() {
			return {
				isShow: false,
				canvasW: 0,
				canvasH: 0,
			};
		},
		props: {
			urlList: {
				type: Array
			},
			saturation: {
				type: Number,
				default: 4
			},
			brightness: {
				type: Number,
				default: 8
			}
		},
		methods: {
			async open() {
				let updatedRgbaColor = [];
				for (let i = 0; i < this.urlList.length; i++) {
					const that = this;
					this.canvasW = uni.upx2px(450);
					this.canvasH = uni.upx2px(200);
					this.isShow = true;
					this.ctx = uni.createCanvasContext('my-canvas', this);
					// 清空Canvas
					this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);
					let imgUrl = await this.getImageInfo(this.urlList[i]);
					this.ctx.drawImage(imgUrl.path, 0, 0, 150, 100);
					await new Promise((resolve) => {
						// 延迟渲染
						setTimeout(() => {
							this.ctx.draw(true, () => {
								uni.canvasToTempFilePath({
									canvasId: 'my-canvas',
									quality: 1,
									complete: (res) => {
										let tempPath = res.tempFilePath;
										uni.canvasGetImageData({
											canvasId: 'my-canvas',
											x: 0,
											y: 0,
											width: 150,
											height: 100,
											success(res) {
												const imageData = res.data;
												let resImageObj = that
													.getUniqueColor(
														imageData);
												const rgbColor =
													resImageObj.replace(
														'rgba: ', '');
												updatedRgbaColor.push(
													rgbColor.replace(
														/(\d+(\.\d+)?\s*)\)$/,
														'0.5' + ')'));
												resolve
													(); // Promise完成，继续下一次循环
											},
										}, this);
									},
								}, this);
							});
						}, 200);
					});
				}
				this.$emit('update', updatedRgbaColor); // 通过事件将数据发送回父组件
			},
			getImageInfo(imgUrl) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: imgUrl,
						success: (image) => {
							resolve(image);
						},
						fail: (err) => {
							reject(err);
						}
					});
				});
			},
			getUniqueColor(imageData) {
				let res_r = 0;
				let res_g = 0;
				let res_b = 0;
				let res_a = 0;
				let pixelCount = imageData.length / 4;

				for (let i = 0; i < imageData.length; i += 4) {
					res_r += imageData[i];
					res_g += imageData[i + 1];
					res_b += imageData[i + 2];
					res_a += imageData[i + 3];
				}

				res_r = Math.round(res_r / pixelCount);
				res_g = Math.round(res_g / pixelCount);
				res_b = Math.round(res_b / pixelCount);
				res_a = Math.round(res_a / pixelCount);

				// 增加饱和度和亮度
				const saturation = 4.3; // 饱和度增加倍数
				const brightness = 0.6; // 亮度增加倍数

				// 饱和度调整
				const maxChannel = Math.max(res_r, res_g, res_b);
				const minChannel = Math.min(res_r, res_g, res_b);
				const delta = (maxChannel - minChannel) / 255;
				const saturationFactor = 1 + (saturation - 1) * delta;

				res_r = Math.round(res_r + (res_r - 128) * saturationFactor);
				res_g = Math.round(res_g + (res_g - 128) * saturationFactor);
				res_b = Math.round(res_b + (res_b - 128) * saturationFactor);

				// 亮度调整
				res_r = Math.round(res_r * brightness);
				res_g = Math.round(res_g * brightness);
				res_b = Math.round(res_b * brightness);

				return `rgba(${res_r}, ${res_g}, ${res_b}, ${res_a})`;
			}

		}
	}
</script>

<style>
	.content {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>