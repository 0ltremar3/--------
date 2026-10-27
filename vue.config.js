// uniCloud's default instance is injected by HBuilderX, not by the bare uni-app compiler.
module.exports = {
	configureWebpack() {
		let spaces;
		try {
			spaces = JSON.parse(process.env.UNI_CLOUD_PROVIDER || process.env.UNI_CLOUD_SPACES || '[]');
		} catch (_) {
			spaces = [];
		}
		if (!Array.isArray(spaces) || spaces.length !== 1 || !spaces[0] || !(spaces[0].spaceId || spaces[0].id)) {
			throw new Error('本项目需要一个默认 uniCloud 服务空间。请使用 HBuilderX 的运行/发行入口（或 HBuilderX cli publish mp-weixin --appid 项目AppID --upload false），不要直接执行 plugins/uniapp-cli/bin/uniapp-cli.js。');
		}
	}
};
