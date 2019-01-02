// miniprogram/pages/repairs/confirm/confirm.js
//参考：http://caibaojian.com/xiaochengxu-swiper-tab.html
//1.把所有子项的数据都放在list里面
//2.们根据curListId知道当前需要请求那个对象。把剩下的数据合并在同一个对象里面。

const app = getApp();
var user = require("../../../utils/user.js");
var http = require("../../../request/httpRequest.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',//用户登录信息
    //导航栏
    navbarTitle: [{
      "columnName": '待确定',
      "columnId": "1"
    }, {
      "columnName": '全部',
      "columnId": "0"
    }],
    navbarActiveIndex: 0,

    navPosition: [], //导航栏各个TAB的位置
    scrollLeft: 0, //navbar scroll-view 使用

    px2rpx: 2,
    windowWidth: 375,//屏幕可用宽度
    windowHeight: '',//屏幕可用高度
    isHideLoadMore: true,//是否隐藏加载提示
    isComplete: false,//是否全部加载完毕
    
    endTipHidden: false,
    endTip: '正在加载',

    list: {},//把所有子项的数据都放在list里面
    curListId: 0, //滑动到底部时，我们根据curListId知道当前需要请求那个对象

    //请求参数 query
    query: {
      keys: '',
      pageIndex: 1,
      pageSize: 10,
    },
  },

  /**
   * 点击导航栏
   */
  onNavBarTap: function (e) {
    // 获取点击的navbar的index
    let navbarTapIndex = e.currentTarget.dataset.navbarIndex;
    // let index = e.currentTarget.dataset.index;
    this.switchNav(navbarTapIndex);
  },

  //滑动swiper
  bindchange: function (e) {
    let index = e.detail.current;
    //加上这个避免swiper过程，swiper-item会发生滑动混乱，滑动过快就会一直在闪动，新的API属性，touch说明是用户接触滑动，而不是自动滑动
    if (e.detail.source && e.detail.source == 'touch') {
      this.switchNav(index);
    }
  },

  //切换导航（包含滑动swiper和切换导航跳转）
  switchNav: function (index) {
    let that = this;

    if (index && that.data.navbarActiveIndex == index) return;
    
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    that.setData({
      navbarActiveIndex: index
    });
    
    //读取数据
    let cid = that.data.navbarTitle[index].columnId;
    that.getList(cid);
  },

  /**
   * 动画结束时会触发 animationfinish 事件
   */
  onBindAnimationFinish: function ({ detail }) {

  },

  //滚动到底部触发事件
  loadmore: function (e) {
    let that = this;
    let list = that.data.list;
    let cid = that.data.curListId;
    //如果还有数据
    if (list[cid].pageIndex < list[cid].pageCount) {
      //模拟加载--期间为了显示正在加载中的效果-模拟网络延迟
      setTimeout(() => {
        //网络返回请求
        that.getList(cid);
      }, 1500);//1.5秒的定时器
    }
    return;
    //---以下是老的方法；暂时不使用-----
    if (!that.data.isComplete) {
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
        that.getList(cid);
      }, 1500);//1.5秒的定时器
    };
  },

  //滚动时触发-滚动记录之前的滚动位置
  // 在滚动的过程中，不断的记录更新每一个子项它最后滚动到的位置，
  // 下次进入这一屏，就看看数据里面有没有这个滚动值，没有的话，就是第一次进入，默认为0，
  // 如果有值，说明之前我们已经滚动过一次，则赋值给scroll-view的scroll-top
  scroll: function (e) {
    let that = this;
    setTimeout(function () {
      console.log(e.detail.scrollTop);
      let list = that.data.list;
      if (list[that.data.curListId]) {
        list[that.data.curListId].scrollTop = e.detail.scrollTop;
        that.setData({
          list
        })
      }
    }, 300);
  },
  /**
   * 请求列表
   * cid=that.data.navbarTitle[index].columnId
   * 选项卡类别的对应数据库的ID
   */
  getList: function (cid) {
    //console.log('cc:' + cid);
    let that = this;
    that.setData({
      curListId: cid
    });
    let list = that.data.list;
    //组装请求参数
    let query = {
      OTAId: that.data.userInfo.uname,
      Parameter: {
        mode:'confirm',
        keys:'', //关键词
        columnId: cid,//或者用 that.data.curListId,
        pageSize: that.data.query.pageSize,
        pageIndex: 1, //先读取第一页
      },
      Signature: ''
    };
    if (!list[cid]) {
      query.Parameter.pageIndex=1;
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
        // obj.data = list[cid].data.concat(ds);
        //列数*每列的高度（固定）+ 状态栏的高度（正在加载/没有更多了）
        obj.swiperHeight = result.count > result.pageSize * result.pageIndex ? result.pageSize * result.pageIndex * 550 + 102 : result.count * 550 + 102;
        if (result.pageIndex * result.pageSize >= result.count) {
          obj.endTip = '没有更多了';
          obj.endTipHidden = true;
        } else {
          obj.endTip = '正在加载';
        }
        list[cid] = obj;
        that.setData({
          list
        });
        console.log(that.data.list);
      }).catch((err) => {
        console.log(err);
      });
    }else{
      query.Parameter.pageIndex = list[cid].pageIndex + 1;
      if (list[cid].pageIndex < list[cid].pageCount) {
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
          //obj.data = ds;
          obj.data = list[cid].data.concat(ds);
          obj.swiperHeight = result.count > result.pageSize * result.pageIndex ? result.pageSize * result.pageIndex * 550 + 102 : result.count * 550 + 102;
          if (result.pageIndex * result.pageSize >= result.count) {
            obj.endTip = '没有更多了';
            obj.endTipHidden = true;
          } else {
            obj.endTip = '正在加载';
          }
          list[cid] = obj;
          that.setData({
            list
          });
          console.log(that.data.list);
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
        console.log(res);
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          px2rpx: 750 / res.windowWidth
        })
      },
    });
  },

  //获取导航和节点[扩展：也可以通过wx.request 获取API中的Tab数据]
  getNav: function (index) {
    //https://developers.weixin.qq.com/miniprogram/dev/api/SelectorQuery.selectAll.html
    let that = this;
    //获取导航的初始位置
    const query = wx.createSelectorQuery().in(this);//创建节点查询器 query
    //选择class=navbar-item的节点,获取节点位置信息的查询请求
    query.selectAll('.navbar-item').boundingClientRect(function (res) {
      //console.log(res);
      that.setData({
        navPosition: res[0]
      });
      if (index >= 4) {
        that.setData({
          scrollLeft: res[0][index].left
        })
      }
    }).exec();
    //query.selectViewport().scrollOffset();//获取页面滑动位置的查询请求
    that.getList(that.data.navbarTitle[index].columnId);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let index = options.index || 0;
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
      that.getNav(index);
    }).then((res)=>{
      
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