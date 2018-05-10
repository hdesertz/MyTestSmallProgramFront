const main = require("./../config/main.js");
const login = (callback) =>{
     wx.login({
      success(result){
        if(!result.code){
          console.log("wx.login result code", result);
          return;
        }
        let loginOptions = {
          url:main.api.user_login,
          header:{
            "content-type":"application/x-www-form-urlencoded"
          },
          data:{
            code:result.code
          }
        };
        request(loginOptions,function(err,data){
            if(err){
              console.log("login_error1", err);
              return;
            }
            if(data.code !== 0 || !data.data.token){
              console.log("login_error2", data);
              return;
            }
            wx.setStorageSync("token", data.data.token);
            callback(null, data);
        });
      },
      fail(result){
        console.log("wx.login client error",result);
      }
    });
};
const request = (options,callback) =>{
  if (!options || !options.url){
    console.log("url empty",options);
    return;
  }
  let data = options.data ? options.data:{};
  let header = options.header ? options.header:{};
  if (!header["x-token"]){
    header["x-token"] = wx.getStorageSync("token");
  }
  wx.showLoading({
    title: '加载中',
    mask:true
  });
  wx.request({
    url: options.url,
    data:data,
    method: options.method ? options.method:"POST",
    header:header,
    dataType:"json",
    success(result){
      wx.hideLoading();
      if(result.statusCode != 200){
        callback("server error1", result,options);
        return;
      }
      let resultData = result.data;
      callback(null,resultData);
    },
    fail(result){
      wx.hideLoading();
      callback("client error1", result);
    }
  });
};
let convert2humanTime =  (str) => {
  if (!str) {
    return '';
  }
  let date = new Date(str);
  let time = new Date().getTime() - date.getTime();
  if (time < 0) {
    return '';
  } else if (time / 1000 < 60) {
    return '刚刚';
  } else if ((time / 60000) < 60) {
    return parseInt((time / 60000)) + '分钟前';
  } else if ((time / 3600000) < 24) {
    return parseInt(time / 3600000) + '小时前';
  } else if ((time / 86400000) < 31) {
    return parseInt(time / 86400000) + '天前';
  } else if ((time / 2592000000) < 12) {
    return parseInt(time / 2592000000) + '月前';
  } else {
    return parseInt(time / 31536000000) + '年前';
  }
};

let getDisplayFlag = (post,currentIdx,categoryList)=>{
  let currentCategory = categoryList[currentIdx];
  let cateKvStore = {};
  for (let idx in categoryList){
    cateKvStore[categoryList[idx].en_name] = categoryList[idx].name
  }
  if (currentCategory.en_name == "all"){//当前为 全部
    if (post.is_good){
      return cateKvStore["good"];//精华 flag 优先展示
    }
    if (post.is_top) {
      return "置顶";//优先展示 置顶
    }
    return cateKvStore[post.category];
  }
  if(currentCategory.en_name == "good"){//当前为 精华
    if (post.is_top) {
      return "置顶";//优先展示 置顶
    } else {
      return cateKvStore["good"];//精华 flag 优先展示
    }
  }
  return cateKvStore[post.category];
};
let showTips = (msg, title ="温馨提示")=>{
  wx.showModal({
    title: title,
    content: msg,
    showCancel: false
  });
}
module.exports = {
  login:login,
  request:request,
  convert2humanTime: convert2humanTime,
  getDisplayFlag: getDisplayFlag,
  showTips: showTips
}
