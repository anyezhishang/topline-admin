import Vue from 'vue'
import App from './App.vue'
Vue.config.productionTip = false
// 导入饿了么UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 导入全局基础样式
import './assets/base.css'


// 只要导入就行了，就会去里面执行它的代码
import './utils/http'


// 导入路由
import router from './router/' //默认找index.js或者index.vue
// 导入store
import store from './store/'

new Vue({
  // 挂载路由到这里
  router,
  // 挂载store
  store,
  render: h => h(App),
}).$mount('#app')
