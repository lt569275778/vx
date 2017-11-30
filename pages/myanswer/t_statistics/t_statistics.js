// pages/myanswer/t_statistics/t_statistics.js
function sleep(d) {
  for (var t = Date.now(); Date.now() - t <= d;);
}

Page({

  /**
   * 页面的初始数据
   */
    data: {
        // --ZY0927 start--
        head_L: '',
        name_L: '',
        score_L: '',
        head_R: '',
        name_R: '',
        score_R: '',
        Logbuch:'',
        S_number:'',
        S_amount:'',
        S_score:'',
        S_award:'',
        S_ranking: '',
        curmark: {
          win: [
            "请收下我的膝盖，300大分已奉上！",
            "您的对手已哭泣，您的账户已喜极！",
            "定是某种盖世神功，获胜才如此轻松！",
            "赢了对手很酸爽，乘胜追击最勇敢！"
          ],
          fail: [
            "你的对手在学习，隔壁老王在练腰！",
            "哪怕风雨中，这点分算什么！",
            "换个姿势，再答一次！",
            "一定是用右手点击的选项，换左手试试！"
          ]
        },
        remark:''
        // end
    },

    continue_ans: function () {
      sleep(1000)
      wx.redirectTo({
        url: '../mate/mate',
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    getDoubleSubjectResult: function (e) {
      var that = this
        wx.request({
          url: getApp().globalData.servUrl + '/client/subjectInfo/getDoubleSubjectResult.action', //仅为示例，并非真实的接口地址
          data: e,
          method: "GET",
          success: function (res) {
            var curData = res.data.data.own;
//            console.log(res.data)
            var comResult = curData.isSucc;
            var reMark;
            if (comResult == '完胜') {
              reMark = that.data.curmark.win[parseInt(Math.random() * that.data.curmark.win.length)]
            }
            else {
              reMark = that.data.curmark.fail[parseInt(Math.random() * that.data.curmark.fail.length)]
            }
            //console.log(reMark)
            
            that.setData({
              Logbuch:curData.isSucc ,
              S_number: curData.result.totalNum,
              S_amount: curData.result.correctNum,
              S_score: curData.result.goalScore,
              S_award: curData.result.extraScore,
              S_ranking: curData.result.dayRank,
            })
          }
        })
    },
    onLoad: function (options) {

      var curDataTwo = wx.getStorageSync('curDataTwo')
      var myId;
      var userId = wx.getStorageSync('loginstatus').data.userId
      var alreadyMatchVo = wx.getStorageSync('doubleSuccessRes').data.alreadyMatchVo
      if (userId == alreadyMatchVo.sendUserId) myId = 1
      else if (userId == alreadyMatchVo.matchUserId) myId = 2
      this.setData({
        anscode: curDataTwo.anscode,
        nowcore: curDataTwo.nowcore,
        rightcount: curDataTwo.rightcount,
        head_L: (myId == 1) ? alreadyMatchVo.sendPath : alreadyMatchVo.matchPath,
        name_L: (myId == 1) ? alreadyMatchVo.sendName : alreadyMatchVo.matchName,
        head_R: (myId == 1) ? alreadyMatchVo.matchPath : alreadyMatchVo.sendPath,
        name_R: (myId == 1) ? alreadyMatchVo.matchName : alreadyMatchVo.sendName
      })

       var data={
          'uuid': alreadyMatchVo.uuid,
          'userId': wx.getStorageSync('loginstatus').data.userId
        }

       this.getDoubleSubjectResult(data)
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
      var data = {
        scoreleft: 0,
        scoreright: 0,
        anscode: 0,
        rightcount: 0,
        time: 10
      }
      wx.setStorageSync('curDataTwo', data)
      wx.removeStorageSync('enemyLossnet')
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