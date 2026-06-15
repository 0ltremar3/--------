<template>
	<view class="cate-page">
		<!-- 搜索框 -->
		<view class="search-wrap">
			<uv-search :placeholder="$t('category.searchPlaceholder')" shape="round" :showAction="false"
				@search="doSearch" @clear="clearSearch" />
		</view>

		<!-- 主体：侧边栏 + 右侧商品区 -->
		<view class="cate-main" :style="{ height: mainHeight + 'px' }">
			<!-- 左侧父类侧边栏 -->
			<scroll-view class="sidebar" scroll-y :style="{ height: mainHeight + 'px' }">
				<view v-if="flist.length === 0 && !catLoading" class="sidebar-empty">
					<text class="sidebar-empty__text">{{ $t('category.emptyCategory') }}</text>
				</view>
				<view v-for="(item, idx) in flist" :key="idx"
					:class="['sidebar-item', activeParentIndex === idx ? 'sidebar-item--active' : '']"
					@click="selectParent(idx)">
					<text class="sidebar-item__name">{{ displayLangText(item, 'name') }}</text>
				</view>
			</scroll-view>

			<!-- 右侧：子分类tab+排序（sticky）+ 商品列表 -->
			<scroll-view class="goods-scroll" scroll-y :style="{ height: mainHeight + 'px' }"
				@scrolltolower="loadMore" enable-back-to-top>

				<!-- 子分类 Tab + 排序入口（同一行，sticky 吸顶） -->
				<view class="filter-bar">
					<scroll-view scroll-x class="subcate-scroll">
						<view class="subcate-tabs">
							<view :class="['subcate-tab', activeSubCateId === null ? 'subcate-tab--active' : '']"
								@click="selectSubCate(null)">{{ $t('category.all') }}</view>
							<view v-for="sub in currentSubCates" :key="sub._id"
								:class="['subcate-tab', activeSubCateId === sub._id ? 'subcate-tab--active' : '']"
								@click="selectSubCate(sub._id)">{{ displayLangText(sub, 'name') }}</view>
						</view>
					</scroll-view>
					<view class="sort-entry" @click="openSortPanel">
						<text class="sort-label">{{sortLabels[sortType]}}</text>
						<text class="sort-arrow">↓</text>
					</view>
				</view>

				<!-- 骨架屏（首次加载中） -->
				<view v-if="loading && goodsList.length === 0" class="goods-grid">
					<view v-for="n in 6" :key="'sk'+n" class="goods-card goods-card--skeleton">
						<view class="skeleton-img"></view>
						<view class="skeleton-info">
							<view class="skeleton-line skeleton-line--full"></view>
							<view class="skeleton-line skeleton-line--half"></view>
						</view>
					</view>
				</view>

				<!-- 商品网格 -->
				<view v-else-if="goodsList.length > 0" class="goods-grid">
					<view v-for="item in goodsList" :key="item._id" class="goods-card"
						@click="navToDetail(item._id)">
						<image :src="item.goods_thumb" mode="aspectFill" class="goods-img" />
						<view class="goods-info">
							<text class="goods-name">{{ displayLangText(item, 'name') }}</text>
							<view class="goods-meta">
								<jlg-minPrice v-if="item.suks && item.suks.length"
									:min-price="getMinPrice(item)"
									maxSize="28rpx" min-size="22rpx" />
								<!-- <text class="goods-sold">已售{{item.total_sell_count}}</text> -->
								<view class="cart-btn" @click.stop="quickAddToCart(item)">
									<image src="/static/tabbar/cart_active.svg" class="cart-icon" mode="aspectFit" />
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 优雅空状态 -->
				<view v-else-if="!loading" class="goods-empty">
					<view class="goods-empty__divider"></view>
					<text class="goods-empty__text">{{ $t('category.emptyGoods') }}</text>
					<view class="goods-empty__divider"></view>
				</view>

				<uni-load-more v-if="goodsList.length > 0" :status="loadingType" />
			</scroll-view>
		</view>

		<!-- 排序弹窗（底部弹出） -->
		<uni-popup ref="sortPopup" background-color="#fff">
			<view class="sort-panel">
				<view class="sort-panel__header">
					<text class="sort-panel__title">{{ $t('category.sortTitle') }}</text>
					<view class="sort-panel__close" @click="closeSortPanel">
						<text>✕</text>
					</view>
				</view>
				<view v-for="(label, idx) in sortLabels" :key="idx"
					:class="['sort-option', sortType === idx ? 'sort-option--active' : '']"
					@click="changeSort(idx)">
					{{label}}
				</view>
			</view>
		</uni-popup>

		<!-- 规格选择弹窗（独立组件） -->
		<jlg-spec-popup ref="specPopup" :userId="user_id" />
	</view>
