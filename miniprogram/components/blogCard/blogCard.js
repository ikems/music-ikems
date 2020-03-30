import formatTime from '../../utils/formatTime'


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object
  },

  observers: {
    ['blog.createTime'](val) {
      if (val) {
        this.setData({
          _createTime: formatTime(new Date(val))
        })
      }
    }
  },

  pageLifetimes: {
    show() {
      console.log(this.properties.blog)
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _createTime: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPreviewImage(event) {
      const self = event.target.dataset
      wx.previewImage({
        urls: self.imgs,
        current: self.imgsrc
      })
    }
  }
})
