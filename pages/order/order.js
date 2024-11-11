Page({
  data: {
    activeStatus: 3, // 默认显示“已完成”订单
    statusTabs: [
      { status: 3, label: "已完成" },
      { status: 2, label: "配送中" },
      { status: 1, label: "待接单" },
      { status: 0, label: "制作中" }
    ],
    order_data: [
      { oid: 1, accept: 3, price: 20, date: '2020-06-27 16:42' },
      { oid: 2, accept: 2, price: 30, date: '2020-06-27 17:20' },
      { oid: 3, accept: 1, price: 25, date: '2020-06-28 18:45' },
      { oid: 4, accept: 0, price: 15, date: '2020-06-29 19:30' },
    ],
    filteredOrders: []
  },

  onLoad: function () {
    this.filterOrders({ currentTarget: { dataset: { status: this.data.activeStatus } } });
  },

  // 切换订单分类并筛选数据
  filterOrders: function (e) {
    const status = e.currentTarget.dataset.status;
    const statusMap = {
      3: { text: "已完成", image: "/asserts/images/order/finish.png" },
      2: { text: "配送中", image: "/asserts/images/order/d2.png" },
      1: { text: "待接单", image: "/asserts/images/order/d1.png" },
      0: { text: "制作中", image: "/asserts/images/order/d0.png" }
    };
    const filteredOrders = this.data.order_data
      .filter(order => order.accept === status)
      .map(order => ({
        ...order,
        statusText: statusMap[status].text,
        statusImage: statusMap[status].image
      }));
    
    this.setData({
      activeStatus: status,
      filteredOrders
    });
  },

  // 查看订单详情
  goto_order: function (e) {
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/pages/order_info/order_info?oid=${this.data.filteredOrders[index].oid}`
    });
  }
});
