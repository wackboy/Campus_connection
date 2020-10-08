import Vue from 'vue'
import Vuex from 'vuex'

/* 
    使用vuex可以保存类似于登录信息等一系列会被多次访问的数据
*/

// 1. 安装插件
Vue.use(Vuex)

// 2. 创建对象
const store = new Vuex.Store({
    state: {
        isLogin: false,
        token: '',
        editBox: 'display:none',
        userId: '',
        comment_list: [],
    },
    mutations: {
        set_token(state, token) {
            state.token = token
            sessionStorage.token = token
        },
        del_token() {
            state.token = ''
            sessionStorage.removeItem('token')
        },
        set_userId(state, userId) {
            state.userId = userId
            sessionStorage.userId = userId
        }
    },
    actions: {

    },
    getters: {

    },
    modules: {

    }
})

// 3. 导出store对象
export default store



