// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect: [],
    isCollected: false,
    collected: []
  },
  onCollectTap: function() {
    var isCollected = this.data.isCollected;
    if (isCollected) {
      //取消收藏
      var that = this;
      var userId = that.data.userId; //此为当前用户的oppenId
      var infoid = that.data.infoid;
      that.removeCollect(infoid, userId);
      that.setData({
        isCollected: false
      })
    } else {
      //收藏
      this.addCollect();
      this.setData({
        isCollected: true
      })
    }
  },
  _onCollectTap: function() {
    var isCollect = this.data.isCollect;
    if (isCollect) {
      //收藏
      this.addCollect();
      this.setData({
        isCollected: false
      })
    } else {
      //取消收藏
      var that = this;
      var userId = that.data.userId;
      var infoid = that.data.infoid; //此为当前用户的oppenId
      that.removeCollect(userId, infoid);
      // 设置setData值，前端界面才能读取到isCollect
      that.setData({
        isCollected: true
      })
    }
  },
  //收藏
  addCollect: function() {
    const db = wx.cloud.database();
    wx.getStorage({
      key: 'index',
      success: function(res) {
        var infoid = res.data._id;
        var infocontent = res.data.content;
        var infodate = res.data.date;
        var infoimages = res.data.images;
        var infonickname = res.data.userInfo.nickName;
        var infoavatarUrl= res.data.userInfo.avatarUrl;
        var infomenu = res.data.menu;
        wx.request({
          url: 'http://localhost:8080/serverplat/servlet/myCollect',  //本地服务器地址
          data: {
            infoid: infoid,
            infocontent: infocontent,
            infodate: infodate,
            infoimages: infoimages,
            infonickname: infonickname,
            infoavatarUrl: infoavatarUrl,
            infomenu: infomenu,
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {
            console.log(res.data)
            if (res.data == 1) {
              wx.showToast({
                title: "收藏成功",
                icon: 'success',
                duration: 1000,
                make: true
              });
            } else {
              wx.showToast({
                title: "服务器维护中,收藏失败",
                duration: 1000,
                icon: "sucess",
                make: true
              })
            }
          }
        })
     /*    db.collection('collect').add({
          data: {
            infoid: infoid,
            infocontent: infocontent,
            infodate: infodate,
            infoimages: infoimages,
            infonickname: infonickname,
            infoavatarUrl: infoavatarUrl,
            infomenu: infomenu,
          },
          success: res => {
            wx.showToast({
              title: "收藏成功",
              icon: 'success',
              duration: 1000,
              make: true
            });
          },
          fail: err => {
            wx.showToast({
              title: "服务器维护中,收藏失败",
              duration: 1000,
              icon: "sucess",
              make: true
            })
          } 
        })*/
      }
    })
  },
  //删除收藏信息,根据视频id和用户id指定唯一的收藏信息
  removeCollect: function(userId, infoid) {

    wx.request({
      url: 'http://localhost:8080/serverplat/servlet/removeCollect',  //本地服务器地址
      data: {
        infoid: infoid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data == 1) {
          wx.showToast({
            title: '已取消收藏',
          })
        } else {
          wx.showToast({
            title: '取消失败',
          })
        }
      }
    })

   /*  const db = wx.cloud.database();
    db.collection("collect").where({
      _openid: userId,
      infoid: infoid
    }).get({
      success: res => {
        db.collection("collect").doc(res.data[0]._id).remove({
          success: res => {
            wx.showToast({
              title: '已取消收藏',
            })
          },
          fail: err => {
            wx.showToast({
              title: '取消失败',
            })
          }
        })
      },
      fail: err => {
        wx.showToast({
          icon: "none",
          title: '查询记录失败',
        })
      }
    }) */
  },
  adjustCollect: function(infoid, userId) {
    var that = this;
    var userId = that.data.userId;
    var infoid = that.data.infoid;
    wx.request({
      url: 'http://localhost:8080/serverplat/servlet/judgeCollect',  //本地服务器地址
      data: {
      infoid:infoid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data == 1) {
          var that = this
          that.setData({
            collected: res.data,
          })
        } else {
          wx.showToast({
            icon: "none",
            title: '服务器维护中',
          })
      }
      }
    })
   /*  const db = wx.cloud.database()
    db.collection("collect").where({
      infoid: infoid,
      _openid: userId,
    }).get({
      success: res => {
        var that = this
        that.setData({
          collected: res.data,
        })
      },
      fail: err => {
        wx.showToast({
          icon: "none",
          title: '服务器维护中',
        })
      }
    }) */

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var infoid = options.id;
    const db = wx.cloud.database();
    db.collection('topic').doc(options.id).get({
      success: res => {
        console.log(res.data);
        wx.setStorage({
          key: 'index',
          data: res.data,
        })
        this.setData({
          topic: res.data,
          infoid: options.id
        });
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            var userId = res.result.openid;
            this.adjustCollect(infoid, userId);
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
          },
        })
      },
      fail: err => {
        console.error(err);
      }
    })
  },
  addindex: function() {
    var that = this;
    const db = wx.cloud.database();
    wx.getStorage({
      key: 'index',
      success: function(res) {
        var index = res.data.index;
        db.collection('topic').doc(res.data._id).update({
          data: {
            index: Number(index) + 1
          },
          success: console.log(index),
          fail: console.error
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
    var that = this;
    var infoid = that.data.infoid;
    var userId = that.data.userId;
    that.adjustCollect(infoid, userId);
    that.addindex();
    //that.adjustCollect(infoid,userId);
    var ownuser = that.data.ownuser;
    wx.getStorage({ //异步获取缓存值userInfo
      key: 'userInfo',
      success: function(res) {
        that.setData({
          ownuser: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    var infoid = that.data.infoid;
    var userId = that.data.userId;
    that.adjustCollect(infoid, userId);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})