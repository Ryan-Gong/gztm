// miniprogram/pages/sites/map/map.js
//地图map组件用的是腾讯地图，组件需要id属性，以此调用相应的API。
var wxMarkerData = [];
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
    }],
    placeData: {},
    rgcData: {}
  },
  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    console.log(e);
    that.showSearchInfo(wxMarkerData, id);
  },
  showSearchInfo: function (data, i) {
    var that = this;
    that.setData({
      rgcData: {
        address: '地址：' + data[i].address + '\n',
        desc: '描述：' + data[i].desc + '\n',
        business: '商圈：' + data[i].business
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    this.mapCtx = wx.createMapContext('myMap');//获取地图对象同canvas相似，获取后才能调用相应的方法
    this.mapCtx.moveToLocation()//将当前位置移动到地图中心
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