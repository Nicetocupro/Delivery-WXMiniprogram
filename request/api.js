/**
 * 在api.js中，将所有的接口统一管理
 */

const request = require("./request")
module.exports = {
    // 微信登录
    login(data){
        return request.post('wx/login', data)
    },
    // 商务合作
    cooperation(data) {
        return request.post('customer/merchant-application', data)
    },
    // 获取评价列表
    fetchcomment(restaurant_id){
        return request.get(`/customer/comment/restaurant/${restaurant_id}`)
    }
}