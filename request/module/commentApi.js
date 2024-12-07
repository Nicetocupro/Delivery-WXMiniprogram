const request = require("../request");

module.exports = {
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
    FetchPic(file_path) {
        return request.get(`customer/comment/${file_path}`);
    },
    // 获取评价列表
    fetchcomment(restaurant_id) {
        return request.get(`/customer/comment/restaurant/${restaurant_id}`)
    }
};