<template>
	<view class="container">
		<!-- #ifdef MP-WEIXIN -->
		<view class="wxress_van">
			<image class="wxress_img" src="../../static/temp/share_wechat.png"></image>
			<view class="wxress_text" @click="wxaddress">
				{{ $t('address.wechatAddress') }}</view>
		</view>
		<!-- #endif -->
		<uv-form labelPosition="left" :model="model" :rules="rules" ref="uvFormRef" :errorType="errorType">
			<uv-form-item :label="$t('address.consignee')" prop="ressData.name" borderBottom labelWidth="80">
				<uv-input v-model="model.ressData.name" :placeholder="$t('address.consigneePlaceholder')" border="none">
				</uv-input>
			</uv-form-item>
			<uv-form-item :label="$t('address.phone')" prop="ressData.mobile" borderBottom labelWidth="80">
				<uv-input type="number" v-model="model.ressData.mobile" :placeholder="$t('address.phonePlaceholder')" border="none">
				</uv-input>
			</uv-form-item>
			<uv-form-item :label="$t('address.region')" prop="ressData.area" borderBottom labelWidth="80">
				<view style="display: flex;flex-direction: row;">
					<uni-data-picker style="width: 100%;" :clear-icon="false" :border="false" :placeholder="icontext"
						:popup-title="$t('address.cityTitle')" collection="opendb-city-china" field="code as value, name as text"
						orderby="value asc" :step-searh="true" self-field="code" parent-field="parent_code"
						@change="onchange" v-model="model.ressData.area" />
				<!-- #ifdef MP-WEIXIN -->
				<view class="location-icon" @click="getLocation">
					<uni-icons type="location" color="#8E918D" size="28"></uni-icons>
				</view>
				<!-- #endif -->
				</view>
			</uv-form-item>
			<uv-form-item :label="$t('address.detail')" prop="ressData.addRess" borderBottom labelWidth="80">
				<uni-easyinput @input="ressstrclick" :placeholderStyle="derStyle" :inputBorder="false" type="textarea"
					:placeholder="$t('address.editDetailPlaceholder')" v-model="model.ressData.addRess"></uni-easyinput>
			</uv-form-item>
		</uv-form>
		<button class="but" @click="submit">{{ $t('address.save') }}</button>
	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		data() {
			return {
				model: {
					ressData: {
						name: '',
						mobile: '',
						area: '',
						addRess: ''
					}
				},
				rules: {
					'ressData.name': {
						type: 'string',
						required: true,
						max: 5,
						trigger: ['change', 'blur']
					},
					'ressData.mobile': [{
						required: true,
						trigger: ['change', 'blur']
					}, {
						validator: (rule, value) => {
							const regex = /^1[3456789]\d{9}$/; // 手机号码正则表达式
							const isValid = regex.test(value);
							return isValid;
						},
						trigger: ['change', 'blur']
					}],
					'ressData.area': {
						type: 'string',
						required: true,
						trigger: ['change', 'blur']
					},
					'ressData.addRess': {
						type: 'string',
						required: true,
						min: 3,
						trigger: ['change', 'blur']
					},
				},
				errorType: 'border-bottom',
				derStyle: "color:#b1babd;font-size:15px",
				ress_id: '',
				ressarr: '',
				ressstr: '',
				icontext: '',
			}
		},
		onLoad(e) {
			this.icontext = this.$t('address.locationPlaceholder');
			this.ress_id = e.id;
			this.ressData(e.id);
			this.dentifyText();
			// #ifndef MP-WEIXIN
			this.icontext = this.$t('address.selectAddress')
			// #endif
		},
		mounted() {
			this.$refs.uvFormRef.setRules(this.rules)
		},
		methods: {
			submit() {
				let that = this
				// 适配微信小程序
				this.$refs.uvFormRef.setRules(this.rules)
				this.$refs.uvFormRef.validate().then(res => {
					db.collection("jlg-goods-address").doc(this.ress_id).update({
						"name": that.model.ressData.name,
						"mobile": that.model.ressData.mobile,
						"area_code": that.model.ressData.area,
						"address": that.model.ressData.addRess,
						"formatted_address": that.ressarr + that.ressstr
					}).then(() => {
						uni.showToast({
							icon: 'none',
							title: this.$t('address.updateSuccess')
						})
						setTimeout(() => uni.navigateBack(), 500)
					}).catch((err) => {
						uni.showModal({
							content: err.message || this.$t('address.requestFailed'),
							showCancel: false
						})
					})
				}).catch(errors => {
					uni.showToast({
						icon: 'none',
						title: this.$t('address.validateFailed')
					})
				})
			},
			//自动识别剪切板内是否含有收货地址
			dentifyText() {
				let that = this
				uni.getClipboardData({
					success: function(res) {
						// 解析剪贴板内容
						const clipboardData = res.data;
						const addressInfo = that.parseAddress(clipboardData);
						// 自动填写收货地址字段
						if (addressInfo) {
							uni.showModal({
								content: that.$t('address.clipboardDetected'),
								confirmText: that.$t('address.fillIn'),
								cancelColor: "#7f7f7f",
								success: function(res) {
									if (res.confirm) {
										that.model.ressData.name = addressInfo.name;
										that.model.ressData.mobile = addressInfo.phone;
										let reg = /.+?(省|市|自治区|自治州|县|区)/g;
										let address = addressInfo.address.match(reg);
										let addresstext = addressInfo.address.replace(reg, '')
											.trim();
										that.ressarr = '';
										that.ressstr = '';
										that.ressarr += address[0] + address[1] + address[2];
										that.ressstr += addresstext;
										that.separate(address, addresstext);
									}
								}
							})
						}
					}
				});
			},
			// 解析剪贴板内容，提取姓名、电话和地址信息
			parseAddress(clipboardData) {
				//分隔符
				const separators = [' ', '，', ';', '、', '；', ','];
				let name = '';
				let phone = '';
				let address = '';

				for (let i = 0; i < separators.length; i++) {
					const separator = separators[i];
					const dataArray = clipboardData.split(separator);

					if (dataArray.length === 3) {
						let str1 = dataArray[0].trim();
						let str2 = dataArray[1].trim();
						let str3 = dataArray[2].trim();
						if (str1.match(/^\d{11}$/)) {
							phone = str1;
							name = str2.length < str3.length ? str2 : str3;
							address = str2.length < str3.length ? str3 : str2;
							break;
						} else if (str3.match(/^\d{11}$/)) {
							phone = str3;
							name = str1.length < str2.length ? str1 : str2;
							address = str1.length < str2.length ? str2 : str1;
							break;
						} else if (str2.match(/^\d{11}$/)) {
							phone = str2;
							name = str1.length < str3.length ? str1 : str3;
							address = str1.length < str3.length ? str3 : str1;
						}
					}
				}

				if (name && phone && address) {
					return {
						name,
						phone,
						address
					};
				}

				return null;
			},
			getLocation() {
				let that = this;
				uni.authorize({
					scope: 'scope.userLocation',
					success() {
						uni.chooseLocation({
							success: function(res) {
								//详细地址
								that.model.ressData.addRess = res.name;
								that.ressstr = '';
								that.ressstr += res.name;
								// 获取省市区
								let reg = /.+?(省|市|自治区|自治州|县|区)/g;
								let address = res.address.match(reg);
								if (!address) {
									uni.showToast({
										title: that.$t('address.selectLocation'),
										icon: "none",
										duration: 1600
									})
									return;
								}
								if (address[2] == null) {
									uni.showToast({
										title: that.$t('address.locationFailed'),
										icon: "none",
										duration: 1600
									})
									return;
								}
								that.ressarr = '';
								that.ressarr += address[0] + address[1] + address[2];
								that.separate(address);
							}
						});
					},
					fail() {
						// 授权失败，处理错误情况
					}
				});
			},
			separate(address, addresstext) {
				let that = this;
				if (addresstext) {
					that.model.ressData.addRess = addresstext;
				}
				db.collection("opendb-city-china").where({
					"name": address[2],
					"type": 2
				}).get().then((res) => {
					if (res.result.data.length > 1) {
						res.result.data.forEach((item, index) => {
							db.collection("opendb-city-china").where({
								"code": item.parent_code
							}).get().then((res) => {
								if (res.result.data[0].name ==
									address[1]) {
									that.model.ressData.area =
										item.code;
									return;
								}
							})
						})
					} else if (res.result.data.length == 1) {
						that.model.ressData.area = res.result.data[0].code;
					} else {
						uni.showToast({
							title: this.$t('address.manualLocation'),
							icon: "none",
							duration: 1600
						})
						return;
					}

				})
			},
			onchange(e) {
				this.ressarr = '';
				e.detail.value.forEach(item => {
					this.ressarr += item.text;
				})
			},
			ressstrclick(e) {
				this.ressstr = '';
				this.ressstr = e;
			},
			wxaddress() {
				let that = this
				uni.chooseAddress({
					success: function(res) {
						that.separate([0, res.cityName, res.countyName])
						that.model.ressData.name = res.userName;
						that.model.ressData.mobile = res.telNumber;
						that.model.ressData.addRess = res.detailInfo;
						that.ressarr = '';
						that.ressstr = '';
						that.ressarr += res.provinceName + res.cityName + res.countyName;
						that.ressstr += res.detailInfo;
					}
				})
			},
			ressData(id) {
				db.collection("jlg-goods-address").doc(id).get().then((res) => {
					this.model.ressData.name = res.result.data[0].name;
					this.model.ressData.mobile = res.result.data[0].mobile;
					this.model.ressData.area = res.result.data[0].area_code;
					this.model.ressData.addRess = res.result.data[0].address;
					this.ressarr = '';
					this.ressstr = '';
					db.collection("opendb-city-china").where({
						"code": res.result.data[0].area_code
					}).get().then((ress) => {
						db.collection("opendb-city-china").where({
							"code": ress.result.data[0].parent_code
						}).get().then((resss) => {
							db.collection("opendb-city-china").where({
								"code": resss.result.data[0].parent_code
							}).get().then((ressss) => {
								this.ressarr += ressss.result.data[0].name + resss.result
									.data[0].name + ress.result.data[0].name;
							})
						})
					})
					this.ressstr = res.result.data[0].address;
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $brand-surface;
	}

	.container {
		background-color: $brand-surface;
		box-sizing: border-box;
		min-height: 100vh;
	}

	/* 微信地址快捷行 */
	.wxress_van {
		display: flex;
		flex-direction: row;
		align-items: center;
		// justify-content: flex-end;
		padding: 20rpx 32rpx;
		// border-bottom: 1rpx solid $brand-border;
	}

	.wxress_img {
		width: 32rpx;
		height: 32rpx;
		flex-shrink: 0;
	}

	.wxress_text {
		margin-left: 12rpx;
		font-size: $font-meta;
		color: $brand-primary;
		font-weight: $font-product-title-weight;
		line-height: 1.5;
	}

	/* uv-form 整体左右留白与分割线颜色 */
	::v-deep .uv-form {
		padding: 0 32rpx;
	}

	/* 每行 form-item 统一行高和纵向 padding */
	::v-deep .uv-form-item__body {
		padding: 28rpx 0;
		min-height: 96rpx;
		align-items: center;
	}

	/* 标签文字风格 */
	::v-deep .uv-form-item__body__left .uv-form-item__body__left__content__label {
		font-size: $font-body;
		color: $brand-black;
		font-weight: $font-body-weight;
	}

	/* 输入框 placeholder 与值字号 */
	::v-deep .uv-input__content__field-wrapper__field,
	::v-deep .uv-input__content__field-wrapper input {
		font-size: $font-body;
		color: $brand-text;
	}

	/* 详细地址 textarea 对齐 */
	::v-deep .uv-form-item--textarea .uv-form-item__body {
		align-items: flex-start;
		padding-top: 28rpx;
	}

	/* 底部分割线与设计 token 保持一致 */
	::v-deep .uv-form-item--border-bottom::after {
		border-color: $brand-border;
	}

	/* 位置图标区域垂直居中 */
	.location-icon {
		display: flex;
		align-items: center;
		padding-left: 16rpx;
		flex-shrink: 0;
	}

	/* 提交按钮 */
	.but {
		@include shop-button(primary);
		display: block;
		width: calc(100% - 64rpx);
		margin: 48rpx 32rpx 64rpx;
		font-size: $font-product-title;
		font-weight: $font-product-title-weight;
		height: 88rpx;
		line-height: 88rpx;
	}

	button::after {
		border: none;
	}
</style>
