import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './plugins/element'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import axios from 'axios'


// 配置请求的根路径
axios.defaults.baseURL = 'http://localhost:3000'

// 定义全局默认配置
axios.defaults.headers.common['token'] = store.state.token;

// 注册原型
Vue.prototype.$http = axios
Vue.prototype.$store = store
Vue.config.productionTip = false

// 在请求头中添加token, 通过请求拦截器实现
axios.interceptors.request.use(config => {
  if (store.state.token) {
    config.headers.common['token'] = store.state.token
  }
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(
  response => {
    return response
  }, error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          this.$store.common('del_token')
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
          })
      }
    }
    return Promise.reject(error.response.data)
  }
)



new Vue({
  router,
  render: h => h(App),
}).$mount('#app')



