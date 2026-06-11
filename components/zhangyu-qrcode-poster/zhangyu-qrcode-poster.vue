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
		<view class="btn-row">
			<!-- #ifdef H5-->
			<view class="save-btn ghost" @click.stop="saveQrcode">保存商品码</view>
			<view class="save-btn" @click.stop="saveImage">长按保存图片</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN-->
			<view class="save-btn ghost" @click.stop="saveQrcode">保存商品码</view>
			<view class="save-btn" @click.stop="saveImage">保存图片</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	// 与 uni.scss 品牌 Token 保持一致，SCSS 变量无法在 JS 中直接引用，故在此镜像定义
	const BRAND = Object.freeze({
		primary:    '#61A189', // $brand-primary
		black:      '#202321', // $brand-black
		text:       '#2A3033', // $brand-text
		muted:      '#8E918D', // $brand-muted
		lightMuted: '#B8BBB6', // $brand-light-muted
		border:     '#E5E6E2', // $brand-border
		surface:    '#FFFFFF', // $brand-surface
	})

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
				pahta: '',
				qrcodeFilePath: ''
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
				uni.showLoading({ title: '生成海报中...', mask: true })
				this.ctx = uni.createCanvasContext('my-canvas', this)
				this.canvasW = uni.upx2px(650)

				// ── 阶段1：预加载所有图片 ──
				let brandLogoImg = await this.getImageInfo('https://mp-33f14b87-9d61-4c31-83d5-b969e0cb9a6c.cdn.bspapp.com/logo.png')
				// #ifdef H5
				let headerImg = await this.getImageInfo('https://mp-33f14b87-9d61-4c31-83d5-b969e0cb9a6c.cdn.bspapp.com/logo.png')
				// #endif
				// #ifdef MP-WEIXIN
				let headerImg = await this.getImageInfo(this.headerImg)
				let avcimgsImg = await this.getImageInfo(this.avcimgs)
				// #endif

				// ── 阶段2：根据图片真实比例算高度，再算 canvasH ──
				let hW = uni.upx2px(570)
				let rawRatio = (headerImg.width && headerImg.height) ? headerImg.width / headerImg.height : 1.16
				let hH = Math.min(Math.max(Math.round(hW / rawRatio), uni.upx2px(340)), uni.upx2px(520))
				// canvasH = 产品图高 + 上方用户区(~134upx) + 标题价格(~160upx) + 分割线+底部内容(~230upx) + 底部留白(~36upx)
				this.canvasH = hH + uni.upx2px(560)

				// ── 阶段3：绘制白色圆角背景（高度已确定）──
				this.ctx.setFillStyle('rgba(255,255,255,0)')
				this.ctx.fillRect(0, 0, this.canvasW, this.canvasH)
				this.drawRoundRect(this.ctx, 0, 0, this.canvasW, this.canvasH, uni.upx2px(18), BRAND.surface)

				// ── 阶段4：绘制用户头像 ──
				let radius = 25
				let x = 18
				let y = 8
				this.ctx.save()
				this.ctx.beginPath()
				this.ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI)
				this.ctx.closePath()
				this.ctx.clip()
				// #ifdef H5
				this.drawRoundImg(this.ctx, brandLogoImg.path, x, y, radius * 2, radius * 2, radius)
				// #endif
				// #ifdef MP-WEIXIN
				this.drawRoundImg(this.ctx, brandLogoImg.path, x, y, uni.upx2px(100), uni.upx2px(100), 20)
				// #endif
				this.ctx.restore()

				// ── 阶段5：绘制昵称与副标题 ──
				let textX = x + radius * 2 + 7
				let textY = y + radius - 3
				this.ctx.font = '15px Arial'
				this.ctx.fillStyle = BRAND.black
				this.ctx.fillText(this.username, textX, textY)
				this.ctx.font = '12px Arial'
				this.ctx.fillStyle = BRAND.muted
				this.ctx.fillText('发现优质好物，一起开启品质生活之旅', x + radius * 2 + 7, y + radius + 15)

				// ── 阶段6：绘制商品主图（自适应比例）──
				this.drawRoundImg(this.ctx, headerImg.path,
					(this.canvasW - hW) / 2,
					(this.canvasW - hW) / 0.6,
					hW, hH, uni.upx2px(16))

				// ── 阶段7：绘制标题 ──
				this.drawTitle(this.ctx, this.title,
					(this.canvasW - hW) / 2,
					(this.canvasW - hW) / 1.3 + hH + uni.upx2px(130),
					uni.upx2px(570), 23)

				// ── 阶段8：绘制价格与原价 ──
				let priceY = (this.canvasW - hW) / 0.9 + hH + uni.upx2px(200)
				this.ctx.setFontSize(14)
				this.ctx.setFillStyle(BRAND.primary)
				this.ctx.fillText('￥', (this.canvasW - hW) / 2, priceY)
				this.ctx.setFontSize(22)
				this.ctx.fillText(this.price, (this.canvasW - hW) / 2 + uni.upx2px(36), priceY)
				const origX = (this.canvasW - hW) / 2 + uni.upx2px(36) + this.ctx.measureText('￥' + this.price).width + uni.upx2px(5)
				this.ctx.setFontSize(14)
				this.ctx.setFillStyle(BRAND.muted)
				this.ctx.fillText('原价：', origX - uni.upx2px(30), priceY)
				const origPriceStr = '￥' + this.origprice.toFixed(2)
				this.ctx.fillText(origPriceStr, origX + uni.upx2px(35), priceY)
				this.ctx.setStrokeStyle(BRAND.muted)
				this.ctx.setLineWidth(1)
				this.ctx.beginPath()
				this.ctx.moveTo(origX + uni.upx2px(76), priceY - uni.upx2px(8))
				this.ctx.lineTo(origX + uni.upx2px(35) + this.ctx.measureText(origPriceStr).width, priceY - uni.upx2px(8))
				this.ctx.stroke()

				// ── 阶段9：虚线分割 ──
				// 价格基线在 hH+144px，分割线放在价格后 ~20px：uni.upx2px(330)=165px
				let margin = (this.canvasW - hW) / 2
				let dividerY = hH + uni.upx2px(330)
				this.drawDashLine(this.ctx, uni.upx2px(20), dividerY, this.canvasW - uni.upx2px(20), dividerY, 5)

				// ── 阶段10-12：底部品牌 + 二维码（在分割线与卡片底部之间垂直居中）──
				let qrSize   = uni.upx2px(150)
				let logoSize = uni.upx2px(120)
				// 内容块高度 = 提示文案行(24upx) + 间距(16upx) + 主行(max(qrSize, logoSize))
				let contentH = uni.upx2px(24) + uni.upx2px(16) + Math.max(qrSize, logoSize)
				let bottomAvail = this.canvasH - dividerY
				let topPad = Math.round((bottomAvail - contentH) / 2)
				// 提示文案基线 Y（字号 12px ≈ 24upx，故顶部偏移 = topPad + 24upx）
				let hintY = dividerY + topPad + uni.upx2px(24)
				// 主行起始 Y（提示文案基线 + 间距）
				let rowY  = hintY + uni.upx2px(16)

				// QR code 右对齐
				let qrX = this.canvasW - margin - qrSize
				let qrY = rowY
				// 品牌 logo 左对齐，纵向与 QR code 居中对齐
				let logoX = margin + uni.upx2px(8)
				let logoY = rowY + Math.round((qrSize - logoSize) / 2)

				// 绘制提示文案
				this.ctx.setFontSize(12)
				this.ctx.setFillStyle(BRAND.muted)
				this.ctx.fillText('长按识别"山前食养"小程序', margin + uni.upx2px(14), hintY)

				// 绘制品牌 logo
				this.drawRoundImg(this.ctx, brandLogoImg.path, logoX, logoY, logoSize, logoSize, uni.upx2px(8))
				// 品牌名与标语垂直居中于 logo
				this.ctx.setFontSize(16)
				this.ctx.setFillStyle(BRAND.black)
				this.ctx.fillText('山前食养', logoX + logoSize + uni.upx2px(16), logoY + Math.round(logoSize * 0.38))
				this.ctx.setFontSize(11)
				this.ctx.setFillStyle(BRAND.muted)
				this.ctx.fillText('养生 · 美食 · 原产好物', logoX + logoSize + uni.upx2px(16), logoY + Math.round(logoSize * 0.65))

				// 绘制二维码
				// #ifdef H5
				let qrcodeImg = this.qrcode
				// #endif
				// #ifdef MP-WEIXIN
				let qrcodeImg = await this.base64Save(this.qrcode)
				// #endif
				this.qrcodeFilePath = qrcodeImg
				this.ctx.drawImage(qrcodeImg, qrX, qrY, qrSize, qrSize)

								// ── 阶段13：延迟渲染 ──
				setTimeout(() => {
					this.ctx.draw(true, () => {
						// #ifdef H5
						uni.canvasToTempFilePath({
							canvasId: 'my-canvas',
							quality: 1,
							complete: (res) => {
								this.pahta = res.tempFilePath
							}
						}, this)
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
			ctx.setFillStyle('rgba(0,0,0,.18)')
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
			ctx.setStrokeStyle(BRAND.border)
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
			const color = BRAND.text;
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
			//仅保存商品二维码
			saveQrcode() {
				if (!this.qrcodeFilePath) {
					uni.showToast({ title: '请先生成海报', icon: 'none' })
					return
				}
				// #ifdef MP-WEIXIN
				uni.getSetting({
					success: (res) => {
						const needAuth = !res.authSetting['scope.writePhotosAlbum']
						if (needAuth) {
							uni.openSetting({})
							return
						}
						uni.saveImageToPhotosAlbum({
							filePath: this.qrcodeFilePath,
							success: () => {
								uni.showToast({ title: '商品码已保存', icon: 'success', duration: 2000 })
							},
							fail: () => {
								uni.showToast({ title: '保存失败，请检查相册权限', icon: 'none' })
							}
						})
					}
				})
				// #endif
				// #ifdef H5
				const a = document.createElement('a')
				a.href = this.qrcodeFilePath
				a.download = 'qrcode.png'
				a.click()
				// #endif
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
		background: $uni-bg-color-mask;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.btn-row {
			margin-top: 50rpx;
			display: flex;
			flex-direction: row;
			gap: 24rpx;
		}

		.save-btn {
			color: $brand-surface;
			background: $brand-primary;
			padding: 18rpx 48rpx;
			border-radius: $uni-border-radius-sm;
			font-size: $uni-font-size-base;
			letter-spacing: 2rpx;

			&.ghost {
				color: $brand-primary;
				background: $brand-surface;
			}
		}
	}
</style>