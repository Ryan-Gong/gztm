// miniprogram/pages/repairs/verify/verify.js

const app = getApp();
var user = require("../../../utils/user.js");
var http = require("../../../request/httpRequest.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',//用户登录信息
    //导航栏
    navbarTitle: [{
      "columnName": '待确定',
      "columnId": "1"
    }, {
      "columnName": '全部',
      "columnId": "0"
    }],
    navbarActiveIndex: 0,

    navPosition: [], //导航栏各个TAB的位置
    scrollLeft: 0, //navbar scroll-view 使用

    px2rpx: 2,
    windowWidth: 375,//屏幕可用宽度
    windowHeight: '',//屏幕可用高度
    isHideLoadMore: true,//是否隐藏加载提示
    isComplete: false,//是否全部加载完毕

    endTipHidden: false,
    endTip: '正在加载',

    list: {},//把所有子项的数据都放在list里面
    curListId: 0, //滑动到底部时，我们根据curListId知道当前需要请求那个对象

    //请求参数 query
    query: {
      keys: '',
      pageIndex: 1,
      pageSize: 10,
    },
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