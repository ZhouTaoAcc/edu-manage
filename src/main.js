// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//  将vue-resource在vue中绑定，自动在vue对象实例上注入一个$http对象就可以使用ajax方法了
import vueResource from 'vue-resource';

Vue.config.productionTip = false;

/* eslint-disable no-new */
// 在Vue中全局使用mintui
Vue.use(ElementUI);
Vue.use(Vuex);
Vue.use(vueResource);

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
