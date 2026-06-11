<template>
	<view class="about-page">
		<!-- Tab 导航 -->
		<view class="tabs-wrap">
			<uv-tabs
				:list="tabList"
				:lineColor="primaryColor"
				:activeStyle="{ color: primaryColor, fontWeight: '600' }"
				:inactiveStyle="{ color: mutedColor }"
				:scrollable="true"
				@click="onTabClick"
			/>
		</view>

		<!-- 文章内容 -->
		<view class="article-wrap" v-if="currentArticle">
			<mp-html :content="currentArticle.content" />
		</view>

		<!-- 骨架/空态 -->
		<view class="empty-state" v-if="!loading && tabList.length === 0">
			<text class="text-meta">暂无内容</text>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	const CATEGORY_ID = '6a2970ba86206654516c6b00';

	export default {
		data() {
			return {
				tabList: [],
				articles: [],
				currentArticle: null,
				loading: true,
				primaryColor: '#1C7231',
				mutedColor: '#8E918D',
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({ title: '关于我们' });
			this.loadArticles();
		},
		onShareTimeline() {
			return { title: this.currentArticle ? this.currentArticle.title : '关于我们' };
		},
		onShareAppMessage() {
			return { title: this.currentArticle ? this.currentArticle.title : '关于我们' };
		},
		methods: {
			loadArticles() {
				db.collection('opendb-news-articles')
					.where({ category_id: CATEGORY_ID })
					.orderBy('article_order', 'asc')
					.get()
					.then(res => {
						this.articles = res.result.data;
						this.tabList = this.articles.map(item => ({ name: item.title }));
						if (this.articles.length > 0) {
							this.currentArticle = this.articles[0];
						}
					})
					.finally(() => {
						this.loading = false;
					});
			},
			onTabClick(e) {
				const index = this.tabList.findIndex(t => t.name === e.name);
				if (index !== -1) {
					this.currentArticle = this.articles[index];
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/common/common.scss";

	page {
		background: $brand-bg;
	}

	.about-page {
		min-height: 100vh;
		background: $brand-bg;
	}

	/* ── Tab ── */
	.tabs-wrap {
		position: sticky;
		top: 0;
		z-index: 10;
		background: $brand-bg;
		border-bottom: 1rpx solid $brand-border;
	}

	/* ── 文章内容 ── */
	.article-wrap {
		padding: 48rpx 32rpx 80rpx;

		mp-html {
			display: block;
			width: 100%;
		}
	}

	/* mp-html 富文本排版（复用详情页风格） */
	::v-deep .mp-html-container,
	::v-deep ._root {
		font-size: $font-body;
		font-weight: $font-body-weight;
		color: $brand-text;
		line-height: 1.8;
		word-break: break-word;

		p {
			margin: 0 0 28rpx;
		}

		h1, h2, h3 {
			font-weight: 600;
			color: $brand-black;
			margin: 48rpx 0 20rpx;
			line-height: 1.4;
		}

		h1 { font-size: $font-page-title; }
		h2 { font-size: $font-section-title; }
		h3 { font-size: $font-product-title; }

		img {
			max-width: 100%;
			height: auto;
			display: block;
			margin: 24rpx 0;
			border-radius: $uni-border-radius-sm;
		}

		a {
			color: $brand-primary;
			text-decoration: none;
		}

		ul, ol {
			padding-left: 40rpx;
			margin: 0 0 24rpx;

			li {
				margin-bottom: 12rpx;
				line-height: 1.7;
			}
		}

		blockquote {
			margin: 24rpx 0;
			padding: 20rpx 24rpx;
			border-left: 4rpx solid $brand-primary;
			background: $brand-bg;
			color: $brand-muted;
			font-size: $font-meta;
		}

		hr {
			border: none;
			border-top: 1rpx solid $brand-border;
			margin: 40rpx 0;
		}

		strong, b {
			font-weight: 600;
			color: $brand-black;
		}

		em { font-style: italic; }
	}

	/* ── 空态 ── */
	.empty-state {
		display: flex;
		justify-content: center;
		padding: 120rpx 0;
	}
</style>
