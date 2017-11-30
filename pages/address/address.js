//城市选择
var app = getApp();
var flag=false;
Page({
  data: {
    name: "收货人姓名",
    tel: "手机号码",
    addreValue: 0,
    door: "街道、小区等详细地址",
    shengArr: [],//省级数组
    shengId: [],//省级id数组
    shiArr: [],//城市数组
    shiId: [],//城市id数组
    quArr: [],//区数组
    shengIndex: 0,
    shiIndex: 0,
    quIndex: 0,
    mid: 0,
    sheng: 0,
    city: 0,
    area: 0,
    code: 0,
    cartId: 0
  },
  formSubmit: function (e) {
//    console.log(e)
    var adds = e.detail.value;
    var cartId = this.data.cartId;
    var userId = wx.getStorageSync('loginstatus').data.userId;
    var warn = "";
    if (e.detail.value.name == "") {
      warn = "请填写您的姓名！";
    } else if (e.detail.value.phone == "") {
      warn = "请填写您的手机号！";
    } else if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(e.detail.value.phone))) {
      warn = "手机号格式不正确";
    } else if (e.detail.value.city == '请选择') {
      warn = "请选择您的所在城市";
    } else if (e.detail.value.province == "请选择") {
      warn = "请输入您的省";
    } else if (e.detail.value.town == ' ') {
      warn = "请输入您的地区";
    } else {
      flag = true;
    wx.request({
      url: app.d.csurl + '/addUserAddress.action',
      data: {
        uiId: userId,
        uaConsignee: adds.name,
        uaPhone: adds.phone,
        uaProvince: this.data.sheng,
        uaCity: this.data.city,
        uaDistrict: this.data.area,
        uaAddress: adds.address,
        // code: this.data.code,
        uaStatus: adds.Status
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res.data)
        // success
        var code = res.data.code;
        if (code == '0000') {
          wx.showToast({
            title: '保存成功！',
            duration: 3000
          });
          wx.redirectTo({
            url: '../../pages/address/user-address/user-address' 
          })
        } else {
          wx.showToast({
            title: res.data.message,
            duration: 2000
          });
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
    }
    if (flag == false) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this;
    that.setData({
      cartId: options.cartId
    })
    // var parentId = e.currentTarget.dataset.id
    //获取省级城市
    wx.request({
      url: app.d.csurl + '/getAllProvinces.action',

      data: {},
      method: 'GET',
      success: function (res) {
        // console.log(res.data)
        var province = res.data.data;
        var sArr = [];
        var sId = [];
        sArr.push('请选择');
        sId.push('0');
        for (var i = 0; i < province.length; i++) {
          sArr.push(province[i].regionName);
          sId.push(province[i].regionId);
        }
        that.setData({
          shengArr: sArr,
          shengId: sId
        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })

  },

  bindPickerChangeshengArr: function (e) {
    // console.log(e)
    this.setData({
      shengIndex: e.detail.value,
      shiArr: [],
      shiId: [],
      quArr: [],
      quiId: []
    });
    var that = this;
    var parentId = this.data.shengId[e.detail.value];
    var parentname = this.data.shengArr[e.detail.value]
    wx.request({
      url: app.d.csurl + '/findRegionByParentId.action',
      data: { parentId: this.data.shengId[e.detail.value] },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        // console.log(res.data)
        // // success
        var city = res.data.data;
        var hArr = [];
        var hId = [];
        hArr.push('请选择');
        hId.push('0');
        for (var i = 0; i < city.length; i++) {
          hArr.push(city[i].regionName);
          hId.push(city[i].regionId);
        }
        that.setData({
          sheng: parentname,
          shiArr: hArr,
          shiId: hId
        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },

    })
  },
  bindPickerChangeshiArr: function (e) {
    // console.log(e)
    this.setData({
      shiIndex: e.detail.value,
      quArr: [],
      quiId: []
    })
    var that = this;
    var parentId = this.data.shiId[e.detail.value] 
    var parentname = this.data.shiArr[e.detail.value] 
    parentname
    wx.request({
      url: app.d.csurl + '/findRegionByParentId.action',
      data: {
        parentId: this.data.shiId[e.detail.value] 
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        // console.log(res.data)
        var area = res.data.data;
        var qArr = [];
        var qId = [];
        qArr.push('请选择');
        qId.push('0');
        for (var i = 0; i < area.length; i++) {
          qArr.push(area[i].regionName)
          qId.push(area[i].regionId)
        }
        that.setData({
          city: parentname,
          quArr: qArr,
          quiId: qId
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
  bindPickerChangequArr: function (e) {
    // console.log(this.data.city)
    this.setData({
      quIndex: e.detail.value
    });
    var that = this;
    var parentId = this.data.shiId[e.detail.value] 
    var parentname = this.data.quArr[e.detail.value]
    wx.request({
      url: app.d.csurl + '/findRegionByParentId.action',
      data: {
        parentId: parentId
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        // console.log(res.data)
        that.setData({
          area: parentname,
          code: res.data.data.code
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
  }
})