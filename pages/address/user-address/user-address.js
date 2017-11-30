// pages/address/user-address/user-address.js
var app = getApp()
Page({
  data: {
    address: [],
    radioindex: '',
    pro_id: 0,
    num: 0,
    cartId: 0
  },
  onLoad: function (options) {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    var cartId = options.cartId;
    var userId = wx.getStorageSync('loginstatus').data.userId
    wx.request({
      url: app.d.csurl + '/getUserAddress.action',
      // url: app.d.bturl + '/getUserAddress.action',
      data: {
        userId: userId
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        //console.log(res.data)
        // success
        var address = res.data.data;
        if (address == '') {
          var address = []
        }
        that.setData({
          address: address,
          cartId: cartId,
        })
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

  onReady: function () {
    // 页面渲染完成  
  },
  setDefault: function (e) {
    // console.log(e)
    var that = this;

    var userId = wx.getStorageSync('loginstatus').data.userId;
    var uaId = e.currentTarget.dataset.id
    // console.log(uaId)
    wx.request({
      url: app.d.csurl + '/setUserDefaultAddr.action',
      // url: app.d.bturl + '/setUserDefaultAddr.action',
      data: {
        uiId: userId,
        uaId: uaId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res)
        // success
        var code = res.data.code;
        var cartId = that.data.cartId;
        if (code == '0000') {
          wx.showToast({
            title:res.data.message,
            duration: 2000
          });
          that.DataonLoad();
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
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
  delAddress: function (e) {
    // console.log(e)
    var that = this;
    var userId = wx.getStorageSync('loginstatus').data.userId;
    var uaId = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function (res) {
        res.confirm && wx.request({
          url: app.d.csurl + '/deleteUserAddress.action',
          // url: app.d.bturl +'/deleteUserAddress.action',
          data: {
            userId: userId,
            uaId: uaId
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT         
          success: function (res) {
            // console.log(res.data)
            // success
            var code = res.data.code;
            if (code == '0000') {
              that.DataonLoad()
              wx.showToast({
                title: res.data.message,
                duration: 2000,
              });
            } else {
              wx.showToast({
                title: res.data.message,
                duration: 2000,

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
        });
      }
    });

  },
  DataonLoad: function () {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    var userId = wx.getStorageSync('loginstatus').data.userId
    wx.request({
      url: app.d.csurl + '/getUserAddress.action',
      // url: app.d.bturl + '/getUserAddress.action',
      data: {
        userId: userId
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        // console.log(res.data)
        // success
        var address = res.data.data;
        if (address == '') {
          var address = []
        }
        that.setData({
          address: address,
          // cartId: cartId,
        })
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
  modifyAddress:function(event){
    var id=event.currentTarget.dataset.id
    var modifyaddress;
    for (var i = 0; i < this.data.address.length;i++)
    {
      if(this.data.address[i].uaId==id)
      {
        modifyaddress=this.data.address[i]
      }
    }
//    console.log(event)
    //console.log(this.data.address)
    var arry = new Array(modifyaddress.uaConsignee, modifyaddress.uaPhone, modifyaddress.uaAddress, modifyaddress.uaId)
    wx.setStorageSync("modifyAddress", arry)
    wx.navigateTo({
      url: '../modify-address/modifyaddress',
    })
  }
})