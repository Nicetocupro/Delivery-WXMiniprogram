const api = require("../../request/api");

Page({
    data: {

        // 店家信息
        restaurant_id: null,
        session_id: null,
        storeLogo: '', // 示例logo链接
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

        reviews: [],
        selectedPage: 'products'
    },

    onLoad(options) {
        console.log(options)
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
        // 使用 Promise.all 同时执行两个 API 调用
        Promise.all([
            api.GetRestaurantInfo(data),
            api.FetchComments(data)
        ])
            .then(([restaurantResponse, commentsResponse]) => {
                console.log(restaurantResponse);
                console.log(commentsResponse);

                // 处理餐厅信息
                const categories = restaurantResponse.data.data.categories;
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

                // 处理评论数据
                const comments = commentsResponse.data.data.comments;
                console.log(comments);

                // 检查 comments 是否存在且是一个数组
                if (Array.isArray(comments)) {
                    const reviews = comments.map(comment => {
                        return {
                            id: comment.id,
                            content: comment.content,
                            rating: comment.rating * 1.0 / 2,
                            created_at: comment.created_at,
                            updated_at: comment.updated_at,
                            wechat_user: {
                                id: comment.wechat_user.id,
                                nickname: comment.wechat_user.nickname,
                                phone_number: comment.wechat_user.phone_number,
                                profile_image_url: comment.wechat_user.profile_image_url,
                                role: comment.wechat_user.role,
                                created_at: comment.wechat_user.created_at,
                                updated_at: comment.wechat_user.updated_at
                            },
                            replies: Array.isArray(comment.replies) ? comment.replies.map(reply => {
                                return {
                                    id: reply.id,
                                    content: reply.content,
                                    created_at: reply.created_at,
                                    updated_at: reply.updated_at,
                                    wechat_user: {
                                        id: reply.wechat_user.id,
                                        nickname: reply.wechat_user.nickname,
                                        phone_number: reply.wechat_user.phone_number,
                                        profile_image_url: reply.wechat_user.profile_image_url,
                                        role: reply.wechat_user.role,
                                        created_at: reply.wechat_user.created_at,
                                        updated_at: reply.wechat_user.updated_at
                                    }
                                };
                            }) : [],
                            comment_details: Array.isArray(comment.comment_details) ? comment.comment_details.map(detail => {
                                return {
                                    id: detail.id,
                                    image_path: detail.image_path,
                                    created_at: detail.created_at,
                                    updated_at: detail.updated_at
                                };
                            }) : []
                        };
                    });

                    this.setData({
                        reviews: reviews
                    });

                    console.log('Formatted reviews:', reviews);
                } else {
                    console.error('Invalid comments data:', comments);
                    this.setData({
                        reviews: []
                    });
                }
            })
            .catch(error => {
                console.error('API calls failed:', error);
            });
    },

    async fetchData(data) {
        try {
            await this.GetRestaurantMsg(data);
            await this.GetAllDishes(data);
        } catch (error) {
            console.error('Error fetching data:', error);
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
            const response = await api.GetAllDishes(this.data.restaurant_id);
            console.log(response);
            // 提取菜品图片并添加到 storeImages 数组中
            let storeImages = [];
            response.data.data.dishes.forEach(dish => {
                if (dish.image) {
                    storeImages.push(dish.image);
                }
            });

            console.log(storeImages)
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
    goToCheckout() {
        wx.navigateTo({
            url: '/pages/checkout/checkout'
        });
    },

    // 选择页面
    selectPage(e) {
        const page = e.currentTarget.dataset.page;
        this.setData({
            selectedPage: page
        });
    },

    previewImage: function (e) {
        const current = e.currentTarget.dataset.src;
        const urls = [current];
        console.log(current);
        console.log(urls);
        wx.previewImage({
            current: current, // 当前显示图片的链接
            urls: urls // 需要预览的图片链接列表
        });
    },

    formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

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