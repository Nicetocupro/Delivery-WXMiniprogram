Page({
    data: {
      cartItems: [
        {
          id: 1,
          name: '麻辣小龙虾',
          price: 88.0,
          quantity: 1,
          photo: '../../asserts/images/shopTest/4.jpg',
        },
        {
          id: 2,
          name: '珍珠奶茶',
          price: 25,
          quantity: 1,
          photo: '../../asserts/images/shopTest/9.jpg',
        },
        {
          id: 3,
          name: '提拉米苏',
          price: 35,
          quantity: 1,
          photo: '../../asserts/images/shopTest/10.jpg',
        },
      ], // 购物车中的菜品
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
  
    onLoad() {
      // 页面加载时计算初始总价和菜品数量
      this.calculateTotal();
    },
  });
  