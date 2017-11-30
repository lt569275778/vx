// pages/myanswer/statistics/statistics.js
// --答题结果 ZY0927--

function sleep(d) {
  for (var t = Date.now(); Date.now() - t <= d;);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    head: '../../../images/touxiang_02.png',
    name: '*',
    score: '分',
    curmark: {
      lowScore: [
        "有心答题题题对，无心答题得分醉！",
        " 答题还是要走心的，万一得满分呢？",
        "听说单眼看题目，得分轻松过60！",
        "换个姿势，再答一次！",
        "60不够，拼命去凑！"
        ],
      midScore: [
        "听说单手答题，得分更美丽！",
        "获此分者，大有得满分之势！",
        "童鞋，你距离满分还需要答一次！",
        "要想分更高，快准狠才是王道！"
      ],
      higScore: [
        "得分大满贯，人生须尽欢，答题再一组，来把分上满！",
        "恭喜您！已经上了一大波分！",
        "用666称赞您早已逊色，唯有再答一组方可溢彩",
        "恭喜您！此刻您已走上答题巅峰！",
      ]
    },
    remark:'',
    answer_number: '0',
    right_amount: '0',
    the_score: '0',
    award: '0',
    ranking:'0'
  },
  continue_ans: function () {
    getApp().globalData.userselect = []
    sleep(1000)
    getApp().singleResQuestions(wx.getStorageSync('anstype'), 'statistic')
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getSubjectResult: function (e) {
    var that = this
      wx.request({
        url: getApp().globalData.servUrl + '/client/subjectInfo/getSubjctResult.action', //仅为示例，并非真实的接口地址
        data: e,
        method: "POST",
        success: function (res) {
          var curData = res.data.data;
          //console.log(curData)
          var rightAmount = curData.result.correctNum;
          var reMark;
          if (rightAmount==6) 
          {
            reMark = that.data.curmark.higScore[parseInt(Math.random() * that.data.curmark.higScore.length)]
          }
          else if (rightAmount >= 3 && rightAmount <= 5 )
          {
            reMark = that.data.curmark.midScore[parseInt(Math.random() * that.data.curmark.midScore.length)]
          }
          else
          {
            reMark = that.data.curmark.lowScore[parseInt(Math.random() * that.data.curmark.lowScore.length)]
          }
//          console.log(reMark)
          that.setData({
            head: curData.path,
            name: curData.nickName,
            score: curData.userTotalScore,
            remark: reMark ,
            answer_number: curData.result.totalNum,
            right_amount: rightAmount,
            the_score: curData.result.goalScore,
            award: curData.result.extraScore,
            ranking: curData.result.dayRank
          })
        }
      })
  },
  onLoad: function (options) {
    var data = {
      'userId': wx.getStorageSync('loginstatus').data.userId,
      'list': getApp().globalData.userselect
    }
   // wx.setStorageSync('ansResult', data)
    this.getSubjectResult(data)
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
    getApp().globalData.userselect = []
    var data = {
      nowcore: 0,
      anscode: 0,
      time: 60
    }
    wx.setStorageSync('curData', data)
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
  },
})






