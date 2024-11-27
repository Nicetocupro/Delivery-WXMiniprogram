/**
       request.js
     * 封装一个Promise风格的通用请求
     * url - 请求地址
     * option - 包含请求方式、请求参数的配置对象
 */

//  引入全局app.js，可以在globalData中定义公共资源数据，比如baseUrl、token
var app = getApp();
//  引入vant插件，用于提示错误
import Toast from '@vant/weapp/toast/toast';
const request = function (url, options) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.baseUrl + url,
            method: options.method,
            data: options.method == "GET" ? options.data : JSON.stringify(options.data),
            header:{
                'Content-Type' : 'application/json'
            },     
            success: (res) => {
                if (res.data.code == 500) {
                    Toast(res.data.msg);
                    reject(res.data.msg)
                } else {
                    resolve(res)
                }
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

module.exports = {
    //封装get方法
    get(url, data) {
        return request(url, {
            method: "GET",
            data
        })
    },
    //封装post方法
    post(url, data) {
        return request(url, {
            method: "POST",
            data
        })
    }
}