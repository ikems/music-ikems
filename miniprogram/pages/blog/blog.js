Page({

  /**
   * 页面的初始数据
   */
  data: {
    isModalShow: false
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
    console.log(self)
    // let nickName = self.userInfo?  self.userInfo.nickName : self.nickName
    // let avatarUrl = self.userInfo?self.userInfo.avatarUrl : self.avatarUrl

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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})