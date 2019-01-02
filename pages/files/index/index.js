// miniprogram/pages/files/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popErrorMsg: '',
    //请求参数 query
    query:{
      pageIndex:1,
      pageSize:30,
    },
    chooseSize: false,
    animationData: {},
    editRight: false,//是否有编辑权限
    files:{},
    info:{},
  },
  req: function (reqArgs) {
    var that = this;
    var url = app.globalData.ApiUrl;
    wx.request({
      url: url + '/files',
      data: {
        "OTAId": "OTA",
        "Parameter": reqArgs,//{ reqArgs },
        "Signature": ""
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res);
        //设置页面的数据
        that.setData({
          info: res.data.info,
          files: res.data.result, //存档信息
        });
        //使用 JS 动态 设置 页面标题
        wx.setNavigationBarTitle({
          title: '与' + res.data.info.name + '相关存档'
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
    let query = that.data.query;//保存在另一个变量中
    //query.type = options.type;
    //query.id = options.id;
    for (var key in options) {//遍历json对象的每个key/value对,key=为key
      query[key] = options[key];
    }
    that.setData({
      query: query
    });
    //console.log(that.data.query); return;
    that.req(that.data.query);
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