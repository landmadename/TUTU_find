const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
/*    found_places: ['仓库的架子的上面', '家里的小卧室的第一个抽屉'], 
    code: 1, 
    found_name: '打气筒'*/
  },

  /**
   * 生命周期函数--监听页面加载
   */
  navigate(e){
    var path = e.target.dataset.path
    path = path.split('的')
    path.unshift('TUTU')
    app.globalData.find_path = path
    wx.switchTab({
      url: '/pages/edit/edit'
    })
  },

  find(sth) {
    var server = app.globalData.server+"find"
    var skey = app.globalData.skey
    var data
    var that = this
    wx.request({
      url: server,
      method: 'POST',
      data: { sth: sth, skey: skey, mode: '0' },
      header:{'content-type': 'application/x-www-form-urlencoded'},
      success: function(res){
        data = res.data
        console.log(data)
        switch (data['code']) {
          case -1:
            that.setData({
              code: data.code
            })
            break;
          case 0:
            that.setData({
              code: data.code,
              similar_names: data.similar_names
            })
            break;
          case 1:
            that.setData({
              code: data.code,
              found_name: data.name,
              found_places: data.places
            })
            break;
          case 2:
            that.setData({
              code: data.code
            })
        }
      }

    })
  },

  search(e){
    this.find(e.detail.detail.value)
  },

  search_by_click(e){
    this.find(e.currentTarget.dataset.name)
  },

  log_it(e){
    console.log(e)
  },

  onLoad: function (options) {
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