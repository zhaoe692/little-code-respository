// pages/post/post.js
var util = require('../../utils/utils.js');
var app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    camera: "/images/camera.jpg",
    //书籍
    content: '',
    des: '',
    wxNumber: '',
    phoneNumber: '',
    images: [],
    conditions: ["全新", "几乎全新", "九成新", "八成新", "七成新", "六成新", "五成新", "五成新以下"],
    conditionIndex: 2,
    quality: ["全新", "几乎全新", "少量笔记", "较多笔记", "不影响阅读"],
    qualityIndex: 2,
    campus: ["北湖校区", "林园校区", "南湖校区"],
    campusIndex: 0,
    menu: ["应用", "机械", "电信"],
    menuIndex: 0,
    list: ["生活用品", "电子产品", "玩具乐器", "运动用品", "其他"],
    listIndex: 0,
    userInfo: {},
    isLike: false,
    style: '二手书籍',
    //物品

  },
  bindqualityChange: function(e) {
    this.setData({
      qualityIndex: e.detail.value
    })
  },
  bindcontent: function (event) {
    this.setData({
      content: event.detail
    })
  },
  binddes: function(event) {
    this.setData({
      des: event.detail
    })
  },
  bindwxNumber: function(e) {
    this.setData({
      wxNumber: e.detail.value
    })
   //this.data.wxNumber = e.detail.value;
  },
  bindphoneNumber: function(e) {
    this.setData({
      phoneNumber: e.detail.value
    })
    //this.data.phoneNumber = e.detail.value;
  },
  bindConditionChange: function(e) {
    this.setData({
      conditionIndex: e.detail.value
    })
  },
  bindCampusChange: function(e) {
    this.setData({
      campusIndex: e.detail.value
    })
  },
  bindMenuChange: function(e) {
    this.setData({
      menuIndex: e.detail.value
    })
  },
  bindlistChange: function(e) {
    this.setData({
      listIndex: e.detail.value
    })
  },
  formSubmit: function(e) {
    var that = this;
    var userInfo = that.data.userInfo;
    if (!userInfo) {
      wx.showModal({
        title: '提示',
        content: '请验证您的学生信息',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '../index/index',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      var style = that.data.style;
      if (style == "二手书籍") {
        //this.saveImages();
        this.saveDataToServer();
      } else {
        this.saveData2ToServer();
      }
    }
  },
  saveDataToServer: function() {
    var that = this;
    var content = that.data.content;
    var des = that.data.des; 
    var userinfoNickName = that.data.userInfo.nickName;
    var userinfoAvatarUrl = that.data.userInfo.avatarUrl;
    var userInfo = that.data.userInfo;
    var qualityIndex = that.data.qualityIndex;
    var quality0 = that.data.quality[qualityIndex];
    var campusIndex = that.data.campusIndex;
    var campus0 = that.data.campus[campusIndex];
    var menuIndex = that.data.menuIndex;
    var menu0 = that.data.menu[menuIndex];
    var wxNumber = that.data.wxNumber;
    var phoneNumber = that.data.phoneNumber;

    var username=that.data.username;
    var studentId= that.data.studentId;

    var date1 = new Date();
    var myDate =  (date1.getMonth() + 1) + date1.getDate() ;
    var idnum = studentId + myDate;
    var isLike = that.data.isLike; 
   
    if (!(that.data.content.length == 0 || that.data.des.length == 0 || that.data.wxNumber.length == 0 || that.data.phoneNumber.length == 0 || that.data.images == 0)  ) { 
      console.log(content);
      console.log(wxNumber);
      wx.request({
        url: 'http://localhost:8080/myplat/servlet/saveTopic',  //本地服务器地址
        data: {
          idnum: idnum,
          index: 0,
          content:content,
          des: des,
          style: "book",
          menu: menu0,
          campus: campus0,
          condition: quality0,
          wxNumber: wxNumber,
          phoneNumber: phoneNumber,
          date: util.formatTime(new Date),
          images: that.data.imageslist,
          //userInfo: userInfo,
          userinfoNickName: userinfoNickName,
          userinfoAvatarUrl: userinfoAvatarUrl,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          that.showTipAndSwitchTab();
              that.setData({
                value: '',
                content: '',
                des: '',
                wxNumber: '',
                phoneNumber: '',
                images: '',
              })
            }
          })
    } else {
      wx.showToast({
        title: '信息不完整!',
        duration: 3000,
      }) 
    } 
  },
  showTipAndSwitchTab: function(event) {
    wx.showToast({
      title: '新增记录成功',
    })
    wx.navigateTo({
      url: '../index/index',
    })
    console.log("============")
  },
  saveData2ToServer: function() {
    var that = this;
    //var userInfo = that.data.userInfo;
    var conditionIndex = that.data.conditionIndex;
    var condition0 = that.data.conditions[conditionIndex];
    var listIndex = that.data.listIndex;
    var list0 = that.data.list[listIndex];
    var campusIndex = that.data.campusIndex;
    var campus0 = that.data.campus[campusIndex];

    var username = that.data.username;
    var studentId = that.data.studentId;

    var date1 = new Date();
    var myDate = (date1.getMonth() + 1) + date1.getDate();
    var idnum = studentId + myDate;
    if (/* !(that.data.content.length == 0 || that.data.des.length == 0 || that.data.wxNumber.length == 0 || that.data.phoneNumber.length == 0 || that.data.images == 0) */  1 ) {
      wx.request({
        url: 'http://localhost:8080/myplat/servlet/saveTopic',  //本地服务器地址
        data: {
          idnum: idnum,
          index: 0,
          content: content,
          des: des,
          style: "good",
          menu: list0,
          campus: campus0,
          condition: quality0,
          wxNumber: wxNumber,
          phoneNumber: phoneNumber,
          date: util.formatTime(new Date),
          images: that.data.imageslist,
          //userInfo: userInfo,
          userinfoNickName: userinfoNickName,
          userinfoAvatarUrl: userinfoAvatarUrl,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          that.showTipAndSwitchTab();
          that.setData({
            value: '',
            content: '',
            des: '',
            wxNumber: '',
            phoneNumber: '',
            images: '',
          })
        }
      })
    } else {
      wx.showToast({
        title: '信息不完整!',
        duration: 3000,
      })
    }
  },
  jugdeUserLogin: function(event) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              that.data.userInfo = res.userInfo;
              console.log(that.data.userInfo)
            }
          })
        }
      }
    })
  },
  chooseImage: function(event) {
    var that = this;
    wx.chooseImage({
      count: 6,
      success: function(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        for (var i in tempFilePaths) {
          that.data.images = that.data.images.concat(tempFilePaths[i])
        }
        that.setData({
          images: that.data.images
        })
        var imageslist = [];
        var images = that.data.images;
        for (var i = 0; i < images.length; i++) {
          let randString = Math.floor(Math.random() * 1000000).toString() + '.png'
          wx.cloud.uploadFile({
            cloudPath: randString,
            filePath: images[i],
            success: res => {
              imageslist.push(res.fileID);
            },
            fail: err => {
              wx.showToast({
                title: '图片上传失败',
              })
            }
          })
        }
        that.setData({
          imageslist
        })
        console.log(that.data.imageslist);
        console.log(that.data.images);
      }
    })
  },
  removeImg: function(event) {
    var that = this;
    var position = event.currentTarget.dataset.index;
    var fileid = that.data.imageslist[position];
    wx.cloud.deleteFile({
      fileList: [fileid],
      success: res => {
        this.data.imageslist.splice(position, 1);
        this.setData({
          images: this.data.imageslist,
        })
        console.log(this.data.imageslist)
      },
      fail: err => {
        wx.showToast({
          title: '删除失败',
          duration: 3000,
        })
      }
    })
    this.data.images.splice(position, 1);
    // 渲染图片
    this.setData({
      images: this.data.images,
    })
    console.log(this.data.images)
  },
  previewImg: function(e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.images[index],
      urls: this.data.images
    })
  },
  onClick(event) {
    var that = this;
    if (event.detail.index == 0) {
      this.setData({
        style: "二手书籍"
      })
    } else {
      this.setData({
        style: "二手物品"
      })
    }
  },
  onLoad: function(options) {
    this.jugdeUserLogin();
  },
  onReady: function() {

  },
  onShow: function() {
    var that = this;
    var userInfo = that.data.userInfo;
    wx.getStorage({ //异步获取缓存值userInfo
      key: 'userInfo',
      success: function(res) {
        that.setData({
          userInfo: res.data
        })
      }
    })
  },
  saveToHistoryServer: function (dkid) {
    var that = this;
    var campusIndex = that.data.campusIndex;
    var campus0 = that.data.campus[campusIndex];
    const db = wx.cloud.database();
    db.collection('history').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        fileid: dkid,
        content: that.data.content,
        des: that.data.des,
        campus: campus0,
        date: new Date().toLocaleString(),
        images: that.data.imageslist,
        userInfo: that.data.userInfo,
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      },
      fail: console.error
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