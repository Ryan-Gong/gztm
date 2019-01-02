//https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxs/01wxs-module.html
var _baseUrl = 'https://apis.xxx.xxx.com/dev/apis/train/v1';
let sessionId = wx.getStorageSync('sessionId');
function httpRequest(options = {}) {
  //init 参数
  const {
    url,
    data = {},
    //header = {},
    method = 'GET', // 有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT,
    dataType,
    responseType,
    success,
    fail,
    complete,
  } = options;
  // 统一注入约定的header
  const header = Object.assign({
    sessionId,
    Accept: 'application/json;charset=UTF-8',
  }, options.header);

  // 用Promise封装wx.request()，简化代码结构--ES6 标准
  // 定义一个 promise 对象
  const promise = new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      header,
      method,
      dataType,
      responseType,
      success: (res => {
        if (res.statusCode === 200) {
          //200: 服务端业务处理正常结束
          resolve(res);
        } else {
          // //其它错误，提示用户错误信息
          // if (this._errorHandler != null) {
          //   //如果有统一的异常处理，就先调用统一异常处理函数对异常进行处理
          //   this._errorHandler(res)
          // }
          reject(res);
        }
      }),
      fail: (res => {
        reject(res);
      })
    });
  });
  return promise; // 返回 promise 对象
}

/**
 * 设置请求地址
 */
function getUrl(url){
  //URL中是否含有 http:// 或者 https://
  if (url.substr(0, 7).toLowerCase() == "http://" || url.substr(0, 8).toLowerCase() == "https://") {
    return url;
  }
  return url = _baseUrl + url;
}
// 导出：转化成小程序模板语言 这一步非常重要 不然无法正确调用
//格式：自定义名:执行的函数名
module.exports = {
  httpRequest: httpRequest
}

/**
 * 使用方法：
 * 微信小程序目前不支持require("/根目录/。。。。.js")
 * 调用前 先引用：
 * var util = require('../../../utils/util.js'); // 根据自己的项目路径引入
 * util.httpRequest(uri, method='GET',page = 1, size = 10, key = null)；
 */