// pages/player/player.js
let songLists = []
let currentSongIndex = 0

const bgAudioManger = wx.getBackgroundAudioManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false,
    isLyricShow: false,
    lyric: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    currentSongIndex = options.index
    songLists = wx.getStorageSync('musicListStorage')
    this._loadSongDetail(options.songId)
    this._loadSongLyric(options.songId)
  },

  //加载音乐
  _loadSongDetail(songId) {
    bgAudioManger.stop()
    const currentSong = songLists[currentSongIndex]
    wx.setNavigationBarTitle({
      title: currentSong.name
    })

    this.setData({
      picUrl: currentSong.al.picUrl,
      isPlaying: false
    })

    wx.showLoading({
      title: '歌曲加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        songId,
        $url: 'songUrl'
      } 
    }).then(res => {
      let result = JSON.parse(res.result)
      bgAudioManger.src = result.data[0].url
      bgAudioManger.title =  currentSong.name
      bgAudioManger.coverImgUrl = currentSong.al.picUrl
      bgAudioManger.singer = currentSong.ar[0].name
      bgAudioManger.epname = currentSong.al.name
    })

    this.setData({
      isPlaying: true
    })
    wx.hideLoading()
  },

  onToggleLyric() {
    console.log('切换')
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },


  //切换音乐的状态
  togglePlaying() {
    if (this.data.isPlaying) {
      bgAudioManger.pause()
    } else {
      bgAudioManger.play()
    }

    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },

  //上一首
  onPrev() {
    currentSongIndex--
    if (currentSongIndex < 0) {
      currentSongIndex = songLists.length - 1
    }
    this._loadSongDetail(songLists[currentSongIndex].id)
  },

  //下一首
  onNext() {
    currentSongIndex = (currentSongIndex + 1) % songLists.length
    this._loadSongDetail(songLists[currentSongIndex].id)
  },

  _loadSongLyric(musicId) {
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'lyric',
      }
    }).then((res) => {
      // console.log(res)
      let lyric = '暂无歌词'
      const lrc = JSON.parse(res.result).lrc
      this.setData({
        lyric: lrc.lyric || lyric
      })
      console.log(this.data.lyric)
    })
  }
  
})