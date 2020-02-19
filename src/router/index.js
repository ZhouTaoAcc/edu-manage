import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home/BaseHome'
import pageList from '@/views/cms/pageListMange'
import templateListManage from '../views/cms/templateListMange'
import siteListMange from '../views/cms/siteListMange'


Vue.use(Router);

export default new Router({
  routes: [
    {
      path:'/',
      name:'',
      redirect: '/cms',//路由重定向
      hidden:true //菜单是否隐藏
    },
    {
      path: '/cms',
      name: 'CMS页面管理',
      icon:'el-icon-document',
      component: Home,
      meta: { requiresAuth: true },
      children:[
        {
          path:'/page/list',
          name:'页面列表',
          component: pageList,
          hidden:false,
          meta: { title: '页面列表' }
        },
        {
          path:'/template/list',
          name:'模板管理',
          component: templateListManage,
          hidden:false,
          meta: { title: '模板管理' }
        },
        {
          path:'/site/list',
          name:'站点管理',
          component: siteListMange,
          hidden:false,
          meta: { title: '站点管理' }
        },
        {
          path:'/page/list4',
          name:'页面列表4',
          component: pageList,
          hidden:true
        },
        {
          path:'/page/list5',
          name:'页面列表',
          component: pageList,
          hidden:false
        }
      ]
    },
    {
      path: '/course',
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
