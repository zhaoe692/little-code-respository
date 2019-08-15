const cloud = require('wx-server-sdk')
cloud.init()
exports.main = (event, context) => {
  console.log(event)
  console.log(context)
  
  return {
    openid: event.userInfo.openId,
    userInfo: event.userInfo
  }
}
