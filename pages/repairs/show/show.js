// miniprogram/pages/repairs/show/show.js
const app = getApp();
var utils = require("../../../utils/utils.js");
var user = require("../../../utils/user.js");
var http = require("../../../request/httpRequest.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    popErrorMsg: '',
    loading: true,
    repairs: '',//维护信息
    
  },
  
  /**
   * 获取维护记录
   */
  getRepairs: function () {
    let that = this;
    //组装请求参数
    let query = {
      OTAId: that.data.userInfo.uname,
      Parameter: {},
      Signature: ''
    };
    //从API接口中查询数据
    http.request({
      url: app.globalData.ApiUrl + '/repairs/' + that.data.id,
      method: 'GET',
      data: query,
    }).then((res) => {
      //console.log(res.result);
      that.setData({
        repairs: res.result,
      });
    }).catch((err) => {
      console.log(err);
    });
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id
    });
    this.req(that.data.id);
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