Page({
    data: {
      categories: ["营养早餐", "经典美食", "烧烤串", "甜点饮品"],
      shopList: [
        {
          name: "科教餐馆",
          logo: "/asserts/images/index/breakfast.png",
          description: "科教餐馆，欢迎同学们下单！",
          monthlySales: 9872,
          deliveryFee: 0.8,
          rating: 4.8,
          tags: ["人气店铺", "干净卫生", "味道赞"],
          category: "营养早餐",
          products: [
            { name: "腊肠煲仔饭", image: "/asserts/images/index/breakfast.png", price: 9.9 },
            { name: "金牌腊味煲仔饭", image: "/asserts/images/index/breakfast.png", price: 12.8 },
            { name: "腊肠拼煲仔饭", image: "/asserts/images/index/breakfast.png", price: 12.8 },
            { name: "酱豆腐", image: "/asserts/images/index/breakfast.png", price: 14.8 },
          ]
        },
        // 更多商家...
      ],
      filteredShops: []
    },
  
    onLoad: function () {
      // 默认显示第一个分类的商家
      this.filterShops({ currentTarget: { dataset: { category: "营养早餐" }}});
    },
  
    filterShops: function (event) {
      const category = event.currentTarget.dataset.category;
      const filtered = this.data.shopList.filter(shop => shop.category === category);
      this.setData({
        filteredShops: filtered
      });
    },
  
    sortShops: function (event) {
      const sortType = event.currentTarget.dataset.sort;
      // 这里可以根据不同的排序逻辑进行排序
      // 比如按评分、销量等排序逻辑
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
    }
  });
  