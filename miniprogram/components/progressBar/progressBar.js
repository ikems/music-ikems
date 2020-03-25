let backgroundAudioManager = wx.getBackgroundAudioManager()
let movableAreaWidth = 0
let movableViewWidth = 0
let durationTime = 0
let isMoving = false
let sec = 0

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSameSong: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentTime: '00:00',
    durationTime: '00:00',
    percent: 0,
    movableDis: 0,
  },

  lifetimes: {
    ready() {
      if (this.properties.isSameSong && this.data.durationTime === '00:00') {
        this._setTime()
      }
      this._bindBGMEvent()
      this._getMovableDis()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _setTime() {
      durationTime = backgroundAudioManager.duration
      this.setData({
          durationTime: this._dateFormat(durationTime)
      })
    },

    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        // console.log('onPlay')
        //在拖拽时间结束后，有机率会出发onChange事件，
        //故每当onPlay执行，重新锁住状态
        isMoving = false
        this.triggerEvent('musicPlay')
      })

      backgroundAudioManager.onStop(() => {
        // console.log('onStop')
      })

      backgroundAudioManager.onPause(() => {
        this.triggerEvent('musicPause')
      })

      backgroundAudioManager.onWaiting(() => {
        // console.log('onWaiting')
      })

      backgroundAudioManager.onCanplay(() => {
        // console.log('onCanplay')
        if (typeof backgroundAudioManager.duration !== 'undefined') {
          this._setTime()
        } else {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })

      backgroundAudioManager.onTimeUpdate(() => {
        if (!isMoving) {
          const currentTime = backgroundAudioManager.currentTime
          let currentSec = currentTime.toString().split('.')[0]
          if (sec !== currentSec) {
            const percent = (currentTime / durationTime) * 100
            this.setData({
              percent,
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / durationTime,
              currentTime: this._dateFormat(currentTime)
            })
            sec = currentSec
            // console.log(sec, this.data.percent)
          }
          this.triggerEvent('syncLyric', {
            currentTime
          })
        }
      })

      backgroundAudioManager.onEnded(() => {
        this.triggerEvent('musicEnd')
      }) 
    },

    onChange(event) {
      // console.log(event.detail)
      if (event.detail.source === 'touch') {
        this.data.movableDis = event.detail.x
        this.setData({
          currentTime: this._dateFormat(backgroundAudioManager.currentTime),
          percent: event.detail.x / (movableAreaWidth - movableViewWidth) * 100
        })
        isMoving = true
      }
    },

    onTouchEnd(event) {
      this.setData({
        percent: this.data.percent,
        movableDis: this.data.movableDis,
        
      })
      backgroundAudioManager.seek(durationTime * this.data.percent /100)
      isMoving =  false
    },

    _getMovableDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect) => {
        // console.log(rect)
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
        // console.log(movableAreaWidth, movableViewWidth)
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
