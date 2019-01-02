// miniprogram/pages/sites/qqmap/qqmap.js
//https://lbs.qq.com/qqmap_wx_jssdk/method-reverseGeocoder.html
// 引入【腾讯位置服务API】SDK核心类
var QQMapWX = require('../../../libs/qqmap/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: -13.22564,
    longitude: 30.209621,
    markers: [{
      id: 1,
      latitude: -13.22564,
      longitude: 30.209621,
      name: '由龚祥龙开发'
    }]
  },
  //打开腾讯地图
  showQQMap: function(){
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: '73VBZ-DQNWU-CA7VD-B5ZBE-I2F3K-5RFGQ'
    });
    // 调用接口--输入坐标返回地理位置信息和附近poi列表
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: this.data.latitude,
        longitude: this.data.longitude
      },
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showQQMap();
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