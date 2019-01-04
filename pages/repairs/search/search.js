// miniprogram/pages/repairs/search/search.js
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
    parts: [],  //放置返回数据的数组,设为空
    windowHeight: '',//屏幕可用高度
    isHideLoadMore: true,//是否隐藏加载提示
    isComplete: false,//是否全部加载完毕
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
    let query = that.data.query;//保存在另一个变量中
    query.keys = e.detail.value;
    query.pageIndex = 1; //从第一页开始显示
    that.setData({
      inputVal: e.detail.value,
      query: query,
      isHideLoadMore: true,
      isComplete: false,
    });
    that.req();
    // 滚动到顶部
    wx.pageScrollTo({
      scrollTop: 0
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