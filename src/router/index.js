/* eslint-disable indent */
import Vue from 'vue'
import Router from 'vue-router'
// 添加Login组件
import Login from '../components/Login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/user/users.vue'
import rights from '../components/power/rights.vue'
import roles from '../components/power/roles.vue'
import cate from '../components/goods/categories.vue';

Vue.use(Router)

const router = new Router({
    routes: [
        {
            // 当输入的路径为"/",重新定向到Login页面
            path: '/',
            redirect: 'Login'
        },
        {
            // 添加login的路由
            path: '/Login',
            component: Login
        },
        {
            // 添加login的路由
            path: '/home',
            component: home,
            redirect: '/welcome',
            // 将其他页面在home页面中展示
            children: [
                { path: '/welcome', component: welcome },
                { path: '/users', component: users },
                { path: '/rights', component: rights },
                { path: '/roles', component: roles },
                { path: '/categories', component: cate }
            ]


        },
    ]
})

// 挂载路由导航首位,如果没有登录，那么直接退出
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 从哪个路径跳转过来
    // next 是一个函数，表示放行
    // next() 代表放行 next('/login')代表强制跳转到login
    if (to.path === '/login') return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router
