// miniprogram/pages/sites/parts/parts.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sbId: '', //设备ID
    chooseSize: false,
    animationData: {},
    editRight: false,//是否有编辑权限
    facility: {}, //设备信息
    parts: {}, //零部件

  },
  //获取指定设备的零部件
  req: function (id) {
    var that = this;
    var url = app.globalData.ApiUrl;
    wx.request({
      url: url + '/facility',
      data: {
        "OTAId": "OTA",
        "Parameter": { "id": id },
        "Signature": ""
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var result = res.data.result
        console.log(res);
        //设置页面的数据
        that.setData({
          facility: result, //设备信息
          parts: result.parts,//零部件
        });
        //使用 JS 动态 设置 页面标题
        wx.setNavigationBarTitle({
          title: '与' + result.mc + '相关零部件'
        });
      }
    });
  },
  //移除该设备
  remove: function () {
    wx.showToast({
      title: '您无权限',//解除绑定
      icon: 'loading',//success
      duration: 2000
    });
    return false;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      sbId: options.sbid //获取query中的 设备ID
    });
    that.req(that.data.sbId);
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