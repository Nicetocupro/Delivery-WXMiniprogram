const request = require("../request");

module.exports = {
    // 上传骑手认证
    Rider_Certificate(data) {
        return request.post(`customer/rider-application`, data);
    },
};
