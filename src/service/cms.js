/*CMS公共服务API*/
import Http from './ajax/index';
let sysUrlConfig = require('../../static/config/baseUrl.js');//读取配置文件
const QueryString = require("querystring");
let urlPre = sysUrlConfig.ApiUrlPre;//获取前缀
//1、页面列表API
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

/*2、模板管理*/
export const findTemplateListApi =(params) =>{
  let queryParams = QueryString.stringify(params);//将json对象转成key/value字符串
  return Http.requestQuickGet(urlPre+'/cms/template/list/'+params.pageNo+'/'+params.pageSize+'?'+queryParams);
};
/*添加模板*/
export const addTemplateApi=(params)=>{
  return Http.requestPost(urlPre+'/cms/template/add',params)
};
/*编辑模板 根据ID*/
export const updateTemplateApi=(id,params)=>{
  return Http.requestPut(urlPre+'/cms/template/update/'+id,params)
};
/*删除模板*/
export const deleteTemplateApi=(id)=>{
  return Http.requestDelete(urlPre+'/cms/template/delete/'+id)
};

/*对模板文件的处理 上传下载删除API*/

//参数 文件所在路径 上传文件
export const uploadTemplateFileApi=(url)=>{
  return Http.requestQuickGet(urlPre+'/cms/template/uploadTemplateFile'+'?url='+url)
};
//参数 文件在GridFS中的id 下载文件
export const readTemplateFileApi=(id,type)=>{
  return Http.requestQuickGet(urlPre+'/cms/template/readTemplateFile'+'?id='+id+'&type='+type)
};
//参数 文件在GridFS中的id 删除文件
export const deleteTemplateFileApi=(id)=>{
  return Http.requestQuickGet(urlPre+'/cms/template/deleteTemplateFile'+'?id='+id)
};

//页面发布
// export const previewPageApi=(id)=>{
//   return Http.requestQuickGet(urlPre+'/cms/template/deleteTemplateFile'+'?id='+id)
// };
