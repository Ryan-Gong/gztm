/**
 * name: request.js
 * description: request处理基础类--ES6 标准
 * 用Promise封装wx.request()，简化代码结构
 * author: ryan gong
 * date: 2018-12-20
 */
class httpRequest {

  constructor() {
    this.apiUrl = 'http://127.0.0.1:84';
    this._defaultHeader = { 'Content-Type': 'application/json' }
    this.sessionId = wx.getStorageSync('sessionId');
    this.loginQueue = []; //用于队列
    this.isLoginning = false; //这个变量来充当锁的角色，锁的目的就是当登录正在进行中的时候，告诉程序“我已经在登录了，你先把回调都加队列里去吧”，当登录结束之后，回来将锁解开，把回调全部执行并清空队列。
  }

  /**
   * 网络请求
   */
  request(options = {}) {
    const {
      url,
      data = {},
      //header = {},
      method = 'GET', // 有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      dataType,
      responseType,
      success,
      fail,
      complete,
    } = options;

    // 统一注入约定的header
    //为了登录并且顺利获取到了sessionId，把sessionId通过请求带上去。
    let sessionId = this.sessionId;
    const header = Object.assign({
      sessionId, //通过header的方式来携带sessionId
      Accept: 'application/json;charset=UTF-8',
    }, options.header);

    // 定义一个 promise 对象,并直接返回
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        data,
        header,
        method,
        dataType,
        responseType,
        success(r) {
          const isSuccess = this.isHttpSuccess(r.statusCode);
          if (isSuccess) { // 成功的请求状态
            if (success) {
              success(r.data);
            }
            resolve(r.data);
          } else {
            if (fail) {
              fail({
                msg: `服务器好像出了点小问题，请与客服联系~（错误代码：${r.statusCode}）`,
                detail: r,
              });
            }
            reject({
              msg: `服务器好像出了点小问题，请与客服联系~（错误代码：${r.statusCode}）`,
              detail: r,
            });
          }
        },
        fail(err) {
          if (fail) {
            fail(err);
          }
          reject(err);
        },
        complete,
      });
    });
  }

  /**
   * 微信登录wx.login
   */
  login(){
    var that = this;
    return new Promise((resolve, reject) => {
      // 微信登录
      wx.login({
        success(r1) {
          if (r1.code) {
            // 获取sessionId
            that.request({
              url: `${apiUrl}/api/login`,
              method: 'POST',
              data: {
                jsCode: r1.code,
              },
            }).then((r2) => {
              if (r2.code === 0) {
                const newSessionId = r2.data.sessionId;
                that.sessionId = newSessionId; // 更新sessionId
                try {
                  // 保存sessionId
                  wx.setStorage({
                    key: 'sessionId',
                    data: newSessionId,
                  });
                  resolve(r2);
                } catch (err) {
                  reject(err);
                }
              } else {
                reject(r2);
              }
            })
              .catch((err) => {
                reject(err);
              });
          } else {
            reject(r1);
          }
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }

  /**
   * ajax高级封装
   * @param {object} options {}
   * @param {boolean} keepLogin true 是为了适配有些接口不需要sessionId
   */
  requestP (options = {}, keepLogin = true){
    var _this = this;
    if (keepLogin) {
      return new Promise((resolve, reject) => {
        _this.getSessionId()
          .then(() => {
            // 获取sessionId成功之后，发起请求
            _this.request(options)
              .then((r2) => {
                if (r2.code === 3000) {
                  // 登录状态无效，则重新走一遍登录流程
                  // 销毁本地已失效的sessionId
                  _this.sessionId = '';
                  _this.getSessionId()
                    .then(() => {
                      _this.request(options)
                        .then((r4) => {
                          resolve(r4);
                        })
                        .catch((err) => {
                          reject(err);
                        });
                    });
                } else {
                  resolve(r2);
                }
              })
              .catch((err) => {
                // 请求出错
                reject(err);
              });
          })
          .catch((err) => {
            // 获取sessionId失败
            reject(err);
          });
      });
    }
    // 不需要sessionId，直接发起请求
    return _this.request(options);
  }

  /**
   * 图片上传
   */
  uploadFile (data){
    var _this = this;
    const url = `${apiUrl}/api/uploadFile`;
    let sessionId = _this.sessionId;
    const fn = () => new Promise((resolve, reject) => {
      wx.uploadFile({
        url,
        filePath: data.filePath,
        formData: {
          type: data.type, // 1公司logo
        },
        name: 'file',
        header: {
          sessionId,
        },
        success(r) {
          const isSuccess = _this.isHttpSuccess(r.statusCode);
          if (isSuccess) { // 成功的请求状态
            resolve(JSON.parse(r.data));
          } else {
            reject({
              msg: `服务器好像出了点小问题，请与客服联系~（错误代码：${r.statusCode}）`,
              detail: r,
            });
          }
        },
        fail(err) {
          reject(err);
        },
      });
    });
    return new Promise((resolve, reject) => {
      _this.getSessionId()
        .then(() => {
          fn()
            .then((r) => {
              if (r.code === 3000) {
                sessionId = '';
                _this.getSessionId()
                  .then(() => {
                    fn().then(resolve).catch(reject);
                  })
                  .catch(reject);
              } else {
                resolve(r);
              }
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  /**
   * 设置请求地址
   */
  getUrl(url) {
    //URL中是否含有 http:// 或者 https://
    if (url.substr(0, 7).toLowerCase() == "http://" || url.substr(0, 8).toLowerCase() == "https://") {
      return url;
    }
    return url = this.apiUrl + url;
  }

  /**
   * 判断请求状态是否成功
   * 参数：http状态码
   * 返回值：[Boolen]
   */
  isHttpSuccess(status){
    return (status >= 200 && status < 300) || status === 304;
  }

  /**
   * 获取sessionId
   * 并发处理
   * 队列是很常用的用法，一般用在解决并发，也就是说，当机器一次性只能解决有限个任务的时候，我们把超出的任务缓存起来，以排队的形式，当前面的一个任务被解决的时候，便把队列里的一个任务出栈去执行
   */
  getSessionId(){
    // 定义一个 promise 对象,并直接返回
    return new Promise((resolve, reject) => {
      // 本地sessionId丢失，重新登录
      if (!this.sessionId) {
        this.loginQueue.push({ resolve, reject });

        if (!this.isLoginning) {
          this.isLoginning = true;

          this.login()
            .then((r1) => {
              this.isLoginning = false;
              this.loginQueue.map(q => q.resolve(r1.data.sessionId));
              this.loginQueue = [];
            })
            .catch((err) => {
              this.isLoginning = false;
              this.loginQueue.map(q => q.reject(err));
              this.loginQueue = [];
            });
        }
      } else {
        resolve(sessionId);
      }
    });
  }

}

export default httpRequest

/**
 * 使用方法：
 * 1.在app中引用argriknow
 * import httpRequest from './apis/httpRequest.js'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  //定义一个类型为httpRequest的属性并实例化
  http:new httpRequest()
})
 * 2.在Page里调用
 * //查询课程列表
  getdataList() {
    app.http.request({
      url: app.globalData.ApiUrl + '/repairs',
      method: 'GET',
      data: that.data.query,
    }).then(res => {
        wx.stopPullDownRefresh()
        let list = this.data.page > 2 ? this.data.courseData.concat(res.list) : res.list
        this.setData({
          courseData: list
        })
      })
      .catch(res => {
        wx.stopPullDownRefresh()
        wx.showToast({
          title: '出错了！',
          icon: 'none'
        })
      })
  },
 */