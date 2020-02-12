import Http from './ajax/index';
let sysUrlConfig = require('../../static/config/baseUrl.js');
let apiPre = sysUrlConfig.xcApiUrlPre;

/*数据字典 */
export const sys_getDictionary= dType => {
  return Http.requestQuickGet(apiPre+'/sys/dictionary/get/'+dType)
};

/*存储文件元数据*/
export const sys_saveFileMetedata = params => {
  return Http.requestPost(apiPre+'/filesystem/saveFileMetedata',params)
};

/*删除文件*/
export const sys_deleteFile = params => {
  return Http.requestPost(apiPre+'/filesystem/delete',params)
};
