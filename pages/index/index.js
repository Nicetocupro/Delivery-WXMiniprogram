Page({
    data: {
      pageCur: 'takeaway',  // 默认显示外卖页面
    },
  
    onLoad() {
      const app = getApp();
      const user = app.globalData.user;  // 获取全局用户信息
      this.setData({
        user: user
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
      app.globalData.user = this.data.user === 0 ? 1 : 0;  // 切换用户身份
      this.setData({
        user: app.globalData.user
      });
    }
  });
  