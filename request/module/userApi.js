const request = require("../request");

module.exports = {
    // 微信登录
    login(data) {
        return request.post('login', data);
    },
    // 个人信息保存
    ChangeProfile(data) {
        return request.post('customer/info', data);
    },
    // 商务合作
    cooperation(data) {
        return request.post('customer/merchant-application', data)
    },
};