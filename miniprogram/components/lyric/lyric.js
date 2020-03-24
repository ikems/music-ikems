// components/lyric/lyric.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: Boolean,
    lyric: String,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  lifetimes: {
    ready() {
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _handleLyric(){ 
      console.log(this.properties.lyric)
    }
  }
})
