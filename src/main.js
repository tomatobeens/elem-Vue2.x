// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//js入口文件
//通过import引用第三方插件
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

//可以在main.js入口文件导入外部样式
import './common/stylus/index.styl'

Vue.config.productionTip = false

//0. 要告诉 vue 使用 vueRouter,相当全局注册
Vue.use(VueRouter)
Vue.use(VueResource)

// 1. 定义 (路由) 组件。
// 可以从其他文件 import 进来
import goods from './components/goods/goods.vue'
import seller from './components/seller/seller.vue'
import ratings from './components/ratings/ratings.vue'

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
const routes = [
  {
    path:'/',//当前目录
    component:goods
  },
  {
    path:'/goods',
    component:goods
  },
  {
    path:'/seller',
    component:seller
  },
  {
    path:'/ratings',
    component:ratings
  }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  linkActiveClass:'active',//router-link中选中时自动生成的类名
  routes
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
/* eslint-disable no-new */
const app = new Vue({
  el:'#app',
  router,
  render: h => h(App)
})