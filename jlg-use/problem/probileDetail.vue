<template>
	<view class="detail-page">
		<view class="article-wrap">
			<mp-html ref="mpAll" :content="loadList.content" />
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				id: '',
				loadList: [],
			}
		},
		onLoad(e) {
			this.id = e.id;
			this.loadData(e.id);
		},
		onShareTimeline() {
			return {
				title: this.loadList.title
			}
		},
		onShareAppMessage(res) {
			return {
				title: this.loadList.title
			}
		},
		methods: {
			loadData(id) {
				db.collection("opendb-news-articles").doc(id).get().then((res) => {
					this.loadList = res.result.data[0]
					uni.setNavigationBarTitle({
						title: this.loadList.title
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/common/common.scss";

	page {
		background: $brand-bg;
	}

	.detail-page {
		min-height: 100vh;
		background: $brand-bg;
	}

	.article-wrap {
		padding: 48rpx 32rpx 64rpx;

		/* ── mp-html 富文本重置 ── */
		.rich-text,
		mp-html {
			display: block;
			width: 100%;
		}
	}

	/* mp-html 生成的内容排版 */
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
			margin: 40rpx 0 20rpx;
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
</style>
