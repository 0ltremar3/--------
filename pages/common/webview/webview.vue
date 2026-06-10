<template>
	<view>
		<web-view :src="urls || url">
		</web-view>
	</view>
</template>

<script>
	export default {
		onLoad({
			url,
			title,
		}) {
			this.url = url;
			if (title) {
				uni.setNavigationBarTitle({
					title
				});
			}
		},
		data() {
			return {
				url: null,
				urls: null,
			};
		}
	}
</script>

<style lang="scss">

</style>