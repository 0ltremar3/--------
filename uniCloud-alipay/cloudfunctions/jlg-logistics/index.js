const axios = require('axios');
const crypto = require('crypto');

exports.main = async (event) => {
	const {
		com,
		num,
	} = event; // 快递公司编码和快递单号
	const = customer: '' // 替换成您自己的授权码
	const = key: '' // 替换成您自己的key
	// 构建查询参数对象
	const param = {
		com,
		num,
		resultv2: '0', // 关闭行政区域解析功能，不返回出发、目的及当前城市信息
		show: '0', // 返回json格式数据
		order: 'desc', // 返回结果按时间降序排列
	};

	// 构建签名
	const signStr = JSON.stringify(param) + key + customer;
	const sign = crypto.createHash('md5').update(signStr).digest('hex').toUpperCase();

	// 构建请求链接
	const baseUrl = 'https://poll.kuaidi100.com/poll/query.do';
	const queryParams = `customer=${customer}&sign=${sign}&param=${encodeURIComponent(JSON.stringify(param))}`;
	const url = `${baseUrl}?${queryParams}`;

	try {
		// 发送GET请求到快递100接口
		const response = await axios.get(url);

		// 返回快递查询结果
		return response.data;
	} catch (error) {
		console.error('快递查询失败', error);
		return {
			message: '快递查询失败',
		};
	}
};