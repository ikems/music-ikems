// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const TCbRouter = require('tcb-router')

// 云函数入口函数
exports.main = async (event, context) => {

  const app = new TCbRouter({event})

  app.use(async (ctx, next) => {
    ctx.data = {}
    ctx.data.openId = event.userInfo.openId
    await next()
  })

  app.router

  return app
  
}