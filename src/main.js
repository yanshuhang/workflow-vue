// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import Vue from 'vue'
import router from './router'
import App from './App'
// import VueRouter from 'vue-router'

Vue.config.productionTip = false
Vue.use(ElementUI)
/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
