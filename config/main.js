const API_PREFIX = "http://192.168.199.235:7001/api/";
//const API_PREFIX = "https://wxablog.shukaiming.com/api/";
module.exports = {
  api:{
    user_login: API_PREFIX+"user/login",
    user_register: API_PREFIX +"user/register",
    post_getCategoryList: API_PREFIX + "post/getCategoryList",
    post_getPosts: API_PREFIX + "post/getPosts",
    post_getPost: API_PREFIX + "post/getPost",//collectPost
    post_toggleCollectPost: API_PREFIX + "post/toggleCollectPost",//collectPost
  }
};