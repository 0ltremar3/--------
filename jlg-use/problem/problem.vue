<template>
	<view class="problem-page">
		<!-- 顶部 banner -->
		<view class="banner-wrap">
			<image
				class="banner-img"
				src="https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/wenti2.jpg"
				mode="aspectFill"
			/>
			<view class="banner-overlay">
				<button open-type="contact" class="contact-btn">联系客服</button>
			</view>
		</view>

		<!-- 分类 Tab -->
		<view class="tabs-wrap">
			<uv-tabs
				:list="list"
				:lineColor="primaryColor"
				:activeStyle="{ color: primaryColor, fontWeight: '600' }"
				:inactiveStyle="{ color: mutedColor }"
				:scrollable="true"
				@click="loadData"
			/>
		</view>

		<!-- 问题列表 -->
		<view class="list-wrap">
			<view
				class="list-item dflex-b"
				v-for="(item, index) in loadList"
				:key="index"
				@click="navTo(item._id)"
				hover-class="item-hover"
			>
				<text class="item-title text-body">{{ item.title }}</text>
				<text class="iconfont icon-right item-arrow"></text>
			</view>
			<view v-if="loadList.length === 0" class="empty-state">
				<text class="text-meta">暂无相关内容</text>
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				list: [],
				loadList: [],
				primaryColor: '#61A189',
				mutedColor: '#8E918D',
			}
		},
		onLoad() {
			this.listData()
		},
		onShareTimeline() {
			return {
				title: "山前食养商城常见问题说明"
			}
		},
		onShareAppMessage(res) {
			return {
				title: "山前食养商城常见问题说明"
			}
		},
		methods: {
			listData() {
				db.collection("opendb-news-articles").where({
					"category_id": '64cb3e83337a9f4db7bcb3a2'
				}).field("excerpt,category_id").distinct().get().then((res) => {
					res.result.data.forEach(item => {
						this.list.push({ name: item.excerpt })
					})
					this.loadData(this.list[0])
				})
			},
			loadData(e) {
				db.collection("opendb-news-articles").where({
					"excerpt": e.name
				}).get().then((res) => {
					this.loadList = res.result.data
				})
			},
			navTo(id) {
				uni.navigateTo({
					url: `./probileDetail?id=${id}`
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

	.problem-page {
		min-height: 100vh;
		background: $brand-bg;
	}

	/* ── banner ── */
	.banner-wrap {
		position: relative;
		width: 100%;
		height: 300rpx;
		background: $brand-image-bg;
	}

	.banner-img {
		width: 100%;
		height: 300rpx;
	}

	.banner-overlay {
		position: absolute;
		right: 32rpx;
		bottom: 32rpx;
	}
	.contact-btn {
		@include shop-button(secondary);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 64rpx;
		line-height: 64rpx;
		padding: 0 28rpx;
		font-size: $font-meta;
		font-weight: 500;
		letter-spacing: 0.02em;
		&::after {
			border: none;
		}
	}

	/* ── tabs ── */
	.tabs-wrap {
		border-bottom: 1rpx solid $brand-border;
		background: $brand-bg;
	}

	/* ── 列表 ── */
	.list-wrap {
		padding: 0 32rpx;
		background: $brand-bg;
	}

	.list-item {
		height: 96rpx;
		border-bottom: 1rpx solid $brand-border;
		display: flex;
		align-items: center;
		justify-content: space-between;

		&:last-child {
			border-bottom: none;
		}
	}

	.item-hover {
		background: $brand-bg;
	}

	.item-title {
		flex: 1;
		color: $brand-text;
		font-size: $font-body;
	}

	.item-arrow {
		font-size: 28rpx;
		color: $brand-light-muted;
		margin-left: 16rpx;
	}

	.empty-state {
		padding: 80rpx 0;
		display: flex;
		justify-content: center;
	}
</style>
