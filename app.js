//app.js
// 用 import 或者 require 引入模块 
//import httpRequest from './apis/httpRequest.js';
//http://127.0.0.1:84
//https://api.bbicdb.com

App({
  onLaunch: function () {

    this.globalData = {
      //全局变量
      ApiUrl: "http://127.0.0.1:84",
      userInfo: '',//登录信息
    };
    //----------
  },
  //或者在这里自定义全局变量
  //http: httpRequest,
  //定义一个类型为httpRequest的属性并实例化
  //http: new httpRequest(),
})
