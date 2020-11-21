import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './plugins/element'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import axios from 'axios'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies)


// 配置请求的根路径
axios.defaults.baseURL = 'http://localhost:10010/api'
// 默认axios携带Cookie设置为true
axios.defaults.withCredentials=true

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
    return Promise.reject(error.response)   // 这里我删除了.data
  }
)

// //这两个需要设置，不然前端向后台不能传递数据
// Vue.http.options.emulateJSON = true
// Vue.http.options.emulateHTTP = true

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')



