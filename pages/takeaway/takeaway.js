const api = require("../../request/api");

Component({
    properties: {
        categories: {
            type: Array,
            value: ["营养早餐", "经典美食", "烧烤串", "甜点饮品"]
        }
    },

    data: {
        shopList: [],
        filteredShops: [],
        searchQuery : '',
        session_id : wx.getStorageSync('session_id')
    },

    lifetimes: {
        attached: function () {
            //获取所有的商家列表
            api.GetAllRestaurants().then(res=>{
              this.setData({
                shopList:res.data.data.restaurants,
                filteredShops: res.data.data.restaurants,
              });
              console.log(this.data.filteredShops);
              // 依次获取每个商店的商品列表
              Promise.all(this.data.filteredShops.map(shop => {
                api.GetAllDishes(shop.id)
                  .then(productsRes => {
                    console.log(`获取商店 ${shop.id} 的商品列表`);
                    console.log(productsRes.data.data.dishes);
                    let index = this.data.filteredShops.findIndex(item => item.id == shop.id );
                            
                    //console.log(index);
                    this.setData({
                    ['filteredShops['+index+']'] : {
                        ...this.data.filteredShops[index],
                        products: productsRes.data.data.dishes
                      }
                    });
                    })
                    .catch(err => {
                        console.error(`获取商店 ${shop.id} 的商品列表失败`, err);
                        return shop; // 如果获取失败，保留原始商店数据
                    });
            }));
            });
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
      output: function(){
        console.log(this.data.filteredShops)
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
        const filtered = this.data.shopList.filter(shop => shop.restaurant_name.includes(this.data.searchQuery));
        this.setData({
            filteredShops: filtered
        });
      },

      getimage:function(e){
        console.log("图片加载");
        const url = e.currentTarget.dataset.url;
        const base = e.currentTarget.dataset.base;
        

        return api.GetImage(base, url);
      }
    }
});
