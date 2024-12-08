Page({
    data: {
        pageCur: '', // 默认显示外卖页面
        user: 0
    },

    onLoad() {
        const app = getApp();
        const user = app.globalData.user; // 获取全局用户信息
        const pageCur = app.globalData.user ? "rider_map" : "takeaway"
        console.log(user, pageCur)
        this.setData({
            user: user,
            pageCur: pageCur
        });
    },
    onUnload() {
        // 清除定时器
        clearInterval(this.intervalId);
    },

    onRefresh: function () {
        // 刷新数据
        this.refreshData();
    },

    refreshData: function () {
        // 刷新数据的逻辑
        const app = getApp();
        this.setData({
            avatarUrl: app.globalData.userInfo.avatarUrl,
            nickName: app.globalData.userInfo.nickName,
            phoneNumber: app.globalData.userInfo.phoneNumber
        });
    },

    // 切换导航栏
    navChange(e) {
        const curPage = e.currentTarget.dataset.cur;
        this.setData({
            pageCur: curPage
        });
    },

    // 模拟更改用户身份的函数，后续可以根据实际业务来修改
    changeUserType() {
        const app = getApp();
        app.globalData.user = this.data.user === 0 ? 1 : 0; // 切换用户身份
        this.setData({
            user: app.globalData.user,
        });
    }
});