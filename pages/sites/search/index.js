// miniprogram/pages/sites/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keys: '',
    result:{},
    items:{},
    editRight:false,
    type:'0', //type=0全部;1=正常;2=故障;3=维护;4=在建;-1=站点管理首页-统计
    txtState:{
      '正常':'green',
      '故障': 'red',
      '维护': 'yellow',
      '在建': 'orange',
    },
    showModalStatus: false,
    animationData: {},
    latitude: -13.22564,
    longitude: 30.209621,
    markers: [{
      id: 1,
      latitude: -13.22564,
      longitude: 30.209621,
      name: '由龚祥龙开发'
    }],
  },
  //获取用户输入的关键词
  getKeys: function (e) {
    this.setData({
      keys: e.detail.value
    })
  },
  //与后台连接得到数据
  req: function () {
    var that = this;
    var url = app.globalData.ApiUrl;
    wx.request({
      url: url + '/site',
      data: {
        "OTAId": "OTA",
        "Parameter": { "mode": "search", "keys": that.data.keys, "type": that.data.type }, //mode：空/index=站点管理首页-统计;search=搜索页面
        "Signature": ""
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.result);
        that.setData({
          result: res.data,
          items: res.data.result
        });
      }
    });
  },
  //带加载框提示的搜索
  wait: function () {
    var that = this;
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 2000,
      success: function () {
        setTimeout(function () {
          //that.req(that.data.keys);
          that.req();
        }, 2000);
      },
    });
  },
  //搜索
  search: function (e) {
    var that = this;
    // 滚动到顶部
    wx.pageScrollTo({
      scrollTop: 0
    });
    //that.req(this.data.keys);
    that.wait();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      type: options.type,
      keys: options.keys
    });
    that.wait();
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
  showMap:function(e){
    var that=this;
    let jd = e.target.dataset.jd;
    let wd = e.target.dataset.wd;
    console.log(jd+'--'+wd);
    that.setData({
      latitude: wd,
      longitude: jd,
      markers: [{
        id: 1,
        latitude: wd,
        longitude: jd,
        name: e.target.dataset.name
      }],
    });
    that.showModal();
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