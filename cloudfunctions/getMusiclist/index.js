// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

const musicListsCollect = db.collection('musicLists')

const rp = require('request-promise')

const URL = 'http://musicapi.xiecheng.live/personalized'

const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  const countResult = await musicListsCollect.count()
  const total = countResult.total
  const frequency = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  for (let i=0; i<frequency; i++) {
    let promise = musicListsCollect.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let list = {
    data: []
  }
  console.log(tasks)
  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }
  console.log(list)

  const musicLists = await rp(URL).then(res => {
    return JSON.parse(res).result
  })

  const newData = []
  for (let i = 0; i < musicLists.length; i++) {
    let flag = true
    for(let j = 0; j < list.data.length; j++) {
      if (musicLists[i].id === list.data[j].id) {
        flag = false
        break
      }
    }
    if (flag) {
      newData.push(musicLists[i])
    }
  }

  for (let i = 0; i < newData.length; i++) {
    await musicListsCollect.add({
      data: {
        ...newData[i],
        createTime: db.serverDate()
      }
    }).then(res => {
      // console.log(res)
    }).catch(err => {
      console.log('插入失败')
    })
  }

  return newData.length
}