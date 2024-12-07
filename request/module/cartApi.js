const request = require("../request");

module.exports = {
    // 获取购物车逻辑
    GetCart(data) {
        const restaurantId = data.restaurant_id;
        const url = `customer/cart/restaurant/${restaurantId}`;
        return request.get(url);
    },
    // 更新购物车逻辑
    UpdateCart(data) {
        const restaurantId = data.restaurant_id;
        const url = `customer/cart/restaurant/${restaurantId}`;

        // 删除 data 对象中的 restaurant_id 属性
        delete data.restaurant_id;
        return request.post(url, data);
    },
};
