//app.js
App({
  onLaunch: function () {
   
  },
  globalData: {
    requestLock:{
      loadPosts:false,//并发请求锁控制
      toggleCollectPost:false
    },
  }
})