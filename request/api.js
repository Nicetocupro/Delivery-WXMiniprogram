/**
 * 在api.js中，将所有的接口统一管理
 */

const request = require("./request")
module.exports = {
    // 微信登录
    login(data) {
        return request.post('login', data)
    },
    // 商务合作
    cooperation(data) {
        return request.post('customer/merchant-application', data)
    },
    // 个人信息保存
    ChangeProfile(data) {
        return request.post('customer/info', data);
    },
    // 获取商店的所有商品和类别
    GetRestaurantInfo(data) {
        const restaurantId = data.restaurant_id;
        const url = `customer/restaurant/${restaurantId}/categories/dishes`;
        return request.get(url);
    },
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
    // 获得用户订单
    GetOrders() {
        return request.get('customer/orders')
    },
    // 获得一个顾客的所有地址簿
    GetAddressBook() {
        return request.get('customer/addressbook')
    },
    // 给顾客创造一个新的地址簿
    SetAddressBook(data) {
        return request.post('customer/addressbook', data)
    },
    // 下订单
    PlaceOrder(data) {
        const restaurantId = data.restaurant_id;
        delete data.restaurant_id;
        return request.post(`customer/order/restaurant/${restaurantId}`, data)
    },
    // 取消订单
    CancelOrder(data) {
        const order_id = data.order_id;
        return request.post(`customer/order/${order_id}/cancel`)
    }
}