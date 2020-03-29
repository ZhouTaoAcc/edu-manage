// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//引入播放器
import VideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css';// 第一个是videoJs的样式，后一个是vue-video-player的样式
import 'vue-video-player/src/custom-theme.css';
import 'videojs-contrib-hls' //hls插件
Vue.use(VideoPlayer);


//  将vue-resource在vue中绑定，自动在vue对象实例上注入一个$http对象就可以使用ajax方法了
import vueResource from 'vue-resource';

Vue.config.productionTip = false;

/* eslint-disable no-new */
Vue.use(ElementUI);
Vue.use(Vuex);
Vue.use(vueResource);

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
