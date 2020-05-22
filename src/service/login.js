import Http from './ajax/index'

let sysUrlConfig = require('../../static/config/baseUrl');
let apipre=sysUrlConfig.ApiUrlPre;
/*统一登陆接口*/
export const loginApi = (params) => {
  return Http.requestPost('/auth/userlogin', params)
};
/*登出接口*/
export const logoutApi = () => {
  return Http.requestPost('/auth/userlogout')
};

//查询学学校的信息
export const getCompanyApi = (id) => {
  return Http.requestQuickGet("/ucenter/company/get/" + id);
};

