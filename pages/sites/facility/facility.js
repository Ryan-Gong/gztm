// miniprogram/pages/sites/facility/facility.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    popErrorMsg: '',
    site: {}, //站点信息
    facility: {},//设备信息
    chooseSize: false,
    animationData: {},
    editRight: false,//是否有编辑权限
  },
  req: function (id) {
    var that = this;
    var url = app.globalData.ApiUrl;
    wx.request({
      url: url + '/facility',
      data: {
        "OTAId": "OTA",
        "Parameter": { "siteId": id },
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
          site: result.siteInfo,
          facility: result.result, //设备信息
        });
        //使用 JS 动态 设置 页面标题
        wx.setNavigationBarTitle({
          title: '与' + result.siteInfo.zdm +'相关设备'
        });
      }
    });
  },
  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  //移除该设备
  remove:function(){
    wx.showToast({
      title: '您无权限',//解除绑定
      icon: 'loading',//success
      duration: 2000
    });
    return false;
  },
  showParts: function (e) {
    //带id跳转到指定的页面，这里的e.target.dataset.type是获取wxml页面上的data-type参数，详见事件说明
    wx.navigateTo({
      url: "../parts/parts?sbid=" + e.target.dataset.sbid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id
    });
    that.req(that.data.id);
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