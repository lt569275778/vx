//index.js
//获取应用实例
var timer;
var timerLoading;
var scid;
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    number: 2,
    bb: 'block',
    winWidth: 0,
    winHeight: 0,
    topdiv: ['', '', '', ''],
    // tab切换  
    currentTab: 0,
    bool: 'block',
    display: ['block', 'block', 'block'],
    displayAns: ['none', 'none', 'none'],
    comDisplay: ['block', 'block', 'block', 'block', 'block', 'block'],
    comDisplayAns: ['none', 'none', 'none', 'none', 'none', 'none'],
    showView: true,
    quetions: [
      {
        imagesUrl: '../../images/shixiankuang.png',
        txt: '文学',
        bottomtxt: '属于你的趣味就在这里',
      },
      {
        imagesUrl: '../../images/shixiankuang.png',
        txt: '历史',
        bottomtxt: '在生活不一定懂生活哟',
      },
      {
        imagesUrl: '../../images/shixiankuang.png',
        txt: '科学',
        bottomtxt: '那些年学过的历史还在么'
      },
      {
        imagesUrl: '../../images/shixiankuang.png',
        txt: '体育',
        bottomtxt: '那些年学过的历史还在么'
      },
      {
        imagesUrl: '../../images/shixiankuang.png',
        txt: '地理',
        bottomtxt: '你去过的远方你都了解吗'
      },
      {
        imagesUrl: '../../images/shixiankuang.png',
        txt: '生活',
        bottomtxt: '在生活不一定懂生活哦'
      }
    ],
    nav: [
      {
        imgUrl: '',
        imagesUrl: '../../images/shixiankuang.png',
      },
      {
        imgUrl: '',
        imagesUrl: '../../images/shixiankuang.png',
      },
      {
        imgUrl: '',
        imagesUrl: '../../images/shixiankuang.png',
      }
    ],


    bg: 'block',
    bind_phone: 'block'
  },

  /**
   * 生命周期函数--监听页面加载
   */

  initFirstPage: function (e) {
    clearTimeout(timerLoading)
    var mydata = app.globalData.mydata
    wx.setStorageSync('firstPage', mydata)
    // console.log(mydata)
    for (var k = 0; k < 4; k++) {
      this.data.topdiv[k] = mydata[k].name
    }
    var url = getApp().globalData.servUrl + '/client/free/wx/getImages.action?path='
    switch (e) {
      case 0:
        for (var j = 0; j < 3; j++) {
          this.data.nav[j].imgUrl = url + mydata[0].list[j].scPath
          this.data.nav[j].txt = mydata[0].list[j].name
          this.data.nav[j].bottomtxt = mydata[0].list[j].scDescription
        }
        break;
      case 1:
        for (var j = 0; j < 3; j++) {
          this.data.nav[j].imgUrl = url + mydata[1].list[j].scPath
          this.data.nav[j].txt = mydata[1].list[j].name
          this.data.nav[j].bottomtxt = mydata[1].list[j].scDescription
        }
        break;
      case 2:
        for (var j = 0; j < 3; j++) {
          this.data.nav[j].imgUrl = url + mydata[2].list[j].scPath
          this.data.nav[j].txt = mydata[2].list[j].name
          this.data.nav[j].bottomtxt = mydata[2].list[j].scDescription
        }
        break;
    }

    for (var i = 0; i < mydata[3].list.length; i++) {
      this.data.quetions[i].imgUrl = url + mydata[3].list[i].scPath,
        this.data.quetions[i].txt = mydata[3].list[i].name,
        this.data.quetions[i].bottomtxt = mydata[3].list[i].scDescription
    }

    this.setData({
      topdiv: this.data.topdiv,
      nav: this.data.nav,
      quetions: this.data.quetions
    })
  },

  onLoad: function (options) {

    var data = {
      nowcore: 0,
      anscode: 0,
      time: 60
    }
    wx.setStorageSync('curData', data)

    var datatwo = {
      scoreleft: 0,
      scoreright:0,
      anscode: 0,
      rightcount:0,
      time: 10
    }
    wx.setStorageSync('curDataTwo', datatwo)
    //end
    /** 
     * 获取系统信息 
     */
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    })

    //初始化页面信息
  },
  
  bindChange: function (e) {
    this.initFirstPage(e.detail.current)
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    setTimeout(this.initFirstPage,2000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initFirstPage(0)
    wx.checkSession({
      success: function () {
        getApp().myLogin() //重新登录
      },
      fail: function () {
        //登录态过期
        // console.log("登陆态未过期！重新登陆")
        getApp().myLogin() //重新登录

      }
    })
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

  },
  initChoice: function () {
    this.setData({
      display: this.data.display,
      displayAns: this.data.displayAns,
      comDisplay: this.data.comDisplay,
      comDisplayAns: this.data.comDisplayAns
    })
    clearTimeout(timer)
  },
  choiceEvent: function (event) {
    // console.log(event)
    clearTimeout(timer)
    var id = event.currentTarget.id
    this.data.display[parseInt(id)] = 'none'
    this.data.displayAns[parseInt(id)] = 'block'
    this.setData({
      display: this.data.display,
      displayAns: this.data.displayAns
    })
    timer = setTimeout(this.initChoice, 2000)
  },
  comChoiceEvent: function (event) {
    // console.log(event)
    clearTimeout(timer)
    var id = event.currentTarget.id
    this.data.comDisplay[parseInt(id)] = 'none'
    this.data.comDisplayAns[parseInt(id)] = 'block'
    this.setData({
      comDisplay: this.data.comDisplay,
      comDisplayAns: this.data.comDisplayAns
    })
    timer = setTimeout(this.initChoice, 2000)
  },
  outChoice: function (event) {
    for (var i = 0; i < 3; i++) {
      if (this.data.display[i] == 'none') {
        this.data.displayAns[i] = 'none'
        this.data.display[i] = 'block'
      }
    }
  },
  comOutChoice: function (event) {
    for (var i = 0; i < 6; i++) {
      if (this.data.comDisplay[i] == 'none') {
        this.data.comDisplayAns[i] = 'none'
        this.data.comDisplay[i] = 'block'
      }
    }
  },
  singleAns: function (event) {
    // console.log(event)
    var index = parseInt(event.currentTarget.id)
    if (index >= 0 && index < 3) {
      scid = app.globalData.mydata[0].list[index].id
    }
    else if (index >= 3 && index < 6) {
      scid = app.globalData.mydata[1].list[index - 3].id
    }
    else if (index >= 6 && index < 9) {
      scid = app.globalData.mydata[2].list[index - 6].id
    }
    else if (index >= 9) {
      scid = app.globalData.mydata[3].list[index - 9].id
    }
    getApp().singleResQuestions(scid, 'firstPage')
    wx.setStorageSync('anstype', scid)
  },
  doubleAns: function (event) {
    wx.request({
      url: getApp().globalData.servUrl+'/client/wxUser/wxUserCenter.action', //仅为示例，并非真实的接口地址
      data: {
        userId: wx.getStorageSync('loginstatus').data.userId
      },
      method:'GET',
      success: function (res) {
        var index = parseInt(event.currentTarget.id)
        if (index >= 0 && index < 3) {
          scid = app.globalData.mydata[0].list[index].id
        }
        else if (index >= 3 && index < 6) {
          scid = app.globalData.mydata[1].list[index - 3].id
        }
        else if (index >= 6 && index < 9) {
          scid = app.globalData.mydata[2].list[index - 6].id
        }
        else if (index >= 9) {
          scid = app.globalData.mydata[3].list[index - 9].id
        }
        wx.setStorageSync('anstype', scid)

        
        if(res.data.data.userTotalScore<300)
        {
          wx.showModal({
            title: '温馨提示',
            content: '积分不足，对答功能需要您拥有300以上积分，亲快去赚积分吧~',
          })
        }
        else
        {
          wx.navigateTo({
            url: '/pages/myanswer/mate/mate',
          })
        }
      }
    })
    
  },
  iknow: function (e) {
    this.setData({
      bb: 'none',
      bg: 'none'
    })
  },


  // 点击关闭 绑定手机的弹窗 ZY1027
  hidden_bg: function () {
    var that = this;
    that.setData({
      bg: 'none',
      bind_phone: 'none'
    })
  },
  // 点击去绑定手机按钮 跳转的同时关闭弹窗 ZY1027
  bind_phone: function () {
    var that = this;
    that.setData({
      bg: 'none',
      bind_phone: 'none'
    })
  }
})
