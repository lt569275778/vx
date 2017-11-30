// pages/logs/logs.js
Page({
    data: {
        grade: '#',      //累计积分
        logs: '#',       //昨日排行
        month: '#',      //上月排行
        correct: '#',    //准确率
        con_number: '#', //累计答题
        myLog_L: '#',    //当前用户今日排名
        myImg_L: '../../../images/touxiang_02.png', //默认头像 
        myName_L: '#',   //当前用户名
        myNumber_L: '#', //当前用户今日积分
        myLog_R: '#',    //当前用户当月排名
        myImg_R: '../../../images/touxiang_02.png', //默认头像 
        myName_R: '#',   //当前用户名
        myNumber_R: '#', //当前用户当月积分
        currentTab: '0',    //滑动门
        images: [
            '../../images/ph-pic42x.png',
            '../../images/ph-pic52x.png',
            '../../images/ph-pic62x.png',
        ],
        array_L: [],
        array_R: []

    },

    load: function(){
        var code = wx.getStorageSync('loginstatus').code
        if (code == 1000) {
            // console.log('登陆失败，userId获取失败')
        } else {
            var that = this;
            wx.request({
                url: getApp().globalData.servUrl + '/client/userScoreRank/getUserInfo',
                data: {
                    userId: wx.getStorageSync('loginstatus').data.userId
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                    // console.log(res.data)                    
                    var a = res.data.currUserInfo
                    var c = res.data.currUserMonthRank
                    var d = res.data.currUserDayRank
                    var yesterDayRank
                    var lastMonthRank

                    //昨日排行 判断 
                    if (res.data.currUseryesterDayRank.length >= 5) {
                        yesterDayRank = ">1万"
                    }else{
                        yesterDayRank = "第" + res.data.currUseryesterDayRank + "名"
                    } 
                    //上月排行 判断  
                    if (res.data.currUserlastMonthRank.length >= 5){
                        lastMonthRank = ">1万"
                    }else{
                        lastMonthRank = "第" + res.data.currUserlastMonthRank + "名"
                    }

                    that.setData({
                        grade: a.uai_score,                 //累计积分 
                        correct: a.accuracy_rate,           //准确率 
                        con_number: a.uai_total_count,      //累计答题
                        myImg_L: a.ui_path,                 //当前用户头像
                        myName_L: a.ui_name,                //当前用户名
                        myImg_R: a.ui_path,                 //当前用户头像
                        myName_R: a.ui_name,                //当前用户名
                        logs: yesterDayRank,                //昨日排行
                        month: lastMonthRank,               //上月排行
                        myLog_L: d.day_rank,                //当前用户今日排行
                        myNumber_L: d.uds_total_score,      //当前用户今日积分
                        myLog_R: c.month_rank,              //当前用户当月排行
                        myNumber_R: c.ums_total_score,      //当前用户当月积分
                        array_L: res.data.dayRank,
                        array_R: res.data.monthRank,
                    });

                }
            })
        }

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        this.load()
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
        this.load()
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


    bindChange: function (e) {
        // console.log(e)
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
    }
})
