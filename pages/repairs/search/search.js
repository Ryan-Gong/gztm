// miniprogram/pages/repairs/search/search.js

const app = getApp();
var user = require("../../../utils/user.js");
var http = require("../../../request/httpRequest.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //请求参数 query
    query: {
      keys: '',
      pageIndex: 1,
      pageSize: 10,
    },
    inputShowed: false,
    inputVal: "",

    windowWidth: 375,//屏幕可用宽度
    windowHeight: '',//屏幕可用高度

    endTipHidden: false,//是否隐藏加载提示
    endTip: '正在加载', //是否全部加载完毕

    list: {},//把所有子项的数据都放在list里面
    curListId: 0, //滑动到底部时，我们根据curListId知道当前需要请求那个对象
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
  //清空输入值
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  //获取输入的值
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  //点击小键盘上的[搜索按钮或enter]就触发要执行的方法
  search: function (e) {
    var that = this;
    //重置查询条件
    
    // 滚动到顶部
    wx.pageScrollTo({
      scrollTop: 0
    });
  },

  //获取屏幕高度/宽度
  getSystem: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res);
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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