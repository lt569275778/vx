// pages/myanswer/oneanswer/oneanswer1/oneanswer1.js
var timer;
var i = 0;
var questionNums = 0;
function sleep(d) {
  for (var t = Date.now(); Date.now() - t <= d;);
}

function strtoInt(str) {
  if (str == 'A') return 0
  else if (str == 'B') return 1
  else if (str == 'C') return 2
  else if (str == 'D') return 3
}

function inttoStr(i) {
  if (i == 0) return 'A'
  else if (i == 1) return 'B'
  else if (i == 2) return 'C'
  else if (i == 3) return 'D'
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isnavigate:false,
    index:0,
    question: '',
    time: 30,
    answer: [],
    result: '',
    anscode: 0,
    userselect: 'none',
    btn_disabled: false,
    nowcore: 0,
    ans_complete: 'none',
    imgs: [
      '../../../images/right.png',
      '../../../images/wrong.png',
      '../../../images/unselect.gif'
    ],
    imgurl: [
      '../../../images/unselect.gif',
      '../../../images/unselect.gif',
      '../../../images/unselect.gif',
      '../../../images/unselect.gif'
    ],
    display: ['none', 'none', 'none', 'none']
  },
  /**
   * 生命周期函数--监听页面加载
   */
  btn_click: function (event) {
    clearTimeout(timer)
    var id = event.currentTarget.id
    this.data.display[id] = 'block'

    var nowobject = wx.getStorageSync('questionkits')[this.data.anscode - 1]
    getApp().globalData.userselect.push({ 'siId': nowobject.siId, 'selectItem': inttoStr(id) })

    // console.log(getApp().globalData.userselect)

    if (strtoInt(this.data.result) == id) {
      this.data.imgurl[id] = this.data.imgs[0]
      this.setData(
        {
          imgurl: this.data.imgurl,
          display: this.data.display,
          nowcore: this.data.nowcore + 15,
          btn_disabled: true,
          userselect: 'none',
          index:1
        }
      )
      sleep(800)
    }
    else {
      this.data.imgurl[id] = this.data.imgs[1]
      this.data.imgurl[strtoInt(this.data.result)] = this.data.imgs[0]
      this.data.display[strtoInt(this.data.result)] = 'block'
      this.setData(
        {
          display: this.data.display,
          imgurl: this.data.imgurl,
          btn_disabled: true,
          userselect: 'block',
        }
      )
      sleep(500)
    }
    var data = {
      nowcore: this.data.nowcore,
      anscode: this.data.anscode,
      time: this.data.time
    }
    wx.setStorageSync('curData', data)
     
    if (parseInt(this.data.anscode) < questionNums) {
      this.nextquestion()
      return
    }
    else if (parseInt(this.data.anscode) == questionNums) {
      this.setData({
        isnavigate: true
      })
      wx.showLoading({
        title: '完成，统计成绩',
      })
      sleep(1000)
      wx.hideLoading()
      wx.redirectTo({
        url: '../statistics/statistics',
      })
    }
  },
  nextquestion: function () {
    this.setData({
      isnavigate:true
    })
    wx.redirectTo({
      url: './oneanswer',
    })
  },
  onLoad: function (options) {
    var curData = wx.getStorageSync('curData')
    i = curData.anscode
    this.setData({
      anscode: ++i,
      nowcore: curData.nowcore,
      time: curData.time
    })

    questionNums = wx.getStorageSync('questionkits').length
    this.setData({
      'questionNums': questionNums
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  myTimer: function () {
    var timeOut = this.data.time - 1;
    if(timeOut<0) return
    if (timeOut == 0) {

      this.setData({
        isnavigate: true
      })
      
      wx.showLoading({
        title: '超时，统计成绩',
      })
      sleep(1000)
      wx.hideLoading()
      wx.redirectTo({
        url: '../statistics/statistics',
      })
    }
    else if (timeOut < 10) {
      timeOut = '0' + timeOut
    }
    this.setData({
      time: timeOut,
    })
    clearTimeout(timer)

    timer = setTimeout(this.myTimer, 1000)
    // end
  },

  resubmit: function () {
    this.setData({
      isnavigate: true
    })
    var that = this
    wx.showModal({
      title: '温馨提示',
      content: '提前交卷不能获得额外积分额~',
      success: function (res) {
        if (res.confirm) {
          clearTimeout(timer)
          wx.showLoading({
            title: '正在统计成绩',
          })
          sleep(1000)
          wx.hideLoading()
          wx.redirectTo({
            url: '../statistics/statistics',
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.myTimer()
    var time = wx.getStorageSync('curData').time
    var nowobject = wx.getStorageSync('questionkits')[this.data.anscode - 1]
    
    var question = nowobject.question
    var answer = nowobject.answer
    var result = nowobject.result
    this.setData(
      {
        question: question,
        time: time,
        answer: answer,
        result: result,
        userselect: 'none',
        btn_disabled: false
      }
    )
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(timer)
    if (!this.data.isnavigate) {
      var data = {
        nowcore: 0,
        anscode: 0,
        time: 60
      }
      wx.setStorageSync('curData', data)
      getApp().globalData.userselect = []
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(timer)
    if (!this.data.isnavigate)
    {
      var data = {
        nowcore: 0,
        anscode: 0,
        time: 60
      }
      wx.setStorageSync('curData', data)
      wx.removeStorageSync('questionkits')
      getApp().globalData.userselect=[]
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
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