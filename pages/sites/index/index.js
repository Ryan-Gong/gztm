// miniprogram/pages/sites/index/index.js
const app = getApp()
var user = require("../../../utils/user.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    latitude: -13.22564,
    longitude: 30.209621,
    markers:{},
    siteType:{},
    userInfo:''
  },
  /**
   * 搜索框 功能
   */
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  //点击小键盘上的[搜索按钮或enter]就触发要执行的方法
  search: function (e) {
    var that = this;
    let keys = e.detail.value;
    wx.redirectTo({
      url: '../search/index?keys=' + keys,
    });
    return;
  },
  //与后台连接得到数据
  req: function () {
    var that = this;
    var url = app.globalData.ApiUrl;
    wx.request({
      url: url + '/site',
      data: {
        "OTAId": "OTA",
        "Parameter": { "mode": "index" },//mode：空/index=站点管理首页-统计;search=搜索页面
        "Signature": ""
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.result);
        var result = res.data.result;
        that.setData({
          markers: result.location,
          //获取 json 中的数组中的第一个值
          latitude: result.location[0].latitude,
          longitude: result.location[0].longitude,
          siteType: result.result
        });
      }
    });
  },
  //点击标记点时触发
  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    console.log(e);
  },
  detial: function (e) {
    //带id跳转到指定的页面，这里的e.target.dataset.type是获取wxml页面上的data-type参数，详见事件说明
    wx.navigateTo({
      url: "../search/index?type=" + e.target.dataset.type
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //检查用户是否登录
    user.chklogin().then((res) => {
      //console.log("第1步：如果已经登录，从缓存中把登录信息赋值给userInfo");
      that.setData({
        userInfo: res.data
      });
    }).then((res) => {
      //console.log("第2步：读取登录用户的相关的事务");
      //权限设置(定时器扫描，等待异步请求处理结果)
      that.req();
    }).catch((err) => {
      console.log(err);
    });
    return;
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