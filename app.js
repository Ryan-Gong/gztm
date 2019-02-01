//app.js
// 用 import 或者 require 引入模块 
//import httpRequest from './apis/httpRequest.js';

App({
  onLaunch: function () {

    this.globalData = {
      //全局变量
      ApiUrl: "https://api.bbicdb.com",
      userInfo: '',//登录信息
    };
    //----------
  },
  //或者在这里自定义全局变量
  //http: httpRequest,
  //定义一个类型为httpRequest的属性并实例化
  //http: new httpRequest(),
})
