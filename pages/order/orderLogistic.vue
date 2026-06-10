<template>
	<view>
		<uv-empty v-if="wlInfo.list.length == 0" mode="data" icon="/static/temp/shwk.png" text="暂无物流信息"></uv-empty>
		<logistics v-else :wlInfo="wlInfo"></logistics>
	</view>
</template>

<script>
	import logistics from '@/components/xinyu-logistics/xinyu-logistics.vue'
	export default {
		components: {
			logistics
		},
		data() {
			return {
				wlInfo: {
					delivery_status: 2, //快递状态 1已签收 2配送中
					post_name: '韵达快递', //快递名称
					logo: 'https://cdn.kuaidi100.com/images/all/56/yunda.png', //快递logo
					exp_phone: '95546', //快递电话
					post_no: '4304678557725', //快递单号
					addr: '江西省南昌市青云谱区', //收货地址
					//物流信息
					list: []
				}
			}
		},
		onLoad(e) {
			let logisticData = JSON.parse(e.data);
			switch (e.loginame) {
				case '极兔速递':
					this.wlInfo.logo = 'https://cdn.kuaidi100.com/images/all/56/jtexpress.png';
					this.wlInfo.exp_phone = '956025';
					break;
				case '京东物流':
					this.wlInfo.logo = 'https://cdn.kuaidi100.com/images/all/56/jd.png';
					this.wlInfo.exp_phone = '950616';
					break;
				case '圆通速递':
					this.wlInfo.logo = 'https://cdn.kuaidi100.com/images/all/56/yuantong.png';
					this.wlInfo.exp_phone = '95554';
					break;
				case '中通快递':
					this.wlInfo.logo = 'https://cdn.kuaidi100.com/images/all/56/zhongtong.png';
					this.wlInfo.exp_phone = '95311';
					break;
				case '申通快递':
					this.wlInfo.logo = 'https://cdn.kuaidi100.com/images/all/56/shentong.png';
					this.wlInfo.exp_phone = '95543';
					break;
				case '韵达快递':
					this.wlInfo.logo = 'https://cdn.kuaidi100.com/images/all/56/yunda.png';
					this.wlInfo.exp_phone = '95546';
					break;
				case '百世快递':
					this.wlInfo.logo = 'https://cdn.kuaidi100.com/images/all/56/huitongkuaidi.png';
					this.wlInfo.exp_phone = '95320';
					break;
				case '邮政快递':
					this.wlInfo.logo = 'https://cdn.kuaidi100.com/images/all/56/youzhengguonei.png';
					this.wlInfo.exp_phone = '11183';
					break;
				case '德邦快递':
					this.wlInfo.logo = 'https://cdn.kuaidi100.com/images/all/56/debangwuliu.png';
					this.wlInfo.exp_phone = '95353';
					break;
				default:
					// 如果loginame不匹配任何一个case，可以在default中设置默认的值或错误处理
					break;
			}
			if (logisticData.state == '3') {
				this.wlInfo.delivery_status = 1
			}
			this.wlInfo.post_name = e.loginame;
			this.wlInfo.post_no = e.loginum;
			this.wlInfo.addr = e.address;
			this.wlInfo.list = logisticData.data;
		},
		methods: {

		}
	}
</script>

<style>

</style>