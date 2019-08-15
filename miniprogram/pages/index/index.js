Page({
  data: {
    //
    nickName: '个人信息',
    logged: false,
    takeSession: false,
    requestResult: '',
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    //旧书
    page: 0,
    pageSize: 5,
    totalCount: 0,
    topics: {},
    topics1: {},
    // 首页的轮播图
    imgUrls: [
      "/images/shouye/lunbotu2.png",
      "/images/shouye/lunbotu3.png",
      "/images/shouye/lunbotu6.jpg",
      "/images/shouye/lunbotu7.jpg",
    ],
    indicatorDots: false, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔
    duration: 1000, //滑动动画时长
    //导航
    navbar: ['广场', '旧书', '发布', '旧物', '我的'],
    currentTab: 0,
  },
  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    if (e.currentTarget.dataset.idx == 0) {
      /*  this.my(); */
      this.getData(this.data.page);
    } else if (e.currentTarget.dataset.idx == 1) {
      this.getData2(this.data.page);
    } else if (e.currentTarget.dataset.idx == 2) {
    } else if (e.currentTarget.dataset.idx == 3) {
      this.getData3(this.data.page);
    } else if (e.currentTarget.dataset.idx == 4) {
      this.myData();
    }
  },
  myData: function() {
    var that = this;
    var userInfo = that.data.userInfo;
    wx.getStorage({ //异步获取缓存值studentId
      key: 'userInfo',
      success: function(res) {
        that.setData({
          userInfo: res.data
        })
      }
    })
  },
  my: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '',
      })
      return
    }
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onClick(event) {
    wx.showToast({
      title: `点击标签 ${event.detail.index + 1}`,
      icon: 'none'
    });
  },
  onLoad: function(options) {
    console.log('onload');
    //this.onGetUserInfo();
    this.my();
    this.getData(this.data.page);
    //this.getData2(this.data.page);
    //this.getData3(this.data.page);
  },

  getData: function(page) {
    var that = this;
    const db = wx.cloud.database();
    db.collection('topic').count({
      success: function(res) {
        that.data.totalCount = res.total;
      }
    })
    try {
      db.collection('topic')
        .limit(that.data.pageSize)
        .orderBy('date', 'desc')
        .get({
          success: function(res) {
            that.data.topics = res.data;
            that.setData({
              topics: that.data.topics,
            })
           /*  if(res.data.style=='book'){
              that.setData({
                topic_book: res.data
              })
            }else{
              that.setData({
                topic_good: topics.data
              })
            } */
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();

          },
          fail: function(event) {
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
            console.log("======" + event);
          }
        })
    } catch (e) {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      console.error(e);
    }
  },
  getData2: function(page) {
    var that = this;
    const db = wx.cloud.database();
    db.collection('topic').where({
      style: 'book'
    }).orderBy('date', 'desc').get({
      success: res => {
        this.setData({
          book_list: res.data
        })
      }
    })
  },
  getData3: function(page) {
    var that = this;
    const db = wx.cloud.database();
    db.collection('topic').where({
      style: 'good'
    }).orderBy('date', 'desc').get({
      success: res => {
        this.setData({
          good_list: res.data
        })
      }
    })
  },


  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //this.my();
    this.myData();
    this.savestudentid();
  },
savestudentid: function(){
  var that = this;
  var studentId = that.data.studentId;
  wx.getStorage({ //异步获取缓存值studentId
    key: 'studentId',
    success: function (res) {
      that.setData({
        studentId: res.data
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    console.log('pulldown');
    this.getData(this.data.page);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    var temp = [];
    // 获取后面十条
    console.log("length---->" + this.data.topics.length);
    console.log("count--->" + this.data.totalCount);
    if (this.data.topics.length < this.data.totalCount) {
      try {
        const db = wx.cloud.database();
        db.collection('topic')
          .skip(5)
          .limit(that.data.pageSize) // 限制返回数量为 10 条
          .orderBy('date', 'desc')
          .get({
            success: function(res) {
              // res.data 是包含以上定义的两条记录的数组
              if (res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                  var tempTopic = res.data[i];
                  console.log(tempTopic);
                  temp.push(tempTopic);
                }
                var totalTopic = {};
                totalTopic = that.data.topics.concat(temp);
                console.log(totalTopic);
                that.setData({
                  topics: totalTopic,
                })
              } else {
                wx.showToast({
                  title: '没有更多数据了',
                })
              }
            },
            fail: function(event) {
              console.log("======" + event);
            }
          })
      } catch (e) {
        console.error(e);
      }
    } else {
      wx.showToast({
        title: '没有更多数据了',
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  postbook: function() {
    wx.navigateTo({
      url: '../post/post',
    })
  },
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        nickName: e.detail.userInfo.nickName,
      })
      wx.setStorage({
        key: 'userInfo',
        data: e.detail.userInfo,
      })
    }
  },
  onItemClick: function(event) {
    var id = event.currentTarget.dataset.id;
    //var index = event.currentTarget.dataset.index;
    console.log(id);
    //console.log(index);
    wx.navigateTo({
      url: "../detail/detail?id=" + id //+ " & index=" + index,
    })
  },
  towards_center: function() {
    wx.navigateTo({
      url: '../mycenter/mycenter',
    })
  },
towards_mypost: function () {
    wx.navigateTo({
      url: '../mypost/mypost',
    })
  },
  towards_collect: function(){
    wx.navigateTo({
      url: '../collect/collect',
    })
  },

  scanCode: function (event) {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode'],
      success: res => {
        console.log(res)
        wx.showToast({
          title: '扫码成功',
          duration: 2000,
        })
         wx.cloud.callFunction({
          name: 'bookinfo',
          // 传递给云函数的参数
          data: {
            isbn: res.result
          },
          success: res => {
            var bookString = res.result;
             console.log(JSON.parse(bookString))
            const db = wx.cloud.database()
            const book = db.collection('mybook')
            // set price , shop 
            db.collection('mybook').add({
              content: JSON.parse(bookString).title,
              des: JSON.parse(bookString).summary,
             images: JSON.parse(bookString).image, 
              date: new Date().toLocaleString(),

            }).then(res => {
              console.log(res)
            }).catch(err => {
              console.log(err)
            })
          },
          fail: err => {
            console.error(err)
          }
        }) 
      },
      fail: err => {
        console.log("云函数调用失败");
      }
    })
  },
  bindtest: function () { 
    wx.request({
      url: 'http://localhost:8080/serverplat/servlet/saveTopic',  //本地服务器地址
      data: {
        username: 'huhwdu',
        content:'huhwdu',
        index:12,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' //默认值
      },
      success: function (res) {
        console.log(res.data);
      },
      fail: function (res) {
        console.log("失败");
      }
    })
  },
  onSearch:function(){
    wx.navigateTo({
      url: '../onsearch/onsearch',
    })
  }

})