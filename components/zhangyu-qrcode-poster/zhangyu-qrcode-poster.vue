<template>
	<view>
		<!-- 原生画布保持挂载；弹层快速关闭/重开不能销毁后复用同一个 canvas-id。 -->
		<view style="position:fixed;left:-10000px;top:0;pointer-events:none">
			<!-- #ifdef MP-WEIXIN -->
			<canvas type="2d" id="share-canvas" :style="{ width: canvasW + 'px', height: canvasH + 'px' }"></canvas>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<canvas canvas-id="share-canvas" id="share-canvas" :style="{ width: canvasW + 'px', height: canvasH + 'px' }"></canvas>
			<!-- #endif -->
		</view>
		<view class="content" v-if="isShow" @click.stop="showClick">
			<view v-if="envVersion !== 'release'" style="color:white;margin:16rpx">测试用，勿用于正式包装</view>
			<image v-if="pahta || qrcodeFilePath" :src="pahta || qrcodeFilePath" mode="aspectFit" style="width:650rpx;height:65vh" @click.stop=""></image>
			<view v-if="error" style="color:white;padding:24rpx" @click.stop="">{{ error }}</view>
			<view class="btn-row" @click.stop="">
				<button class="save-btn ghost" @click.stop="prepareCode">{{ qrcodeFilePath ? '预览商品码' : '重试商品码' }}</button>
				<button class="save-btn" @click.stop="showCanvas">生成海报</button>
			</view>
			<view class="btn-row" @click.stop="">
				<button class="save-btn ghost" :disabled="!qrcodeFilePath || saving" @click.stop="saveQrcode">保存商品码</button>
				<button class="save-btn" :disabled="!pahta || saving" @click.stop="saveImage">保存海报</button>
			</view>
			<button class="save-btn ghost" style="margin-top:24rpx" @click.stop="showClick">关闭</button>
		</view>
	</view>
</template>

