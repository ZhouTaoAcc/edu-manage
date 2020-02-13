/*页面列表API*/
import Http from './ajax/index';
let sysUrlConfig = require('../../static/config/baseUrl.js');//读取配置文件
const QueryString = require("querystring");
let urlPre = sysUrlConfig.ApiUrlPre;//获取前缀

/*分页查询*/
export const findPageListApi =(params) =>{
  let queryParams = QueryString.stringify(params);//将json对象转成key/value字符串
  return Http.requestQuickGet(urlPre+'/cms/page/list/'+params.pageNo+'/'+params.pageSize+'/'+params.startDate+'/'+params.endDate+'?'+queryParams);
};
/*添加页面*/
export const addPageApi=(params)=>{
  return Http.requestPost(urlPre+'/cms/page/add',params)
};
/*编辑页面 根据ID*/
export const updatePageApi=(id,params)=>{
  return Http.requestPut(urlPre+'/cms/page/update/'+id,params)
};
/*删除页面*/
export const deletePageApi=(id)=>{
  return Http.requestDelete(urlPre+'/cms/page/delete/'+id)
};
/*查询页面 通过ID*/
export const findPageApi=(id)=>{
  return Http.requestQuickGet(urlPre+'/cms/page/findById/'+id)
};

