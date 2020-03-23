// components/songlist/songlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songlist: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId: -1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(event) {
      const self = event.currentTarget.dataset
      const songId = self.musicid
      this.setData({
        playingId: songId
      })

      wx.navigateTo({
        url: `../../pages/player/player?songId=${songId}&index=${self.index}`,
      })
    }
  }
})
