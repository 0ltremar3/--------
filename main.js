import App from './App'
import i18n from './lang/i18n'
import $func from './common/callFunc.js'

Vue.config.productionTip = false;
App.mpType = 'app'
Vue.prototype.$func = $func; // 将 $func 对象添加到 Vue 实例的原型中

// new Vue({
// 	render: (h) => h(App),
// }).$mount('#app');



// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	i18n,
	...App
})
app.$mount()
// #endif


// #ifdef VUE3
import {
	createSSRApp
} from 'vue'

export function createApp() {
	const app = createSSRApp(App)
	app.use(i18n)
	return {
		app
	}
}
// #endif