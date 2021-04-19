import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

Vue.use(VueCodemirror, /* {
  options: { theme: 'base16-dark', ... },
  events: ['scroll', ...]
} */);

Vue.use(ViewUI);


Vue.config.productionTip = false
Vue.prototype.$axios = axios

// /*第一层if判断生产环境和开发环境*/
// if (process.env.NODE_ENV === 'production') {
//     //production 生产环境
//     axios.defaults.baseURL = 'http://api.xinggeyun.com';
// } else {
//     //dev 开发环境
//     axios.defaults.baseURL = 'http://localhost:8081/';
// }
axios.defaults.baseURL = '/api'  //添加
axios.defaults.headers.post['Content-Type'] = 'application/json'  //添加

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
