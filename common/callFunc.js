const call = {
	myFunction(name, data) {
		return new Promise((resolve, reject) => {
			uniCloud.callFunction({
				name: name,
				data: data,
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