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

    // 收货地址管理
    //新增收获地址
    addAddress(data){
        return request.post('customer/addressbook',data);
    },
    //获取当前用户所有收货地址
    getAddress(data){
        return request.get('customer/addressbook');
    },
    //删除某一个收货地址
    deleteAddress(id){
        return request.delete(`customer/addressbook/${id}`);
    },
    //编辑一个收货地址
    changeAddress(data, id){
        return request.put(`customer/addressbook/${id}`, data);
    },
    //将某一个收货地址设为默认
    setDefaultAddress(id){
        return request.put(`customer/addressbook/${id}/default`);
    },

}