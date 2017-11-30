function sleep(d) {
  for (var t = Date.now(); Date.now() - t <= d;);
}
App({
  d: {
    hostUrl: 'https://app.gemmy.so',
    hostImg: 'http://img.ynjmzb.net',
    hostVideo: 'http://zhubaotong-file.oss-cn-beijing.aliyuncs.com',
    ceshiUrl: 'https://gzleren.com/minipinpaidianti/index.php',
    csurl: 'https://www.ego168.cn/answer/client/userAddress',
    csurl1: 'https://www.ego168.cn/answer/client',
    bturl:'https://www.ego168.cn/answer/client/userAddress'
  },
  singleResQuestions: function (scid,scene) {
    var that=this
    wx.request({
      url: that.globalData.servUrl+'/client/subjectInfo/getSingleSubject.action', //仅为示例，并非真实的接口地址
      data: {
        scId: scid,
        userId:wx.getStorageSync('loginstatus').data.userId
      },
      success: function (res) {
        if (res.data.code == '0000') {
          wx.setStorageSync('questionkits', res.data.data)
          wx.showLoading()
          sleep(2000)
          wx.hideLoading()
          
          if(scene=='firstPage')
          {
              wx.navigateTo({
                url: '/pages/myanswer/oneanswer/oneanswer',
              })
          }
          else if(scene=='statistic')
          {
            
              wx.redirectTo({
                url: '/pages/myanswer/oneanswer/oneanswer',
              })
          }
        }
        else {
          getApp().globalData.reqreslut = false
          wx.showModal({
            title: '温馨提示',
            content: '当前分类题目获取失败，亲可以换个分类再试试哟！'
          })
        }
      },
      fail: function (res) {
        getApp().globalData.reqreslut = false
        wx.showModal({
          title: '温馨提示',
          content: '当前分类题目获取失败，亲可以换个分类再试试哟！'
        })
      }
    })
  },
  myLogin:function()
  {
    var that=this
    wx.login({
      success: function (res) {
        var code = res.code
        // success  
        // 获取用户信息  
        wx.getUserInfo({
          success: function (data) {
            that.globalData.userInfo = data.userInfo
            wx.setStorage({
              key: 'userInfo',
              data: that.globalData.userInfo
            })
            var rawData = data.rawData;
            var signature = data.signature;
            var encryptedData = data.encryptedData;
            var iv = data.iv;
            // console.log("code=" + code)
            // console.log("iv=" + iv)
            // console.log("encryptedData=" + encryptedData)
            wx.request({
              url: that.globalData.servUrl+"/client/free/wxlogin/wxlogin.action",
              data: {
                jsCode: code,
                iv: iv,
                encryptedData: encryptedData
              },
              method: 'GET',
              success: function (res) {
                //console.log(res.data)
                wx.setStorage({
                  key: 'loginstatus',
                  data: res.data,
                })
              }
            })
          }
        })
      }
    })
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据  
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    this.myLogin()
    this.getUserInfo()
    this.getSubjectClass()
  },

  getSubjectClass:function()
  {
    var that = this
    wx.request({
      url: that.globalData.servUrl + '/client/free/wxsubject/getSubjectClass', //仅为示例，并非真实的接口地址
      success: function (res) {
        that.globalData.mydata = res.data.data
        wx.hideLoading()
      },
      fail: function (res) {
        wx.showLoading({
          title: '网络慢......',
        })
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this
    if (that.globalData.userInfo) {
      wx.setStorage({
        key: 'userInfo',
        data: that.globalData.userInfo,
      })
    } else {
      //调用登录接口 
          that.myLogin()
 
    }
  },
  onLoginUser: function () {
    var that = this;
    var user = that.globalData.userInfo;
    wx.request({
      url: that.d.ceshiUrl + '/Api/Login/authlogin',
      method: 'post',
      data: {
        SessionId: user.sessionId,
        gender: user.gender,
        NickName: user.nickName,
        HeadUrl: user.avatarUrl,
        openid: user.openid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data.arr;
        var status = res.data.status;
        if (status != 1) {
          wx.showToast({
            title: res.data.err,
            duration: 3000
          });
          return false;
        }
        that.globalData.userInfo['id'] = data.ID;
        that.globalData.userInfo['NickName'] = data.NickName;
        that.globalData.userInfo['HeadUrl'] = data.HeadUrl;
        that.d.userId = data.ID;
        if (!that.d.userId) {
          wx.showToast({
            title: '登录失败！',
            duration: 3000
          });
          return false;
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！119',
          duration: 2000
        });
      },
    });
  },
  getUserSessionKey: function (code) {
    var that = this;
    wx.request({
      url: that.d.ceshiUrl + '/Api/Login/getsessionkey',
      method: 'post',
      data: {
        code: code
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data;
        if (data.status == 0) {
          wx.showToast({
            title: data.err,
            duration: 2000
          });
          return false;
        }
        that.globalData.userInfo['sessionId'] = data.session_key;
        that.globalData.userInfo['openid'] = data.openid;
        that.onLoginUser();
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！73',
          duration: 2000
        });
      },
    });
  },
  globalData: {
    userInfo: null,
    mydata:null,
    userselect:[],
     servUrl: 'https://www.ego168.cn/answer'
  }
})  
