// pages/settings/settings.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    skey:'test key',
    domin:'http://47.100.40.72:30001/'
  },

  set_domin(e){
    var data = e.detail.detail.value
    app.globalData.server=data
    app.globalData.reload=true
    wx.setStorage({
      key: 'domin',
      data: data
    })
  }, 
  
  set_skey(e) {
    var data = e.detail.detail.value
    app.globalData.skey = data
    app.globalData.reload=true
    this.setData({
      skey: data
    })
    wx.setStorage({
      key: 'skey',
      data: data
    })
  },

  use_wx_as_a_key(e){
    var data={'detail':{"detail":{"value":e.detail.signature}}}
    this.set_skey(data)
    console.log(e)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getStorage({
      key: 'domin',
      success: function (res) {
        that.setData({
          domin:res.data
        })
      }
    })

    wx.getStorage({
      key: 'skey',
      success: function (res) {
        that.setData({
          skey: res.data
        })
      }
    })

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