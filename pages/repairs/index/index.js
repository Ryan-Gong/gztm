// miniprogram/pages/repairs/index/index.js
const app = getApp();
var user = require("../../../utils/user.js");
var http = require("../../../request/httpRequest.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',//用户登录信息
    //请求参数 query
    query: {
      OTAId: "",
      Parameter: {
        mode:'Summary', //汇总
        keys: '',
        pageIndex: 1,
        pageSize: 10,
      },
      Signature: ""
    },
    summary:'', //汇总信息
  },
  
  //判断是否登录
  checkLogin:function(){
    var that = this;
    //异步获取缓存中用户登录信息
    wx.getStorage({
      key: 'userInfo',
      //接口调用成功的回调函数
      success: function (res) {
        console.log("success:" + JSON.stringify(res));
        that.setData({
          userInfo: res.data
        });
      },
      //接口调用失败的回调函数
      fail: function (res){
        console.log("fail:" + JSON.stringify(res));
        //跳转到登录页面
        wx.redirectTo({
          url: '/pages/userLogin/userLogin',
        })
        return;
      },
      //接口调用结束的回调函数（调用成功、失败都会执行）
      complete: function (res){
        console.log("complete:" + JSON.stringify(res));
      }
    });
  },
  //从webAPI中获取数据
  getData:function(){
    let that=this;
    //组装请求参数
    let query = that.data.query;//保存在另一个变量中
    query.OTAId = that.data.userInfo.uname;
    that.setData({
      query: query
    });
    //如果有用户ID，则读取出该用户相关的数据
    if (query.OTAId){
      http.request({
        url: app.globalData.ApiUrl + '/repairs',
        method: 'GET',
        data: that.data.query,
      }).then((res) => {
        console.log("complete:" + JSON.stringify(res));
        that.setData({
          summary: res.result
        });
      }).catch((err) => {
        console.log(err);
      });
    }
  },
  //新增维护信息
  addRepairs:function(){
    wx.redirectTo({
      url: '/pages/repairs/add/add',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    user.chklogin().then((res)=>{
      //保存登录信息，赋值给userInfo
      console.log("第1步：保存登录信息");
      that.setData({
        userInfo: res.data
      });
    }).then((res)=>{
      console.log("第2步：读取登录用户的相关的事务");
      //读取登录用户的相关的事务
      that.getData();
    }).catch((err)=>{
      console.log(err);
    });
    return;
    // user.checkLogin((res)=>{
    //   that.setData({
    //     userInfo: res
    //   });
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})