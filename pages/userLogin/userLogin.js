// miniprogram/pages/userLogin/userLogin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },
  // 获取输入账号 
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value.replace(/\s+/g, '') //利用正则去除空格
    })
  }, 
  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value.replace(/\s+/g, '') //利用正则去除空格
    })
  }, 
  // 登录 
  login: function () {
    var that = this;
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      this.setData({
        popErrorMsg: "用户名和密码不能为空"
      });
      this.ohShitfadeOut();
      return; 
    } else {
      // 这里修改成跳转的页面
      var url = getApp().globalData.ApiUrl;
      //console.log(url);
      wx.request({
        url: url +'/user?a=auth',
        data: {
          username: this.data.phone,
          password: this.data.password
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data);
          if (res.data.code==200) {
            //异步缓存
            wx.setStorage({ 
              key: 'userInfo',
              data: {
                token: res.data.token,
                uid: res.data.result.Id,
                uname: res.data.result.yhm,
                right: res.data.result
              }
            });// 异步设置缓存
            wx.navigateTo({
              url: '../index/index'
            });
          }else{
            that.setData({
              popErrorMsg: res.data.message
            });
            that.ohShitfadeOut();
            return; 
          }
        },
        fail: function (res) {
          console.log(res.data);
        }
      });
    }
  },
  //3秒隐藏错误提示
  ohShitfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });
      clearTimeout(fadeOutTimeout);
    }, 3000);
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