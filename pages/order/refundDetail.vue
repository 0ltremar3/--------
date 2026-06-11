<template>
	<view class="margin-sm">
		<use-navbar title="商品评价"></use-navbar>
		<view class="state-area use-area dflex">
			<view @click="switchClick(index)" class="item margin-right-sm" :class="{ active: state == index }"
				v-for="(item, index) in stateDatas" :key="index">
				<text style="font-size: 26rpx;">{{ item.name }}({{ item.cnt}})</text>
			</view>
		</view>
		<uv-empty v-if="evaluateDatas.length == 0" mode="data" icon="/static/temp/shwk.png" text="暂无评价"></uv-empty>
		<!-- 评价区 -->
		<view v-else class="evaluate-area">
			<view class="use-area eva-box padding-bottom-lg" v-for="(item, index) in evaluateDatas" :key="index">
				<view class="dflex-b">
					<view class="dflex">
						<image class="portrait border-radius-c"
							:src="item.usimage[0].url?item.usimage[0].url:`../../static/logo.png`"></image>
						<view class="margin-left-sm">
							<text class="fwbd margin-right"
								style="display: block;">{{ item.usname[0]?item.usname[0]:"匿名用户" }}</text>
							<uni-rate :readonly="true" activeColor="#61A189" size="17" v-model="item.grade" />
						</view>
					</view>
					<text class="time fs-xs ft-dark">{{formatDate(item.create_date)}}</text>
				</view>
				<view class="right-area flex1">
					<view class="fs-sm ft-main margin-top-xs margin-bottom-sm break-all">
						{{ item.content.text?item.content.text:''}}
					</view>
					<view class="dflex dflex-wrap-w">
						<view v-for="(img, i) in item.content.images" :key="i" class="dflex-c image-area border-radius">
							<image @click="content_image(i,item.content.images)" :src="img.url" lazy-load
								mode="widthFix"></image>
						</view>
					</view>
					<view>
						<text class="fs-xxs ft-dark">购买类型：</text>
						<text v-for="suk in item.goods_suk" class="fs-xxs ft-dark">{{ suk }}</text>
					</view>

					<view v-if="item.reply" class="margin-top-xs bg-drak padding-lr padding-tb-sm border-radius"
						style="color: #525252;" @click="openReplay(item)">
						<text class="clamp-lh" :class="{ 'clamp-2': !item.replay_open }">商家回复:
							{{item.reply}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="w-full" style="height: 30rpx;"></view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				// 评价状态
				stateDatas: [{
						name: '全部',
						cnt: 0
					},
					{
						name: '好评',
						cnt: 0
					},
					{
						name: '中评',
						cnt: 0
					},
					{
						name: '差评',
						cnt: 0
					},
					{
						name: '带图',
						cnt: 0
					}
				],
				// 评价数据
				evaluateDatas: [],
				origdata: [],
				// 评价类型
				state: 0,
				// 商品评价
				dbname: 'usemall-goods-comment'
			}
		},
		onLoad(e) {
			this.refunData(e.id, 0)
		},
		methods: {
			refunData(id, index) {
				uni.showLoading({
					title: "加载中"
				})
				db.collection("opendb-mall-comments,uni-id-users").where({
					"goods_id": id
				}).field(
					"content,create_date,goods_id,goods_suk,grade,user_id.nickname as usname,user_id.avatar_file as usimage,reply"
				).get().then((res) => {
					let nuwdata = res.result.data;
					this.evaluateDatas = nuwdata;
					this.origdata = nuwdata;
					// 遍历评论数据进行统计
					nuwdata.forEach((comment) => {
						const grade = comment.grade;
						this.stateDatas[0].cnt++;
						if (grade < 3) {
							this.stateDatas[3].cnt++;
						} else if (grade === 3) {
							this.stateDatas[2].cnt++;
						} else if (grade > 3) {
							this.stateDatas[1].cnt++;
						}
						if (comment.content.images != null) {
							this.stateDatas[4].cnt++;
						}
					});
					uni.hideLoading()

				})
			},
			switchClick(index) {
				this.state = index;
				this.evaluateDatas = [];
				if (index == 0) {
					this.evaluateDatas = this.origdata
				} else {
					this.origdata.forEach(item => {
						const grade = item.grade;
						if (index == 1 && grade > 3) {
							this.evaluateDatas.push(item)
						} else if (index == 2 && grade == 3) {
							this.evaluateDatas.push(item)
						} else if (index == 3 && grade < 3) {
							this.evaluateDatas.push(item)
						} else if (index == 4 && item.content.images != null) {
							this.evaluateDatas.push(item)
						}
					})
				}

			},
			content_image(e, a) {
				const imageUrls = a.map(item => item.url);
				uni.previewImage({
					urls: imageUrls,
					loop: true,
					indicator: 'default',
					current: e,
					count: e
				})
			},
			formatDate(timestamp) {
				const date = new Date(timestamp);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			}
		}
	}
</script>

<style lang="scss">
	@import url("../../static/colorui/icon.css");
	@import url("../../static/common/common.scss");
	@import url("../../static/colorui/main.css");

	page {
		background: #f0f0f0;
	}

	.state-area {
		.item {
			text {
				padding: 10rpx 20rpx;
				border: 1px solid #f0f0f0;
				border-radius: 30rpx;
			}

			&:last-child {
				margin-right: 0;
			}
		}
	}

	.evaluate-area {
		.portrait {
			flex-shrink: 0;
			width: 80rpx;
			height: 80rpx;
		}

		.image-area {
			height: 200rpx;
			width: 30%;
			margin-right: 10rpx;
			margin-bottom: 10rpx;
			border: 1px solid #f5f5f5;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>