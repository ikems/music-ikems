let lyricHeight = 0


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: Boolean,
    lyric: String,
  },

  observers: {
    lyric(lrc) {
      // console.log(lrc)
      if (lrc === '暂无歌词') {
        this.setData({
          lrcList: [{
            lrc,
            time: 0
          }],
          curLyricIndex: -1,
        })
        console.log(this.data.lrcList[0].lrc)
      }
      // console.log(lrc)
      this._parseLyric(lrc)
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [],
    curLyricIndex: 0, //高亮显示歌词的索引
    scrollTop: 0, //滚动条滚动的高度
  },

  lifetimes: {
    ready() {
      //解析手机的单位尺寸，方便歌词滚动
      wx.getSystemInfo({
        success: function(res) {
          //求出1rpx的大小， 64为一行歌词的高度
          lyricHeight = res.screenWidth / 750 * 64
        },
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _parseLyric(sLyric){ 
      let lineLists = sLyric.split('\n')
      const results = lineLists.map(item => {
        let str1 = item.substring(1, 9)
        let str2 = item.substring(10).trim()
        // console.log(this._tranSec(str1), str2)
        return {
          lrc: str2,
          time: this._tranSec(str1)
        }
      })
      this.setData({
        lrcList: results
      })
    },

    update(currentTime) {
      let lrcLists = this.data.lrcList
      let len = lrcLists.length
      if (len === 0) {
        return
      }
      if (currentTime > lrcLists[len - 1].time) {
        this.setData({
          curLyricIndex: -1,
          scrollTop: (len - 1) * lyricHeight
        })
      }

      for(let i=0; i<len; i++) {
        if (currentTime <= lrcLists[i].time) {
          this.setData({
            curLyricIndex: i-1,
            scrollTop: (i - 1) * lyricHeight
          })
          break
        }
      }
    },

    _tranSec(str) {
      // console.log(str)
      let s1 = str.substr(0, 2)
      let s2 = str.substr(3, 2)
      let s3 = str.substr(6, 2)
      let sec = parseInt(s1) * 60 + parseInt(s2) + parseInt(s3) / 1000
      return sec
    }
  }
})
