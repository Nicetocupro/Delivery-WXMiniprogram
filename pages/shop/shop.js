const api = require("../../request/api");

Page({
    data: {
        // 店家信息
        restaurant_id: null,
        session_id: null,
        storeLogo: '../../asserts/images/shopTest/logo.jpg', // 示例logo链接
        storeName: null,
        storeLocation: null,
        storeImages: [],

        // 商品类目
        categories: [],

        // 商品数据
        products: [],

        // 当前选择的商品类目ID
        selectedCategoryId: 1,
        selectedCategoryProducts: [], // 当前选择类目的商品数据
    },

    onLoad(options) {
        // 传入restaurant_id
        this.setData({
            restaurant_id: options.restaurant_id
        });
        this.setData({
            session_id: wx.getStorageSync('session_id')
        });
        let data = {
            restaurant_id: this.data.restaurant_id
        };
        this.fetchData(data);
    },

    async fetchData(data) {
        try {
            await this.GetRestaurantInfo(data);
            await this.GetRestaurantMsg(data);
            await this.GetAllDishes(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },

    // 获取商品信息
    async GetRestaurantInfo(data) {
        try {
            const response = await api.GetRestaurantInfo(data);
            console.log(response);
            const categories = response.data.data.categories;
            const products = [];

            categories.forEach(category => {
                category.dishes.forEach(dish => {
                    products.push({
                        id: dish.id,
                        categoryId: category.id,
                        name: dish.name,
                        price: dish.price / 100.00,
                        image: dish.image,
                        description: dish.description,
                        flavors: dish.flavors
                    });
                });
            });

            console.log(categories);
            console.log(products);

            this.setData({
                categories: categories,
                products: products,
                selectedCategoryId: categories.length > 0 ? categories[0].id : null
            });

            this.filterProductsByCategory();
        } catch (error) {
            console.error('Error fetching restaurant info:', error);
        }
    },

    // 获取商家信息
    async GetRestaurantMsg(data) {
        try {
            const response = await api.GetRestaurantMsg(data);
            console.log(response);
            this.setData({
                storeName: response.data.data.name,
                storeLocation: response.data.data.address
            })
            // 处理商家信息的逻辑
        } catch (error) {
            console.error('Error fetching restaurant message:', error);
        }
    },

    // 获取顶部图片
    async GetAllDishes(data) {
        try {
            const response = await api.GetAllDishes(data.restaurant_id);
            console.log(response);
            // 提取菜品图片并添加到 storeImages 数组中
            let storeImages = [];
            response.data.data.dishes.forEach(dish => {
                if (dish.image) {
                    storeImages.push(dish.image);
                }
            });
            
            this.setData({
                storeLogo: storeImages[0],
                storeImages: storeImages
            })
        } catch (error) {
            console.error('Error fetching dishes message:', error);
        }
    },

    // 选择商品类目
    selectCategory(e) {
        const categoryId = e.currentTarget.dataset.id;
        this.setData({
            selectedCategoryId: categoryId
        });
        this.filterProductsByCategory();
    },

    // 根据类目筛选商品
    filterProductsByCategory() {
        const filteredProducts = this.data.products.filter(product => product.categoryId === this.data.selectedCategoryId);
        this.setData({
            selectedCategoryProducts: filteredProducts
        });
    },

    // 选择规格（示例，实际应用时可以添加更多逻辑）
    selectSpec(e) {
        console.log(e)
        const productId = e.currentTarget.dataset.id;
        const flavors = e.currentTarget.dataset.flavors;
        const flavorNames = flavors.map(flavor => flavor.name);

        wx.showActionSheet({
            itemList: flavorNames,
            success: (res) => {
                if (res.tapIndex >= 0) {
                    const selectedFlavor = flavors[res.tapIndex];
                    this.addToCart({
                        productId,
                        flavorId: selectedFlavor.id
                    });
                }
            },
            fail: (res) => {
                console.log(res.errMsg);
            }
        });
    },

    // 添加到购物车
    addToCart(e) {
        let productId, flavorId;
        if (e.currentTarget) {
            productId = e.currentTarget.dataset.id;
            flavorId = 0;
        } else {
            productId = e.productId;
            flavorId = e.flavorId;
        }

        console.log(productId, flavorId)

        // 获取购物车逻辑
        let data = {
            restaurant_id: this.data.restaurant_id
        };
        let cart = [];
        api.GetCart(data)
            .then(res => {
                console.log(res);
                cart = res.data.data.cart;

                const exist = cart.find(item => item.dish_id === productId && item.flavor_id === flavorId)
                if (exist) {
                    exist.count += 1;
                } else {
                    console.log(cart)
                    cart.push({
                        count: 1,
                        dish_id: productId,
                        flavor_id: flavorId
                    });
                }
                console.log(cart)
                data.cart = cart
                console.log(data)
                // 更新购物车
                api.UpdateCart(data)
                    .then(res => {
                        console.log(res);
                    })
            })
    },

    // 去结算页面
    goToCart() {
        console.log(this.data.products);
        const products = JSON.stringify(this.data.products);
        const restaurant_id = this.data.restaurant_id;
        wx.navigateTo({
            url: `/pages/shoppingCart/shoppingCart?products=${encodeURIComponent(products)}&restaurant_id=${restaurant_id}`,
            success: function (res) {
                console.log('购物车_跳转成功');
            },
            fail: function (err) {
                console.error('购物车_跳转失败', err);
            }
        });
    }
});