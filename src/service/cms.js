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

