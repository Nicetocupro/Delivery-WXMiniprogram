// pages/wxml/index.js

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {
            avatarUrl: defaultAvatarUrl,
            nickName: '',
        }
    },

    /**修改个人信息 */
    modifyInformation: function () {
        console.log('修改信息_按钮被点击');
        wx.navigateTo({
            url: '/pages/modifyInformation/modifyInformation',
            success: function (res) {
                console.log('修改信息_跳转成功');
            },
            fail: function (err) {
                console.error('修改信息_跳转失败', err);
            }
        });
    },

    /**管理收货地址 */
    manageAddress: function () {
        console.log('收货地址_按钮被点击');
        wx.navigateTo({
            url: '/pages/manageAddress/manageAddress',
            success: function (res) {
                console.log('收货地址_跳转成功');
            },
            fail: function (err) {
                console.error('收货地址_跳转失败', err);
            }
        });
    },
    /**投诉反馈跳转 */
    complainFeedback: function () {
        console.log('投诉反馈');
        wx.navigateTo({
            url: '/pages/complaintFeedback/complaintFeedback',
            success: function (res) {
                console.log('收货地址_跳转成功');
            },
            fail: function (err) {
                console.error('收货地址_跳转失败', err);
            }
        });
    },
    /** 商务合作跳转 */
    cooperation: function () {
        console.log('商务合作');
        wx.navigateTo({
            url: '/pages/cooperation/cooperation',
            success: function (res) {
                console.log('商务合作_跳转成功');
            },
            fail: function (err) {
                console.error('商务合作_跳转失败', err);
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})