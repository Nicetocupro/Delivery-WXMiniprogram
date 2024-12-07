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
    // 获取评价列表
    fetchcomment(restaurant_id){
        return request.get(`/customer/comment/restaurant/${restaurant_id}`)
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
    // 上传评论
    SendComment(restaurant_id, data) {
        return request.post(`customer/comment/restaurant/${restaurant_id}`, data);
    },
    // 获取商铺所有的评论
    FetchComments(data) {
        const restaurant_id = data.restaurant_id;
        console.log(restaurant_id);
        delete data.restaurant_id;
        return request.get(`customer/comment/restaurant/${restaurant_id}`, data);
    },
    // 获取图片
    FetchPic(file_path){
        return request.get(`customer/comment/${file_path}`);
    },
    // 上传骑手认证
    Rider_Certificate(data){
        return request.post(`customer/rider-application`, data);
    }
}