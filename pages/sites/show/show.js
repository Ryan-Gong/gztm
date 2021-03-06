// miniprogram/pages/sites/show/show.js

const app = getApp();
var user = require("../../../utils/user.js");
var http = require("../../../request/httpRequest.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    userInfo: '',//用户登录信息
    popErrorMsg: '',
    site: {}, //站点信息
    facility:{},//设备信息
    records:{},//维护信息
    files: {}, //存档信息
    siteState: ["正常", "故障", "维护", "在建"],//数组
    siteStateIndex: 0,
    siteStateValue:'',
    buildDate:'',//建站日期
    disabled:false,//是否禁用
    editRight: false,//是否有编辑权限
    
  },
  req: function (id) {
    var that = this;
    var url = app.globalData.ApiUrl;
    wx.request({
      url: url + '/site',
      data: {
        "OTAId": "OTA",
        "Parameter": { "id": id },
        "Signature": ""
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var result = res.data.result
        console.log(result);
        //设置页面的数据
        that.setData({
          site: result,
          facility: result.facilities, //设备信息
          records: result.maintenance, //维护信息
          files: result.files, //存档信息
          siteStateValue: result.zt,//
          buildDate:result.jzsj,
        });
      }
    });
  },
  //选择建站日期
  bindDateChange: function (e) {
    this.setData({
      buildDate: e.detail.value
    })
  },
  //选择站点的状态
  bindAccountChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);
    this.setData({
      siteStateIndex: e.detail.value,
      siteStateValue: this.data.siteState[e.detail.value]
    })
  },
  //检查表单是否完整
  checkInput:function(value,msg){
    var that = this;
    //3秒隐藏错误提示
    var hide = function () {
      var fadeOutTimeout = setTimeout(() => {
        that.setData({ popErrorMsg: '' });
        clearTimeout(fadeOutTimeout);
      }, 3000);
    };
    //检测开始
    var value = value.replace(/\s+/g, ''); //利用正则去除空格
    if (value.length == 0) {
      that.setData({
        popErrorMsg: msg
      });
      hide();
      return false
    };
    return true;
  },
  //提交保存数据
  formSubmit: function (e) {
    var that = this;
    var url = getApp().globalData.ApiUrl;
    //检查权限
    if (!editRight){
      wx.showToast({
        title: '您无权限',
        icon: 'loading',
        duration: 3000
      });
      return false;
    }
    //let id = this.data.category[this.data.categoryIndex].id
    var data = e.detail.value;
    data.zt = that.data.siteStateValue; //站点状况
    //检查表单是否完整
    //1.检查名称
    if (that.checkInput(data.zdm,'请输入磨面站点名称')==false) return false;
    //2.检查地址
    if (that.checkInput(data.zddz,'请输入磨面站点地址') == false) return false;
    //3.检查经纬度
    if (that.checkInput(data.jd,'请输入经度') == false) return false;
    if (that.checkInput(data.wd,'请输入维度') == false) return false;

    console.log(data);
    //验证通过后，保存数据
    return;
    wx.request({
      url: url + '/site/1',
      data: {
        "OTAId": "OTA",
        "Parameter": e.detail.value,
        "Signature": ""
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res);
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id
    });
    //检查用户是否登录
    user.chklogin().then((res) => {
      //console.log("第1步：如果已经登录，从缓存中把登录信息赋值给userInfo");
      that.setData({
        userInfo: res.data
      });
      console.log(res.data);
      if (res.data.right.zdxxqx != '编辑') {
        wx.showToast({
          title: '暂无权限',
          icon: 'loading'
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          });
        }, 1500);
      }
    }).then((res) => {
      //console.log("第2步：登录用户成功后相关的事务");
      that.req(that.data.id);
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