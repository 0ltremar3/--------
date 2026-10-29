const db = uniCloud.database();

exports.main = async (event, context) => {
	const functionName = event.functionName;
	const data = event.data;
	try {
		let result;

		if (functionName === 'cetagories') {
			result = await getCetagories();
		} else if (functionName === 'seckilldata') {
			result = await getSeckillData();
		} else if (functionName === 'goodsdata') {
			result = await getGoodsData(data);
		} else if (functionName === 'catedata') {
			result = await getCateData();
		} else if (functionName === 'mrgoodsdata') {
			result = await getmrGoodsData(data);
		} else {
			throw new Error('Invalid functionName');
		}

		return result;
	} catch (err) {
		throw err;
	}
};

async function getCetagories() {
	try {
		const res = await db.collection("jlg-homepage-cetagories").where({ is_index_show: true }).orderBy("sort", "asc").get();
		return res.data;
	} catch (err) {
		throw err;
	}
}

async function getSeckillData() {
	try {
		const res = await db.collection("jlg-goods-seckill").get();
		const a = Array.isArray(res.data) ? res.data : [];

		const currentTime = Date.now();
		let filteredData = [];

		// 使用数组的过滤（filter）方法筛选秒杀中的数据
		filteredData = a.filter(item => {
			return item && item.start_time <= currentTime && item.end_time > currentTime;
		});

		// 如果没有秒杀中的，查找开始时间距离当前时间最近的数据
		if (filteredData.length === 0) {
			let closestIndex = -1;
			let closestDiff = Infinity;

			a.forEach((item, index) => {
				if (item && item.start_time >= currentTime && item.end_time > currentTime) {
					let diff = item.start_time - currentTime;
					if (diff < closestDiff) {
						closestIndex = index;
						closestDiff = diff;
					}
				}
			});

			// 获取最近的数据项
			if (closestIndex !== -1) {
				filteredData.push(a[closestIndex]);
			}
		}

		// 处理剩余时间
		let hours = 0;
		let minutes = 0;
		let seconds = 0;
		let control = false;

		if (filteredData[0]) {
			if (currentTime >= filteredData[0].start_time) {
				let endTime = filteredData[0].end_time - currentTime;
				let sseconds = Math.floor(endTime / 1000);
				let sminutes = Math.floor(sseconds / 60);
				let shours = Math.floor(sminutes / 60);

				// 转换为剩余的分钟和秒
				sminutes %= 60;
				sseconds %= 60;
				hours = shours;
				minutes = sminutes;
				seconds = sseconds;
				control = true;
			} else {
				let endTime = filteredData[0].start_time - currentTime;
				let sseconds = Math.floor(endTime / 1000);
				let sminutes = Math.floor(sseconds / 60);
				let shours = Math.floor(sminutes / 60);

				// 转换为剩余的分钟和秒
				sminutes %= 60;
				sseconds %= 60;
				hours = shours;
				minutes = sminutes;
				seconds = sseconds;
				control = false;
			}
		}

		return {
			filteredData: filteredData,
			hours: hours,
			minutes: minutes,
			seconds: seconds,
			control: control
		};
	} catch (err) {
		throw err;
	}
}

async function getGoodsData(data) {
	try {
		const res = await db.collection("opendb-mall-goods").where(data.where).skip(data.skip).limit(data
				.pageSize)
			.get();
		return res.data;
	} catch (err) {
		throw err;
	}
}

async function getmrGoodsData(data) {
	try {
		let msres = await db.collection("opendb-mall-goods").where({
			is_on_sale: true,
			is_new: true
		}).get();
		let rxres = await db.collection("opendb-mall-goods").where({
			is_on_sale: true,
			is_hot: true
		}).limit(10).get();
		const res = {
			ms: msres.data,
			rx: rxres.data
		}
		return res;
	} catch (err) {
		throw err;
	}
}

async function getCateData() {
	try {
		const res = await db.collection("opendb-mall-categories")
			.where({
				is_index_show: true
			}).orderBy("sort", "asc")
			.get();

		const flist = [];
		const tlist = [];

		res.data.forEach((item, index) => {
			if (item.parent_id.length === 0) {
				flist.push(item);
			} else {
				tlist.push(item);
			}
		});

		tlist.forEach((item) => {
			const parentIndex = flist.findIndex((parent) => parent._id === item.parent_id);
			if (parentIndex !== -1) {
				if (!flist[parentIndex].childrens) {
					flist[parentIndex].childrens = [];
				}
				flist[parentIndex].childrens.push(item);
			}
		});

		return {
			flist: flist
		};
	} catch (err) {
		throw err;
	}
}
