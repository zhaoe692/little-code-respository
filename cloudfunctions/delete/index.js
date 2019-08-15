// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var docid = event.docid
  try {
    return await db.collection('topic').doc(docid).remove({
      success(res) {
        console.log(res.data)
      }
    })
  } catch (e) {
    console.log(e)
  }
}