import Vue from 'vue'
import VueResource from 'vue-resource'
import mint from 'mint-ui'
import router from './router'
import store from './store'

import App from './app.vue'

import 'mint-ui/lib/style.css'
import './static/css/neat-min.css'
import './assets/css/style.css'

Vue.use(mint)
Vue.use(VueResource)

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
})
