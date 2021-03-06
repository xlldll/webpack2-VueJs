import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import routes from './routes'

Vue.use(VueRouter)

// 滚动条滚回顶部
const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
const router = new VueRouter({
    mode:'history',
    scrollBehavior,
    routes
})
// Todo-vuerouter:全局路由钩子 beforeEach see：http://www.shouce.ren/api/view/a/11762
// 拦截需要验证登录的页面以及登陆之后访问登录和注册的页面
router.beforeEach(({meta, path}, from, next) => {
  store.dispatch('showProgress', 0)
  // NProgress.start();
	console.log(`beforeEach->meta`, meta)
	console.log(`beforeEach->path`, path)
	// let {auth = true} = meta
	// todo-server：前后端未能分离，因此改为false
	let {auth = false} = meta
  let isLogin = Boolean(store.state.token)
	console.log(`beforeEach->auth`, auth)
  // 访问不需要权限的设置meta:false,注册也要设置成meta:false
  if (auth && !isLogin && path !== '/login') {
    return next({path:'/login'})
  }
  // 如果登录了以后再访问reg和login则路由到Home
  if (isLogin && (path == '/login' || path == '/reg')) {
    return next({path:'/admin'})
  }
  // 未登录的情况下访问reg则直接路由
  next()
})
// router.afterEach(route=>{
//   NProgress.done(true);
// })
export default router
