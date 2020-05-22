import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/home/BaseHome'
//cms页面管理模块
import pageList from '../views/cms/pageListMange'
import templateListManage from '../views/cms/templateListMange'
import siteListMange from '../views/cms/siteListMange'
//系统管理模块
import dictionaryListMange from '../views/system/dictionaryListMange'

//课程管理模块
import courseManageList from '../views/course/courseListManage'
import courseSetting from '../views/course/courseSetting'
import courseBaseAdd from '../views/course/courseBaseAdd'
//课程管理->课程设置
import courseIndex from '../views/course/components/courseIndex' //课程主页
import courseBaseInfo from '../views/course/components/courseBaseInfo'//基本信息
import coursePicture from '../views/course/components/coursePicture'//课程图片
import coursePlan from '../views/course/components/coursePlan'//课程计划
import courseMarketInfo from '../views/course/components/courseMarketInfo'//营销信息
import courseTeacher from '../views/course/components/courseTeacher'//教师信息
import coursePublish from '../views/course/components/coursePublish'//课程发布
//媒质管理模块
import mediaListManage from '../views/media/mediaListManage'
import mediaUpload from '../views/media/mediaUpload'
//登录页面
import loginIndex from '../views/login/loginIndex'
import error from '../components/error'
import welcome from '../components/welcome'
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: '',
      redirect:'/login',
      hidden: true
    },
    {
      path: '/login',//登录页
      name: 'login',
      component: loginIndex,
      hidden: true
    },
    {
      path: '/',
      name: '',
      component: Home,
      hidden: true,
      children: [
        {
          path: 'error', //错误页面
          name: 'error',
          component: error,
          hidden: true
        },
        {
          path: 'welcome',//系统首页
          name: 'welcome',
          component: welcome,
          hidden: true
        }
      ]
    },
    {
      path: '/cms',
      name: 'CMS页面管理',
      icon: 'el-icon-document',//图标
      component: Home,
      hidden: false,//菜单是否隐藏
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
      children: [
        {
          path: 'myCourse/list',
          name: '我的课程',
          component: courseManageList,
          hidden: false,
          meta: {title: '我的课程'}
        },
        {
          path: 'courseSetting',
          name: '课程设置',
          component: courseSetting,
          hidden: true,
          meta: {title: '课程设置'},
          children: [
            {
              path: 'courseIndex',
              name: '课程首页',
              component: courseIndex,
              hidden: false
            },
            {
              path: 'baseInfo',
              name: '基本信息',
              component: courseBaseInfo,
              hidden: false
            },
            {
              path: 'picture',
              name: '课程图片',
              component: coursePicture,
              hidden: false
            },
            {
              path: 'marketInfo',
              name: '营销信息',
              component: courseMarketInfo,
              hidden: false
            },
            {
              path: 'plan',
              name: '课程计划',
              component: coursePlan,
              hidden: false
            },
            {
              path: 'teacher',
              name: '教师信息',
              component: courseTeacher,
              hidden: false
            },
            {
              path: 'publish',
              name: '发布课程',
              component: coursePublish,
              hidden: false
            }
          ]
        },
        {
          path: 'courseBase/add',
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
      icon: 'el-icon-video-camera',
      component: Home,
      hidden: false,
      children: [
        {
          path: 'myMedia/list',
          name: '我的媒资',
          component: mediaListManage,
          hidden: false,
          meta: {title: '媒资列表'}
        },
        {
          path: 'media/upload',
          name: '上传媒资',
          component: mediaUpload,
          meta: {title: '上传媒资'},
          hidden: false
        }
      ]
    },
    {
      path: '/system',
      name: '系统管理',
      icon: 'el-icon-setting',
      component: Home,
      hidden: false,
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
