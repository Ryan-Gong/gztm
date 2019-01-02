// components/toast/toast.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    /* type: 'fail',*/
    /* success, success_no_circle, info, warn, waiting, cancel, download, search, clear */
    type: '',
    title: '我是自定义toast',
    isShow: false,
    animationData: '',
    duration: 3000
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showToast: function (data) {
      const self = this;
      if (this._showTimer) {
        clearTimeout(this._showTimer)
      }
      if (this._animationTimer) {
        clearTimeout(this._animationTimer)
      }
      // display需要先设置为block之后，才能执行动画
      this.setData({
        title: data.title,
        type: data.type,
        isShow: true,
      });
      this._animationTimer = setTimeout(() => {
        const animation = wx.createAnimation({
          duration: 500,
          timingFunction: 'ease',
          delay: 0
        })
        animation.opacity(1).step();
        self.setData({
          animationData: animation.export(),
        })
      }, 50)
      this._showTimer = setTimeout(function () {
        self.hideToast();
        if (data.compelete && (typeof data.compelete === 'function')) {
          data.compelete()
        }
      }, 1200 || (50 + data.duration))
    },

    hideToast: function () {
      if (this._hideTimer) {
        clearTimeout(this._hideTimer)
      }
      let animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease',
        delay: 0
      })
      animation.opacity(0).step();
      this.setData({
        animationData: animation.export(),
      })
      this._hideTimer = setTimeout(() => {
        this.setData({
          isShow: false,
        })
      }, 250)
    },
    //
  }
})