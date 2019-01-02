Page({
  data:{
    url:''
  },
  goto:function(e){
    let _url=e.target.dataset.url;
    //关闭当前页面，跳转到应用内的某个页面
    wx.redirectTo({
      url: _url
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let _url = options.url ? options.url :'/pages/index/index';
    that.setData({
      url:_url
    });
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
});