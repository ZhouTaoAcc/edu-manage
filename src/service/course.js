import Http from './ajax/index'

let sysUrlConfig = require('../../static/config/baseUrl.js');//读取配置文件
const QueryString = require("querystring");
let urlPre = sysUrlConfig.ApiUrlPre;//获取前缀


//1、课程列表API
//分页查询
export const findCourseListApi = (params) => {
  let queryParams = QueryString.stringify(params);//将json对象转成key/value字符串
  return Http.requestQuickGet(urlPre + '/course/courseBase/list/' + params.pageNo + '/' + params.pageSize + '?' + queryParams);
};
//新增课程基础信息
export const addCourseBaseApi = (params) => {
  return Http.requestPost(urlPre + '/course/courseBase/add', params);
};
//2、课程分类（树形结构）
export const findCategoryTreeApi = () => {
  return Http.requestQuickGet(urlPre + '/course/category/tree');
};

