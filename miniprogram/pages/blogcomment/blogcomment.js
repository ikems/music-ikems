import formatTime from '../../utils/formatTime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog: {},
    commentLists: [],
    blogId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options)
     this.setData({
       blogId: options.blogId
     })
     this._getBlogCommentLists()
  },

  _getBlogCommentLists() {
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })

    //请求数据
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'detail',
        blogId: this.data.blogId
      }
    }).then(res => {
      console.log(res)
      let commentLists = res.result.commentLists.data
      commentLists.forEach(item => {
        return item.createTime = formatTime(new Date(item.createTime)) 
      })

      this.setData({
        commentLists,
        blog: res.result.detail[0]
      })

      wx.hideLoading()
    })
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