let backgroundAudioManager = wx.getBackgroundAudioManager()
let durationTime = 0

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    currentTime: '00:00',
    durationTime: '00:00',
  },

  lifetimes: {
    ready() {
      this._bindBGMEvent()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _setTime() {
      durationTime = backgroundAudioManager.duration
      console.log(durationTime)
      this.setData({
          durationTime: this._dateFormat(durationTime)
      })
    },


    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        console.log('onPlay')
        
      })

      backgroundAudioManager.onStop(() => {
        console.log('onStop')
      })

      backgroundAudioManager.onPause(() => {
    
      })

      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      })

      backgroundAudioManager.onCanplay(() => {
        console.log('onCanplay')
        if (typeof backgroundAudioManager.duration !== 'undefined') {
          this._setTime()
        } else {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })

      backgroundAudioManager.onTimeUpdate(() => {
        const currentTime = backgroundAudioManager.currentTime
        this.setData({
          currentTime: this._dateFormat(currentTime)
        })

      })
  },
    // 格式化时间
    _dateFormat(time) {
      const minutes = "0" + Math.floor(time / 60)
      const seconds = "0" + Math.floor((time - time / 60))
      return minutes.substr(-2) + ":" + seconds.substr(-2)
      }
    }
})
