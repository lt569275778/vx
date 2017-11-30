// pages/phone/phone.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  Input: function (e) {
    this.setData({
      num: e.detail.value
    })
  },
  submit: function (e) {
    // var num
    var phone;
    var call = new Array(this.data.num)
    wx.setStorageSync("phone", call)
    wx.request({
      url: app.d.csurl1+'/free/common/getCode.action',
      data: {
        phone: this.data.num,
        validateType: '00'
      },
      method: 'GET',
      success: function (res) {
//        console.log(res.data)
        // success
        var code = res.data.code;
        if (code == '0000') {
          wx.showToast({
            title: res.data.message,
            duration: 3000
          });
          wx.navigateTo({
            url: '../phone/wphone/wphone',
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: res.data.message,
          duration: 2000
        });
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