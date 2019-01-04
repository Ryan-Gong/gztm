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
    userInfo: '',//用户登录信息
    repairs: '', //维护记录
    //请求参数 query
    query: {
      OTAId: "",
      Parameter: {
        keys: '',
        pageIndex: 1,
        pageSize: 10,
      },
      Signature: ""
    },
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
  * 初始化/读取数据(用于等待异步请求处理结果)
  * 定时器setInterval
  */
  initData: function () {
    var that = this;
    var times = 0;//记录时间
    var _repairs = that.data.repairs;
    var _userInfo = that.data.userInfo;
    var i = setInterval(function () {
      times++;
      if (_repairs && _userInfo) {
        console.log(times);
        
        that.setData({
          loading: false
        });
        clearInterval(i);//如果有数据，则 清除定时器
      } else {
        //继续 从 data 中 读取 repairs的值
        _repairs = that.data.repairs;
        _userInfo = that.data.userInfo;
      }
    }, 1000);//每隔1秒时间便执行
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id
    });
    //检查用户是否登录
    user.chklogin().then((res) => {
      //console.log("第1步：如果已经登录，从缓存中把登录信息赋值给userInfo");
      that.setData({
        userInfo: res.data
      });
    }).then((res) => {
      //console.log("第2步：读取登录用户的相关的事务");
      //读取登录用户的相关的事务
      that.getRepairs();
      //权限设置(定时器扫描，等待异步请求处理结果)
      that.setRight();
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