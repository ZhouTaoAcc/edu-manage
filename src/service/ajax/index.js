require('es6-promise').polyfill();
import axios from 'axios'
import Utils from '../../../utils/utils.js'
import router from '../../router/index'
import {
  Message
} from 'element-ui'

axios.defaults.withCredentials = true; //跨域
axios.defaults.timeout = 100000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www=form-urlencoded';
// 请求之前拦截
axios.interceptors.request.use(config => {
  // 判断token
  if (Utils.getJwt()) {
    config.headers.Authorization = 'Bearer ' + Utils.getJwt();
  }
  return config
}, error => {
  return Promise.reject(error)
});
// 全局拦截响应
axios.interceptors.response.use((response) => {
  if(response.data.code===10001){ //网关校验之后响应的数据
    Message.error('身份过期，重新登陆');
    router.replace({path: '/login'})
  }
  return response
}, error => {
  if (error.response) {
    if (error.response.status === 401) {
      // 这种情况一般没有登录
      router.replace({path: '/login'})
    } else if (error.response.status === 403) {
      // 提示无权限等
      Message.error('权限不足，拒绝访问');
      router.replace({path: '/error'})
    } else {
      // 其他错误处理
    }
  }
  return Promise.reject(error)
});


export default {
  //get请求
  requestGet(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.get(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  //get请求不带参数
  requestQuickGet(url) {
    return new Promise((resolve, reject) => {
      axios.get(url).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  //post请求
  requestPost(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.post(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  //post请求
  requestPostForm(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.post(url, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then(res => {
        resolve(res.data)//注意res是axios封装的对象，res.data才是服务端返回的信息
      }).catch(error => {
        reject(error)
      })
    })
  },
  //put请求
  requestPut(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.put(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  //delete请求
  requestDelete(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.delete(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
