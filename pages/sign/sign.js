var app = getApp();
var calendarSignData;
var date;
var calendarSignDay;
Page({
  data: {
    num: null,
    num1:'',
    num2:'',
    num3:'',
    num4:''
  },
  //事件处理函数
  calendarSign: function () {
    var userId = wx.getStorageSync("loginstatus").data.userId;
    var that=this;
    wx.request({
      url: app.d.csurl1 + '/userSignLog/sign.action', //仅为示例，并非真实的接口地址
      data: {
        userId: userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code=='0000'){
          wx:wx.redirectTo({
            url: '../sign/sign',
            success: function(res) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onShow();  
            },
          })
        }
        that.setData({
          num4:res.data.code
        })
//        console.log(res.data)
        wx.showModal({
          title: '提示',
          duration: 2000,    
          content: res.data.message
        })
      }
    })
    this.setData({
      calendarSignData: calendarSignData,
      calendarSignDay: calendarSignDay
    })
  },
  onLoad: function () {
    var userId = wx.getStorageSync('loginstatus').data.userId
    var that = this
    wx.request({
      url: app.d.csurl1 + '/userSignLog/queryUserSign.action', //仅为示例，并非真实的接口地址
      data: {
        userId: userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
//        console.log(res.data)
        that.setData({
          num: res.data.data.list,
          num1:res.data.data.dayScore,
          num2: res.data.data.numbers,
          num3: res.data.data.todaySign
        })

      }
    })
//    console.log(this.data.num3)
    var mydate = new Date();
    date = mydate.getDate();
    var month=mydate.getMonth()+1;
   // console.log(month)  
    var num3=month+'.'+date;
   // console.log(num3)
   // console.log("date" + date)
    var day = mydate.getDay();
   // console.log(day)
    var monthDaySize;
    this.setData({
      monthDaySize: monthDaySize,
      month: month,
      date: date,
      calendarSignData: calendarSignData,
      calendarSignDay: calendarSignDay
    })
  }
})
