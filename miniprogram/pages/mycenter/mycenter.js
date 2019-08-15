var app = getApp()
Page({
  data: {
    buttonLoading: false,
    studentId: '',
    passWord: '',

  },
  inputStudentId: function (e) {
    var num = e.detail.value;
    var reg = /\d{8}/;
    if (reg.test(num)) {
      this.setData({
        studentId: num
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '学号有误',
      })
    }

  },
  inputPassWord: function (e) {
    var num = e.detail.value;
    var reg = /\d{6}/;
    if (reg.test(num)) {
      this.setData({
        passWord: num
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请输入六位密码',
      })
    }

  },
  bindSubmit: function () {
    var that = this;
    this.setData({
      buttonLoading: true
    })
    var studentId = that.data.studentId;
    var passWord = that.data.passWord;
    wx.request({
      url: 'http://localhost:8080/serverplat/servlet/identityStudent',  //本地服务器地址
      data: {
      studentId:studentId,
      passWord:passWord,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res.data)
       if(res.data==1){
         wx.setStorage({
           key: "studentId",// 异步缓存学号
           data: studentId //学号
         }),
         wx.setStorage({
           key: "passWord",// 异步缓存学号
           data: passWord //密码
         }),
         wx.showModal({
           title: '提示',
           content: '身份验证成功',
           success: function () {
             wx.navigateBack({
               delta: 1
             })
           }
         });
       }else{
         wx.showModal({
           title: '提示',
           content: '身份验证失败,请重试！',
           success: function () {
             wx.redirectTo({
               url: './mycenter',
             })
           }
         });
       }
      }
   /*  const db = wx.cloud.database()
    const _ = db.command
    db.collection('user').where({
      studentId: studentId,
      passWord: passWord
    })
      .get({
        success(res) {
          wx.showModal({
            title: '提示',
            content: '身份验证成功',
            success: function () {
              wx.navigateBack({
                delta: 1
              })
            }
          })
          wx.setStorage({ key: "studentId",// 异步缓存学号 data: studentId //学号 })
          wx.setStorage({key: "passWord",// 异步缓存学号 data: passWord //密码 })
          try { wx.setStorageSync('studentIdSync', studentId)} catch (e) {};
        }
        , fail: function (res) {
          console.log(JSON.stringify(res));
          wx.showModal({
            title: '提示',
            content: '身份验证失败,请重试！',
            success: function () {
              wx.redirectTo({
                url: './mycenter',
              })
            }
          });
        }*/
    })
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

  onShow: function () {
    var that = this;
    var studentId = that.data.studentId;
    var passWord = that.data.passWord;
    wx.getStorage({  //异步获取缓存值studentId
      key: 'studentId',
      success: function (res) {
        that.setData({
          studentId: res.data
        })

      }
    })
    wx.getStorage({  //异步获取缓存值studentId
      key: 'passWord',
      success: function (res) {
        that.setData({
          passWord: res.data
        })

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
