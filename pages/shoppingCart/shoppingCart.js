const api = require("../../request/api");

Page({
    data: {
        restaurant_id: null,
        // 包含每一个菜品的id category name price image flavors description
        products: [],
        // 购物车包含所选菜品的id flavor_id count
        cart: [],
        cartItems: [], // 购物车中的菜品
        totalPrice: 0, // 总价格
        totalItems: 0, // 总菜品数量
    },

    // 计算总价格和总菜品数量
    calculateTotal() {
        let totalPrice = 0;
        let totalItems = 0;

        this.data.cartItems.forEach(item => {
            totalPrice += item.price * item.quantity; // 计算总价
            totalItems += item.quantity; // 计算总菜品数量
        });

        // 更新总价格和总菜品数量
        this.setData({
            totalPrice: totalPrice.toFixed(2), // 保留两位小数
            totalItems: totalItems,
        });
    },

    // 增加菜品数量
    increaseQuantity(e) {
        const index = e.currentTarget.dataset.index;
        const cartItems = this.data.cartItems;

        // 增加数量
        cartItems[index].quantity += 1;

        // 更新数据
        this.setData({
            cartItems: cartItems,
        });

        // 重新计算总价和总菜品数量
        this.calculateTotal();
    },

    // 减少菜品数量
    decreaseQuantity(e) {
        const index = e.currentTarget.dataset.index;
        const cartItems = this.data.cartItems;

        // 保证数量不能为0
        if (cartItems[index].quantity > 1) {
            cartItems[index].quantity -= 1;
        }

        // 更新数据
        this.setData({
            cartItems: cartItems,
        });

        // 重新计算总价和总菜品数量
        this.calculateTotal();
    },

    // 去结算按钮的点击事件
    goToCheckout() {
        if (this.data.totalItems > 0) {
            wx.navigateTo({
                url: '/pages/checkout/checkout', // 跳转到结算页面
            });
        } else {
            wx.showToast({
                title: '购物车为空，无法结算！',
                icon: 'none',
            });
        }
    },

    goToCart() {
        wx.navigateTo({
            url: '/pages/shoppingCart/shoppingCart',
        })
    },

    onLoad(options) {
        console.log(options)
        if (options.products) {
            const products = JSON.parse(decodeURIComponent(options.products));
            this.setData({
                products: products
            });
        }
        if (options.restaurant_id) {
            const restaurant_id = options.restaurant_id;
            this.setData({
                restaurant_id: restaurant_id
            });
        }
        let data = {
            restaurant_id: this.data.restaurant_id
        }
        console.log(data)
        // 将购物车获取到这个地方
        api.GetCart(data)
            .then(res => {
                console.log(res);
                const cart = res.data.data.cart;
                this.setData({
                    cart: cart
                });

                // 将 cart 数据转换为 cartItems 格式，考虑不同的口味
                const cartItems = cart.map(item => {
                    const product = this.data.products.find(p => p.id === item.dish_id);
                    const flavor = product.flavors.find(f => f.id === item.flavor_id);
                    return {
                        id: item.dish_id,
                        flavorId: item.flavor_id,
                        name: `${product.name} (${flavor ? flavor.name : '默认口味'})`,
                        price: product.price,
                        quantity: item.count,
                        photo: product.image,
                    };
                });

                this.setData({
                    cartItems: cartItems
                });

                // 页面加载时计算初始总价和菜品数量
                this.calculateTotal();
            })
            .catch(err => {
                console.error('获取购物车数据失败', err);
            });
    },
});
