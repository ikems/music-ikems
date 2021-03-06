let keyword = ''

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeHolder: {
      type: String,
      value: '请输入关键字'
    }
  },

  externalClasses: ['iconfont', 'icon-sousuo'],
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(event) {
      keyword = event.detail.value
    },

    onSearch() {
      this.triggerEvent('keywordSearch', {keyword})
    }
  }
})
