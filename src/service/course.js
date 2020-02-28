import Http from './ajax/index'

let sysUrlConfig = require('../../static/config/baseUrl.js');//读取配置文件
const QueryString = require("querystring");
let urlPre = sysUrlConfig.ApiUrlPre;//获取前缀

/*课程服务Api*/
//1、分页查询课程列表
export const findCourseListApi = (params) => {
  let queryParams = QueryString.stringify(params);//将json对象转成key/value字符串
  return Http.requestQuickGet(urlPre + '/course/courseBase/list/' + params.pageNo + '/' + params.pageSize + '?' + queryParams);
};
//2、新增课程基础信息
export const addCourseBaseApi = (params) => {
  return Http.requestPost(urlPre + '/course/courseBase/add', params);
};
//3、课程分类（树形结构）
export const findCategoryTreeApi = () => {
  return Http.requestQuickGet(urlPre + '/course/category/tree');
};
//4.查找课程基础信息
export const findCourseBaseById= (id) => {
  return Http.requestQuickGet(urlPre + '/course/courseBase/findById/'+id);
};
//5、更新课程基础信息
export const updateCourseBaseApi = (id,params) => {
  return Http.requestPut(urlPre + '/course/courseBase/update/'+id, params);
};
//6。查询课程图片
export const findCoursePicById= (id) => {
  return Http.requestQuickGet(urlPre + '/course/coursePic/findById/'+id);
};
//7。添加课程图片
export const addCoursePicApi= (params) => {
  return Http.requestPost(urlPre + '/course/coursePic/add', params);
};
//8。删除课程图片
export const deleteCoursePicApi= (id) => {
  return Http.requestGet(urlPre + '/course/coursePic/delete/'+id);
};
