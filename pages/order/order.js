const api = require("../../request/api");

Component({
    properties: {
        activeStatus: {
            type: Number,
            value: 3 // 默认显示“已完成”订单
        },
        order_data: {
            type: Array,
            value: []
        }
    },

    data: {
        statusTabs: [{
                status: 0,
                label: "未支付"
            },
            {
                status: 1,
                label: "已支付"
            },
            {
                status: 2,
                label: "等待配送"
            },
            {
                status: 3,
                label: "已完成"
            },
            {
                status: 4,
                label: "已取消"
            }
        ],
        filteredOrders: []
    },

    observers: {
        'activeStatus': function (newStatus) {
            this.filterOrders(newStatus); // 当activeStatus变化时重新筛选订单
        }
    },

    attached: function () {
        this.fetchOrders(); // 初始化时从后端获取订单数据
    },

    methods: {
        // 从后端获取订单数据
        fetchOrders: function () {
            api.GetOrders()
            .then(res =>{
                console.log(res);
                this.setData({
                    order_data: res.data.data.orders
                });
                this.filterOrders(this.data.activeStatus); // 获取数据后重新筛选订单
            })
        },

        // 切换订单分类并筛选数据
        filterOrders: function (status) {
            const statusMap = {
                0: {
                    text: "未支付",
                    image: "/asserts/images/order/unpaid.png"
                },
                1: {
                    text: "已支付",
                    image: "/asserts/images/order/paid.png"
                },
                2: {
                    text: "等待配送",
                    image: "/asserts/images/order/waiting.png"
                },
                3: {
                    text: "已完成",
                    image: "/asserts/images/order/finish.png"
                },
                4: {
                    text: "已取消",
                    image: "/asserts/images/order/cancel.png"
                }
            };

            console.log('status:', status); // 打印当前的状态值
            console.log('order_data:', this.data.order_data); // 打印订单数据

            const filteredOrders = this.data.order_data
                .filter(order => {
                    console.log('order.status:', order.status, 'status:', status); // 打印每个订单的 accept 和筛选条件
                    return order.status === status;
                })
                .map(order => ({
                    ...order,
                    statusText: statusMap[status].text,
                    statusImage: statusMap[status].image
                }));

            console.log('filteredOrders:', filteredOrders); // 打印筛选后的结果

            // 更新数据
            this.setData({
                filteredOrders
            });
        },

        // 点击分类时更新activeStatus并重新筛选
        filterOrdersByStatus: function (e) {
            // 使用 e.currentTarget.dataset.status 来获取点击元素上的 status 值
            const status = e.currentTarget.dataset.status;
            console.log('Selected Status:', status); // 检查 status 的值
            this.setData({
                activeStatus: status // 更新 activeStatus
            });
        },

        // 查看订单详情
        goto_order: function (e) {
            const index = e.currentTarget.dataset.index;
            const id = this.data.filteredOrders[index].id;
            wx.navigateTo({
                url: `/pages/order_info/order_info?id=${id}`
            });
        }
    }
});
