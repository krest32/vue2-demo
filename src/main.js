// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// 全部使用Element Ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
// 引入全局樣式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 引入axios
import axios from 'axios'
import ZKTable from 'vue-table-with-tree-grid'



Vue.config.productionTip = false
// 使用ElementUI
Vue.use(ElementUI)

// 指定axios 访问的跟路基
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 增加一个axios拦截器处理请求

axios.interceptors.request.use(config => {
    // 在header中添加一个Authorization字段，匹配token值
    config.headers.Authorization = window.sessionStorage.getItem('token')
    console.log(config)
    return config;
})



Vue.prototype.$http = axios

Vue.component('tree-table', ZKTable)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})
