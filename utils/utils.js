import jwtDecode from 'jwt-decode'
import {Message} from 'element-ui';


export default {
  //获取当前登陆人信息
  getActiveUser: function () {
    let uid = this.getCookie("uid");
    if (uid) {
      //let activeUserStr = this.getUserSession("activeUser");
      let activeUserStr = this.getLocalStorage("activeUser");
      return JSON.parse(activeUserStr);
    } else {
      this.delLocalStorage("activeUser")
    }
  },
//获取jwt令牌
  getJwt: function () {
    let activeUser = this.getActiveUser();
    if (activeUser) {
      return activeUser.jwt
    }
  },
  //解析jwt 获取用户信息
  getUserInfoFromJwt(val) {
    let jwtDecode1 = jwtDecode(val);
    let activeUser = {};
    if (jwtDecode1) {
      activeUser.rolename = jwtDecode1.rolename || '';
      activeUser.username = jwtDecode1.user_name || '';
      activeUser.userpic = jwtDecode1.userpic || '';
      activeUser.userid = jwtDecode1.id || '';
      activeUser.companyId = jwtDecode1.companyId || '';
      activeUser.authorities = jwtDecode1.authorities || '';
      activeUser.jwt = val;
    }
    return activeUser;
  },
  //检验用户后台系统的登录权限
  checkLogin() {
    let jwt = this.getCookie("uid");
    let isAllow = false;
    if (jwt) {
      let activeUser = this.getUserInfoFromJwt(jwt);
      if (activeUser) {
        let authorities = activeUser.authorities;
        if(authorities instanceof Array){
          authorities.find(item => {
            if (item === 'edu_sys_manage_login') {
              this.setLocalStorage('activeUser', JSON.stringify(activeUser));
              isAllow = true;
            }
          });
        }
        return isAllow;
      }
    }
    return isAllow;
  },
  //检验用户后台系统的操作权限
  checkAuthorities: function (router, permission) {
    if (permission !== 'Login' && permission !== 'Logout') {//校验权限
      let activeUser = this.getActiveUser()
      let authorities = activeUser.authorities;
      if (!authorities) {
        Message.error('对不起您没有此操作权限！');
        //跳转到统一授权失败页面
        window.location = "http://ucenter.xuecheng.com/#/denied?returnUrl=" + Base64.encode(window.location)
        /*        router.push({
                  path: '/login'
                })*/
      }
      //console.log(authorities)
      var ret1 = authorities.find((value, index, arr) => {
        return value == permission;
      })
      if (!ret1) {
        Message.error('对不起您没有此操作权限！');
        //跳转到统一授权失败页面
        window.location = "http://ucenter.xuecheng.com/#/denied?returnUrl=" + Base64.encode(window.location)
        /*router.push({
          path: '/login'
        })*/
      }
    }
  },
  //检验用户拥有的资源菜单
  checkmenu(routeValue, authorities) {
    if (routeValue.meta && routeValue.meta.permission) {
      let permission = routeValue.meta.permission;
      // console.log(routeValue);
      var ret1 = authorities.find((value, index, arr) => {
        return value == permission;
      })
      if (!ret1) {
        //将菜单 隐藏
        routeValue.hidden = true
      }
    }
  },
  //获取当前登陆人cookie
  getCookie: function (name) {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
      return (arr[2]);
    }
    else
      return null;
  },

  setCookie: function (c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
  },
  delCookie: function (name, val) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    document.cookie = name + "=" + val + ";expires=" + exp.toGMTString();
  },
  setSession: function (key, value) {
    return sessionStorage.setItem(key, value);
  },
  getUserSession: function (key) {
    return sessionStorage.getItem(key);
  },
  delUserSession: function (key) {
    return sessionStorage.removeItem(key)
  },
  setLocalStorage: function (key, value) {
    return localStorage.setItem(key, value);
  },
  getLocalStorage: function (key) {
    return localStorage.getItem(key);
  },
  delLocalStorage: function (key) {
    return localStorage.removeItem(key)
  },
  getQueryStringByName: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    var context = "";
    if (r != null)
      context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
  }
}
