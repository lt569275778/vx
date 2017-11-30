Page({
  data: {
    open: false,
    open1: false,
    open2:false,
    open3:false,
    open4:false,
    xuan:false,
    xuan1: false,
    xuan2: false,
    xuan3: false,
    xuan4: false,
    

  },
  showitem: function () {

    
    this.setData({
      open: !this.data.open,
      xuan: !this.data.xuan
    })
  },
  showitem1: function () {
    this.setData({
      open1: !this.data.open1,
      xuan1: !this.data.xuan1
      
    })
  },
  showitem2: function () {
    var that = this
    
    this.setData({
      open2: !this.data.open2,
      xuan2: !this.data.xuan2
      
    })
  },
  showitem3: function () {
  

    this.setData({
      open3: !this.data.open3,
      xuan3: !this.data.xuan3
      
    })
  },
  showitem4: function () {
   

    this.setData({
      open4: !this.data.open4,
      xuan4: !this.data.xuan4
      
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})