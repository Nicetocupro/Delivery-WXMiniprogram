const request = require("../request");

module.exports = {
    // 获取商店的所有商品和类别
    GetRestaurantInfo(data) {
        const restaurantId = data.restaurant_id;
        const url = `customer/restaurant/${restaurantId}/categories/dishes`;
        return request.get(url);
    },
    // 获取商店的商家信息
    GetRestaurantMsg(data) {
        const restaurantId = data.restaurant_id;
        const url = `customer/restaurant/${restaurantId}`;
        return request.get(url);
    },
    // 获得所有店铺及商品（以及商品照片）
    GetAllRestaurants() {
        return request.get('customer/restaurants');
    },
    GetAllDishes(id) {
        return request.get(`customer/restaurant/${id}/dishes/top`);
    },
};