// miniprogram/pages/repairs/edit/edit.js
const app = getApp();
var utils = require("../../../utils/utils.js");
var user = require("../../../utils/user.js");
var http = require("../../../request/httpRequest.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    hasError: false,
    popErrorMsg: '',
    userInfo: '',//用户登录信息
    repairs: '', //维护记录
    //请求参数 query
    query: {
      OTAId: "",
      Parameter: {
        mode: 'Summary', //汇总
        keys: '',
        pageIndex: 1,
        pageSize: 10,
      },
      Signature: ""
    },
    searchSiteResult: {}, //搜索站点信息
    selectedSite: { id: '', name: '' },//已选择的站点信息
    //维护人员资料
    users: ['请选择'],
    usersIndex: 0,
    //分类
    cate: ["请选择", "安装", "调试", "故障", "维修", "故障维修", "巡检"],//数组
    cateIndex: 0,
    cateValue: '请选择',
    //关联设备
    facility: ['无关联设备'],
    facilityIndex: 0,
    facilityValue: '',
    //设备编号
    facilityXH: ['无关联设备'],
    facilityXHIndex: 0,

    pkgRelation: [], //关联设备

    buildDate: '请选择',
    disabled: false,//是否禁用
    editRight: false,//是否有编辑权限
    published: false, //是否发布
    animationData: {},
    showModalStatus: false,
    inputShowed: false,
    inputVal: ""
  },
  //选择建站日期
  bindDateChange: function (e) {
    console.log('picker date 发生选择改变，携带值为', e.detail.value);
    this.setData({
      buildDate: e.detail.value
    })
  },
  //选择分类
  bindTypeChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);
    this.setData({
      cateIndex: e.detail.value,
      cateValue: this.data.cate[e.detail.value]
    })
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
  //搜索站点
  inputTyping: function (e) {
    var that = this;
    //let keys = e.detail.value;
    this.setData({
      inputVal: e.detail.value
    });
    that.search();
  },
  search: function () {
    let that = this;
    //组装请求参数
    let query = that.data.query;//保存在另一个变量中
    query.OTAId = that.data.userInfo.uname;
    query.Parameter.mode = 'search';
    query.Parameter.keys = that.data.inputVal;//mode：空/index=站点管理首页-统计;search=搜索页面
    query.Parameter.type = 0;//type=0全部;1=正常;2=故障;3=维护;4=在建
    query.Parameter.pageSize = 30;
    query.Signature = '';
    that.setData({
      query: query
    });
    //从API接口中查询数据
    http.request({
      url: app.globalData.ApiUrl + '/site',
      method: 'GET',
      data: that.data.query,
    }).then((res) => {
      //console.log("complete:" + JSON.stringify(res));
      //console.log(res.result.result);
      that.setData({
        searchSiteResult: res.result.result
      });
    }).catch((err) => {
      console.log(err);
    });
  },
  //获取用户列表
  getUsers: function () {
    let that = this;
    //组装请求参数
    let query = {
      OTAId: that.data.userInfo.uname,
      Parameter: {
        //gzwhqx:'编辑',
      },
      Signature: ''
    };
    //从API接口中查询数据
    http.request({
      url: app.globalData.ApiUrl + '/user',
      method: 'GET',
      data: query,
    }).then((res) => {
      let data = res.result;
      let user = data.map(function (item) { return item.yhm; });
      //1.首先找到登录用户在user中的位置
      let index = user.indexOf(that.data.userInfo.uname);
      //2.使用splice函数进行移除
      if (index > -1) {
        user.splice(index, 1);
      }
      //3.使用unshift将登录用户挪到数组的第一位
      user.unshift(that.data.userInfo.uname);
      //4.设置data中，users 属性的值
      that.setData({
        users: user
      });
    }).catch((err) => {
      console.log(err);
    });
  },
  //选中站点
  radioChange: function (e) {
    var that = this;
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var radioItems = this.data.searchSiteResult;//搜索站点的结果
    var sited = this.data.selectedSite;//已选择的站点信息
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].Id == e.detail.value;
      if (radioItems[i].Id == e.detail.value) {
        radioItems[i].checked = true;
        //已选择的站点信息
        sited.id = e.detail.value;
        sited.name = radioItems[i].zdm;
      }
    }
    this.setData({
      searchSiteResult: radioItems,
      selectedSite: sited,
    });
    //读取所选站点关联的设备
    that.getFacilityBySite();
    //console.log(this.data.searchSiteResult);
    //1秒隐藏错误提示
    setTimeout(function () {
      that.hideModal();
    }, 1000);
  },
  /**
   * 绑定站点关联的设备
   * selected 已经选择的值，用于修改
   */
  getFacilityBySite: function (selected='') {
    let that = this;
    let facility = that.data.facility;
    //组装请求参数
    let query = {
      OTAId: that.data.userInfo.uname,
      Parameter: {
        mode: 'distinct',
        zdid: that.data.selectedSite.id
      },
      Signature: ''
    };
    http.request({
      url: app.globalData.ApiUrl + '/facility',
      method: 'GET',
      data: query,
    }).then((res) => {
      let data = res.result;
      if (data) {
        //that.pkgRelationFacility(data);
        let json = [], sb = ['无关联设备'];
        //---设备名称--------
        data.map(function (item, index, array) {
          let temp = {
            id: item.Id,
            mc: item.mc,
            bh: item.sbbh
          };
          json.push(temp);
          sb.push(item.mc);
          //return item.mc;
        });
        console.log(json);
        //拓展运算符(...)内部使用for...of循环
        //利用ES6的set(Set数据结构，它类似于数组，其成员的值都是唯一的;去重)
        sb = [...new Set(sb)];
        that.setData({
          facility: sb,//facility.concat(sb),
          pkgRelation: json,
          facilityIndex: selected ? utils.getKey(selected,sb):0,
          facilityValue: selected,
        });
        //that.resetData();//重设表单
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  //由设备名称读取对应一系列的编号列表
  getFacilityXHList: function () {
    var that = this;
    //js获取对象长度
    let arr = Object.keys(that.data.pkgRelation);
    if (arr.length) {
      //使用map映射循环pkgRelation
      let sbbh = ['无关联设备'];
      that.data.pkgRelation.map(function (item, index, array) {
        //如果循环列mc属性==设备名称，则 返回该列的设备编号
        if (item.mc == that.data.facility[that.data.facilityIndex]) {
          sbbh.push(item.bh);
        }
      });
      //console.log(sbbh);
      that.setData({
        facilityXH: sbbh,//that.data.facilityXH.concat(sbbh),
      });
    }
  },
  //重组关联的设备
  //json数据去重
  pkgRelationFacility: function (jsonData) {
    var json = [];//去重之后的新的数据放在这里;里面存放用来判断是否一样的name的值
    var name = jsonData.map(function (item, index, array) {
      return item.mc;
    });
    //拓展运算符(...)内部使用for...of循环
    name = [...new Set(name)];//利用ES6的set(Set数据结构，它类似于数组，其成员的值都是唯一的;去重)
    jsonData.map(function (item, index, array) {

    });
    console.log(name);
    return;
    //-----以下是常规算法 去重---------------------
    for (var i = 0; i < jsonData.length; i++) {
      var name = jsonData[i]['mc'];//设备名
      var sbbh = jsonData[i]['sbbh'];//设备编号
      var repeat = false;//是否重复标识
      var item = {
        name: name,
        serials: []
      };

      //循环json，读取出name，对比是否存在
      for (var key in json) {
        //console.log(key + " : " + JSON.stringify(json[key]));
        //如果 存放数据json 中 name,相等，说明已经存在
        if (json[key]['name'] == name) {
          repeat = true;
          break;
        }
      }
      //如果不重复，则添加到数组中
      if (!repeat) json.push(item);
    }
    console.log(serials);
  },
  //重设重置
  resetData: function () {
    let that = this;
    that.setData({
      //关联设备
      facilityIndex: 0,
      facilityValue: '',
      //设备编号
      facilityXHIndex: 0,
    });
  },
  selectFacility: function (e) {
    var that = this;
    this.setData({
      facilityIndex: e.detail.value,
      facilityValue: this.data.facility[e.detail.value]
    });
    that.getFacilityXHList();
    that.setData({
      //重设 下级 picker
      facilityXHIndex: 0, //设备编号 索引
    });
  },
  selectFacilityXH: function (e) {
    this.setData({
      facilityXHIndex: e.detail.value,
      //facilityXHValue: this.data.facilityXH[e.detail.value]
    })
  },
  bindUser: function (e) {
    this.setData({
      usersIndex: e.detail.value,
    })
  },
  //是否发布-开关选择器
  switchChange: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value);
  },
  //提示输入错误，3秒隐藏错误提示
  showTopTips: function (msg) {
    var that = this;
    that.setData({
      hasError: true,
      popErrorMsg: msg
    });
    //3秒隐藏错误提示
    setTimeout(function () {
      that.setData({
        //hasError:false,
        popErrorMsg: ''
      });
    }, 3000);
  },
  //检查表单是否完整
  checkInput: function (value, msg, zero = false) {
    var that = this;
    that.setData({
      hasError: false
    });
    //检测开始
    value = value.toString().replace(/\s+/g, ''); //利用正则去除空格
    if (value.length == 0 || (zero && value == 0) || value == '请选择') {
      that.showTopTips(msg);
      return false;
    };
    return true;
  },
  //获取当前页url
  getCurrentPageUrl: function () {
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route //当前页面url
    return url;
  },

  /**
   * 获取维护记录
   */
  getRepairs: function () {
    let that = this;
    //组装请求参数
    let query = {
      OTAId: that.data.userInfo.uname,
      Parameter: {},
      Signature: ''
    };
    //从API接口中查询数据
    http.request({
      url: app.globalData.ApiUrl + '/repairs/' + that.data.id,
      method: 'GET',
      data: query,
    }).then((res) => {
      console.log(res.result);
      that.setData({
        repairs: res.result,
        buildDate: res.result.whsj,
        published: res.result.fbzt,
        selectedSite: {
          id: res.result.zdid,
          name: res.result.zdm
        },
        cateIndex: utils.getKey(res.result.fl, that.data.cate),
        cateValue: res.result.fl,
        usersIndex: utils.getKey(res.result.jlry, that.data.users),
        // //关联设备
        // facility: res.result.sbmc ? ['无关联设备', res.result.sbmc] : ['无关联设备'],
        // facilityIndex: res.result.sbmc ? 1 : 0,
        // facilityValue: res.result.sbmc,
        //设备编号
        // facilityXH: res.result.sbbh ? ['无关联设备', res.result.sbbh] : ['无关联设备'],
        // facilityXHIndex: res.result.sbbh ? 1 : 0,
      });
      that.getFacilityBySite();
      that.getFacilityXHList();
    }).catch((err) => {
      console.log(err);
    });
  },

  //提交保存数据
  formSubmit: function (e) {
    var that = this;
    //检查权限
    //let id = this.data.category[this.data.categoryIndex].id
    var data = e.detail.value; //json
    //检查表单是否完整
    if (!that.checkInput(data.zdid, '请选择关联站点')) return false;
    if (!that.checkInput(data.bt, '请输入标题')) return false;
    if (!that.checkInput(data.fl, '请选择分类', true)) return false;
    if (!that.checkInput(data.whsj, '请选择维护时间', true)) return false;
    if (!that.checkInput(data.ms, '请输入描述')) return false;
    if (!that.checkInput(data.zj, '请输入总结')) return false;
    //console.log("重组前的数据："+data);
    //重组data值 
    data.sbmc = that.data.facility[data.sbmc];
    if (data.sbmc == '无关联设备') data.sbmc = '';
    data.sbbh = that.data.facilityXH[data.sbbh];
    if (data.sbbh == '无关联设备') data.sbbh = '';
    data.fl = that.data.cate[data.fl];
    data.whry = that.data.users[data.whry];
    //删除json对象的不相干的属性
    delete data.zdname; //删除data json对象的zdname属性
    console.log("重组后的数据：" + JSON.stringify(data)); return;
    //验证通过后，保存数据
    http.request({
      url: app.globalData.ApiUrl + '/repairs',
      method: 'POST',
      data: {
        OTAId: that.data.userInfo.uname,
        Parameter: data,
        Signature: ""
      },
    }).then((res) => {
      console.log(res);
      let _url = "/pages/msg/msg_fail";
      //res.code==200 && res.result
      if (1 == 1) {
        _url = "/pages/msg/msg_success";
        //_url += '?url=/' + that.getCurrentPageUrl(); //当前页面url;
        _url += '?url=/pages/repairs/index/index'; //指定其他URL
      }
      //navigateTo/redirectTo
      console.log(_url);
      //关闭当前页面，跳转到应用内的某个页面
      wx.navigateTo({
        url: _url
      })
    }).catch((err) => {
      console.log(err);
    });
    return;

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let id = options.id;
    this.setData({
      id: id
    });
    //检查用户是否登录
    user.chklogin().then((res) => {
      //如果已经登录，从缓存中把登录信息赋值给userInfo
      console.log("第1步：读取登录信息");
      that.setData({
        userInfo: res.data
      });
    }).then((res) => {
      console.log("第2步：读取登录用户的相关的事务");
      //读取登录用户的相关的事务
      that.getUsers();
      that.getRepairs();
    }).catch((err) => {
      console.log(err);
    });
    return;

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