<template>
	<page-meta :page-style="'overflow:'+(true?'hidden':'visible')"></page-meta>
	<view class="content" v-if="isShow" @click.stop="showClick()">
		<!-- #ifndef MP-WEIXIN -->
		<view style="position: absolute;top: -9999999999999999999999999px;">
			<canvas @click.stop="" :style="{ width: canvasW + 'px', height: canvasH + 'px' }"
				canvas-id="my-canvas"></canvas>
		</view>
		<image :src="pahta" mode="widthFix" :style="{ width: canvasW + 'px', height: canvasH + 'px' }"></image>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<canvas @click.stop="" :style="{ width: canvasW + 'px', height: canvasH + 'px' }"
			canvas-id="my-canvas"></canvas>
		<!-- #endif -->
		<!-- #ifdef H5-->
		<view class="save-btn" @click.stop="saveImage">长按保存图片</view>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN-->
		<view class="save-btn" @click.stop="saveImage">保存图片</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		props: {
			headerImg: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: '山前食养商城'
			},
			price: {
				type: Number,
				default: 9.99
			},
			origprice: {
				type: Number,
				default: 99.99
			},
			abImg: {
				type: String,
				default: 'http://test.slwjd.com/hbimage/ggimg.png'
			},
			avcimgs: {
				type: String,
				default: ''
			},
			username: {
				type: String,
				default: '匿名用户'
			}
		},
		data() {
			return {
				canvasW: 0,
				canvasH: 0,
				ctx: null,
				isShow: false,
				qrcode: '',
				pahta: ''
			}
		},
		methods: {
			showClick() {
				this.isShow = false
				this.$emit('showClick', this.isShow);
			},
			//显示
			showCanvas(qrcode) {
				this.isShow = true
				this.qrcode = qrcode
				this.__init()
			},
			//初始化画布
			async __init() {
				uni.showLoading({
					title: '生成海报中...',
					mask: true
				})
				this.ctx = uni.createCanvasContext('my-canvas', this)
				this.canvasW = uni.upx2px(650);
				this.canvasH = uni.upx2px(980);
				//设置画布背景透明
				this.ctx.setFillStyle('rgba(255, 255, 255, 0)')
				//设置画布大小
				this.ctx.fillRect(0, 0, this.canvasW, this.canvasH)
				//绘制圆角背景
				this.drawRoundRect(this.ctx, 0, 0, this.canvasW, this.canvasH, uni.upx2px(18), '#FFFFFF')
				//绘制用户头像
				let radius = 25; // 定义头像半径
				let x = 18; // 头像的 x 坐标
				let y = 8; // 头像的 y 坐标
				// 绘制头像
				this.ctx.save(); // 保存当前绘图状态
				this.ctx.beginPath();
				this.ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
				this.ctx.closePath();
				this.ctx.clip(); // 裁剪路径
				// #ifdef H5
				let tximg = 'http://test.slwjd.com/hbimage/logo.png'
				this.ctx.drawImage(tximg, x, y, radius * 2, radius * 2);
				// #endif
				// #ifdef MP-WEIXIN
				let width = uni.upx2px(100); // 头像的宽度
				let height = uni.upx2px(100); // 头像的高度
				let avcimgsImg = await this.getImageInfo(this.avcimgs)
				this.drawRoundImg(this.ctx, avcimgsImg.path, x, y,
					width,
					height, 20)
				// #endif
				// 绘制头像图片

				this.ctx.restore(); // 恢复之前保存的绘图状态

				// 绘制昵称
				let textX = x + radius * 2 + 7; // 文字的 x 坐标
				let textY = y + radius - 3; // 文字的 y 坐标

				this.ctx.font = '15px Arial'; // 设置字体样式和大小
				this.ctx.fillStyle = '#464646'; // 设置文字颜色
				this.ctx.fillText(this.username, textX, textY); // 绘制文字

				// 绘制昵称下的文字
				let texts = '发现优质好物！一起开启优质购物之旅吧！';
				let textXs = x + radius * 2 + 7; // 文字的 x 坐标
				let textYs = y + radius + 15; // 文字的 y 坐标

				this.ctx.font = '12px Arial'; // 设置字体样式和大小
				this.ctx.fillStyle = '#ff0f0f'; // 设置文字颜色
				this.ctx.fillText(texts, textXs, textYs); // 绘制文字

				//获取标题图片
				// #ifdef H5
				let headerImg = {
					path: 'http://test.slwjd.com/hbimage/btimg.jpg'
				}
				// #endif
				// #ifdef MP-WEIXIN
				let headerImg = await this.getImageInfo(this.headerImg)
				// #endif
				let hW = uni.upx2px(570);
				let hH = uni.upx2px(490);
				//绘制标题图
				this.drawRoundImg(this.ctx, headerImg.path, ((this.canvasW - hW) / 2), ((this.canvasW - hW) / 0.6),
					hW,
					hH, uni.upx2px(16))
				//绘制标题
				this.drawTitle(this.ctx, this.title, ((this.canvasW - hW) / 2), (
					((this.canvasW - hW) / 1.3) + hH + uni.upx2px(130)), uni.upx2px(570), 23)
				// this.ctx.setFontSize(16); //设置标题字体大小
				// this.ctx.setFillStyle('#333'); //设置标题文本颜色
				// this.ctx.fillText(this.title, ((this.canvasW - hW) / 2), (
				// 	((this.canvasW - hW) / 1.5) + hH + uni.upx2px(130)))
				// 绘制价格
				this.ctx.setFontSize(14);
				this.ctx.setFillStyle('#f54545');
				this.ctx.fillText('￥', ((this.canvasW - hW) / 2), (((this.canvasW - hW) / 0.9) + hH + uni.upx2px(
					200)));
				this.ctx.setFontSize(22);
				this.ctx.fillText(this.price, (((this.canvasW - hW) / 2) + uni.upx2px(36)), (((this
						.canvasW - hW) /
					0.9) + hH + uni.upx2px(200)));

				// 绘制原价
				const originalPriceX = (((this.canvasW - hW) / 2) + uni.upx2px(36) + this.ctx.measureText('￥' + this
					.price).width + uni.upx2px(5));
				const originalPriceY = (((this.canvasW - hW) / 0.9) + hH + uni.upx2px(200));
				this.ctx.setFontSize(14);
				this.ctx.setFillStyle('#999'); // 设置原价文本颜色为灰色
				this.ctx.fillText('原价：', originalPriceX - uni.upx2px(30), originalPriceY);

				const originalPrice = '￥' + this.origprice.toFixed(2); // 假设原价为￥100.00，你可以替换为实际的原价数据

				this.ctx.fillText(originalPrice, originalPriceX + uni.upx2px(35), originalPriceY);

				// 绘制删除线
				this.ctx.setLineWidth(1);
				this.ctx.beginPath();
				this.ctx.moveTo(originalPriceX + uni.upx2px(76), originalPriceY + uni.upx2px(-8)); // 偏移7个像素，使得删除线在文字上方
				this.ctx.lineTo(originalPriceX + uni.upx2px(35) + this.ctx.measureText(originalPrice).width,
					originalPriceY + uni
					.upx2px(-8));
				this.ctx.stroke();



				//绘制价格
				// this.ctx.setFontSize(14);
				// this.ctx.setFillStyle('#f54545');
				// this.ctx.fillText('￥', ((this.canvasW - hW) / 2), (
				// 	((this.canvasW - hW) / 0.9) + hH + uni.upx2px(200)))
				// this.ctx.setFontSize(22);
				// this.ctx.fillText(this.price, (((this.canvasW - hW) / 2) + uni.upx2px(36)), (
				// 	((this.canvasW - hW) / 0.9) + hH + uni.upx2px(200)))
				//绘制虚线
				this.drawDashLine(this.ctx, uni.upx2px(20), (((this.canvasW - hW) / 1.1) + hH + uni.upx2px(240)), (this
					.canvasW - uni.upx2px(20)), (((this.canvasW - hW) / 1.1) + hH + uni.upx2px(240)), 5)
				//左边实心圆
				this.drawEmptyRound(this.ctx, 0, (((this.canvasW - hW) / 1.1) + hH + uni.upx2px(240)), uni.upx2px(20))
				//右边实心圆
				this.drawEmptyRound(this.ctx, this.canvasW, (((this.canvasW - hW) / 1.1) + hH + uni.upx2px(240)), uni
					.upx2px(20))

				//底部广告
				// #ifdef MP-WEIXIN
				let abImg = "https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/ggimg.png";
				let BottomAdImg = await this.getImageInfo(abImg)
				// #endif
				// #ifndef MP-WEIXIN
				let BottomAdImg = await this.getImageInfo(this.abImg)
				// #endif
				this.ctx.drawImage(BottomAdImg.path, (((this.canvasW - hW) / 2)), (((this.canvasW - hW) / 1.7) + hH +
					uni
					.upx2px(310)), uni.upx2px(400), uni.upx2px(110))
				//提示文案
				this.ctx.setFontSize(12);
				this.ctx.setFillStyle('#858585');
				this.ctx.fillText('长按识别“山前食养”小程序', (((this.canvasW - hW) / 2) + uni.upx2px(14)), (((this.canvasW -
					hW) / 1.4) + hH + uni.upx2px(300)))
				//小程序码
				// #ifdef H5
				let qrcodeImg = this.qrcode
				// #endif
				// #ifdef MP-WEIXIN
				let qrcodeImg = await this.base64Save(this.qrcode)
				// #endif
				this.ctx.drawImage(qrcodeImg, uni.upx2px(460), (((this.canvasW - hW) / 1.5) + hH + uni.upx2px(
						274)),
					uni.upx2px(150), uni.upx2px(150))
				//延迟渲染
				setTimeout(() => {
					this.ctx.draw(true, () => {
						// #ifdef H5
						var that = this
						uni.canvasToTempFilePath({
							canvasId: 'my-canvas',
							quality: 1,
							complete: (res) => {
								this.pahta = res.tempFilePath
							}
						}, this);
						// #endif
						uni.hideLoading()
					})
				}, 500)
			},
			//绘制实心圆
			drawEmptyRound(ctx, x, y, radius) {
				ctx.save()
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
				ctx.setFillStyle('rgba(0, 0, 0, .4)')
				ctx.fill();
				ctx.restore()
				ctx.closePath()
			},
			createCircularAvatar(ctx, x, y, radius, width, height, imageSrc) {
				ctx.save(); // 保存当前绘图状态
				ctx.beginPath();
				ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.clip(); // 裁剪路径

				ctx.drawImage(imageSrc, x, y, width, height);

				ctx.restore(); // 恢复之前保存的绘图状态
			},
			//绘制虚线
			drawDashLine(ctx, x1, y1, x2, y2, dashLength) {
				ctx.setStrokeStyle("#cccccc") //设置线条的颜色
				ctx.setLineWidth(1) //设置线条宽度
				var dashLen = dashLength,
					xpos = x2 - x1, //得到横向的宽度;
					ypos = y2 - y1, //得到纵向的高度;
					numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen);
				//利用正切获取斜边的长度除以虚线长度，得到要分为多少段;
				for (var i = 0; i < numDashes; i++) {
					if (i % 2 === 0) {
						ctx.moveTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i);
						//有了横向宽度和多少段，得出每一段是多长，起点 + 每段长度 * i = 要绘制的起点；
					} else {
						ctx.lineTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i);
					}
				}
				ctx.stroke();
			},
			//绘制标题
			drawTitle(ctx, title, x, y, maxWidth, lineHeight) {
				const fontSize = 16;
				const color = '#333';
				ctx.setFontSize(fontSize);
				ctx.setFillStyle(color);

				const maxLines = 2;
				const ellipsis = '...';

				const textArray = title.split('');
				let line = '';
				let lines = [];

				for (let i = 0; i < textArray.length; i++) {
					const testLine = line + textArray[i];
					const testWidth = ctx.measureText(testLine).width;

					if (testWidth > maxWidth) {
						if (lines.length + 1 === maxLines) {
							const remainingWidth = maxWidth - ctx.measureText(ellipsis).width;
							let j;
							for (j = line.length - 1; j >= 0; j--) {
								const lineTest = line.slice(0, j) + ellipsis;
								const lineWidth = ctx.measureText(lineTest).width;
								if (lineWidth <= remainingWidth) {
									lines.push(line.slice(0, j) + ellipsis);
									break;
								}
							}
							break;
						}
						lines.push(line);
						line = textArray[i];
					} else {
						line = testLine;
					}
				}

				if (lines.length < maxLines) {
					lines.push(line);
				}

				lines.forEach((lineText, index) => {
					const yPos = y + (index * lineHeight);
					ctx.fillText(lineText, x, yPos);
				});
			},
			//带圆角图片
			drawRoundImg(ctx, img, x, y, width, height, radius) {
				ctx.save();
				ctx.beginPath();
				// 绘制圆角路径
				ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5);
				ctx.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 2);
				ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 0.5);
				ctx.arc(x + radius, y + height - radius, radius, Math.PI * 0.5, Math.PI);
				ctx.closePath();
				// 裁剪路径
				ctx.clip();
				// 绘制图片
				ctx.drawImage(img, x, y, width, height);
				ctx.restore();
			},
			//圆角矩形
			drawRoundRect(ctx, x, y, width, height, radius, color) {
				ctx.save();
				ctx.beginPath();
				ctx.setFillStyle(color);
				ctx.setStrokeStyle(color)
				ctx.setLineJoin('round'); //交点设置成圆角
				ctx.setLineWidth(radius);
				ctx.strokeRect(x + radius / 2, y + radius / 2, width - radius, height - radius);
				ctx.fillRect(x + radius, y + radius, width - radius * 2, height - radius * 2);
				ctx.stroke();
				ctx.closePath();
			},
			//获取图片
			getImageInfo(imgSrc) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: imgSrc,
						success: (image) => {
							resolve(image);
							console.log('获取图片成功', image)
						},
						fail: (err) => {
							reject(err);
							console.log('获取图片失败', err)
						}
					});
				});
			},
			base64Save(base64File) { //base64File 需要加前缀
				const fsm = wx.getFileSystemManager(); //获取全局文件管理器

				let extName = base64File.match(/data\:\S+\/(\S+);/)
				if (extName) {
					//获取文件后缀
					extName = extName[1]
				}

				//获取自1970到现在的毫秒 + 文件后缀 生成文件名
				let fileName = Date.now() + '.' + extName

				return new Promise((resolve, reject) => {
					//写入文件的路径
					let filePath = wx.env.USER_DATA_PATH + '/' + fileName

					fsm.writeFile({
						filePath,
						data: base64File.replace(/^data:\S+\/\S+;base64,/, ''), //替换前缀为空
						encoding: 'base64',
						success: (res) => {
							// console.log('filePath', filePath); //路径：http://user.....
							resolve(filePath);
						},
						fail() {
							reject('写入失败');
						},
					});
				});
			},
			//保存图片到相册
			saveImage() {
				// #ifdef MP-WEIXIN
				//判断用户授权
				uni.getSetting({
					success(res) {
						console.log('获取用户权限', res.authSetting)
						if (Object.keys(res.authSetting).length > 0) {
							//判断是否有相册权限
							if (res.authSetting['scope.writePhotosAlbum'] == null) {
								//打开设置权限
								uni.openSetting({
									success(res) {
										console.log('设置权限', res.authSetting)
									}
								})
							} else {
								if (!res.authSetting['scope.writePhotosAlbum']) {
									//打开设置权限
									uni.openSetting({
										success(res) {
											console.log('设置权限', res.authSetting)
										}
									})
								}
							}
						} else {
							return
						}
					}
				})
				var that = this
				uni.canvasToTempFilePath({
					canvasId: 'my-canvas',
					quality: 1,
					complete: (res) => {
						console.log('保存到相册', res);
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success(res) {
								uni.showToast({
									title: '已保存到相册',
									icon: 'success',
									duration: 2000
								})
								setTimeout(() => {
									that.isShow = false
								}, 2000)
							}
						})
					}
				}, this);
				// #endif
			}
		}
	}
</script>

<style scoped lang="scss">
	.content {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .4);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.save-btn {
			margin-top: 65rpx;
			color: #FFFFFF;
			background: linear-gradient(to right, #fe3d3d, #fe6f61);
			padding: 15rpx 40rpx;
			border-radius: 50rpx;
		}
	}
</style>