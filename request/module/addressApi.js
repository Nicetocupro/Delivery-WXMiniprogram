const request = require("../request");

module.exports = {
    // 新增收获地址
    addAddress(data) {
        return request.post('customer/addressbook', data);
    },
    // 获取当前用户所有收货地址
    getAddress() {
        return request.get('customer/addressbook');
    },
    // 删除某一个收货地址
    deleteAddress(id) {
        return request.delete(`customer/addressbook/${id}`);
    },
    // 编辑一个收货地址
    changeAddress(data, id) {
        return request.put(`customer/addressbook/${id}`, data);
    },
    // 将某一个收货地址设为默认
    setDefaultAddress(id) {
        return request.put(`customer/addressbook/${id}/default`);
    },
};
