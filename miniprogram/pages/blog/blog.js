let keyword = ''

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isModalShow: false,
    blogLists: []
  },

  onLoad() {
    this._loadBlogLists()
  },

  onPublish() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              console.log(res)
              this.onLoginSuccess({
                detail: res.userInfo
              })
            },
          })
        } else {
          this.setData({
            isModalShow: true
          })
        }
      },
    })

    
  },

  onLoginSuccess(event) {
    // console.log(event)
    const self = event.detail
    let nickName = self.nickName || self.userInfo.nickName
    let avatarUrl = self.avatarUrl || self.userInfo.avatarUrl
    wx.navigateTo({
      url: `../blogedit/blogedit?nickName=${nickName}&avatarUrl=${avatarUrl}`,
    })
  },

  onLoginFail() {
    wx.showModal({
      title: '授权用户才能发布博客',
      content: ''
    })
  },

  _loadBlogLists(start=0) {
    wx.showLoading({
      title: '努力加载中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        start,
        keyword,
        count: 5,
        $url: 'list',
      }
    }).then(res => {
      this.setData({
        blogLists: this.data.blogLists.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })

  },

  onPullDownRefresh() {
    this.setData({
      blogLists: []
    }) 
    this._loadBlogLists()
  },

  onReachBottom() {
    this._loadBlogLists(this.data.blogLists.length)
  },

  goComment(event) {
    console.log(event)
    let blogId = event.target.dataset.blogid
    wx.navigateTo({
      url: `../../pages/blogcomment/blogcomment?blogId=${blogId}`,
    })
  },

  onSearch(event) {
    // console.log(event.detail.keyword)
    this.setData({
      blogLists: []
    })
    keyword = event.detail.keyword
    this._loadBlogLists()
  }
})