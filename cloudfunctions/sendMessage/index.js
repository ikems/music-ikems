// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  console.log(OPENID)
  const result = await cloud.openapi.subscribeMessage.send({
    touser: OPENID,
    page: `/pages/blogcomment/blogcomment?blogId=${event.blogID}`,
    data: {
      name1: {
        value: event.nickName
      },
      thing3: {
        value: event.content
      }
    },
    templateId: 'v00Aa2JlYw0ZG46vYHtAicUECreaPPezpUTPgkg8CDo',
  })
  console.log(result)
  return result
}