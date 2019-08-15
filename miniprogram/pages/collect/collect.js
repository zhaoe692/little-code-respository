var app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    studentId: '',
    topic: [],
  },
  onLoad: function (options) {
    var that = this;
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        var _this = this;
        db.collection('collect').where({
          _openid: res.result.openid,
        }).get({
          success: res => {
            that.setData({
              topic: res.data
            })
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  onReady: function () {

  },
  onShow: function (options) {
    var that = this;
    var studentId = that.data.studentId;
    wx.getStorage({
      key: 'studentId',
      success: function (res) {
        that.setData({
          studentId: res.data
        })
        console.log(res.data)
        if (!res.data) {
          wx.showModal({
            title: '提示',
            content: '请验证您的学生身份',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: '../mycenter/mycenter',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              var _this = this;
              db.collection('collect').where({
                _openid: res.result.openid,
              }).get({
                success: res => {
                  that.setData({
                    topic: res.data
                  })
                }
              })
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
            }
          })
        }
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
  onPullDownRefresh: function (options) {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  deleteList: function (event) {
    wx.showModal({
      title: '提示',
      content: '是否确定删除？',
      success(res) {
        if (res.confirm) {
          var id = event.currentTarget.dataset.id
          db.collection('collect').doc(id).remove({
            success(res) {
              console.log(res.data)
              wx.showToast({
                title: '删除成功',
                duration: 2000,
              })
             
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else {
          wx.navigateBack({
            delta: 1
          })
        
        }
      }
    })

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  viewItem: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    });
  }
})