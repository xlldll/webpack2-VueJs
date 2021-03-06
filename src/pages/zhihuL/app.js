// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'
import VueLazyLoad from 'vue-lazyload'

import App from './app.vue'
import Router from './router/router'
import store from './vuex/store'

import './common/base.scss'

const errorImg = require('./static/error.jpg')
const loadingImg = require('./static/loading.gif')

Vue.use(VueRouter)
Vue.use(VueLazyLoad, {
	error: `${errorImg}`,
	loading:  `${loadingImg}`,
	attempt: 1
})

const router = new VueRouter({
	routes: Router.routes
})
// To next hook until all done
router.beforeEach((to, from, next) => {
	next()
})

sync(store, router)

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	...App
})
