const request = require("../request");

module.exports = {
    /** 用户订单列表 */
    // 获得用户订单
    GetUserOrders() {
        return request.get('customer/orders');
    },
    // 下订单
    PlaceUserOrder(data) {
        const restaurantId = data.restaurant_id;
        delete data.restaurant_id;
        return request.post(`customer/order/restaurant/${restaurantId}`, data);
    },
    // 取消订单
    CancelUserOrder(data) {
        const order_id = data.order_id;
        return request.post(`customer/order/${order_id}/cancel`);
    },
    // 支付订单
    PayUserOrder(data) {
        const order_id = data.order_id;
        return request.post(`customer/order/${order_id}/pay`);
    },
};
