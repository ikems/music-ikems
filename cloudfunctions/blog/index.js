// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const TcbRouter = require('tcb-router')

const db = cloud.database()

const blogCol = db.collection('blog')
const commentCol = db.collection('blog-comments')

const MAX_LIMIT = 100



// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({event})

  app.router('list', async (ctx, next) => {
    const keyword = event.keyword
    let w = {}
    if (keyword.trim() !== '') {
      w = {
        inputContent: db.RegExp({
          regexp: keyword,
          options: 'i'
        })
      }
    }

    let blogLists = await blogCol.where(w).skip(event.start).limit(event.count).orderBy('createTime', 'desc').get()
      .then(res => {
        return res.data
      })
    ctx.body = blogLists
  })

  app.router('detail', async (ctx, next) => {
    let blogId = event.blogId
    //获取blog详情
    let detail = await blogCol.where({
      _id: blogId
    }).get().then(res => {
      return res.data
    })

    //获取评论信息
    const countRes = await commentCol.count()
    const total = countRes.total
    let commentLists = {
      data: []
    }
    if (total > 0) {
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      let task = []
      for (let i=0; i<batchTimes; i++) {
        let p = commentCol.skip(i * MAX_LIMIT).limit(MAX_LIMIT).where({
          blogId
        }).orderBy('createTime', 'desc').get()
        task.push(p)
      }

      if (task.length > 0) {
        commentLists = (await Promise.all(task)).reduce((pre, cur) => {
          return {
            data: pre.data.concact(cur.data)
          }
        })
      }

      ctx.body = {
        commentLists,
        detail
      }

    }

  })

  return app.serve()
}