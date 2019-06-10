App({
  globalData:{
    server: "http://47.100.40.72:30001/",
    skey: "test key",
    find_path: false,
    reload: false
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    var that = this
    wx.getStorage({
      key: 'domin',
      success: function(res) {
        that.globalData.server = res.data
      },
      fail: function(res){
        that.globalData.server = "http://47.100.40.72:30001/"
      }
    })

    wx.getStorage({
      key: 'skey',
      success: function (res) {
        that.globalData.skey = res
      },
      fail: function (res) {
        that.globalData.skey = "test key"
      }
    })

  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
