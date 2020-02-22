import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/home/BaseHome'
//cms页面管理模块
import pageList from '../views/cms/pageListMange'
import templateListManage from '../views/cms/templateListMange'
import siteListMange from '../views/cms/siteListMange'
//系统管理模块
import dictionaryListMange from  '../views/system/dictionaryListMange'

//课程模块
import courseManageList from  '../views/course/courseListManage'
import courseSetting from  '../views/course/courseSetting'
import courseBaseAdd from  '../views/course/courseBaseAdd'


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: '',
      redirect: '/login',//路由重定向
      hidden: true
    },
    {
      path: '/cms',
      name: 'CMS页面管理',
      icon: 'el-icon-document',//图标
      component: Home,
      hidden: false,//菜单是否隐藏
      meta: {requiresAuth: true},
      children: [
        {
          path: 'page/list', /*访问路径 /cms/page/list */
          name: '页面列表',
          component: pageList,
          hidden: false,
          meta: {title: '页面列表'}
        },
        {
          path: 'template/list',
          name: '模板管理',
          component: templateListManage,
          hidden: false,
          meta: {title: '模板管理'}
        },
        {
          path: 'site/list',
          name: '站点管理',
          component: siteListMange,
          hidden: false,
          meta: {title: '站点管理'}
        }
      ]
    },
    {
      path: '/courseManage',
      name: '课程管理',
      icon: 'el-icon-notebook-1',
      component: Home,
      hidden: false,
      meta: {requiresAuth: true},
      children: [
        {
          path: 'myCourse/list',
          name: '我的课程',
          component: courseManageList,
          hidden: false,
          meta: {title: '我的课程'}
        },
        {
          path: 'courseSetting/:id',
          name: '课程设置',
          component: courseSetting,
          hidden: true,
          meta: {title: '课程设置'}
        },
        {
          path:'courseBase/add',
          name: '新增课程',
          component: courseBaseAdd,
          hidden: false,
          meta: {title: '新增课程'}
        }
      ]
    },
    {
      path: '/mediaManage',
      name: '媒资管理',
      icon: 'el-icon-notebook-1',
      component: Home,
      hidden: false,
      meta: {requiresAuth: true},
      children: [
        {
          path: 'course/list',
          name: '课程列表',
          component: pageList,
          hidden: true,
          meta: {title: '课程列表'}
        },
        {
          path: 'course/list2',
          name: '页面列表',
          component: templateListManage,
          hidden: true
        }
      ]
    },
    {
      path: '/system',
      name: '系统管理',
      icon: 'el-icon-notebook-1',
      component: Home,
      hidden: false,
      meta: {requiresAuth: true},
      children: [
        {
          path: 'dictionary/list',
          name: '字典管理',
          component: dictionaryListMange,
          hidden: false,
          meta: {title: '字典管理'}
        }]
    }
  ]
})
