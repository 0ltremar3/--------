<template>
	<view class="article">
		<view class="article-content">
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
</style>