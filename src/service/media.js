import Http from './ajax/index'

let sysUrlConfig = require('../../static/config/baseUrl.js');//读取配置文件
const QueryString = require("querystring");
let urlPre = sysUrlConfig.ApiUrlPre;//获取前缀

/*媒资服务Api*/
//1、分页查询媒资列表
export const findMediaListApi = (params) => {
  let queryParams = QueryString.stringify(params);//将json对象转成key/value字符串
  return Http.requestQuickGet(urlPre + '/media/fileInfo/list/' + params.pageNo + '/' + params.pageSize + '?' + queryParams);
};
//2、媒质处理 编码
export const mediaProcessApi=(id)=>{
  return Http.requestQuickGet(urlPre + '/media/fileInfo/process/'+id);
};
