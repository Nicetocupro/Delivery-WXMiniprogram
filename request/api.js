/**
 * 在api.js中，将所有的接口统一管理
 */

const request = require("./request")
module.exports = {
    // 商务合作
    cooperation(data) {
        return request.post('customer/merchant-application', data)
    }
}