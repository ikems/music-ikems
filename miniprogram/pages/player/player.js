// pages/player/player.js
let songLists = []
let currentSongIndex = 0
const bgAudioManger = wx.getBackgroundAudioManager()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false,
    isLyricShow: false,
    lyric: '',
    isSameSong: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    currentSongIndex = options.index
    songLists = wx.getStorageSync('musicListStorage')
    this._loadSongDetail(options.songId)
  },

  //加载音乐
  _loadSongDetail(songId) {
    if (songId === app.getPlayingMusicId()) {
      this.setData({
        isSameSong: true
      })
    } else {
      this.setData({
        isSameSong: false
      })
    }

    if (!this.data.isSameSong) {
      bgAudioManger.stop()
    }
    const currentSong = songLists[currentSongIndex]
    wx.setNavigationBarTitle({
      title: currentSong.name
    })
    this.setData({
      picUrl: currentSong.al.picUrl,
      isPlaying: false
    })

    app.setPlayingMusicId(songId) 

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
      if (result.data[0].url == null) {
        wx.showToast({
          title: '当前歌曲无权限播放',
        })
        return
      }
      if (!this.data.isSameSong) {
        bgAudioManger.src = result.data[0].url
        bgAudioManger.title = currentSong.name
        bgAudioManger.coverImgUrl = currentSong.al.picUrl
        bgAudioManger.singer = currentSong.ar[0].name
        bgAudioManger.epname = currentSong.al.name
      }   
    })
    this._loadSongLyric(songId)
    this.setData({
      isPlaying: true
    })
    wx.hideLoading()
  },

  onToggleLyric() {
    // console.log('切换')
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },

  //同步歌词，使其高亮
  onSyncLyric(event) {
    this.selectComponent('.lyric').update(event.detail.currentTime)
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
      const slyric = '暂无歌词'
      const lrc = JSON.parse(res.result).lrc
      const lyric = lrc? lrc.lyric : slyric
      this.setData({
        lyric
      })
      // console.log(this.data.lyric)
    })
  },
  
  onPlay() {
    this.setData({
      isPlaying: true
    })
  },

  onPause() {
    this.setData({
      isPlaying: false
    })
  }
  
})