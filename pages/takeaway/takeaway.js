Component({
    properties: {
        categories: {
            type: Array,
            value: ["营养早餐", "经典美食", "烧烤串", "甜点饮品"]
        },
        shopList: {
            type: Array,
            value: [
                {
                    name: "科教餐馆",
                    logo: "/asserts/images/takeaway/breakfast.png",
                    description: "科教餐馆，欢迎同学们下单！",
                    monthlySales: 9872,
                    deliveryFee: 0.8,
                    rating: 4.8,
                    tags: ["人气店铺", "干净卫生", "味道赞"],
                    category: "营养早餐",
                    products: [
                        { name: "腊肠煲仔饭", image: "/asserts/images/takeaway/breakfast.png", price: 9.9 },
                        { name: "金牌腊味煲仔饭", image: "/asserts/images/takeaway/breakfast.png", price: 12.8 },
                        { name: "腊肠拼煲仔饭", image: "/asserts/images/takeaway/breakfast.png", price: 12.8 },
                        { name: "酱豆腐", image: "/asserts/images/takeaway/breakfast.png", price: 14.8 }
                    ]
                }
            ]
        }
    },

    data: {
        filteredShops: [],
        searchQuery : ''
    },

    lifetimes: {
        attached: function () {
            // 默认显示第一个分类的商家
            this.filterShops({ currentTarget: { dataset: { category: "营养早餐" } } });
        }
    },

    methods: {
      navigator: function () {
        console.log('导航');
        wx.navigateTo({
          url: '/pages/map/map',
          success: function (res) {
            console.log('导航_跳转成功');
          },
          fail: function (err) {
            console.error('导航_跳转失败', err);
          }
        });
      },
      filterShops: function (event) {
          const category = event.currentTarget.dataset.category;
          const filtered = this.data.shopList.filter(shop => shop.category === category);
          this.setData({
              filteredShops: filtered
          });
          console.log(category);
      },

      sortShops: function (event) {
          const sortType = event.currentTarget.dataset.sort;
          let sortedShops = this.data.filteredShops;

          if (sortType === "综合排序") {
              console.log("综合排序");
              sortedShops = sortedShops.sort((a, b) => b.rating - a.rating);
          } else if (sortType === "销量最高") {
              console.log("销量最高");
              sortedShops = sortedShops.sort((a, b) => b.monthlySales - a.monthlySales);
          } else if (sortType === "口碑最好") {
              console.log("口碑最好");
              sortedShops = sortedShops.sort((a, b) => b.rating - a.rating);
          }

          this.setData({
              filteredShops: sortedShops
          });
      },

      // 搜索框输入事件
      onSearchInput: function(event) {
        this.setData({
          searchQuery: event.detail.value  // 更新搜索框的输入内容
        });
        //console.log(this.data.searchQuery);
      },
  
      // 搜索框按下回车或确认
      onSearchConfirm: function() {
        const query = this.data.searchQuery;
        this.searchRestaurant(query);
      },

      searchRestaurant:function(query){
        if(query.length==0){
          this.setData({filteredShops: this.data.shopList});
          return;
        }
        console.log("尝试搜索",query);
        const filtered = this.data.shopList.filter(shop => shop.name.includes(this.data.searchQuery));
        this.setData({
            filteredShops: filtered
        });
        //console.log(filteredShops);
      }
    }
});
