
let userInfo = {}
const db = wx.cloud.database()
const commentTempId = 'v00Aa2JlYw0ZG46vYHtAicUECreaPPezpUTPgkg8CDo'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String
  },

  externalClasses: ['iconfont', 'icon-pinglun', 'icon-fenxiang'],

  /**
   * 组件的初始数据
   */
  data: {
    isModalShow: false,
    isLoginShow: false,
    content: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      wx.getSetting({
        complete: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              complete: (res) => {
                userInfo = res.userInfo
                this.setData({
                  isModalShow: true
                })
              },
            })
          } else {
            this.setData({
              isLoginShow: true
            })
          }
        },
      })
    },

    onLoginSuccess(event) {
      userInfo = event.detail.userInfo
      this.setData({
        isLoginShow: false
      }, () => {
        this.setData({
          isModalShow: true
        })
      })
    },

    onLoginFail() {
      wx.showModal({
        title: '只有授权用户才可以评论',
      })
    },

    onInput(event) {
      this.setData({
        content: event.detail.value
      })
    },

    onSendComment(event) {
      let content = this.data.content
      // console.log(event)
      if (content.trim() === '') {
        wx.showModal({
          title: '发布的内容不能为空',
        })
        return
      }

      wx.showLoading({
        title: '评论发布中',
        mask: true
      })

      db.collection('blog-comments').add({
        data: {
          content,
          createTime: db.serverDate(),
          blogId: this.properties.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
        })
        // console.log('1')

        this.setData({
          isModalShow: false,
          content: ''
        })
        
      })

      wx.requestSubscribeMessage({
        tmplIds: [commentTempId],
        complete: (res) => {
          console.log(res)
          let results = res[commentTempId]
          console.log(results)
          if (results === 'accept') {
            wx.cloud.callFunction({
              name: 'sendMessage',
              data: {
                nickName: userInfo.nickName,
                content,
                blogId: this.properties.blogId
              }
            })
          } else {
            wx.showModal({
              title: '只有授权才可以通知作者',
            })
          }
        }
      })
    },
  }
})
