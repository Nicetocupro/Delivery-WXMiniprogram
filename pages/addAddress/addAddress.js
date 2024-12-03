const api = require("../../request/api");

Page({
    data: {
        name: '',
        phone: '',
        detail: '',
        index: null, // 用于编辑时存储索引
        isLoading: false,
        errorMessage: ''
    },

    onLoad: function (options) {
        console.log("options: ", options);
        if (options.index) {
            const address = JSON.parse(options.address);
            this.setData({
                name: address.name,
                phone: address.phone_number.substring(3),
                detail: address.address,
                index: options.index
            });
        }
    },

    onInputChange: function (e) {
        const field = e.currentTarget.dataset.field;
        if (field === 'phone') {
            let value = e.detail.value;
            if (value.startsWith('+86')) {
                value = value.substring(3); // 去掉 +86
            }
            this.setData({
                [field]: value
            });
        } else {
            this.setData({
                [field]: e.detail.value
            });
        }
    },

    onSubmit: function (e) {
        const {
            name,
            phone,
            detail,
            index
        } = this.data;
        const address = {
            name,
            phone,
            detail
        };

        if (!this.validateForm(address)) {
            return;
        }

        this.setData({
            isLoading: true,
            errorMessage: ''
        });

        const data = {
            address: address.detail,
            gender: 1,
            name: address.name,
            phone_number: `+86${address.phone}`
        };

        console.log(data)

        if (index !== null) {
            // 编辑地址
            api.changeAddress(data, index).then(res => {
                if (res.data.ecode === 200) {
                    wx.showToast({
                        title: '修改成功',
                        icon: 'success',
                        duration: 2000,
                        success: function () {
                            console.log('弹窗显示成功');
                            wx.navigateBack(); // 返回上一个页面
                        },
                        fail: function () {
                            console.log('弹窗显示失败');
                        },
                        complete: function(){
                            console.log('弹窗显示完成');
                        }
                    })
                } else {
                    this.setData({
                        errorMessage: '修改地址失败'
                    });
                }
            }).catch(err => {
                this.setData({
                    errorMessage: err.message || '修改地址失败'
                });
            }).finally(() => {
                this.setData({
                    isLoading: false
                });
            });
        } else {
            // 新增地址
            api.addAddress(data).then(res => {
                // console.log("res.ecode: ", res.data.ecode);
                if (res.data.ecode === 200) {
                    console.log('新建地址，成功！');
                    wx.showToast({
                        title: '修改成功',
                        icon: 'success',
                        duration: 2000,
                        success: function () {
                            console.log('弹窗显示成功');
                            wx.navigateBack(); // 返回上一个页面
                        },
                        fail: function () {
                            console.log('弹窗显示失败');
                        },
                        complete: function(){
                            console.log('弹窗显示完成');
                        }
                    });

                } else {
                    this.setData({
                        errorMessage: '新增地址失败'
                    });
                }
            }).catch(err => {
                console.log('新建地址，失败！');
                this.setData({
                    errorMessage: err.message || '新增地址失败'
                });
            }).finally(() => {
                console.log('新建地址，完成！');
                this.setData({
                    isLoading: false
                });
            });
        }
    },

    validateForm: function (address) {
        // 校验表单数据
        if (!/^1[3-9]\d{9}$/.test(address.phone)) {
            wx.showToast({
                title: '请填写正确的电话号码',
                icon: 'none',
                duration: 2000
            });
            return false;
        }

        if (!address.name || !address.phone || !address.detail) {
            wx.showToast({
                title: '请填写完整地址信息',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        return true;
    }
});