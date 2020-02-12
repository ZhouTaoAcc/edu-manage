import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home/BaseHome'
import pageList from '@/views/cms/pageListMange'




Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: '后台管理系统',
      icon:'el-icon-document',
      component: Home,
      children:[
        {
          path:'cms/page/list',
          name:'页面列表',
          component: pageList,
          hidden:false
        },
        {
          path:'cms/page/list2',
          name:'页面列表',
          component: pageList,
          hidden:false
        },
        {
          path:'cms/page/list3',
          name:'页面列表',
          component: pageList,
          hidden:false
        },
        {
          path:'cms/page/list4',
          name:'页面列表',
          component: pageList,
          hidden:false
        },
        {
          path:'cms/page/list5',
          name:'页面列表',
          component: pageList,
          hidden:false
        }
      ]
    },
    {
      path: '/',
      name: '课程管理',
      icon:'el-icon-notebook-1',
      component: Home,
      children:[
        {
          path:'cms/page/list',
          name:'页面列表',
          component: pageList,
          hidden:false
        },
        {
          path:'cms/page/list2',
          name:'页面列表',
          component: pageList,
          hidden:false
        },
        {
          path:'cms/page/list3',
          name:'页面列表',
          component: pageList,
          hidden:false
        },
        {
          path:'cms/page/list4',
          name:'页面列表',
          component: pageList,
          hidden:false
        },
        {
          path:'cms/page/list5',
          name:'页面列表',
          component: pageList,
          hidden:false
        }
      ]
    }
  ]
})
