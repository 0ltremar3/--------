const call = {
	myFunction(name, data) {
		return new Promise((resolve, reject) => {
			uniCloud.callFunction({
				name: name,
				data: { ...data, uniIdToken: uni.getStorageSync('uni_id_token') },
				success: function(res) {
					resolve(res);
				},
				fail: function(err) {
					reject(err);
				}
			});
		});
	}
};

export default call;