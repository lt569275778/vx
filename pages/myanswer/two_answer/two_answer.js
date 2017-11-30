// pages/myanswer/two_answer/two_answer.js
// pages/myanswer/oneanswer/oneanswer1/oneanswer1.js
var timer,timerReq;
var i = 0;
var myId=0;
var myData={};
var questionNums = 0;
var alreadyMatchVo, userId;


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
    head_L: "",
    name_L: "",
    score_L: 0,
    head_R: "",
    name_R: "",
    score_R: 0,
    question: '',
    time: 10,
    isnavigate:false,
    answer: [],
    result: '',
    anscode: 0,
    rightcount:0,
    isnavigate: false,
    userselect: 'none',
    btn_disabled: false,
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
    var id = event.currentTarget.id
    this.data.display[id] = 'block'

    var nowobject = wx.getStorageSync('doubleSuccessRes').data.subjectList[this.data.anscode]
   

    if (strtoInt(this.data.result) == id) {
      this.data.imgurl[id] = this.data.imgs[0]
      this.setData(
        {
          imgurl: this.data.imgurl,
          display: this.data.display,
          score_L: this.data.score_L + 10,
          rightcount:this.data.rightcount+1,
          btn_disabled: true,
          userselect: 'none',
          anscode: this.data.anscode + 1
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
          anscode: this.data.anscode + 1,
        }
      )
    }
   

    if (parseInt(this.data.anscode) < questionNums) {
      this.reqResult()
      return
    }
    else if (parseInt(this.data.anscode) == questionNums) {
      this.setData({
        isnavigate: true
      })

      if (userId == alreadyMatchVo.sendUserId) {
        myData = {
          uuid: alreadyMatchVo.uuid,
          userId: wx.getStorageSync('loginstatus').data.userId,
          sendUserId: alreadyMatchVo.sendUserId,
          sendSubjectCount: this.data.anscode,
          sendRightCount: this.data.rightcount,
          sendScore: this.data.score_L
        }
      }
      else if (userId == alreadyMatchVo.matchUserId) {
        myData = {
          uuid: alreadyMatchVo.uuid,
          userId: wx.getStorageSync('loginstatus').data.userId,
          matchUserId: alreadyMatchVo.matchUserId,
          matchSubjectCount: this.data.anscode,
          matchRightCount: this.data.rightcount,
          matchScore: this.data.score_L
        }
      }
      wx.request({
        url: getApp().globalData.servUrl + '/client/subjectInfo/updateDoubleAnswerResult.action', 
        data: myData,
        method: "POST",
        success:function(res)
        {
//          console.log(res.data)
        }
      })
      wx.showLoading({
        title: '完成，统计成绩',
      })
      sleep(1000)
      wx.hideLoading()
      wx.redirectTo({
        url: '../t_statistics/t_statistics',
      })
    }
  },
  nextquestion: function () {
    this.setData({
      isnavigate: true
    })

    wx.redirectTo({
      url: './two_answer',
    })
  },

  reqResult:function()
  {
    alreadyMatchVo = wx.getStorageSync('doubleSuccessRes').data.alreadyMatchVo
    userId = wx.getStorageSync('loginstatus').data.userId
    if (userId == alreadyMatchVo.sendUserId) {
      myData = {
        uuid: alreadyMatchVo.uuid,
        userId: wx.getStorageSync('loginstatus').data.userId,
        sendUserId: alreadyMatchVo.sendUserId,
        sendSubjectCount: this.data.anscode,
        sendRightCount: this.data.rightcount,
        sendScore: this.data.score_L
      }
    }
    else if (userId == alreadyMatchVo.matchUserId) {
      myData = {
        uuid: alreadyMatchVo.uuid,
        userId: wx.getStorageSync('loginstatus').data.userId,
        matchUserId: alreadyMatchVo.matchUserId,
        matchSubjectCount: this.data.anscode,
        matchRightCount: this.data.rightcount,
        matchScore: this.data.score_L
      }
    }
   // console.log(myData)

    var that=this
    wx.request({
      url: getApp().globalData.servUrl + '/client/subjectInfo/updateDoubleAnswerResult.action', //仅为示例，并非真实的接口地址
      data: myData,
      method:"POST",
      success: function (res) {
        console.log(res.data)
        if(res.data.code=="0000")
        {
          var scoreright = (myId == 1) ? res.data.data.matchScore : res.data.data.sendScore
          var otherSubjectCount = (myId == 1) ? res.data.data.matchSubjectCount:res.data.data.sendSubjectCount
          that.setData(
            {
              score_R: scoreright
            })
          if (otherSubjectCount > wx.getStorageSync('enemyansNum'))
          {
            wx.setStorageSync('enemyansNum', otherSubjectCount)
            wx.setStorageSync('enemyLossnet', false)

          }
          
          if (that.data.time == 0 && (otherSubjectCount == wx.getStorageSync('enemyansNum')) && (that.data.anscode > otherSubjectCount + 1) && that.data.anscode<12)
          {
            wx.setStorageSync('enemyLossnet', true)

          }
//          console.log("other="+otherSubjectCount + "?" + "my="+that.data.anscode)
        
          if (otherSubjectCount == that.data.anscode && (that.data.anscode < 12))
            {
              that.nextquestion()
              return
            }
            else if (wx.getStorageSync('enemyLossnet') || (that.data.time == 0 && (that.data.anscode<12)) )
            {
              that.nextquestion()
              return
            }
          else
          {
            clearTimeout(timerReq)
            timerReq=setTimeout(that.reqResult,2000)
            return
          }
        }
        if(res.data.code=="1000")
        {
//          console.log("返回数据不正确！")
          return
        }
      },
      fail: function (res) {
//        console.log("调用请求失败！")
        return
      }
    })
  },
  onLoad: function (options) {

    alreadyMatchVo = wx.getStorageSync('doubleSuccessRes').data.alreadyMatchVo
    userId = wx.getStorageSync('loginstatus').data.userId
    if (userId == alreadyMatchVo.sendUserId) myId=1
    else if (userId == alreadyMatchVo.matchUserId) myId=2

    var curDataTwo =wx.getStorageSync("curDataTwo")
   
    var alreadyMatchVo = wx.getStorageSync('doubleSuccessRes').data.alreadyMatchVo

    this.setData({
      anscode: curDataTwo.anscode,
      score_L: curDataTwo.scoreleft,
      score_R: curDataTwo.scoreright,
      rightcount:curDataTwo.rightcount,
      head_L: (myId == 1) ? alreadyMatchVo.sendPath : alreadyMatchVo.matchPath,
      name_L: (myId == 1) ? alreadyMatchVo.sendName : alreadyMatchVo.matchName,
      head_R: (myId == 1) ? alreadyMatchVo.matchPath : alreadyMatchVo.sendPath,
      name_R: (myId == 1) ? alreadyMatchVo.matchName : alreadyMatchVo.sendName
    })

    questionNums = wx.getStorageSync('doubleSuccessRes').data.subjectList.length
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
    clearTimeout(timer)
    if (timeOut==-1) return
    
    if (timeOut ==0) {
      this.setData({
        anscode: (this.data.anscode != 12 && (this.data.btn_disabled == false)) ? this.data.anscode + 1 : this.data.anscode,
        time: timeOut,
        isnavigate: true
      })
     
      this.reqResult()

      if (parseInt(this.data.anscode) == questionNums) {
        wx.showLoading({
          title: '完成，统计成绩',
        })
        sleep(1000)
        wx.hideLoading()
        wx.redirectTo({
          url: '../t_statistics/t_statistics',
        })
      }
    }
    else if (timeOut < 10) {
      timeOut = '0' + timeOut
    }
    this.setData({
      time: timeOut,
    })

    timer = setTimeout(this.myTimer, 1000)
    // end
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.myTimer()
    var nowobject = wx.getStorageSync('doubleSuccessRes').data.subjectList[this.data.anscode]
    var question = nowobject.question
    var answer = nowobject.answer
    var result = nowobject.result
    this.setData(
      {
        question: question,
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
    clearTimeout(timerReq)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(timer)
    clearTimeout(timerReq)
    if (!this.data.isnavigate) {
      wx.removeStorageSync('anstype')
      wx.removeStorageSync('enemyLossnet')
    }
    var curDataTwo = {
      scoreleft: this.data.score_L,
      scoreright: this.data.score_R,
      anscode: this.data.anscode,
      rightcount: this.data.rightcount,
      time: 10
    }
    wx.setStorageSync('curDataTwo', curDataTwo)
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