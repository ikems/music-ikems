Component({externalClasses:["l-class"],properties:{type:{type:String,value:"still"},swipArr:Array,frontIconName:{type:String,value:""},frontIconSize:{type:Number,value:28},frontIconColor:{type:String,value:"#3683D6"},endIconName:{type:String,value:""},endIconSize:{type:Number,value:28},endIconColor:{type:String,value:"#3683D6"},backgroundcolor:{type:String,value:"#DFEDFF"},color:{type:String,value:"#3683D6"},speed:{type:Number,value:1500},show:{type:Boolean,value:!0},close:{type:Boolean,value:!1}},data:{wrapWidth:0,width:0,duration:0,animation:null,timer:null},detached(){this.destroyTimer()},ready(){"roll"==this.properties.type&&this.properties.show&&this.initAnimation()},methods:{initAnimation(){wx.createSelectorQuery().in(this).select(".l-noticebar-content-wrap").boundingClientRect(t=>{wx.createSelectorQuery().in(this).select(".l-noticebar-content").boundingClientRect(i=>{const e=i.width/40*this.data.speed,a=wx.createAnimation({duration:e,timingFunction:"linear"});this.setData({wrapWidth:t.width,width:i.width,duration:e,animation:a},()=>{this.startAnimation()})}).exec()}).exec()},startAnimation(){if(0!==this.data.animation.option.transition.duration){this.data.animation.option.transition.duration=0;const t=this.data.animation.translateX(this.data.wrapWidth).step();this.setData({animationData:t.export()})}this.data.animation.option.transition.duration=this.data.duration;const t=this.data.animation.translateX(-this.data.width).step();setTimeout(()=>{this.setData({animationData:t.export()})},100);const i=setTimeout(()=>{this.startAnimation()},this.data.duration);this.setData({timer:i})},destroyTimer(){this.data.timer&&clearTimeout(this.data.timer)},handleTap(){this.triggerEvent("lintap",{},{bubbles:!0,composed:!0}),this.setData({timer:null})},onSwip(t){this.triggerEvent("lintap",{...t.currentTarget.dataset},{bubbles:!0,composed:!0})},onIconTap(){this.triggerEvent("linicontap",{},{bubbles:!0,composed:!0}),this.setData({timer:null})},onClose(){this.setData({timer:null,show:!1})}}});