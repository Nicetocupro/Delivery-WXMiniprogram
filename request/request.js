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
    // 请求头
    let header = {
        'Content-Type': 'application/json'
    }
    let session_id = wx.getStorageSync('session_id');

    // 本地session存在,则放到header里
    if (session_id != "" && session_id != null) {
        header.Authorization = session_id;
    }

    return new Promise((resolve, reject) => {
        wx.request({
            url: app.globalData.baseUrl + url,
            method: options.method,
            data: options.method == "GET" ? options.data : JSON.stringify(options.data),
            header: header,
            success: (res) => {
                if (res.statusCode == 200) {
                    if (res.data.ecode == 200) {
                        resolve(res);
                    } else if (res.data.ecode == 9000) {
                        Toast("登陆超时");
                        //删除缓存  重新登录 获取会话
                        wx.removeStorageSync('sessionid');

                        wx.navigateTo({
                            url: '/pages/register/register',
                            success: function (res) {
                                console.log('register 跳转成功');
                            },
                            fail: function (err) {
                                console.error('register 跳转失败', err);
                            }
                        })
                    } else {
                        Toast(res.data.msg);
                        reject(res.data.msg);
                    }
                } 
                else if(res.statusCode == 403)
                {
                    Toast("公共区域不提供服务");
                    reject(res.data.msg)
                }
                else {
                    Toast(res);
                    reject(res.data.msg)
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
    },

    // 封装delete方法
    delete(url, data) {
        return request(url, {
            method: "DELETE", // 修正拼写
            data
        });
    },

    // 封装put方法
    put(url, data) {
        return request(url, {
            method: "PUT", // 修正拼写
            data
        });
    },

}