</template>

<script>
	const db = uniCloud.database();

	export default {
		data() {
			const sysInfo = uni.getSystemInfoSync();
			const rpx = sysInfo.windowWidth / 750;
			return {
				flist: [],
				catLoading: false,
				activeParentIndex: 0,
				activeSubCateId: null,
				goodsList: [],
				loadingType: 'more',
				currentPage: 1,
				pageSize: 8,
				loading: false,
				sortType: 0,
				sortOrders: ['add_date asc', 'add_date desc', 'crossed_price asc', 'crossed_price desc'],
				searchKeyword: '',
				windowWidth: sysInfo.windowWidth,
				windowHeight: sysInfo.windowHeight,
				searchBarH: Math.ceil(112 * rpx),
				user_id: '',
			};
		},
		computed: {
			mainHeight() {
				return this.windowHeight - this.searchBarH;
			},
			currentSubCates() {
				if (this.flist.length === 0 || !this.flist[this.activeParentIndex]) return [];
				return this.flist[this.activeParentIndex].childrens || [];
			},
			currentSubCateIds() {
				return this.currentSubCates.map(s => s._id);
			},
			sortLabels() {
				return [
					this.$t('category.defaultSort'),
					this.$t('category.newestSort'),
					this.$t('category.priceAsc'),
					this.$t('category.priceDesc')
				];
			}
		},
		onShareTimeline() {
			return {
				title: this.$t('home.shareTitle'),
				imageUrl: '../../static/logo.png',
			};
		},
		onShareAppMessage() {
			return { title: this.$t('home.shareTitle') };
		},
		onLoad() {
			try {
				this.user_id = uniCloud.getCurrentUserInfo().uid;
			} catch(e) {}
			this.loadCategories();
		},
		methods: {
			loadCategories() {
				this.catLoading = true;
				uni.showLoading({ title: this.$t('home.loading') });
				this.$func.myFunction('jlg-home', {
					functionName: 'catedata',
					data: {}
				}).then(res => {
					uni.hideLoading();
					this.flist = res.result.flist;
					this.catLoading = false;
					if (this.flist.length > 0) {
						this.loadProducts(true);
					}
				}).catch(err => {
					uni.hideLoading();
					this.catLoading = false;
					console.error(err);
				});
			},
			selectParent(idx) {
				if (this.activeParentIndex === idx) return;
				this.activeParentIndex = idx;
				this.activeSubCateId = null;
				this.resetAndLoad();
			},
			selectSubCate(id) {
				if (this.activeSubCateId === id) return;
				this.activeSubCateId = id;
				this.resetAndLoad();
			},
			resetAndLoad() {
				this.currentPage = 1;
				this.goodsList = [];
				this.loadingType = 'more';
				this.loadProducts(true);
			},
			buildWhere() {
				const where = { is_on_sale: true };
				if (this.activeSubCateId) {
					where.category_id = this.activeSubCateId;
				} else if (this.currentSubCateIds.length > 0) {
					where.category_id = db.command.in(this.currentSubCateIds);
				}
				if (this.searchKeyword) {
					where.name = new RegExp(this.searchKeyword, 'i');
				}
				return where;
			},
			loadProducts(showToast) {
				if (this.loading) return;
				if (this.loadingType === 'noMore' && this.currentPage > 1) return;
				// 当前父类无子分类且未选中具体子类时，直接置空
				if (!this.activeSubCateId && this.currentSubCateIds.length === 0) {
					this.goodsList = [];
					this.loadingType = 'noMore';
					return;
				}
				this.loading = true;
				if (showToast) {
					uni.showLoading({ title: this.$t('home.loading') });
				}
				const skip = (this.currentPage - 1) * this.pageSize;
				db.collection('opendb-mall-goods')
					.where(this.buildWhere())
					.orderBy(this.sortOrders[this.sortType])
					.skip(skip)
					.limit(this.pageSize)
					.get()
					.then(res => {
						const newData = res.result.data;
						if (this.currentPage === 1) {
							this.goodsList = newData;
						} else {
							this.goodsList = this.goodsList.concat(newData);
						}
						this.loadingType = newData.length < this.pageSize ? 'noMore' : 'more';
						uni.hideLoading();
						this.loading = false;
					})
					.catch(err => {
						console.error(err);
						uni.hideLoading();
						this.loading = false;
					});
			},
			loadMore() {
				if (this.loadingType === 'noMore' || this.loading) return;
				this.currentPage++;
				this.loadProducts(false);
			},
			doSearch(keyword) {
				this.searchKeyword = keyword;
				this.resetAndLoad();
			},
			clearSearch() {
				this.searchKeyword = '';
				this.resetAndLoad();
			},
			openSortPanel() {
				this.$refs.sortPopup.open('bottom');
			},
			closeSortPanel() {
				this.$refs.sortPopup.close();
			},
			changeSort(idx) {
				this.sortType = idx;
				this.closeSortPanel();
				this.resetAndLoad();
			},
			getMinPrice(item) {
				if (!item.suks || item.suks.length === 0) return 0;
				return item.suks.reduce((min, suk) =>
					parseInt(suk.price) < parseInt(min.price) ? suk : min
				).price;
			},
			getCurrentLang() {
				return uni.getStorageSync('CURRENT_LANG') || this.$i18n.locale || 'zh-Hans';
			},
			displayLangText(item, key) {
				if (!item) return '';
				const langKey = this.getCurrentLang() === 'en' ? `${key}_en` : key;
				return item[langKey] || item[key] || '';
			},
			quickAddToCart(item) {
				if (!this.user_id) {
					uni.showToast({ title: this.$t('category.loginRequired'), icon: 'none', duration: 1000 });
					setTimeout(() => {
						uni.navigateTo({ url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd' });
					}, 1000);
					return;
				}
				this.$refs.specPopup.open(item);
			},
			navToDetail(id) {
				uniCloud.callFunction({
					name: 'jlg-record',
					data: { user_id: this.user_id, id }
				}).catch(() => {});
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	$sidebar-w: 140rpx;

	page {
		background: $brand-bg;
		height: 100%;
	}

	.cate-page {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: $brand-bg;
	}

	/* ── 搜索框 ── */
	.search-wrap {
		flex-shrink: 0;
		background: $brand-surface;
		padding: 20rpx 24rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	/* ── 主体布局 ── */
	.cate-main {
		display: flex;
		flex-direction: row;
		overflow: hidden;
	}

	/* ── 左侧侧边栏 ── */
	.sidebar {
		width: $sidebar-w;
		flex-shrink: 0;
		background: $brand-bg;
	}

	.sidebar-empty {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 60rpx 12rpx;

		&__text {
			font-size: $font-meta;
			color: $brand-light-muted;
			text-align: center;
		}
	}

	.sidebar-item {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 88rpx;
		padding: 0 12rpx;
		text-align: center;
		font-size: $font-body;
		color: $brand-muted;
		position: relative;
		line-height: 1.4;

		&--active {
			background: $brand-surface;
			color: $brand-primary;
			font-weight: 600;

			&::before {
				content: '';
				position: absolute;
				left: 0;
				top: 20%;
				height: 60%;
				width: 6rpx;
				background: $brand-primary;
				border-radius: 0 4rpx 4rpx 0;
			}
		}
	}

	.sidebar-item__name {
		display: block;
	}

	/* ── 右侧商品滚动区 ── */
	.goods-scroll {
		flex: 1;
		overflow: hidden;
	}

	/* ── 筛选栏（子分类 + 排序，同一行，sticky 吸顶） ── */
	.filter-bar {
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		background: $brand-surface;
		height: 88rpx;
	}

	.subcate-scroll {
		flex: 1;
		height: 88rpx;
		white-space: nowrap;
		overflow: hidden;
	}

	.subcate-tabs {
		display: flex;
		align-items: center;
		height: 88rpx;
		padding-left: 16rpx;
		white-space: nowrap;
	}

	.subcate-tab {
		display: inline-flex;
		align-items: center;
		padding: 0 22rpx;
		height: 52rpx;
		margin-right: 8rpx;
		border-radius: 26rpx;
		font-size: $font-meta;
		color: $brand-muted;
		white-space: nowrap;
		flex-shrink: 0;
		transition: all 0.2s;

		&--active {
			background: rgba(28, 114, 49, 0.08);
			color: $brand-primary;
			font-weight: 600;
		}
	}

	.sort-entry {
		display: flex;
		align-items: center;
		height: 88rpx;
		padding: 0 16rpx 0 14rpx;
		flex-shrink: 0;
		border-left: 1rpx solid $brand-border;
		white-space: nowrap;
		gap: 4rpx;
	}

	.sort-label {
		font-size: $font-meta;
		color: $brand-text;
	}

	.sort-arrow {
		font-size: 20rpx;
		color: $brand-muted;
	}

	/* ── 商品网格 ── */
	.goods-grid {
		display: flex;
		flex-wrap: wrap;
		padding: 12rpx 8rpx 8rpx;
	}

	.goods-card {
		width: calc(50% - 10rpx);
		margin: 5rpx;
		background: $brand-surface;
		border-radius: $uni-border-radius-lg;
		overflow: hidden;
	}

	.goods-img {
		width: 100%;
		height: 260rpx;
		display: block;
	}

	.goods-info {
		padding: 14rpx 14rpx 18rpx;
	}

	.goods-name {
		font-size: $font-product-title;
		font-weight: $font-product-title-weight;
		color: $brand-text;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
	}

	.goods-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 10rpx;
	}

	.goods-sold {
		font-size: $font-meta;
		color: $brand-muted;
		flex-shrink: 0;
	}

	/* ── 购物袋图标按钮 ── */
	.cart-btn {
		width: 52rpx;
		height: 52rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		flex-shrink: 0;

		&:active {
			background: rgba(28, 114, 49, 0.08);
		}
	}

	.cart-icon {
		width: 46rpx;
		height: 46rpx;
	}

	/* ── 骨架屏 ── */
	@keyframes skeleton-pulse {
		0%, 100% { opacity: 0.5; }
		50% { opacity: 1; }
	}

	.goods-card--skeleton {
		pointer-events: none;
	}

	.skeleton-img {
		width: 100%;
		height: 260rpx;
		background: $brand-image-bg;
		animation: skeleton-pulse 1.4s ease-in-out infinite;
	}

	.skeleton-info {
		padding: 14rpx 14rpx 18rpx;
	}

	.skeleton-line {
		height: 24rpx;
		border-radius: 4rpx;
		background: $brand-image-bg;
		animation: skeleton-pulse 1.4s ease-in-out infinite;
		margin-bottom: 12rpx;

		&--full { width: 90%; }
		&--half { width: 55%; animation-delay: 0.2s; }
	}

	/* ── 优雅空状态 ── */
	.goods-empty {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 80rpx 40rpx;
		gap: 24rpx;

		&__divider {
			flex: 1;
			height: 1rpx;
			background: $brand-border;
		}

		&__text {
			font-size: $font-meta;
			color: $brand-light-muted;
			white-space: nowrap;
			letter-spacing: 2rpx;
		}
	}

	/* ── 排序弹窗 ── */
	.sort-panel {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.sort-panel__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 28rpx 32rpx 20rpx;
		border-bottom: 1rpx solid $brand-border;
	}

	.sort-panel__title {
		font-size: $font-body;
		font-weight: 600;
		color: $brand-text;
	}

	.sort-panel__close {
		width: 52rpx;
		height: 52rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: $brand-muted;
		border-radius: 50%;
		background: #f5f5f5;
	}

	.sort-option {
		padding: 30rpx 32rpx;
		font-size: $font-body;
		color: $brand-text;
		text-align: center;
		border-bottom: 1rpx solid $brand-border;

		&--active {
			background: rgba(28, 114, 49, 0.06);
			color: $brand-primary;
			font-weight: 600;
		}

		&:last-child {
			border-bottom: none;
		}
	}

</style>
