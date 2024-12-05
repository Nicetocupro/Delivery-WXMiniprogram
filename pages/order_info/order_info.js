// pages/order_info/order_info.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        oid: 0,
        order: {},
        goods: [],
        totalprice: 0.0,
        accepted: 0,
        address: '',
        phone: '',
        business: 0,
        courier: '',
        courier_phone: '',
        random: '',
        url: getApp().globalData.server,
    },
    onLoad: function (options) {
        this.setData({
            random: Math.random() / 9999
        });
        this.setData({
            oid: options.id,
            business: options.business
        });
        console.log(this.data.business);
        // 这个地方要能查询到 order_id 对应的数据（待完成）
    },
    goto_comment: function (e) {
        var index = parseInt(e.currentTarget.dataset.index);
        wx.navigateTo({ //跳转到订单详情
            url: '/pages/comment/comment?gid=' + this.data.goods[index].id + '&oid=' + this.data.oid
        });
    },
    cannot_comment: function () {
        wx.showToast({
            title: '订单尚未完成,不能评价',
            icon: "none"
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
});
