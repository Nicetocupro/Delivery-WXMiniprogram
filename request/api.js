/**
 * 在api.js中，将所有的接口统一管理
 */

const request = require("./request")
module.exports = {
    // 微信登录
    login(data){
        return request.post('login', data)
    },
    // 商务合作
    cooperation(data) {
        return request.post('customer/merchant-application', data)
    },
    // 个人信息保存
    ChangeProfile(data){
        return request.post('customer/info', data);
    }
}