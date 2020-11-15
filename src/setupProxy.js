/**
 @Author：liaoliuyuan
 @Date：2019/9/12/13:14
 @FileName: setupProxy.js
 */
const proxy = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(proxy("/smart", {
        target: "https://www.baidu.com",
        changeOrigin: true,
    }))
};