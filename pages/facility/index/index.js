// miniprogram/pages/facility/index/index.js
const app = getApp();
var user = require("../../../utils/user.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //请求参数 query
    query: {
      keys:'',
      pageIndex: 1,
      pageSize: 10,
    },
    inputShowed: false,
    inputVal: "",
    facility: [],  //放置返回数据的数组,设为空
    windowHeight: '',//屏幕可用高度
    isHideLoadMore: true,//是否隐藏加载提示
    isComplete:false,//是否全部加载完毕,
    userInfo:''
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
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  //点击小键盘上的[搜索按钮或enter]就触发要执行的方法
  search: function (e){
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
  //求情数据
  req: function () {
    var that = this;
    var url = app.globalData.ApiUrl;
    wx.request({
      url: url + '/facility',
      data: {
        "OTAId": "OTA",
        "Parameter": that.data.query, //{ "siteId": id },
        "Signature": ""
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //console.log(res);
        let result = res.data.result;
        let list = result.result || [];
        // 如果是第一页
        // 将请求下来的数据用concat方法进行合并[合并请求的数据]
        var lists = that.data.query.pageIndex === 1
          ? list : that.data.facility.concat(list);
        //判断是否有数据，有则取数据
        if (list.length == 0){
          //没有数据了，把“没有数据”显示，把“上拉加载”隐藏
          that.setData({
            isComplete: true, //把“没有数据”设为true，显示
            isHideLoadMore: true,  //把"上拉加载"的变量设为false，隐藏
            facility: lists,
          });
        }else{
          that.setData({
            facility: lists,
            //isHideLoadMore: false
          });
        };
        //console.log(that.data);
      }
    });
  },
  //滚动到底部触发事件
  loadmore: function(e){
    let that = this;
    //如果还有数据
    if (!that.data.isComplete){
      let query = that.data.query;//保存在另一个变量中
      //每次触发上拉事件，把pageIndex+1
      query.pageIndex = that.data.query.pageIndex + 1;
      that.setData({
        query: query,
        isHideLoadMore: false,//显示：正在加载
      });
      console.log(that.data.query);
      //模拟加载--期间为了显示正在加载中的效果-模拟网络延迟
      setTimeout(() => {
        //网络返回请求
        that.req();
      }, 1500);//1.5秒的定时器
    };
  },
  //滚动时触发
  scroll:function(e){
    let lastScollTop=0;
    const { scrollHeight, scrollTop } = e.detail;
    const { scrollYHeight, hasMore } = this.data;
    //如果当前没有加载中且列表还有数据未加载，且页面滚动到距离底部40px内
    if ( hasMore && (scrollHeight - scrollYHeight - scrollTop < 40) && lastScollTop <= scrollTop) {
      this.loadMore()
    }
    lastScollTop = scrollTop
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
    };
    that.setData({
      query: query
    });
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
        console.log("onLoad屏幕高度: " + res.windowHeight)
      }
    });
    //检查用户是否登录
    user.chklogin().then((res) => {
      //console.log("第1步：如果已经登录，从缓存中把登录信息赋值给userInfo");
      that.setData({
        userInfo: res.data
      });
    }).then((res) => {
      //console.log("第2步：读取登录用户的相关的事务");
      //权限设置(定时器扫描，等待异步请求处理结果)
      that.req();
    }).catch((err) => {
      console.log(err);
    });
    return;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
        console.log("onReady屏幕高度: " + res.windowHeight)
      }
    });
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