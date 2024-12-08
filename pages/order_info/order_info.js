// pages/order_info/order_info.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        orderInfo: {}
    },
    onLoad: function (options) {
        this.setData({
            orderInfo: JSON.parse(options.data)
          });
          console.log(this.data.orderInfo);
    },
});