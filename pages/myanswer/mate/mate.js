// pages/myanswer/mate/mate.js
var oneReq;
var twoReq;
var reqNumber=0;
function sleep(d) {
  for (var t = Date.now(); Date.now() - t <= d;);
}
var timer;
var timerReq;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      M_top:'',
      M_img:'',
      F_img: '../../../images/touxiang_02.png',
      F_foot:'李四',
      time:'0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      M_top: userInfo.nickName,
      M_img: userInfo.avatarUrl
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  
  },

  myTimer: function () {
    var timeOut =parseInt(this.data.time) + 1;
   
    if (timeOut < 10) {
      timeOut = '0' + timeOut
    }
    this.setData({
      time: timeOut
    })
    clearTimeout(timer)
    timer = setTimeout(this.myTimer, 1000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.myTimer()
    var that = this
    
    this.setData({
      F_img:"../../../images/mygif.gif"
    })
    wx.request({
      url: getApp().globalData.servUrl + '/client/subjectInfo/matchOpponent.actio', //仅为示例，并非真实的接口地址
      data: {
        userId: wx.getStorageSync('loginstatus').data.userId,
        scId: wx.getStorageSync('anstype')
      },
      success: function (res) {
        oneReq = res.data
        //console.log(oneReq)
        wx.setStorageSync('doubleSuccessRes', oneReq) //存入本地
        if (oneReq.data.matchStatus == 1) //判断匹配成功
        {
          that.setData({
            F_img: oneReq.data.alreadyMatchVo.sendPath ,
            F_foot: oneReq.data.alreadyMatchVo.sendName
          })
          sleep(1000)
          wx.redirectTo({
            url: '../two_answer/two_answer',
          })
        }
        else if (0==oneReq.data.matchStatus)
        {
          sleep(2000)
          that.secondReq()
        }
      },
      fail: function (res) {
       // console.log("发送请求失败！")
      }
    })
  },

/*
第二次请求
*/
  secondReq:function()
  {
    reqNumber++;
    var that=this
    wx.request({
      url: getApp().globalData.servUrl + '/client/subjectInfo/secondMatching.action', //仅为示例，并非真实的接口地址
      data: {
        userId: wx.getStorageSync('loginstatus').data.userId,
        scId: wx.getStorageSync('anstype'),
        uuid: wx.getStorageSync('doubleSuccessRes').data.uuid
      },
      success: function (res) {
        twoReq = res.data
//        console.log(twoReq)
        wx.setStorageSync('doubleSuccessRes', twoReq)
        if (twoReq.code=="0000" && twoReq.data.matchStatus == 1) //判断匹配成功
        {
          that.setData({
            F_img: twoReq.data.alreadyMatchVo.matchPath,
            F_foot: twoReq.data.alreadyMatchVo.matchName
          })
          sleep(1000)
          wx.redirectTo({
            url: '../two_answer/two_answer',
          })
        }
        else if (twoReq.code=="1000" || (0 == twoReq.data.matchStatus)) {
          if(100==reqNumber) //如果请求超过15次，即匹配时间超过30秒
          {
            wx.showModal({
              title: '温馨提示',
              content: '当前未匹配到用户，亲可以换个时间段或分类再试试哟~',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 3
                  })
                } else if (res.cancel) {
//                  console.log('用户点击取消')
                }
              }
            })
            return
          }
          clearTimeout(timerReq)
          timerReq= setTimeout(that.secondReq,2000)
        }
      },
      fail: function (res) {
//        console.log("发送请求失败！")
      }
    })
  }
,
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(timer)
    clearTimeout(timerReq)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
     clearTimeout(timer)
     clearTimeout(timerReq)
     var data = {
       scoreleft: 0,
       scoreright:0,
       anscode: 0,
       rightcount:0,
       time: 10
     }
     wx.setStorageSync('curDataTwo', data)
    
     
     getApp().globalData.userselect = []

     wx.setStorageSync('enemyansNum', 0)
     wx.setStorageSync('enemyLossnet', false)
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