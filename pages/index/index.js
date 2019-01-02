//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: '../images/user-unlogin.jpg', //头像地址
    logged: false,
    userInfo: '',//登录信息（json数据）
  },

  onLoad: function () {
    var that = this;

    //异步获取缓存中用户登录信息
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          userInfo: res.data
        });

        //判断是否登录
        console.log("异步获取登录信息：" + JSON.stringify(that.data.userInfo));
      }
    });
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        return;
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    });
    //-----------
  },

  // 打开登陆页面
  onGetOpenid: function () {
    wx.navigateTo({
      url: '../userLogin/userLogin',
    });
  },

  //安全退出
  logout: function () {
    var that = this;
    // 从本地缓存中异步移除指定 key 
    wx.removeStorage({
      key: 'userInfo',
      success: function (res) {
        //重新设置
        that.setData({
          userInfo: ''
        });
      }
    });
    //wx.navigateTo({
    //  url: '../index/index',
    //})
  },

  // 上传图片
  doUpload: function () {
    return;
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  onGetUserInfo: function (e) {
    return;
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

})