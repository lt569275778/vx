// pages/phone/wphone/wphone.js

var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    second: 60,
    hid: 'none',
    input1: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    countdown(this);
    var callp = wx.getStorageSync("phone")
    this.setData({
      callphone: callp[0]
    })
  },
  input: function (e) {
    this.setData({
      input1: e.detail.value
    })
  },
  send: function (e) {
    var phone;
    var call=wx.getStorageSync("phone");
    var that=this;
    wx.request({
      url: app.d.csurl1 + '/free/common/getCode.action',
      data: {
        phone: call[0],
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
          that.setData({
            second: 60
          })
          countdown(that);
        } else {
          wx.showToast({
            title: res.data.message,
            duration: 2000
          });
          that.setData({
            second: 60
          })
          countdown(that);
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })

  },
  submit: function (e) {
    var callp = wx.getStorageSync("phone");
    var userid = wx.getStorageSync("loginstatus").data.userId;
    var that = this;
    wx.request({
      url: app.d.csurl1 + '/wxUser/bindPhone.action', //仅为示例，并非真实的接口地址
      data: {
        userId: userid,
        phone: callp[0],
        validateCode: this.data.input1
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
//        console.log(res.data)
        var code = res.data.code;
        if (code == '0000') {
        that.setData({
          hid: 'block'
        });
        wx.request({
          url: app.d.csurl1 + '/wxUser/wxUserCenter.action',
          data: {
            userId: userid
          },
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
//            console.log(res.data)
            that.setData({
              widowsphone: res.data.data.phone
            })
          }
        });
        hide()
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'loading',
            duration: 2000
          })
        }
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
    hide()
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
function hide(){
  setTimeout(function () {
    wx.switchTab({
      url: '../../mine/mine',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return; 
        page.onLoad();
      } 
    })
  }, 1000)
}
function countdown(that) {
  var second = that.data.second
  if (second == 0) {
    // console.log("Time Out...");
    that.setData({
      second: "0"
    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }
    , 1000)
}