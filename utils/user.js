//https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxs/01wxs-module.html

/**
 * 检查用户登录状态(getStorageSync)：方法1：回调函数
 * 同步
 * user.checkLogin((res)=>{
      that.setData({
        userInfo: res
      });
    });
 */
var checkLogin = function (callback) {
  try {
    //同步获取userInfo的值
    const value = wx.getStorageSync('userInfo')
    if (value) {
      // Do something with return value
      //console.log("complete:" + JSON.stringify(value));
      //把value变量传参给 回调函数callback();
      //为了安全性，还需要进一步判断其类型是否为函数
      return typeof (callback) === 'function' && callback(value);
    } else {
      //跳转到登录页面
      wx.redirectTo({
        url: '/pages/userLogin/userLogin',
      });
      return;
    }
  } catch (e) {
    // Do something when catch error
  };
};

/**
 * 检查用户登录状态(getStorage)：方法2：使用Promise，重构你的Js代码
 * https://baijiahao.baidu.com/s?id=1600129839179269265&wfr=spider&for=pc
 * 异步
 */
var chklogin = function(){
  if (typeof (Promise) !== "function") {
    console.log("您的浏览器不支持Promise，请用chrome或Firefox");
    return false;
  }
  //Promise 对象代表一个异步操作，其不受外界影响
  //避免了层层嵌套的回调函数。此外，Promise 对象提供统一的接口，使得控制异步操作更加容易。
  //Promise 构造函数包含一个参数和一个带有 resolve（解析）和 reject（拒绝）两个参数的回调。
  //在回调中执行一些操作（例如异步），如果一切都正常，则调用 resolve，否则调用 reject。
  return  new Promise((resolve, reject) => {
    // 异步处理,如果一切都正常，则调用 resolve，否则调用 reject。
    // 异步获取缓存中用户登录信息
    wx.getStorage({
      key: 'userInfo',
      //接口调用成功的回调函数
      success: function (res) {
        //console.log("success:" + JSON.stringify(res));
        resolve(res);
      },
      //接口调用失败的回调函数
      fail: function (res) {
        //console.log("fail:" + JSON.stringify(res) + typeof (reject));
        //如果reject是回调函数，传参res并执行reject(),否则 跳转到登录页面
        //typeof (reject) === 'function'
        reject(res);
        //跳转到登录页面
        wx.redirectTo({
          url: '/pages/userLogin/userLogin',
        });
      },
      //接口调用结束的回调函数（调用成功、失败都会执行）
      complete: function (res) {
        //console.log("complete:" + JSON.stringify(res));
      }
    });
    // 处理结束后、调用resolve 或 reject
  });
};

// 导出：转化成小程序模板语言 这一步非常重要 不然无法正确调用
//格式：自定义名:执行的函数名
module.exports = {
  checkLogin: checkLogin, //同步 getStorageSync
  chklogin: chklogin, //Promise getStorage异步
}

/**
 * 
 * 微信小程序目前不支持require("/根目录/。。。。.js")
 * user.checkLogin((res)=>{
      that.setData({
        userInfo: res
      });
    });
 * 或者
 * user.checkLogin(function (res){
      that.setData({
        userInfo: res
      });
    });
 * 
 */