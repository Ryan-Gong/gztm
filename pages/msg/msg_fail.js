Page({
  goBack:function(){
    wx.navigateBack();//返回上一个页面
  },
  goIndex:function(){
    //关闭当前页面，跳转到应用内的某个页面
    wx.redirectTo({
      url: '/pages/index/index'
    });
  },
});