<script>
	import { getProductCode, codeEnvironment, imageInfo, withTimeout, apiCall, savePicture } from '@/common/product-share.js';
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
			goodsId: { type: String, default: '' },
			identity: { type: String, default: '' },
			headerImg: { type: String, default: '' },
			title: { type: String, default: '山前食养商城' },
			price: { type: Number, default: 0 },
			origprice: { type: Number, default: 0 },
			username: { type: String, default: '匿名用户' }
		},
		data() {
			return { canvasW: 1, canvasH: 1, canvasId: 'share-canvas', isShow: false, pahta: '', qrcodeFilePath: '', envVersion: '', stage: '', error: '', saving: false, revision: 0 };
		},
		computed: {
			contentKey() { return JSON.stringify([this.goodsId, this.identity, this.headerImg, this.title, this.price, this.origprice, this.username, this.envVersion, 1]); }
		},
		watch: { contentKey() { this.invalidate(); } },
		beforeDestroy() { this.invalidate(); },
		methods: {
			invalidate() {
				this.revision++;
				this._work = null;
				this._code = null;
				this.pahta = '';
				this.qrcodeFilePath = '';
				if (this._loading) { uni.hideLoading(); this._loading = false; }
				this.isShow = false;
				this.$emit('showClick', false);
			},
			showClick() { this.invalidate(); },
			async open() {
				this.envVersion = codeEnvironment();
				await this.$nextTick();
				this.isShow = true;
				this.$emit('showClick', true);
				return this.prepareCode();
			},
			checkTask(revision) {
				if (revision !== this.revision || !this.isShow) throw new Error('任务已取消');
			},
			run(action) {
				if (this._work) return this._work;
				const revision = this.revision;
				this.error = '';
				this.stage = '准备商品码';
				this._loading = true;
				uni.showLoading({ title: '正在生成...', mask: true });
				const started = Date.now();
				const work = withTimeout(Promise.resolve().then(() => action(revision)), 8000, () => this.stage + '超时，请重试').catch(error => {
					if (revision === this.revision) {
						console.warn('[share] failed-stage', this.stage);
						this.error = error.message || error.errMsg || '生成失败，请检查网络及图片权限后重试';
						this.revision++; // timeout also invalidates callbacks that arrive later
					}
				}).finally(() => {
					console.info('[share] generation-total-ms', Date.now() - started);
					if (this._work === work) {
						this._work = null;
						if (this._loading) uni.hideLoading();
						this._loading = false;
					}
				});
				this._work = work;
				return work;
			},
			async code(revision) {
				const key = JSON.stringify([this.goodsId, this.identity, this.envVersion]);
				let value = this._codeCache && this._codeCache.key === key ? this._codeCache.value : null;
				if (value) {
					try { await apiCall('getImageInfo', { src: value.path }); } catch (_) { value = null; }
				}
				if (!value) value = await getProductCode(this.goodsId, this.envVersion);
				this.checkTask(revision);
				this._codeCache = { key, value };
				this.qrcodeFilePath = value.path;
				return value.path;
			},
			prepareCode() {
				return this.run(async revision => {
					await this.code(revision);
					this.checkTask(revision);
					this.pahta = '';
				});
			},
			showCanvas() {
				return this.run(async revision => {
					if (this._posterCache && this._posterCache.key === this.contentKey) {
						try {
							await apiCall('getImageInfo', { src: this._posterCache.path });
							this.checkTask(revision);
							this.pahta = this._posterCache.path;
							return;
						} catch (_) { this.checkTask(revision); }
					}
					await this.__init(revision);
				});
			},
			//初始化画布
			async __init(revision) {
				this.stage = '准备海报素材';
				const [brandLogoImg, headerImg, qrcodePath] = await Promise.all([
					imageInfo('/static/share-brand.png'), imageInfo(this.headerImg), this.code(revision)
				]);
				this.checkTask(revision);
				this.canvasW = uni.upx2px(650);
				// 微信原生 canvas-id 在挂载时注册，不能随任务 revision 改名。

				// ── 阶段2：根据图片真实比例算高度，再算 canvasH ──
				let hW = uni.upx2px(570)
				let rawRatio = (headerImg.width && headerImg.height) ? headerImg.width / headerImg.height : 1.16
				let hH = Math.min(Math.max(Math.round(hW / rawRatio), uni.upx2px(340)), uni.upx2px(520))
				// canvasH = 产品图高 + 上方用户区(~134upx) + 标题价格(~160upx) + 分割线+底部内容(~230upx) + 底部留白(~36upx)
				this.canvasH = hH + uni.upx2px(560)

				this.stage = '等待画布就绪';
				await this.$nextTick();
				this.checkTask(revision);
				let canvas, ctx, qrcodeImg = qrcodePath;
				let brandImage = brandLogoImg.path, productImage = headerImg.path;
				// #ifdef MP-WEIXIN
				const field = await new Promise(resolve => {
					uni.createSelectorQuery().in(this).select('#' + this.canvasId).fields({ node: true, size: true }, resolve).exec();
				});
				this.checkTask(revision);
				if (!field || !field.node || !field.width || !field.height) throw new Error('画布尚未就绪，请重试');
				canvas = field.node;
				const ratio = uni.getSystemInfoSync().pixelRatio || 1;
				canvas.width = Math.round(this.canvasW * ratio);
				canvas.height = Math.round(this.canvasH * ratio);
				ctx = canvas.getContext('2d');
				ctx.scale(ratio, ratio);
				this.stage = '解码海报图片';
				const decoded = new Map();
				const decode = src => {
					if (!decoded.has(src)) decoded.set(src, new Promise((resolve, reject) => {
						const image = canvas.createImage();
						image.onload = () => resolve(image);
						image.onerror = () => reject(new Error('海报图片解码失败，请重试'));
						image.src = src;
					}));
					return decoded.get(src);
				};
				[brandImage, productImage, qrcodeImg] = await Promise.all([decode(brandImage), decode(productImage), decode(qrcodePath)]);
				// #endif
				// #ifndef MP-WEIXIN
				await new Promise((resolve, reject) => {
					uni.createSelectorQuery().in(this).select('#' + this.canvasId).boundingClientRect(rect => {
						if (rect && rect.width > 0 && rect.height > 0) resolve();
						else reject(new Error('画布尚未就绪，请重试'));
					}).exec();
				});
				ctx = uni.createCanvasContext(this.canvasId, this);
				// #endif
				this.checkTask(revision);

				// ── 阶段3：绘制白色圆角背景（高度已确定）──
				ctx.fillStyle = 'rgba(255,255,255,0)';
				ctx.fillRect(0, 0, this.canvasW, this.canvasH)
				this.drawRoundRect(ctx, 0, 0, this.canvasW, this.canvasH, uni.upx2px(18), BRAND.surface)

				// ── 阶段4：绘制用户头像 ──
				let radius = 25
				let x = 18
				let y = 8
				ctx.save()
				ctx.beginPath()
				ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI)
				ctx.closePath()
				ctx.clip()
				// #ifdef H5
				this.drawRoundImg(ctx, brandImage, x, y, radius * 2, radius * 2, radius)
				// #endif
				// #ifdef MP-WEIXIN
				this.drawRoundImg(ctx, brandImage, x, y, uni.upx2px(100), uni.upx2px(100), 20)
				// #endif
				ctx.restore()

				// ── 阶段5：绘制昵称与副标题 ──
				let textX = x + radius * 2 + 7
				let textY = y + radius - 3
				ctx.font = '15px Arial'
				ctx.fillStyle = BRAND.black
				ctx.fillText(this.username, textX, textY)
				ctx.font = '12px Arial'
				ctx.fillStyle = BRAND.muted
				ctx.fillText('发现优质好物，一起开启品质生活之旅', x + radius * 2 + 7, y + radius + 15)

				// ── 阶段6：绘制商品主图（自适应比例）──
				this.drawRoundImg(ctx, productImage,
					(this.canvasW - hW) / 2,
					(this.canvasW - hW) / 0.6,
					hW, hH, uni.upx2px(16))

				// ── 阶段7：绘制标题 ──
				this.drawTitle(ctx, this.title,
					(this.canvasW - hW) / 2,
					(this.canvasW - hW) / 1.3 + hH + uni.upx2px(130),
					uni.upx2px(570), 23)

				// ── 阶段8：绘制价格与原价 ──
				let priceY = (this.canvasW - hW) / 0.9 + hH + uni.upx2px(200)
				ctx.font = '14px Arial';
				ctx.fillStyle = BRAND.primary;
				ctx.fillText('￥', (this.canvasW - hW) / 2, priceY)
				ctx.font = '22px Arial';
				ctx.fillText(this.price, (this.canvasW - hW) / 2 + uni.upx2px(36), priceY)
				const origX = (this.canvasW - hW) / 2 + uni.upx2px(36) + ctx.measureText('￥' + this.price).width + uni.upx2px(5)
				ctx.font = '14px Arial';
				ctx.fillStyle = BRAND.muted;
				ctx.fillText('原价：', origX - uni.upx2px(30), priceY)
				const origPriceStr = '￥' + this.origprice.toFixed(2)
				ctx.fillText(origPriceStr, origX + uni.upx2px(35), priceY)
				ctx.strokeStyle = BRAND.muted;
				ctx.lineWidth = 1;
				ctx.beginPath()
				ctx.moveTo(origX + uni.upx2px(76), priceY - uni.upx2px(8))
				ctx.lineTo(origX + uni.upx2px(35) + ctx.measureText(origPriceStr).width, priceY - uni.upx2px(8))
				ctx.stroke()

				// ── 阶段9：虚线分割 ──
				// 价格基线在 hH+144px，分割线放在价格后 ~20px：uni.upx2px(330)=165px
				let margin = (this.canvasW - hW) / 2
				let dividerY = hH + uni.upx2px(330)
				this.drawDashLine(ctx, uni.upx2px(20), dividerY, this.canvasW - uni.upx2px(20), dividerY, 5)

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
				ctx.font = '12px Arial';
				ctx.fillStyle = BRAND.muted;
				ctx.fillText('长按识别"山前食养"小程序', margin + uni.upx2px(14), hintY)

				// 绘制品牌 logo
				this.drawRoundImg(ctx, brandImage, logoX, logoY, logoSize, logoSize, uni.upx2px(8))
				// 品牌名与标语垂直居中于 logo
				ctx.font = '16px Arial';
				ctx.fillStyle = BRAND.black;
				ctx.fillText('山前食养', logoX + logoSize + uni.upx2px(16), logoY + Math.round(logoSize * 0.38))
				ctx.font = '11px Arial';
				ctx.fillStyle = BRAND.muted;
				ctx.fillText('养生 · 美食 · 原产好物', logoX + logoSize + uni.upx2px(16), logoY + Math.round(logoSize * 0.65))

				ctx.drawImage(qrcodeImg, qrX, qrY, qrSize, qrSize);
				this.stage = '绘制海报';
				const drawStarted = Date.now();
				// #ifndef MP-WEIXIN
				await new Promise(resolve => ctx.draw(false, resolve));
				// #endif
				console.info('[share] draw-ms', Date.now() - drawStarted);
				this.checkTask(revision);
				this.stage = '导出海报';
				const exportStarted = Date.now();
				const exported = await apiCall('canvasToTempFilePath', { canvas, canvasId: this.canvasId, quality: 1, fileType: 'png' }, this);
				this.checkTask(revision);
				if (!exported.tempFilePath) throw new Error('图片导出失败，请重试');
				console.info('[share] export-ms', Date.now() - exportStarted);
				this.pahta = exported.tempFilePath;
				this._posterCache = { key: this.contentKey, path: this.pahta };
			},

			//绘制实心圆
		drawEmptyRound(ctx, x, y, radius) {
			ctx.save()
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
			ctx.fillStyle = 'rgba(0,0,0,.18)';
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
			ctx.strokeStyle = BRAND.border;
				ctx.lineWidth = 1; //设置线条宽度
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
				ctx.font = fontSize + 'px Arial';
				ctx.fillStyle = color;

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
				ctx.fillStyle = color;
				ctx.strokeStyle = color;
				ctx.lineJoin = 'round'; //交点设置成圆角
				ctx.lineWidth = radius;
				ctx.strokeRect(x + radius / 2, y + radius / 2, width - radius, height - radius);
				ctx.fillRect(x + radius, y + radius, width - radius * 2, height - radius * 2);
				ctx.stroke();
				ctx.closePath();
			},
			async save(path) {
				if (this.saving) return;
				this.saving = true;
				const revision = this.revision;
				try {
					await savePicture(path);
					if (revision === this.revision) this.showClick();
				} catch (error) {
					if (revision === this.revision) uni.showToast({ title: error.message || error.errMsg || '保存失败，请重试', icon: 'none' });
				} finally { this.saving = false; }
			},
			saveQrcode() { return this.save(this.qrcodeFilePath); },
			saveImage() { return this.save(this.pahta); }
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
			margin-top: 20rpx;
			display: flex;
			flex-direction: row;
			gap: 24rpx;
		}
		.save-btn {
			@include shop-button(primary);
			padding: 16rpx 24rpx;
			font-size: $uni-font-size-base;
			letter-spacing: 2rpx;
			&.ghost {
				@include shop-button(secondary);
			}
		}
	}
</style>