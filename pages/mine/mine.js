var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    widowsphone:'',
    func: [
      // {
      //   text: '绑定手机',
      //   navigateToUrl: '../phone/phone',
      // },
      {
        text: '领奖流程',
        navigateToUrl: '../award/award',       
      },
      {
        text: '积分明细',
        navigateToUrl: '../details/details',
      }, {
        text: '获奖记录',
        navigateToUrl: '../record/record',       
      }, 
      
   
    ],
    nbsp:[
      {
        text: '收货地址',
        navigateToUrl: '../address/user-address/user-address'

      }, {
        text: '常见问题',
        navigateToUrl: '../question/question'

      }
    ],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  getUserInfo: function (e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    var userid = wx.getStorageSync("loginstatus").data.userId;
    var that=this;
      wx.request({
        url: app.d.csurl1 +'/wxUser/wxUserCenter.action',
        data: {
          userId: userid
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
         // console.log(res.data)
          that.setData({
            widowsphone:res.data.data.phone
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