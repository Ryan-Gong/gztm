// miniprogram/pages/sites/index/index.js
const app = getApp();
var user = require("../../../utils/user.js");
var http = require("../../../request/httpRequest.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',//用户登录信息
    //请求参数 query
    query: {
      keys: '',
      pageIndex: 1,
      pageSize: 10,
    },
    windowWidth: 375, //屏幕可用宽度
    windowHeight: '', //屏幕可用高度

    endTipHidden: false,  //是否隐藏加载提示
    endTip: '正在加载', //是否全部加载完毕

    list: '', //把所有子项的数据都放在list里面
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
  //搜索--点击小键盘上的[搜索按钮或enter]就触发要执行的方法
  search: function (e) {
    var that = this;
    //清空list,重新获取数据（关键）
    this.setData({
      list: '',
    });
    // 滚动到顶部
    wx.pageScrollTo({
      scrollTop: 0
    });
    //查询数据
    //that.wait();
    //模拟加载--期间为了显示正在加载中的效果-模拟网络延迟
    setTimeout(() => {
      //网络返回请求
      that.getList();
    }, 1500);//1.5秒的延时器
  },
  //滚动到底部触发事件
  loadmore: function (e) {
    let that = this;
    let list = that.data.list;
    //如果还有数据
    if (list.pageIndex < list.pageCount) {
      //模拟加载--期间为了显示正在加载中的效果-模拟网络延迟
      setTimeout(() => {
        //网络返回请求
        that.getList();
      }, 1500);//1.5秒的延时器
    }
    return;
  },

  //滚动时触发-滚动记录之前的滚动位置
  // 在滚动的过程中，不断的记录更新每一个子项它最后滚动到的位置，
  // 下次进入这一屏，就看看数据里面有没有这个滚动值，没有的话，就是第一次进入，默认为0，
  // 如果有值，说明之前我们已经滚动过一次，则赋值给scroll-view的scroll-top
  scroll: function (e) {
    let that = this;
    setTimeout(function () {
      //console.log(e.detail.scrollTop);
      let list = that.data.list;
      if (list) {
        list.scrollTop = e.detail.scrollTop;
        that.setData({
          list
        })
      }
    }, 300);
  },

  //获取屏幕高度/宽度
  getSystem: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res);
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      type: options.type || '',
      keys: options.keys || ''
    });
    //that.wait();
    let that = this;
    that.getSystem();
    //检查用户是否登录
    user.chklogin().then((res) => {
      //如果已经登录，从缓存中把登录信息赋值给userInfo
      //console.log("第1步：处理登录信息");
      that.setData({
        userInfo: res.data
      });
    }).then((res) => {
      //console.log("第2步：登录用户成功后相关的事务");
      //模拟加载--期间为了显示正在加载中的效果-模拟网络延迟
      setTimeout(() => {
        //网络返回请求
        that.getList();
      }, 1500);//1.5秒的延时器
    }).catch((err) => {
      console.log(err);
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