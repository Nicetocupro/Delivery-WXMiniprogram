Component({
    data: {
      activeTab: 0, // 当前选中的Tab，0代表“新任务”
      taskList: [], // 任务列表
      loading: false, // 下拉刷新状态
      hasMore: true, // 是否还有更多任务
      pageNum: 1, // 当前页数
      tabBarHidden: false,
    },
  
    lifetimes: {
        attached: function () {
            this.loadTasks(); // 初始化加载任务
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
        this.loadTasks();

        },
    
        // 加载任务数据
        loadTasks: function () {
        if (this.data.loading || !this.data.hasMore) return; // 防止重复请求
    
        this.setData({ loading: true });
    
        // 模拟请求数据
        setTimeout(() => {
            const newTasks = this.getSampleTasks();
            this.setData({
            taskList: this.data.taskList.concat(newTasks), // 拼接新任务数据
            loading: false,
            pageNum: this.data.pageNum + 1,
            hasMore: newTasks.length > 0, // 如果没有更多数据，更新hasMore
            });
        }, 1000);
        },

    // 获取示例任务数据
    getSampleTasks: function () {
        const tasks = [];
        const taskStatuses = ['新任务', '待取货', '待送达', '已完成'];
        const sampleAddresses = [
          '上海市浦东新区陆家嘴',
          '北京市海淀区中关村',
          '广州市天汇大厦',
          '深圳市南山区科技园'
        ];
    
        for (let i = 0; i < 10; i++) {
          const status = taskStatuses[Math.floor(Math.random() * taskStatuses.length)];
          tasks.push({
            id: i + 1,
            status: status,
            pickupAddress: sampleAddresses[Math.floor(Math.random() * sampleAddresses.length)],
            deliveryAddress: sampleAddresses[Math.floor(Math.random() * sampleAddresses.length)],
            orderAmount: (Math.random() * 100 + 20).toFixed(2), // 随机金额
            totalDistance: (Math.random() * 10 + 3).toFixed(2), // 随机距离，单位：公里
            timeLimit: (Math.floor(Math.random() * 60 + 30)), // 随机时间限制，单位：分钟
          });
        }
    
        return tasks;
      },
    
      // 抢单按钮点击事件
      onGrabTask: function (e) {
        const taskId = e.currentTarget.dataset.id;
        wx.showModal({
          title: '抢单',
          content: `确认抢单任务: ${taskId}`,
          success: (res) => {
            if (res.confirm) {
              wx.showToast({
                title: '任务抢单成功！',
                icon: 'success',
              });
              // 在这里可以调用抢单接口，将任务状态更新为“待取货”或其他
            }
          },
        });
      },
      onAdd: function(parent, data){
          console.log("挂载回调函数")
        this.loadTasks(); // 初始化加载任务
      },

    }
        
  
    // // 下拉刷新事件
    // onPullDownRefresh: function () {
    //   this.setData({
    //     tabBarHidden: true,
    //     pageNum: 1,
    //     taskList: [],
    //     hasMore: true,
    //   });
    //   this.loadTasks();
    //   wx.stopPullDownRefresh(); // 停止刷新动画
    //   this.setData({
    //     tabBarHidden: false,
    // });
    // },
  
    // // 触底加载事件
    // onReachBottom: function () {
    //   if (this.data.hasMore) {
    //     this.loadTasks();
    //   }
    // },
  

  }
  
  
);
  