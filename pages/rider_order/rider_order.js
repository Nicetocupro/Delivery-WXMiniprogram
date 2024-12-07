const api = require("../../request/api");

Component({
    data: {
        activeTab: 0, // 当前选中的Tab，0代表“新任务”
        taskList: [], // 任务列表
        loading: false, // 下拉刷新状态
        hasMore: true, // 是否还有更多任务
        pageNum: 1, // 当前页数
        tabBarHidden: false, // 控制TabBar显示
        action: '抢单',
    },

    lifetimes: {
        attached: function () {
            console.log("页面初始化");
            this.loadTasks(); // 初始化加载任务
            console.log("页面初始化完成");

        }
    },

    methods: {
        // 下拉刷新事件
        onPullDownRefresh: function () {
            this.setData({
                tabBarHidden: true,
                pageNum: 1,
                taskList: [],
                hasMore: true,
            });
            this.loadTasks();
            wx.stopPullDownRefresh(); // 停止刷新动画
            this.setData({
                tabBarHidden: false,
            });
        },

        // 触底加载事件
        onReachBottom: function () {
            if (this.data.hasMore) {
                this.loadTasks();
            }
        },

        // 切换Tab
        onTabChange: function (e) {
            const index = e.currentTarget.dataset.index;

            this.setData({
                activeTab: index,
                pageNum: 1,
                taskList: [],
                hasMore: true,
            });
            if(this.data.activeTab == 0){
                this.setData({
                    action: '抢单',
                });
            }else if(this.data.activeTab == 1){
                this.setData({
                    action: '取货',
                });
            }else if(this.data.activeTab == 2){
                this.setData({
                    action: '送达',
                });
            }else if(this.data.activeTab == 3){
                this.setData({
                    action: '查看',
                });
            }
            this.loadTasks(); // 重新加载任务
        },

        // 加载任务数据
        loadTasks: function () {
            if (this.data.loading || !this.data.hasMore) return; // 防止重复请求
            this.setData({
                loading: true
            });

            const status = parseInt(this.data.activeTab) + 1; // 获取当前tab对应的任务状态
            api.GetRiderOrder(status).then(res => {
                console.log("获取订单，订单状态：", status);
                const orders = res.data.data.orders;
                const updatedOrders = orders.map(order => {
                    const limitTime = this.formatTimestamp(order.payment_time + 40 * 60); 
                    return {
                        ...order, // 保留原有订单数据
                        limit_time: limitTime, // 添加 limit_time 字段
                    };
                });

                this.setData({
                    taskList: updatedOrders,
                    loading: false,
                });
                console.log("taskList: ", this.data.taskList);
            }).catch(err => {
                console.error('获取订单失败, err: ', err);
                wx.showToast({
                    title: '获取订单失败',
                    icon: 'none',
                });
            });

        },
   
        // 任务按钮点击事件
        onTaskAction: function (e) {
            // const index = e.currentTarget.dataset.id - 1;
            // console.log(index);
            // console.log(this.data.taskList);
            // console.log(this.data.taskList[index]);
            // console.log(this.data.taskList[index].id);
            const taskId = e.currentTarget.dataset.id;

            // 根据任务状态执行不同的操作
            if (this.data.activeTab == 0) {
                this.grabTask(taskId);
            } else if (this.data.activeTab == 1) {
                this.pickUpTask(taskId);
            } else if (this.data.activeTab == 2) {
                this.deliverTask(taskId);
            } else if (this.data.activeTab == 3) {
                this.viewTask(taskId);
            }
        },

        grabTask: function (taskId) {
            api.SetRiderOrder(taskId, 2).then(res => {
                if (res.data.data.success) {
                    wx.showToast({
                        title: '抢单成功',
                        icon: 'success',
                    });
                    this.loadTasks(); // 重新加载任务
                } else {
                    wx.showToast({
                        title: '抢单失败，请重试',
                        icon: 'error',
                    });
                }
            }).catch(err => {
                wx.showToast({
                    title: '订单数据请求失败，请重试',
                    icon: 'error',
                });
            });
            
        },

        pickUpTask: function (taskId) {
            api.SetRiderOrder(taskId, 3).then(res => {
                if (res.data.data.success) {
                    wx.showToast({
                        title: '取货成功',
                        icon: 'success',
                    });
                    this.loadTasks(); // 重新加载任务
                } else {
                    wx.showToast({
                        title: '取货失败，请重试',
                        icon: 'error',
                    });
                }
            }).catch(err => {
                wx.showToast({
                    title: '订单数据请求失败，请重试',
                    icon: 'error',
                });
            });
        },

        deliverTask: function (taskId) {
            api.SetRiderOrder(taskId, 4).then(res => {
                if (res.data.data.success) {
                    wx.showToast({
                        title: '送达成功',
                        icon: 'success',
                    });
                    this.loadTasks(); // 重新加载任务
                } else {
                    wx.showToast({
                        title: '送达失败，请重试',
                        icon: 'error',
                    });
                }
            }).catch(err => {
                wx.showToast({
                    title: '订单数据请求失败，请重试',
                    icon: 'error',
                });
            });
        },

        viewTask: function (taskId) {
            wx.showToast({
                title: '该功能正在实现',
                icon: 'loading',
            });
        },

        // 格式化时间戳为年月日时分秒
        formatTimestamp: function (timestamp) {
            const date = new Date(timestamp * 1000); // Unix 时间戳需要乘以 1000
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        }
    }
});