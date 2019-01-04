// miniprogram/pages/repairs/search/search.js

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
    inputShowed: false,
    inputVal: "",

    windowWidth: 375,//屏幕可用宽度
    windowHeight: '',//屏幕可用高度

    endTipHidden: false,//是否隐藏加载提示
    endTip: '正在加载', //是否全部加载完毕

    list: {},//把所有子项的数据都放在list里面
    curListId: 0, //滑动到底部时，我们根据curListId知道当前需要请求那个对象
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
    //清空list,重新获取数据（关键）
    this.setData({
      list: {},
    });
    // 滚动到顶部
    wx.pageScrollTo({
      scrollTop: 0
    });
    //重置查询条件
  },

  /**
   * 请求列表
   */
  getList: function () {
    let that = this;
    let list = that.data.list;
    //组装请求参数
    let query = {
      OTAId: that.data.userInfo.uname,
      Parameter: {
        keys: that.data.inputVal, //关键词
        pageSize: that.data.query.pageSize,
        pageIndex: 1, //先读取第一页
      },
      Signature: ''
    };
    //如果list为空【即第一次访问前，暂无数据】
    if (!list) {
      query.Parameter.pageIndex = 1;
      //从API接口中查询数据
      http.request({
        url: app.globalData.ApiUrl + '/repairs',
        method: 'GET',
        data: query,
      }).then((res) => {
        //console.log(res);
        let obj = {};
        let result = res.result;
        let ds = res.result.result;
        obj.pageIndex = result.pageIndex;
        obj.pageCount = Math.ceil(result.count / result.pageSize);
        obj.total = result.count;
        obj.data = ds;
        if (result.pageIndex * result.pageSize >= result.count) {
          obj.endTip = '没有更多了';
          obj.endTipHidden = true;
        } else {
          obj.endTip = '正在加载';
        }
        that.setData({
          list: obj
        });
        console.log(list);
      }).catch((err) => {
        console.log(err);
      });
    } else {
      //翻页
      query.Parameter.pageIndex = list.pageIndex + 1;
      if (list.pageIndex < list.pageCount) {
        //从API接口中查询数据
        http.request({
          url: app.globalData.ApiUrl + '/repairs',
          method: 'GET',
          data: query,
        }).then((res) => {
          console.log(res);
          let obj = {};
          let result = res.result;
          let ds = res.result.result;
          obj.pageIndex = result.pageIndex;
          obj.pageCount = Math.ceil(result.count / result.pageSize);
          obj.total = result.count;
          obj.data = list.data.concat(ds);
          if (result.pageIndex * result.pageSize >= result.count) {
            obj.endTip = '没有更多了';
            obj.endTipHidden = true;
          } else {
            obj.endTip = '正在加载';
          }
          that.setData({
            list:obj
          });
          console.log(list);
        }).catch((err) => {
          console.log(err);
        });
      }
    }
    //---------

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
      
    }).catch((err) => {
      console.log(err);
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