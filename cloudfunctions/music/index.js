// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const BASE_URL = 'http://musicapi.xiecheng.live'

const TcbRouter = require('tcb-router')
const rp = require('request-promise')

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({event})

  app.router('playList', async (ctx, next) => {
    ctx.body =  await db.collection('musicLists')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        return res
      })
  })

  app.router('musicList', async (ctx, next) => {
    let url = BASE_URL + '/playlist/detail?id=' + parseInt(event.musicListId)
    console.log(url)
    ctx.body = await rp(url)
      .then(res => {
        console.log(res)
        return JSON.parse(res)
      })
  })

  app.router('songUrl', async (ctx, next) => {
    let url = BASE_URL + `/song/url?id=${event.songId}`
    ctx.body = await rp(url)
      .then(res => {
        return res
      })
  })

  return app.serve()
}