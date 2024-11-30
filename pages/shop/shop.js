Page({
    data: {
        // 店家信息
        storeLogo: '../../asserts/images/shopTest/logo.jpg', // 示例logo链接
        storeName: '熊大爷水饺',
        storeLocation: '嘉定区安亭镇曹安公路4800号同济大学满天星广场',
        storeImages: [
            '../../asserts/images/shopTest/1.jpg',
            '../../asserts/images/shopTest/2.jpg',
            '../../asserts/images/shopTest/3.jpg'
        ],

        // 商品类目
        categories: [{
                id: 1,
                name: '主食'
            },
            {
                id: 2,
                name: '小吃'
            },
            {
                id: 3,
                name: '饮料'
            },
            {
                id: 4,
                name: '甜点'
            }
        ],

        // 商品数据
        products: [{
                id: 1,
                categoryId: 1,
                name: '麻辣小龙虾',
                price: 88.00,
                image: '../../asserts/images/shopTest/4.jpg'
            },
            {
                id: 2,
                categoryId: 1,
                name: '香煎牛排',
                price: 128.00,
                image: '../../asserts/images/shopTest/5.jpg'
            },
            {
                id: 3,
                categoryId: 2,
                name: '炸鸡块',
                price: 28.00,
                image: '../../asserts/images/shopTest/6.jpg'
            },
            {
                id: 4,
                categoryId: 2,
                name: '薯条',
                price: 18.00,
                image: '../../asserts/images/shopTest/7.jpg'
            },
            {
                id: 5,
                categoryId: 3,
                name: '柠檬茶',
                price: 18.00,
                image: '../../asserts/images/shopTest/8.jpg'
            },
            {
                id: 6,
                categoryId: 3,
                name: '珍珠奶茶',
                price: 20.00,
                image: '../../asserts/images/shopTest/9.jpg'
            },
            {
                id: 7,
                categoryId: 4,
                name: '巧克力蛋糕',
                price: 38.00,
                image: '../../asserts/images/shopTest/10.jpg'
            },
            {
                id: 8,
                categoryId: 4,
                name: '提拉米苏',
                price: 48.00,
                image: '../../asserts/images/shopTest/11.jpg'
            }
        ],

        // 当前选择的商品类目ID
        selectedCategoryId: 1,
        selectedCategoryProducts: [], // 当前选择类目的商品数据
    },

    onLoad() {
        // 初始加载时根据默认选中的类目加载商品
        this.filterProductsByCategory();
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
        const productId = e.currentTarget.dataset.id;
        wx.showToast({
            title: `选择了规格：${productId}`,
            icon: 'none'
        });
    },

    // 去购物车页面
    goToCart() {
        wx.navigateTo({
            url: '/pages/cart/cart'
        });
    },

    // 去结算页面
    goToCart() {
        console.log('购物车-点击')
        wx.navigateTo({
            url: "/pages/shoppingCart/shoppingCart",
            success: function (res) {
                console.log('购物车_跳转成功');
            },
            fail: function (err) {
                console.error('购物车_跳转失败', err);
            }
        });
    }
});