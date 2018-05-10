const util = require("./../../utils/util.js");
const main = require("./../../config/main.js");
const app = getApp();
Page({
  data: {
    userInfo:null,
    categoryList:[],
    currentIndex:0,
    currentPageNo:0,
    postList:[],
    pageSize:10,
    maxLoadedPageNum:10,//最多加载多少页
    input:{
      account:"",
      password:""
    },
    systemInfo:wx.getSystemInfoSync(),
  },
  onLoad: function () {
    let page = this;
    page.login();
    //拿到分类配置
    util.request({
      url:main.api.post_getCategoryList,
      method:"GET"
    },function(err,data){
      if(err){
        console.log("post_getCategoryList_error1",err);
        util.showTips(err);
        return;
      }
      if(data.code !== 0){
        console.log("post_getCategoryList_error2", data);
        util.showTips(data.tips);
        return;
      }
      page.setData({
        categoryList: data.data,
        currentIndex:0
      });
      page.loadPosts(1, page.data.pageSize, data.data[0].en_name);
    });
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
    let page = this;
    page.loadPosts(page.data.currentPageNo + 1, page.data.pageSize, page.data.categoryList[page.data.currentIndex].en_name);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  login(){
    let page = this;
    util.login(function (err, data) {
      if (err) {
        console.log("util.login error1", err);
        util.showTips(err);
        return;
      }
      if (data.code !== 0) {
        console.log("util.login error2", data);
        util.showTips(data.tips);
        return;
      }
      let returnData = data.data;
      wx.setStorageSync("token", returnData.token);
      wx.setStorageSync("userInfo", returnData.userInfo);
      page.setData({
        userInfo: returnData.userInfo
      });
    });   
  },

  switchTab(event){
    let page = this;
    let index = event.currentTarget.dataset.idx;
    
    page.setData({
      postList:[],
      currentIndex:index
    });
    page.loadPosts(1, page.data.pageSize, page.data.categoryList[index].en_name);
  },
  switchCate(event){
    let page = this;
    let index = event.detail.current;
    page.setData({
      postList: [],
      currentIndex: index
    });
    page.loadPosts(1, page.data.pageSize, page.data.categoryList[index].en_name);
  },
  loadPosts(pageNo,pageSize,category){
    let page = this;
    if (app.globalData.requestLock.loadPosts){
      return;
    }
    app.globalData.requestLock.loadPosts = true;
    util.request({
      url: main.api.post_getPosts,
      method:"GET",
      data: { page: pageNo, pageSize: pageSize, category: category}
    },function(err,data){
      app.globalData.requestLock.loadPosts = false;
      if(err){
        console.log("post_getPosts_error1",err);
        util.showTips(err);
        return;
      }
      if(data.code !== 0){
        console.log("post_getPosts_error2", data);
        util.showTips(data.tips);
        return;
      }
      let posts = data.data;
      for(let idx in posts){
        //修改为人类更加可读的过去时间
        posts[idx].created_at_human = util.convert2humanTime(posts[idx].created_at);
        posts[idx].display_flag = 
          util.getDisplayFlag(posts[idx], page.data.currentIndex, page.data.categoryList);
      }
      let postList = page.data.postList;
      if (posts.length>0){
        postList = postList.concat(posts);
        page.setData({
          postList: postList,
          currentPageNo: pageNo
        });
      }
    });
  },
  register(event){
    let page = this;
    console.log(event);
    if (event.detail.errMsg !== "getUserInfo:ok"){
      util.showTips("请同意获取您的公开信息");
      return;
    }
    let inputData = page.data.input;
    inputData.userInfo = JSON.stringify(event.detail);

    util.request({
      url:main.api.user_register,
      header:{
        "content-type":"application/x-www-form-urlencoded"
      },
      data: inputData
    },function(err,data){
      if(err){
        console.log("user_register_error1",err);
        util.showTips(err);
        return;
      }
      if(data.code !== 0){
        console.log("user_register_error2", data);
        util.showTips(data.tips);
        return;
      }
      page.login();
    });
  },
  inputAccount(event){
    let page = this;
    page.setData({
      "input.account": event.detail.value
    });
  },
  inputPassword(event){
    let page = this;
    page.setData({
      "input.password": event.detail.value
    });
  }
})
