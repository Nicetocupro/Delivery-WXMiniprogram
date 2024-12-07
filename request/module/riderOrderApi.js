const request = require("../request");

module.exports = {
    /** 骑手订单列表 */
    GetRiderOrder(status) {
        return request.get(`customer/order/status/${status}`);
    },
    SetRiderOrder(orderId, nextStatus) {
        return request.put(`customer/order/${orderId}/status/${nextStatus}`);
    },
};