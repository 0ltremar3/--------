<template>
	<uv-popup bgColor="#ffffff" ref="popup" :round="10" mode="bottom">
		<view class="spec-popup" v-if="item">
			<!-- 顶部：缩略图 + 价格 + 已选 -->
			<view class="spec-popup__top">
				<image class="spec-popup__img"
					:src="suks_img || item.goods_thumb"
					mode="aspectFill" />
				<view class="spec-popup__top-info">
					<jlg-minPrice v-if="suks_price" :min-price="suks_price * numberl"
						maxSize="36rpx" min-size="24rpx" :Weight="500" />
					<text v-else class="spec-popup__prompt">选择规格</text>
					<text class="spec-popup__stock" v-if="suks_inventory > 0">库存：{{suks_inventory}} 件</text>
					<view class="spec-popup__selected" v-if="specSelected.length">
						已选：<text v-for="(s, si) in specSelected" :key="si">{{s.name}} </text>
					</view>
				</view>
				<view class="spec-popup__close-btn" @click="close">✕</view>
			</view>

			<!-- 规格组 -->
			<scroll-view scroll-y class="spec-popup__body">
				<view v-for="(group, gi) in specList" :key="gi" class="spec-group">
					<text class="spec-group__name">{{group.name}}</text>
					<view class="spec-group__items">
						<text v-for="child in getSpecChildren(group.id)"
							:key="child.globalIndex"
							:class="['spec-tag', child.selected ? 'spec-tag--active' : '']"
							@click="selectSpec(child.globalIndex, child.pid)">
							{{child.name}}
						</text>
					</view>
				</view>

				<!-- 数量 -->
				<view class="spec-popup__qty">
					<text class="spec-popup__qty-label">数量</text>
					<view class="qty-counter">
						<view class="qty-counter__btn"
							:class="numberl <= 1 ? 'qty-counter__btn--disabled' : ''"
							@click="numberl > 1 && numberl--">−</view>
						<text class="qty-counter__val">{{numberl}}</text>
						<view class="qty-counter__btn"
							:class="numberl >= (suks_inventory || 99) ? 'qty-counter__btn--disabled' : ''"
							@click="numberl < (suks_inventory || 99) && numberl++">+</view>
					</view>
				</view>
			</scroll-view>

			<!-- 底部确认按钮 -->
			<view class="spec-popup__footer" @click="confirm">加入购物袋</view>
		</view>
	</uv-popup>
</template>

