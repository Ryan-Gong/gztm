/**
 * name: agriknow.js
 * description: 赣州天目服务器提供的服务
 * author: ryan gong
 * date: 2018-12-20
 * https://blog.csdn.net/abs1004/article/details/79188197
 */
import request from './request.js'
class agriknow {
  constructor() {
    this._baseUrl = 'http://127.0.0.1:84'
    this._defaultHeader = { 'Content-Type': 'application/json' }
    this._request = new request
    this._request.setErrorHandler(this.errorHander)
  }

  /**
   * 统一的异常处理方法
   */
  errorHander(res) {
    console.error(res)
  }

  /**
   * 设置请求地址
   */
  getUrl(url){
    //URL中是否含有 http:// 或者 https://
    if (url.substr(0, 7).toLowerCase() == "http://" || url.substr(0, 8).toLowerCase() == "https://") {
      return url;
    }
    return url = this._baseUrl + url;
  }

  wxRequest(uri, query = null, method = 'GET') {
    let url = this.getUrl(uri);
    let data = query;
    return this._request.requestAll(url, data, this._defaultHeader, method).then(res => res.data);
  }

  /**
   * 查询所有数据列表
   * uri 查询资源/地址
   * query 请求参数 json格式
   */
  getData(uri, query) {
    let url = this.getUrl(uri);
    //let data = { page: page, size: size }
    let data = query;
    //return this._request.getRequest(this._baseUrl + 'news/client', data).then(res => res.data)
    return this._request.getRequest(url, data).then(res => res.data)
  }
  /**
  getData(uri,page = 1, size = 10) {
    let data = { page: page, size: size }
    //return this._request.getRequest(this._baseUrl + 'news/client', data).then(res => res.data)
    return this._request.getRequest(this._baseUrl + uri, data).then(res => res.data)
  }
   */

  /**
   * 获取所有数据
   */
  getDataList(uri,page = 1, size = 10, key = null) {
    let data = key != null ? { page: page, size: size, queryValue: key } : { page: page, size: size }
    return this._request.getRequest(this._baseUrl + uri, data).then(res => res.data)
  }
}

export default agriknow

/**
 * 使用方法：
 * 1.在app中引用argriknow
 * import agriknow from './apis/agriknow.js'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  //定义一个类型为agriknow的属性并实例化
  agriknow:new agriknow()
})
 * 2.在Page里调用
 * //查询课程列表
  getdataList() {
    app.agriknow.getDataList('/course/',this.data.page++, this.data.size, '')
      .then(res => {
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