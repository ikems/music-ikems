// components/songlist/songlist.js
const app = getApp()

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

  pageLifetimes: {
    show() {
      this.setData({
        playingId: app.getPlayingMusicId().toString()
      })
      console.log(this.data.playingId)
    }
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