<script>
	const db = uniCloud.database();

	export default {
		name: 'jlg-spec-popup',
		props: {
			userId: { type: String, default: '' }
		},
		data() {
			return {
				item: null,
				goods: null,
				specList: [],
				specChildList: [],
				specSelected: [],
				suks_price: null,
				suks_inventory: 0,
				suks_img: '',
				numberl: 1,
			};
		},
		methods: {
			/**
			 * 打开规格弹窗
			 * @param {Object} item - 商品基础信息（含 _id、goods_thumb）
			 * @param {Object} [goodsData] - 已加载的完整商品数据（含 orig_suks、suks）
			 *   - 传入时直接使用，无需再次请求（product.vue 场景）
			 *   - 不传时自动从 DB 拉取（category.vue 场景）
			 */
			open(item, goodsData) {
				this._reset(item);
				if (goodsData) {
					this._buildSpec(goodsData);
				} else {
					uni.showLoading({ title: '加载中' });
					db.collection('opendb-mall-goods').doc(item._id).get()
						.then(res => {
							uni.hideLoading();
							this._buildSpec(res.result.data[0]);
						})
						.catch(err => {
							uni.hideLoading();
							console.error(err);
							uni.showToast({ title: '加载失败', icon: 'none' });
						});
				}
			},
			close() {
				this.$refs.popup.close();
				this.$emit('close');
			},
			confirm() {
				if (!this.suks_price) {
					uni.showToast({ title: '请先选择规格', icon: 'none' });
					return;
				}
				this.$refs.popup.close();
				const uid = this.userId || uniCloud.getCurrentUserInfo().uid;
				this.$func.myFunction('jlg-cart', {
					functionName: 'addToCart',
					data: {
						user_id: uid,
						goods_id: this.item._id,
						control: false,
						specSelected: this.specSelected,
						suks_price: this.suks_price,
						numberl: this.numberl
					}
				}).then(res => {
					const msg = res.result.message === '加购成功' ? '已加入购物袋' : (res.result.message || '加购失败');
					uni.showToast({ title: msg, icon: 'none', duration: 1600 });
					this.$emit('success', msg);
				}).catch(err => {
					uni.showToast({ title: '加购失败', icon: 'none' });
					console.error(err);
				});
			},
			// 按父规格 id 过滤子项，并附加全局索引供 selectSpec 使用
			getSpecChildren(pid) {
				return this.specChildList
					.map((c, globalIndex) => ({ ...c, globalIndex }))
					.filter(c => c.pid === pid);
			},
			selectSpec(index, pid) {
				const list = this.specChildList;
				list.forEach(item => {
					if (item.pid === pid) this.$set(item, 'selected', false);
				});
				this.$set(list[index], 'selected', true);
				this.specSelected = list.filter(item => item.selected === true);
				// 匹配 SKU 组合，更新价格与库存
				const suks = this.goods.suks || [];
				for (let i = 0; i < suks.length; i++) {
					const specs = suks[i].specs;
					if (specs.length === this.specSelected.length &&
						specs.every((spec, idx) => spec === this.specSelected[idx].name)) {
						this.suks_price = suks[i].price;
						this.suks_inventory = suks[i].inventory;
						this.suks_img = suks[i].goods_thumb || '';
						break;
					}
				}
			},
			_reset(item) {
				this.item = item;
				this.goods = null;
				this.specList = [];
				this.specChildList = [];
				this.specSelected = [];
				this.suks_price = null;
				this.suks_inventory = 0;
				this.suks_img = '';
				this.numberl = 1;
			},
			_buildSpec(goods) {
				this.goods = goods;
				const origSuks = goods.orig_suks || [];
				for (let i = 0; i < origSuks.length; i++) {
					this.specList.push({ id: i, name: origSuks[i].name });
					for (let ii = 0; ii < origSuks[i].values.length; ii++) {
						this.specChildList.push({ id: ii, pid: i, name: origSuks[i].values[ii].name });
					}
				}
				this.$refs.popup.open();
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* ── 规格弹窗容器 ── */
	.spec-popup {
		display: flex;
		flex-direction: column;
		max-height: 75vh;

		&__top {
			display: flex;
			flex-direction: row;
			align-items: flex-start;
			padding: 28rpx 28rpx 20rpx;
			border-bottom: 1rpx solid $brand-border;
			position: relative;
		}

		&__img {
			width: 150rpx;
			height: 150rpx;
			border-radius: $uni-border-radius-lg;
			background: $brand-image-bg;
			flex-shrink: 0;
		}

		&__top-info {
			flex: 1;
			padding-left: 24rpx;
			display: flex;
			flex-direction: column;
			gap: 10rpx;
		}

		&__prompt {
			font-size: $font-body;
			color: $brand-primary;
			font-weight: 500;
		}

		&__stock {
			font-size: $font-meta;
			color: $brand-muted;
		}

		&__selected {
			font-size: $font-meta;
			color: $brand-muted;
			line-height: 1.5;
		}

		&__close-btn {
			position: absolute;
			right: 24rpx;
			top: 24rpx;
			width: 48rpx;
			height: 48rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			color: $brand-muted;
			border-radius: 50%;
			background: #f5f5f5;
		}

		&__body {
			flex: 1;
			padding: 20rpx 28rpx;
		}

		&__qty {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 24rpx 0 8rpx;
		}

		&__qty-label {
			font-size: $font-body;
			color: $brand-text;
		}

		&__footer {
			height: 96rpx;
			line-height: 96rpx;
			text-align: center;
			background: $brand-primary;
			color: $brand-surface;
			font-size: $font-body;
			font-weight: 500;
			letter-spacing: 2rpx;
			flex-shrink: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
		}
	}

	/* ── 规格组 ── */
	.spec-group {
		margin-bottom: 28rpx;

		&__name {
			font-size: $font-body;
			color: $brand-text;
			font-weight: 500;
			display: block;
			margin-bottom: 16rpx;
		}

		&__items {
			display: flex;
			flex-wrap: wrap;
			gap: 16rpx;
		}
	}

	.spec-tag {
		display: inline-flex;
		align-items: center;
		padding: 12rpx 28rpx;
		border: 1rpx solid $brand-border;
		border-radius: $uni-border-radius-base;
		font-size: $font-meta;
		color: $brand-text;

		&--active {
			border-color: $brand-primary;
			color: $brand-primary;
			background: rgba(28, 114, 49, 0.06);
			font-weight: 600;
		}
	}

	/* ── 数量加减控件 ── */
	.qty-counter {
		display: flex;
		align-items: center;
		gap: 2rpx;

		&__btn {
			width: 48rpx;
			height: 48rpx;
			line-height: 46rpx;
			text-align: center;
			font-size: 28rpx;
			color: $brand-primary;
			font-weight: 400;
			font-family: $brand-price-font;
			border: 1rpx solid $brand-primary;
			border-radius: $uni-border-radius-sm;

			&:active {
				background: rgba(28, 114, 49, 0.08);
			}

			&--disabled {
				color: $brand-light-muted;
				border-color: $brand-light-muted;
				pointer-events: none;
			}
		}

		&__val {
			width: 52rpx;
			line-height: 48rpx;
			text-align: center;
			font-size: $font-meta;
			color: $brand-text;
		}
	}
</style>
