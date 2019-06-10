// pages/edit/edit.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    path: ['TUTU'],
    tabs: [],
    now: 0,
    to_edit: [],
    edit_show: false,
    add_item_show: false,
    add_folder_show: false,
    edit_folder_show: false,
    big_box: false,
    sorted_data: false,
    draw_show: false,
    reset_path_show: false
  },

  refresh(){
    //confirm path
    var p = this.data.path
    p.push(' ')
    this.setData({
      path: p
    })
    p.pop()
    this.setData({
      path: p
    })

    //set tabs
    var t = []
    var now = this.data.big_box
    var name, flag = "box", temp = [], keys

    for (var i in this.data.path) {
      name = this.data.path[i]
      if (Object.keys(now[name])[0] != 'thing') {
        keys = Object.keys(now[name])
        for (var ii in keys) {
          temp.push([0, keys[ii]])
        }
        t.push(temp)
        temp = []
      }
      else {
        keys = now[name]['thing']
        for (var ii in keys) {
          temp.push([1, keys[ii]])
        }
        t.push(temp)
        temp = []
      }
      now = now[name]
    }
    this.setData({
      tabs: t
    })
    
  },

  changePath(e) {
    var p = this.get_current_path()
    p.push(e.target.id)
    this.setData({
      path: p,
      now: this.data.now + 1
    })

    this.refresh()
  },

  logSite(e){
    this.setData({
      now: e.detail.currentIndex
    })
  },

  popEdit(e){
    this.setData({
      to_edit: e.currentTarget.dataset.data,
      edit_show: true
    })
  },

  edit_item(e){
    var p = this.get_current_path()
    p.shift()

    var data = e.detail.value
    var item = [this.data.to_edit[0],
                data.name,
                parseInt(data.count),
                data.from_,
                data.to_,
                this.data.to_edit[5],
                '',
                '!']
    item.splice(5, 0, p.join("$"))
    item = { "type": "items", "data": [item] }
    item = JSON.stringify(item)
    this.setData({
      edit_show: false
    })
    this.post_items(item)
  },

  get_current_path(){
    var p

    p = this.data.path
    p = p.slice(0, this.data.now + 1)
    return p
  },

  post_items(item){
    var that = this
    var server = app.globalData.server + "post"
    var skey = app.globalData.skey
    wx.request({
      url: server,
      method: 'POST',
      data: { skey: skey, data: item },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        var data = res.data
        console.log(data)
        switch (data['code']) {
          case -1:
            break;
          case 0:
            break;
          case 1:
            that.setData({
              big_box: { "TUTU": data['data'] }
            })
            that.refresh()
            break;
        }
      }
    })

  },


  add_item(e) {
    var p = this.get_current_path()
    p.shift()

    var data = e.detail.value
    var that = this
    var item = [0,
                data.name,
                parseInt(data.count),
                data.from_,
                data.to_,
                "in_time",
                '',
                '+']
    item.splice(5, 0, p.join("$"))
    item = { "type": "items", "data": [item]}
    item = JSON.stringify(item)
    this.setData({
      add_item_show: false
    })
    this.post_items(item)
    if(this.data.delete_empty){
      this.delete_item()
      this.setData({
        delete_empty: false
      })
    }
  },

  delete_item(e){
    var p = this.get_current_path()
    var data = this.to_line_data(this.find_by_path(p))
    console.log(data, this.delete_empty)
    if(data.length <= 1 && !this.data.delete_empty){
    //add init
    p.shift()
    var item = [ 0,
                "__init__",
                0,
                "",
                "",
                "",
                "",
                '+']
    item.splice(5, 0, p.join("$"))
    item = { "type": "items", "data": [item] }
    item = JSON.stringify(item)
    this.post_items(item)
    }


    var item = [this.data.to_edit[0],
                "",
                "",
                "",
                "",
                "",
                "",
                "-"]
    item = { "type": "items", "data": [item] }
    item = JSON.stringify(item)
    this.setData({
      edit_show: false
    })
    this.post_items(item)
  },

  folder_panel_show(e){
    var p = this.get_current_path()
    p.push(e.currentTarget.id)
    this.setData({
      to_edit: p,
      edit_folder_show: true
    })
  },
  
  delete_folder(e){
    var path = this.data.to_edit
    var data, item

    data = this.to_line_data(this.find_by_path(path))
    path.shift()
    for (var i in data) {
      data[i][5] = path.join("$") + "$" + data[i][5]
      data[i][8] = "-"
    }
    item = { "type": "items", "data": data }
    item = JSON.stringify(item)
    path.unshift("TUTU")
    path.pop()
    this.setData({
      path: path,
      edit_folder_show: false
    })
    this.post_items(item)
  },

  edit_folder_name(e){
    var to_name = e.detail.value.name
    var path = this.data.to_edit
    var data, item
    if(to_name == ""){
      return 0
    }

    data = this.to_line_data(this.find_by_path(path))
    path.pop()
    path.shift()
    path.push(to_name)
    console.log(path)
    for(var i in data){
      data[i][5] = path.join("$") + (data[i][5]&&"$") + data[i][5]
      data[i][8] = "!"
    }
    item = { "type": "items", "data": data }
    item = JSON.stringify(item)
    path.unshift("TUTU")
    path.pop()
    this.setData({
      path: path,
      edit_folder_show: false
    })

    this.post_items(item)
  },

  add_folder(e){
    var p = this.get_current_path()
    p.shift()

    var name = e.detail.value.name
    p.push(name)
    console.log(p)
    var item = [0,
                "__init__",
                0,
                "",
                "",
                "",
                "",
                '+']
    item.splice(5, 0, p.join("$"))
    item = { "type": "items", "data": [item] }
    item = JSON.stringify(item)

    p.unshift("TUTU")
    this.setData({
      path: p,
      now: p.length-1,
      add_folder_show: false
    })
    this.post_items(item)
    if (this.data.delete_empty) {
      this.delete_item()
      this.setData({
        delete_empty: false
      })
    }  },

  find_by_path(p){
    var now = this.data.big_box
    var name, temp = [], keys

    for (var i in p) {
      if(!!now[p[i]]){
        now = now[p[i]]
      }
    }
    return now
  },

  add(e){
    if (!this.data.tabs[this.data.now][0]){
      this.setData({
        add_folder_show: true
      })
    }
    else if (this.data.tabs[this.data.now][0][0] == 1){
      this.setData({
        add_item_show: true
      })
    }
    else if (this.data.tabs[this.data.now][0][0] == 0){
      this.setData({
        add_folder_show: true
      })
    }
  },

  to_line_data(d){
      function get_data(data){
          for(var i in data){
              path.push(i)
              if(i == 'thing'){
                  for(var ii in data[i]){
                      data[i][ii].splice(5, 0, path.slice(0,-1).join("$"))
                      things.push(data[i][ii])
                  }
              }
              else{
                  get_data(data[i])
              }
              path.pop()
              }
          }
          
      var data = JSON.parse(JSON.stringify(d))
      var path = []
      var things = []
      get_data(data)
      return things
  },

  add_folder_in_new_folder(e){
    this.setData({
      to_edit: e.currentTarget.dataset.data,
      add_folder_show: true,
      delete_empty: true
    })
  },

  add_item_in_new_folder(e){
    this.setData({
      to_edit: e.currentTarget.dataset.data,
      add_item_show: true,
      delete_empty: true
    })
  },

  load_data(){
    var server = app.globalData.server + "get"
    var skey = app.globalData.skey
    var that = this
    wx.request({
      url: server,
      method: 'POST',
      data: { skey: skey },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        var data = res.data
        console.log(data)
        switch (data['code']) {
          case -1:
            break;
          case 0:
            that.setData({
              big_box: { "TUTU": {} }
            })
            that.refresh()
            break;
          case 1:
            that.setData({
              big_box: { "TUTU": data['data'] }
            })
            that.refresh()
            break;
        }
      },
      fail: function (res){
        console.log('Wrong')
      }

    })
  },

  tap_sorted_item(e) {
    this.setData({
      path: e.target.dataset.path.split("$"),
      draw_show: false
    })
    this.refresh()
  }, 
  
  tap_drawer_opener() {
    var d
    var data = this.to_line_data(this.data.big_box)
    console.log(data)
    data.sort(function (a, b) {
      return b[6] - a[6]
    })
    for (var i in data) {
      d = new Date(parseInt(data[i][6]) * 1000)
      if(data[i][1] == "__init__"){
        data[i][1] = "一个空的路径"
      }
      data[i][6] = d.getFullYear() + "." + d.getMonth() + "." + d.getDate() + "      " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
    }

    this.setData({
      draw_show: true,
      sorted_data: data
    })
  },

  tap_reset_path(){
    this.setData({
      edit_folder_show:false,
      reset_path_show:true,
    })
  },

  reset_path(e){
    var to_name = e.detail.value.name
    var path = this.data.to_edit
    var data, item


    data = this.to_line_data(this.find_by_path(path))

    for (var i in data) {
      data[i][5] = to_name + (to_name && "$") + path[path.length-1] + (data[i][5] && "$") + data[i][5]
      data[i][8] = "!"
    }
    item = { "type": "items", "data": data }
    item = JSON.stringify(item)
    path=to_name.split('$')
    path.unshift('TUTU')
    this.setData({
      path: path,
      reset_path_show: false
    })

    this.post_items(item)

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.load_data()
    this.setData({
      path: ['TUTU'],
      now: 0
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
    this.load_data()
    this.setData({
      now: 0
    })

    if (!!app.globalData.reload){
      app.globalData.reload = false
      this.onLoad()
    }

    if (!!app.globalData.find_path){
      this.setData({
        path: app.globalData.find_path
      })
      if(!!this.data.big_box){
        this.refresh()
      }
      app.globalData.find_path = false
    }
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