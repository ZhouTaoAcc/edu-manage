/*系统服务API*/
import Http from './ajax/index';
let sysUrlConfig = require('../../static/config/baseUrl.js');//读取配置文件
const QueryString = require("querystring");
let urlPre = sysUrlConfig.ApiUrlPre;//获取前缀

//1、字典列表API
/*分页查询字典*/
export const findDictionaryListApi =(params) =>{
  let queryParams = QueryString.stringify(params);//将json对象转成key/value字符串
  return Http.requestQuickGet(urlPre+'/system/dictionary/list/'+params.pageNo+'/'+params.pageSize+'?'+queryParams);
};
/*添加字典*/
export const addDictionaryApi=(params)=>{
  return Http.requestPost(urlPre+'/system/dictionary/add',params)
};
/*添加字典项*/
export const addDictionaryItemApi=(type,params)=>{
  return Http.requestPost(urlPre+'/system/dictionary/addItem/'+type,params)
};
/*编辑字典 根据ID*/
export const updateDictionaryApi=(type,id,params)=>{
  return Http.requestPut(urlPre+'/system/dictionary/update/'+type+'/'+id,params)
};
/*删除字典 通过Type*/
export const deleteDictionaryApi=(id)=>{
  return Http.requestQuickGet(urlPre+'/system/dictionary/deleteById/'+id)
};
/*删除字典项 通过Type id*/
export const deleteDictionaryItemApi=(type,id)=>{
  return Http.requestQuickGet(urlPre+'/system/dictionary/deleteItem/'+type+'/'+id)
};

/*设置字典状态 通过Type*/
export const setDictionaryStatusApi=(type,id,status)=>{
  return Http.requestQuickGet(urlPre+'/system/dictionary/setStatusByType/'+type+'/'+id+'?status='+status)
};

/*查询字典 通过Type*/
export const findDictionaryApi=(type)=>{
  return Http.requestQuickGet(urlPre+'/system/dictionary/findByType/'+type)
};
