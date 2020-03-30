//最大输入字符数
const MAX_WORDS_NUM = 140
//最大选择照片数
const MAX_IMAGE_NUM = 9
//输入的内容
let inputContent = ''
//用户的信息
let userInfo = {}

const db = wx.cloud.database()



Page({

  /**
   * 页面的初始数据
   */
  data: {
    footerHeight: 0,
    wordsNum: 0,
    imageLists: [],
    isSelectPhoto: true,
  },

  onLoad: function(options) {
    userInfo = options
  },

  onFocus(event) {
    // console.log(event)
    this.setData({
      footerHeight: event.detail.height
    })
  },

  onBlur(event) {
    // console.log(event)
    
  },

  onInput(event) {
    let wordsNum = event.detail.value.length
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大数字为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
    inputContent = event.detail.value
  },

  onChooseImage() {
    //还能再选几张图片
    let max = MAX_IMAGE_NUM - this.data.imageLists.length
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          imageLists: this.data.imageLists.concat(res.tempFilePaths) 
        })
        max = MAX_IMAGE_NUM - this.data.imageLists.length
        this.setData({
          isSelectPhoto: max <= 0 ? false:true
        })
      }
    })
  },

  onDeletePhoto(event) {
    // console.log(event)
    let index = event.target.dataset.index
    this.data.imageLists.splice(index, 1)
    this.setData({
      imageLists: this.data.imageLists
    })
    if (this.data.imageLists.length === MAX_IMAGE_NUM - 1) {
      this.setData({
        isSelectPhoto: true
      })
    }
  },

  onPreviewImage(event) {
    wx.previewImage({
      urls: this.data.imageLists,
      current: event.target.dataset.imgPreSrc
    })
  },

  onSendImage() {
    let len = this.data.imageLists.length
    if (inputContent === '' && len === 0) {
      wx.showModal({
        title: '请输入内容',
        content: ''
      })
      return
    }

    wx.showLoading({
      title: '发布中',
      mask: true
    })

    let results = []
    for (let item of this.data.imageLists) {
      results.push(this.upLoadPhotoAsync(item))
    }
    
    Promise.all(results)
      .then( res => {
        // console.log(res)
        const lists = res.map(item => item.fileID)
        db.collection('blog').add({
          data: {
            ...userInfo,
            inputContent,
            img: lists,
            createTime: db.serverDate(), // 服务端的时间
          }
        }).then((res) => {
            wx.hideLoading()
            wx.showToast({
              title: '发布成功',
            })
            wx.navigateBack()
            const pages = getCurrentPages()
            const prePage = pages[pages.length - 2]
            prePage.onPullDownRefresh()
          })
      }).catch(err => {
        wx.hideLoading()
        wx.showToast({
          title: '发布失败',
        })
      })
  },

  upLoadPhotoAsync(item) {
    const p = new Promise((reslove, reject) => {
      let suffix = /\.\w+$/.exec(item)[0]
      wx.cloud.uploadFile({
        cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 10000000 + suffix,
        filePath: item,
        success: res => {
          reslove(res)
        },
        fail: err => {
          console.error(err)
        }
      }) 
    })
    return p
  }
})