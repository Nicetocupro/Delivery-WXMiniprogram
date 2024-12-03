const api = require("../../request/api");
var app = getApp();

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';

Page({
    data: {
        phoneNumber: '',
        avatarUrl: defaultAvatarUrl, // 头像 URL
        nickName: '',
        isLoading: false, // 加载状态
        errorMessage: '' // 错误信息
    },

    onLoad: function () {
        let phoneNumber = app.globalData.userInfo.phoneNumber;
        if (phoneNumber.startsWith('+86')) {
            phoneNumber = phoneNumber.substring(3); // 去掉 +86
        }
        this.setData({
            avatarUrl: app.globalData.userInfo.avatarUrl || defaultAvatarUrl,
            nickName: app.globalData.userInfo.nickName,
            phoneNumber: phoneNumber
        });
    },

    onChooseAvatar(e) {
        const {
            avatarUrl
        } = e.detail;
        this.setData({
            avatarUrl,
        });
    },

    onInputChange: function (e) {
        const field = e.currentTarget.dataset.field;
        if (field === 'phoneNumber') {
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
        if (!this.validateForm()) {
            return;
        }

        this.setData({
            isLoading: true,
            errorMessage: ''
        });

        let data = {
            phone_number: `+86${this.data.phoneNumber}`,
            profile_image_url: this.data.avatarUrl,
            nickname: this.data.nickName
        };

        api.ChangeProfile(data)
            .then(() => {
                // 更新 app.globalData 中的数据
                app.globalData.userInfo.avatarUrl = this.data.avatarUrl;
                app.globalData.userInfo.nickName = this.data.nickName;
                app.globalData.userInfo.phoneNumber = `+86${this.data.phoneNumber}`;
                wx.navigateBack(); // 返回上一个页面
            })
            .catch((error) => {
                this.setData({
                    errorMessage: error.message
                });
            })
            .finally(() => {
                this.setData({
                    isLoading: false
                });
            });
    },

    validateForm: function () {
        if (!this.data.nickName) {
            this.setData({
                errorMessage: '请输入昵称'
            });
            return false;
        }
        if (!this.data.phoneNumber) {
            this.setData({
                errorMessage: '请输入手机号'
            });
            return false;
        }
        if (!/^1[3-9]\d{9}$/.test(this.data.phoneNumber)) {
            this.setData({
                errorMessage: '请输入有效的手机号'
            });
            return false;
        }
        return true;
    }
});