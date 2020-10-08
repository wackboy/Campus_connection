import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import FreeTalk from './components/FreeTalk.vue'
import Academic from './components/Academic.vue'
import SeekFriend from './components/SeekFriend.vue'
import Register from './components/Register.vue'
import EditInfo from './components/editInfo.vue'
import store from './store'

Vue.use(Router)


if (sessionStorage.getItem('token')) {
    store.commit('set_token', sessionStorage.getItem('token'))
}

const router = new Router ({
    // 改变url的生成方式（原来是哈希），后端可能要做相应的调整
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: Login
        }, 
        {
            path: '/register',
            component: Register
        },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                {
                    path: '/welcome',
                    component: Welcome
                },
                {
                    path: '/freeTalk',
                    component: FreeTalk
                },
                {
                    path: '/academic',
                    component: Academic
                },
                {
                    path: '/seekFriend',
                    component: SeekFriend
                },
                {
                    path: '/EditInfo',
                    component: EditInfo
                }
            ]
        }
    ]
})


// 挂载路由导航守卫， 待写
// router.beforeEach((to, from, next) => {
//     if(to.path == '/login') next()
//     // 获取token
// })

export default router








