Component({
    properties: {
        activeStatus: {
            type: Number,
            value: 3 // 默认显示“已完成”订单
        },
        order_data: {
            type: Array,
            value: [{
                    oid: 1,
                    accept: 3,
                    price: 20,
                    date: '2020-06-27 16:42'
                },
                {
                    oid: 2,
                    accept: 2,
                    price: 30,
                    date: '2020-06-27 17:20'
                },
                {
                    oid: 3,
                    accept: 1,
                    price: 25,
                    date: '2020-06-28 18:45'
                },
                {
                    oid: 4,
                    accept: 0,
                    price: 15,
                    date: '2020-06-29 19:30'
                },
            ]
        }
    },

    data: {
        statusTabs: [{
                status: 3,
                label: "已完成"
            },
            {
                status: 2,
                label: "配送中"
            },
            {
                status: 1,
                label: "待接单"
            },
            {
                status: 0,
                label: "制作中"
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
        this.filterOrders(this.data.activeStatus);
    },

    methods: {
        // 切换订单分类并筛选数据
        filterOrders: function (status) {
            const statusMap = {
                3: {
                    text: "已完成",
                    image: "/asserts/images/order/finish.png"
                },
                2: {
                    text: "配送中",
                    image: "/asserts/images/order/d2.png"
                },
                1: {
                    text: "待接单",
                    image: "/asserts/images/order/d1.png"
                },
                0: {
                    text: "制作中",
                    image: "/asserts/images/order/d0.png"
                }
            };

            console.log('status:', status); // 打印当前的状态值
            console.log('order_data:', this.data.order_data); // 打印订单数据

            const filteredOrders = this.data.order_data
                .filter(order => {
                    console.log('order.accept:', order.accept, 'status:', status); // 打印每个订单的 accept 和筛选条件
                    return order.accept === status;
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
            const oid = this.data.filteredOrders[index].oid;
            wx.navigateTo({
                url: `/pages/order_info/order_info?oid=${oid}`
            });
        }
    }
});