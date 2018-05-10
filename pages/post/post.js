const WxParse = require('./../../wxParse/wxParse.js');
const util = require("./../../utils/util.js");
const main = require("./../../config/main.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    post:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this;
    let id = options.id;

    util.request({
      url:main.api.post_getPost,
      method:"GET",
      data:{id:id}
    },function(err,data){
        if(err){
          console.log("post_getPost_error1",err);
          util.showTips(err);
          return;
        }
        if(data.code !== 0){
          console.log("post_getPost_error2", data);
          util.showTips(data.tips);
          return;
        }
        let post = data.data;
        if(!post){
          console.log("post_getPost_error3", data);
          util.showTips("文章不存在");
          return;
        }
        post.created_at_human = util.convert2humanTime(post.created_at);
        page.setData({
          post: post
        });
        WxParse.wxParse('article', 'html', post.content_html, page, 5);
    });
  
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  toggleCollectPost(event){
    let page = this;
    if (app.globalData.requestLock.toggleCollectPost){
      wx.showToast({
        title: '收藏中',
        icon:'none',
        mask:true,
      });
      return;
    }
    app.globalData.requestLock.toggleCollectPost = true;

    let id = event.currentTarget.dataset.id;
    util.request({
      url: main.api.post_toggleCollectPost,
      data:{id:id}
    },function(err,data){
      app.globalData.requestLock.toggleCollectPost = false;
      if(err){
        console.log("collectPost_err1",err);
        util.showTips(err);
        return;
      }
      if(data.code !== 0){
        console.log("collectPost_err2", err);
        util.showTips(data.tips);
        return;
      }

      let post = page.data.post;
      post.uc_id = data.data;
      page.setData({
        post: post
      });

      if(data.data){
        wx.showToast({
          title: '收藏成功',
          musk: true
        });
      } else {
        wx.showToast({
          title: '取消收藏',
          icon: "none",
          musk:true
        });
      }
    });
  }
})