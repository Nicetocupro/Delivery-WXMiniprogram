const api = require("../../request/api");

Page({
    data: {
        addresses: [],
        isLoading: false,
        errorMessage: ''
    },

    onLoad: function () {
        console.log('页面初始化成功')
        this.loadAddresses();
    },

    onShow: function () {
        console.log('页面刷新成功')
        this.loadAddresses();
    },

    loadAddresses: function () {
        this.setData({
            isLoading: true,
            errorMessage: ''
        });

        api.getAddress().then(res => {
            if (res.data.ecode === 200) {
                console.log('获取所有地址成功')
                this.setData({
                    addresses: res.data.data.address_books || []
                });
            } else {
                this.setData({
                    errorMessage: '加载地址失败'
                });
            }
        }).catch(err => {
            this.setData({
                errorMessage: err.message || '加载地址失败'
            });
        }).finally(() => {
            this.setData({
                isLoading: false
            });
        });
    },

    addAddress: function () {
        wx.navigateTo({
            url: '/pages/addAddress/addAddress' // 新增收货地址页面的路径
        });
    },

    editAddress: function (e) {
        const index = e.currentTarget.dataset.index;
        const address_id = this.data.addresses[index].id;
        const address = this.data.addresses[index];
        wx.navigateTo({
            url: `/pages/addAddress/addAddress?index=${address_id}&address=${JSON.stringify(address)}`
        });
    },

    deleteAddress: function (e) {
        const index = e.currentTarget.dataset.index;
        const address_id = this.data.addresses[index].id;
        this.setData({
            isLoading: true,
            errorMessage: ''
        });

        api.deleteAddress(address_id).then(res => {
            if (res.data.ecode === 200) {
                const addresses = this.data.addresses.filter(addr => addr.id !== index);
                this.setData({
                    addresses
                });
                wx.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 2000
                });
                this.loadAddresses();
            } else {
                this.setData({
                    errorMessage: '删除地址失败'
                });
            }
        }).catch(err => {
            this.setData({
                errorMessage: err.message || '删除地址失败'
            });
        }).finally(() => {
            this.setData({
                isLoading: false
            });
        });
    },

    setDefault: function (e) {
        const index = e.currentTarget.dataset.index;
        const address_id = this.data.addresses[index].id;
        this.setData({
            isLoading: true,
            errorMessage: ''
        });

        console.log("address_id: ", address_id);
        console.log("设置默认地址开始");
        api.setDefaultAddress(address_id).then(res => {
            console.log("设置默认地址api，调用成功");
            console.log("res", res);
            if (res.data.ecode == 200) {
                // const addresses = this.data.addresses.map(addr => {
                //     addr.default = addr.id == address_id; // 设置为默认地址
                //     // return addr;
                // });
                console.log("设置默认地址成功");
                wx.showToast({
                    title: '设置成功',
                    icon: 'success',
                    duration: 2000
                });
            } else {
                this.setData({
                    errorMessage: '设置默认地址失败'
                });
            }
        }).catch((error) => {
            console.log("设置默认地址api，调用失败");
            console.log("error", error); // 打印具体的错误信息
        }).finally(() => {
            console.log("设置默认地址api，调用完成");
            this.setData({
                isLoading: false
            });
            this.loadAddresses();
        });
    }
});