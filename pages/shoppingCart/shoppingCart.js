const api = require("../../request/api");

Page({
    data: {
        restaurant_id: null,
        session_id: null,
        // 包含每一个菜品的id category name price image flavors description
        products: [],
        // 购物车包含所选菜品的id flavor_id count
        cart: [],
        cartItems: [], // 购物车中的菜品
        totalPrice: 0, // 总价格
        totalItems: 0, // 总菜品数量
        selectedAddress: null
    },

    // 初始化逻辑
    onLoad(options) {
        this.setData({
            session_id: wx.getStorageSync('session_id')
        })
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
            console.log("提交订单逻辑");
            // 首先需要它选择 地址信息等
            api.GetAddressBook()
                .then(res => {
                    console.log(res);
                    const addressBooks = res.data.data.address_books
                    // 无论地址簿是否为空，都展示地址簿选择弹窗
                    this.showAddressSelectionModal(addressBooks);
                })
        } else {
            wx.showToast({
                title: '购物车为空，无法结算！',
                icon: 'none',
            });
        }
    },

    // 展示地址簿选择弹窗
    showAddressSelectionModal(addressBooks) {
        const items = addressBooks.map(address => address.address);
        items.push('添加新地址');
        wx.showActionSheet({
            itemList: items,
            success: (res) => {
                if (res.tapIndex < items.length - 1) {
                    // 用户选择了现有地址
                    const selectedAddress = addressBooks[res.tapIndex];
                    this.setData({
                        selectedAddress: selectedAddress
                    });
                    this.proceedToCheckout();
                } else {
                    // 用户选择了添加新地址
                    this.addNewAddress();
                }
            },
            fail: (res) => {
                console.log(res.errMsg);
            }
        });
    },

    // 添加新地址
    addNewAddress() {
        wx.showModal({
            title: '添加新地址',
            editable: true,
            placeholderText: '请输入地址信息（格式：地址 性别 姓名 电话号码）',
            success: (res) => {
                if (res.confirm) {
                    const addressInfo = res.content.split(' ');
                    console.log(addressInfo);
                    if (addressInfo.length === 4) {
                        const address = addressInfo[0].trim();
                        const gender = addressInfo[1].trim();
                        const name = addressInfo[2].trim();
                        const phone_number = addressInfo[3].trim();

                        // 验证地址信息
                        if (address.length > 80) {
                            wx.showToast({
                                title: '地址长度不能超过80个字符！',
                                icon: 'none',
                            });
                            return;
                        }
                        if (gender !== '男' && gender !== '女') {
                            wx.showToast({
                                title: '性别必须是“男”或“女”！',
                                icon: 'none',
                            });
                            return;
                        }
                        if (name.length > 20) {
                            wx.showToast({
                                title: '姓名长度不能超过20个字符！',
                                icon: 'none',
                            });
                            return;
                        }
                        const phoneRegex = /^\d{11}$/;
                        if (!phoneRegex.test(phone_number)) {
                            wx.showToast({
                                title: '电话号码格式不正确，请输入11位数字！',
                                icon: 'none',
                            });
                            return;
                        }

                        // 转换性别和手机号格式
                        const genderCode = gender === '男' ? 1 : 2;
                        const formattedPhoneNumber = `+86${phone_number}`;

                        const newAddress = {
                            address: address,
                            gender: genderCode,
                            name: name,
                            phone_number: formattedPhoneNumber
                        };

                        // 同济大学 男 马恒超 15665299259
                        console.log(newAddress)
                        api.SetAddressBook(newAddress)
                            .then(res => {
                                console.log(res)
                                wx.showToast({
                                    title: '地址添加成功！',
                                    icon: 'success',
                                });
                                this.setData({
                                    selectedAddress: newAddress
                                });
                                this.proceedToCheckout();
                            });
                    } else {
                        wx.showToast({
                            title: '地址信息格式不正确，请重新输入！',
                            icon: 'none',
                        });
                    }
                }
            }
        });
    },

    // 下订单操作
    proceedToCheckout() {
        // 已选地址
        console.log(this.data.selectedAddress)

        // 下订单
        const data = {
            restaurant_id: this.data.restaurant_id,
            address: this.data.selectedAddress.address,
            customer: this.data.selectedAddress.name,
            phone_number: this.data.selectedAddress.phone_number
        }

        console.log(data)
        api.PlaceOrder(data)
            .then(res => {
                console.log(res)
                this.setData({
                    showCheckoutPage: true,
                });
                this.startCountdown();
            })
    },

    // 取消订单（待完成）
    cancelCheckout() {
        // 取消订单逻辑
        /* 这个地方应该将order_id传入，而不是null */
        let data = {
            order_id: null
        }

        api.CancelOrder(data)
        .then(res =>{
            console.log(res);
            this.stopCountdown();
            this.setData({
                showCheckoutPage: false,
            });
        })
    },

    // 支付订单（待完成）
    PayOrder(){
        /** 这个地方模拟订单支付的操作，将订单的状态转变为1 */
    },

    // 开始倒计时
    startCountdown: function () {
        let countdown = 15 * 60; // 15分钟转换为秒
        this.setData({
            countdown: this.formatTime(countdown)
        });
        this.data.countdownInterval = setInterval(() => {
            countdown -= 1;
            if (countdown <= 0) {
                this.stopCountdown();
                this.setData({
                    showCheckoutPage: false,
                });
            } else {
                this.setData({
                    countdown: this.formatTime(countdown)
                });
            }
        }, 1000);
    },

    // 停止倒计时
    stopCountdown: function () {
        if (this.data.countdownInterval) {
            clearInterval(this.data.countdownInterval);
            this.setData({
                countdownInterval: null
            });
        }
    },

    // 格式化时间
    formatTime: function (seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
});