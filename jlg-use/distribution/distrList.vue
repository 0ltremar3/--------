<template>
	<page-meta :page-style="'overflow:'+(show?'hidden':'visible')"></page-meta>
	<view class="content">
		<!-- #ifdef MP-WEIXIN -->
		<zhangyu-qrcode-poster style="position: absolute;z-index: 9999;" ref="poster" :title="hbname" :headerImg="hbimg"
			:price="hbprice / 100" :username="usname" :avcimgs="usimg" :origprice="hborigprice/100"
			@showClick="showClick"></zhangyu-qrcode-poster>
		<uqrcode :hide="true" ref="uqrcode" canvas-id="qrcode"
			:value="`http://test.slwjd.com?id=${goods_id}&fxsid=${user_id}`" :options="{ margin: 10 }"></uqrcode>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<zhangyu-qrcode-poster style="position: absolute;z-index: 9999;" ref="poster" :title="hbname"
			:price="hbprice / 100" :username="usname" :origprice="hborigprice/100"
			@showClick="showClick"></zhangyu-qrcode-poster>
		<uqrcode :hide="true" ref="uqrcode" canvas-id="qrcode"
			:value="`http://test.slwjd.com/pages/product/product?id=${goods_id}&fxsid=${user_id}`"
			:options="{ margin: 10 }"></uqrcode>
		<!-- #endif -->

		<view style="background: #fff;padding:10rpx 20rpx;">
			<uv-search placeholder="请输入商品名称搜索" shape="round" :showAction="false" @search="searchClick"
				@clear="clearClick"></uv-search>
		</view>
		<uv-sticky bgColor="#fff" :custom-nav-height="0">
			<uv-tabs :list="list" lineColor="#1C7231" @click="loadData" :activeStyle="{color: '#1C7231'}"
				:scrollable="false">
			</uv-tabs>
		</uv-sticky>
		<view v-if="name.length > 0" class="coupon-name">{{name}}</view>
		<uv-empty v-if="evengoodsList.length == 0" mode="data" icon="/static/temp/shwk.png" text="暂无商品"></uv-empty>
		<view v-else class="allLike mb-30">
			<uv-waterfall class="dis-flex flex-x-around" ref="waterfall" left-gap="0" right-gap="0" column-gap="8"
				@changeList="changeList">
				<!-- 第一列数据 -->
				<template v-slot:list1>
					<!-- 为了磨平部分平台的BUG，必须套一层view -->
					<view>
						<view v-for="(item, index) in evengoodsList" :key="index" class="waterfall-item">
							<view @click="navToDetailPage(item._id)" class="waterfall-item__image">
								<image :src="item.goods_thumb" mode="scaleToFill" class="allLike-img">
								</image>
							</view>
							<view class="waterfall-item__ft">
								<view @click="navToDetailPage(item._id)" class="mb-10 f-28 ellipsis">
									{{item.name}}
								</view>
								<view class="waterfall-item__ft__desc mt-10 uv-line-2 price-nav">
									<jlg-minPrice @click="navToDetailPage(item._id)"
										:min-price="item.suks.reduce((min, suk) => parseInt(suk.price) < parseInt(min.price) ? suk : min).price"
										maxSize="32rpx" min-size="26rpx"></jlg-minPrice>
									<button
										@click="shareClick(item.goods_thumb,item.name,item.suks.reduce((min, suk) => parseInt(suk.price) < parseInt(min.price) ? suk : min).price,item.crossed_price,item._id)"
										class="uni-but">生成海报</button>
								</view>
							</view>
						</view>
					</view>
				</template>
				<!-- 第二列数据 -->
				<template v-slot:list2>
					<!-- 为了磨平部分平台的BUG，必须套一层view -->
					<view>
						<view v-for="(item, index) in oddgoodsList" :key="index" class="waterfall-item">
							<view @click="navToDetailPage(item._id)" class="waterfall-item__image">
								<image :src="item.goods_thumb" mode="scaleToFill" class="allLike-img">
								</image>
							</view>
							<view class="waterfall-item__ft">
								<view @click="navToDetailPage(item._id)" class="mb-10 f-28 ellipsis">
									{{item.name}}
								</view>
								<view class="waterfall-item__ft__desc mt-10 uv-line-2 price-nav">
									<jlg-minPrice @click="navToDetailPage(item._id)"
										:min-price="item.suks.reduce((min, suk) => parseInt(suk.price) < parseInt(min.price) ? suk : min).price"
										maxSize="32rpx" min-size="26rpx"></jlg-minPrice>
									<button
										@click="shareClick(item.goods_thumb,item.name,item.suks.reduce((min, suk) => parseInt(suk.price) < parseInt(min.price) ? suk : min).price,item.crossed_price,item._id)"
										class="uni-but">生成海报</button>
								</view>
							</view>
						</view>
					</view>
				</template>
			</uv-waterfall>
		</view>
		<uni-load-more v-if="evengoodsList.length > 0" :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	const db = uniCloud.database();
	import Poster from "@/components/zhangyu-qrcode-poster/zhangyu-qrcode-poster.vue";
	export default {
		components: {
			Poster
		},
		data() {
			return {
				show: false,
				loadingType: 'more', //加载更多状态
				goodsList: [],
				oddgoodsList: [],
				evengoodsList: [],
				goods_id: "",
				orderBy: "add_date asc",
				currentPage: 1, // 当前页码
				pageSize: 8, // 每页数据条数
				goodsArr: [],
				name: '',
				user_id: uniCloud.getCurrentUserInfo().uid,
				where: '',
				sticky: true,
				list: [{
					name: '综合排序',
				}, {
					name: '销量优先',
				}, {
					name: '价格',
					badge: {
						isDot: true,
						value: 0,
					}
				}],
				usname: '',
				usimg: '',
				hbimg: '',
				hbname: '',
				hbprice: 0,
				hborigprice: 0,
			};
		},
		onLoad() {
			this.where = {
				"is_on_sale": true
			}

			this.loadData(99);
			//获取用户头像、昵称用于分享海报
			db.collection("uni-id-users").doc(this.user_id).field("nickname,avatar_file").get().then((res) => {
				this.usname = res.result.data[0].nickname ? res.result.data[0].nickname : '匿名用户';
				this.usimg = res.result.data[0].avatar_file ? res.result.data[0].avatar_file.url :
					'https://mp-f3674fcb-abe5-48a7-af28-4ce3b0ee209a.cdn.bspapp.com/image/logo.png';
			})
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
					"is_on_sale": true,
					"name": regExp
				}
				this.currentPage = 1;
				this.loadData(99);
			},
			clearClick() {
				this.where = {
					"is_on_sale": true
				}
				this.currentPage = 1;
				this.loadData(99);
			},
			//加载商品 ，上滑分页加载
			loadData(num) {
				if (num) {
					uni.showToast({
						title: '加载中',
						icon: 'loading',
						duration: 20000
					});
					let e = num.index;
					if (e != 2) {
						this.list[2].badge.value = 0;
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
						this.list[e].badge.value = this.list[e].badge.value === 1 ? 2 : 1;
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
						title: "浏览记录未成功更新",
						icon: "none",
						duration: 600
					});
				});
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			shareClick(img, gsname, price, origreice, id) {
				let that = this;
				that.show = true;
				that.goods_id = id;
				that.hbimg = img;
				that.hbname = gsname;
				that.hbprice = price;
				that.hborigprice = origreice;
				setTimeout(() => {
					that.$refs.uqrcode.toTempFilePath({
						success: res => {
							that.$refs.poster.showCanvas(res.tempFilePath);
						}
					});
				}, 500)
			},
			showClick(e) {
				this.show = e;
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
		color: #1C7231;

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

	.coupon-name {
		width: 96%;
		height: 75rpx;
		background-color: #1C7231;
		border-radius: 20rpx;
		line-height: 76rpx;
		color: #fff;
		margin: auto;
		margin-top: 20rpx;
		text-align: center;
	}

	.uni-but {
		height: 59rpx;
		line-height: 60rpx;
		font-size: 27rpx;
		background: #1C7231;
		color: #fff;
		margin-top: 11rpx;
	}
</style>
