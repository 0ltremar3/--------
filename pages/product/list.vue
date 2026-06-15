<template>
	<view class="content">
		<view style="background: #fff;padding:10rpx 20rpx;">
			<uv-search :placeholder="$t('productList.searchPlaceholder')" shape="round" :showAction="false" @search="searchClick"
				@clear="clearClick"></uv-search>
		</view>
		<view :style="{display: sticky?'':'none'}">
			<uv-sticky bgColor="#fff" :custom-nav-height="0">
				<uv-tabs :list="sortTabs" lineColor="#61A189" @click="loadData" :activeStyle="{color: '#61A189'}"
					:scrollable="false">
					<template v-slot:right>
						<view style="padding-left: 4px;" @tap="toast('show')">
							<text class="iconfont f-32 icon-uniE03c mr-20"
								style="font-size: 38rpx;border-left: 2rpx solid #a0a0a0;padding-left: 20rpx;color: #696969;"></text>
						</view>
					</template>
				</uv-tabs>
			</uv-sticky>
		</view>
		<uv-empty v-if="evengoodsList.length == 0" mode="data" icon="/static/temp/shwk.png" :text="$t('productList.emptyGoods')"></uv-empty>
		<view v-else class="allLike mb-30">
			<uv-waterfall class="dis-flex flex-x-around" ref="waterfall" left-gap="0" right-gap="0" column-gap="8"
				@changeList="changeList">
				<!-- 第一列数据 -->
				<template v-slot:list1>
					<!-- 为了磨平部分平台的BUG，必须套一层view -->
					<view>
						<view v-for="(item, index) in evengoodsList" :key="index" @click="navToDetailPage(item._id)"
							class="waterfall-item">
							<view class="waterfall-item__image">
								<image :src="item.goods_thumb" mode="scaleToFill" class="allLike-img">
								</image>
							</view>
							<view class="waterfall-item__ft">
								<view class="mb-10 f-28 ellipsis">
									{{ displayLangText(item, 'name') }}
								</view>
								<view class="waterfall-item__ft__desc mt-20 uv-line-2 price-nav"
									style="display: flex !important; flex-direction: row ; align-items: baseline;justify-content: space-between;">
									<jlg-minPrice
										:min-price="item.suks.reduce((min, suk) => parseInt(suk.price) < parseInt(min.price) ? suk : min).price"
										maxSize="32rpx" min-size="26rpx"></jlg-minPrice>
									<text style="float: right;" class="mr-10">{{ $t('productList.sold') }} {{item.total_sell_count}}</text>
								</view>
							</view>
						</view>
					</view>
				</template>
				<!-- 第二列数据 -->
				<template v-slot:list2>
					<!-- 为了磨平部分平台的BUG，必须套一层view -->
					<view>
						<view v-for="(item, index) in oddgoodsList" @click="navToDetailPage(item._id)" :key="index"
							class="waterfall-item">
							<view class="waterfall-item__image">
								<image :src="item.goods_thumb" mode="scaleToFill" class="allLike-img">
								</image>
							</view>
							<view class="waterfall-item__ft">
								<view class="mb-10 f-28 ellipsis">
									{{ displayLangText(item, 'name') }}
								</view>
								<view class="waterfall-item__ft__desc mt-20 uv-line-2 price-nav"
									style="display: flex !important; flex-direction: row ; align-items: baseline;justify-content: space-between;">
									<jlg-minPrice
										:min-price="item.suks.reduce((min, suk) => parseInt(suk.price) < parseInt(min.price) ? suk : min).price"
										maxSize="32rpx" min-size="26rpx"></jlg-minPrice>
									<text style="float: right;" class="mr-10">{{ $t('productList.sold') }} {{item.total_sell_count}}</text>
								</view>
							</view>
						</view>
					</view>
				</template>
			</uv-waterfall>
		</view>
		<uni-load-more v-if="evengoodsList.length > 0" :status="loadingType"></uni-load-more>
		<uni-popup ref="popup" background-color="#fff" @change="change">
			<view class="pop-van">
				<scroll-view scroll-y>
					<view class="pop-fathname">{{ displayLangText(fatherCate, 'name') }}</view>
					<view :class="item._id==goods_id?'pop-list col-61A189':'pop-list col-505050'"
						v-for="item in cateList" :key="item._id" @click="changeCate(item._id)">
						{{ displayLangText(item, 'name') }}
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				priceSortBadgeValue: 0,
				loadingType: 'more', //加载更多状态
				cateList: [],
				goodsList: [],
				oddgoodsList: [],
				evengoodsList: [],
				goods_id: "",
				orderBy: "add_date asc",
				currentPage: 1, // 当前页码
				pageSize: 8, // 每页数据条数
				fatherName: "",
				fatherCate: null,
				user_id: uniCloud.getCurrentUserInfo().uid,
				sticky: true,
				where: {}
			};
		},
		computed: {
			sortTabs() {
				return [{
					name: this.$t('productList.comprehensiveSort'),
				}, {
					name: this.$t('productList.salesFirst'),
				}, {
					name: this.$t('productList.price'),
					badge: {
						isDot: true,
						value: this.priceSortBadgeValue,
					}
				}];
			}
		},
		onShareTimeline(res) {
			return {
				title: this.$t('home.shareTitle'),
				imageUrl: '../../static/logo.png',
			}
		},
		onShareAppMessage(res) {
			return {
				title: this.$t('home.shareTitle')
			}
		},
		onLoad(e) {
			this.goods_id = e.id;
			this.where = {
				"category_id": this.goods_id,
				"is_on_sale": true
			}
			this.loadData({
				index: 0
			});
			this.loadCateList();
		},
		//加载更多
		onReachBottom() {
			this.currentPage++;
			this.loadData();
		},
		methods: {
			searchClick(e) {
				const regExp = new RegExp(e, 'i');
				this.where = {
					"category_id": this.goods_id,
					"is_on_sale": true,
					"name": regExp
				}
				this.currentPage = 1;
				this.loadData(99);
			},
			clearClick() {
				this.where = {
					"category_id": this.goods_id,
					"is_on_sale": true
				}
				this.currentPage = 1;
				this.loadData(99);
			},
			//加载分类
			loadCateList() {
				db.collection("opendb-mall-categories").where({
					"is_index_show": true
				}).orderBy("sort").get().then((res) => {
					let newData = res.result.data
					newData.forEach((item) => {
						if (item._id === this.goods_id) {
							newData.forEach((items) => {
								if (items._id == item.parent_id) {
									this.fatherName = items.name
									this.fatherCate = items
								}
								if (items.parent_id == item
									.parent_id) {
									this.cateList.push(items)
								}
							})
						}
					})
				})
			},
			//加载商品 ，上滑分页加载
			loadData(num) {
				if (num) {
					uni.showToast({
						title: this.$t('home.loading'),
						icon: 'loading',
						duration: 20000
					});
					let e = num.index;
					if (e != 2) {
						this.priceSortBadgeValue = 0;
					}
					if (e == 0) {
						this.orderBy = "add_date asc";
						this.currentPage = 1;
					} else if (e == 1) {
						this.orderBy = "total_sell_count desc";
						this.currentPage = 1;
					} else if (e == 2) {
						this.currentPage = 1;
						this.orderBy = this.orderBy === "crossed_price asc" ? "crossed_price desc" : "crossed_price asc";
						this.priceSortBadgeValue = this.priceSortBadgeValue === 1 ? 2 : 1;
					}
				}
				const skip = (this.currentPage - 1) * this.pageSize;
				db.collection("opendb-mall-goods").where(this.where).orderBy(this.orderBy).skip(skip)
					.limit(this.pageSize).get().then((res) => {
						const newData = res.result.data; // 获取新的数据
						if (this.currentPage === 1) {
							this.goodsList = newData; // 如果是第一页，清空原始数据列表
							this.oddgoodsList = this.goodsList.filter((item, index) => index % 2 === 1);
							this.evengoodsList = this.goodsList.filter((item, index) => index % 2 === 0);
						} else {
							this.goodsList = this.goodsList.concat(newData); // 否则追加数据到原始数据列表
							this.oddgoodsList = this.goodsList.filter((item, index) => index % 2 === 1);
							this.evengoodsList = this.goodsList.filter((item, index) => index % 2 === 0);
						}
						if (newData.length < 8) {
							this.loadingType = "noMore";
						} else {
							this.loadingType = "more";
						}
						uni.hideToast();
					})
			},
			//显示分类面板
			toast(type) {
				this.$refs.popup.open('right');
				this.sticky = false;
			},
			change(e) {
				this.sticky = !this.sticky
			},
			//分类点击
			changeCate(id) {
				this.currentPage = 1;
				this.goods_id = id;
				this.where = {
					"category_id": this.goods_id,
					"is_on_sale": true
				}
				this.loadData({
					index: 0
				});
				this.$refs.popup.close();
			},
			//详情
			navToDetailPage(id) {
				const self = this;
				uniCloud.callFunction({
					name: "jlg-record",
					data: {
						user_id: self.user_id,
						id: id
					}
				}).then((res) => {

				}).catch((err) => {
					uni.navigateTo({
						url: `/pages/product/product?id=${id}`
					})
					uni.showToast({
						title: this.$t('home.recordUpdateFailed'),
						icon: "none",
						duration: 600
					});
				});
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			getCurrentLang() {
				return uni.getStorageSync('CURRENT_LANG') || this.$i18n.locale || 'zh-Hans';
			},
			displayLangText(item, key) {
				if (!item) return '';
				const langKey = this.getCurrentLang() === 'en' ? `${key}_en` : key;
				return item[langKey] || item[key] || '';
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f3f3f3;
		height: 100%;
	}

	.content {}

	$show-lines: 1;
	@import '@/uni_modules/uv-ui-tools/libs/css/variable.scss';

	.waterfall-item {
		width: 103%;
		overflow: hidden;
		margin-top: 10px;
		border-radius: 6px;
		background-color: #fff;
	}

	.waterfall-item__ft {
		padding: 10rpx 10rpx 20rpx 10rpx;
		background: #fff;

		&__title {
			margin-bottom: 10rpx;
			line-height: 48rpx;
			font-weight: 700;

			.value {
				font-size: 32rpx;
				color: #303133;
			}
		}

		&__desc .value {
			font-size: 28rpx;
			color: #606266;
		}

		&__btn {
			padding: 10px 0;
		}
	}

	.allLike {
		margin: 0 3%;
	}

	.allLike-img {
		width: 100%;
		height: 340rpx;

		border-radius: 20rpx 20rpx 0 0;
	}

	.hot-price {
		font-size: 30rpx;
		color: #61A189;

		&:before {
			content: '￥';
			font-size: 26rpx;
		}
	}

	.price-nav {
		font-size: 24rpx;
		color: #989ba1;
	}

	.pop-van {
		width: 560rpx;
	}

	.pop-fathname {
		height: 85rpx;
		background: #efefef;
		line-height: 85rpx;
		font-size: 28rpx;
		border-radius: 5rpx;
		padding: 0rpx 20rpx;
		border-bottom: 1rpx solid #e0e0e0;
	}

	.pop-list {
		height: 85rpx;
		line-height: 85rpx;
		font-size: 28rpx;
		border-radius: 5rpx;
		padding: 0rpx 20rpx;
		border-bottom: 1rpx solid #e0e0e0;
	}
</style>
