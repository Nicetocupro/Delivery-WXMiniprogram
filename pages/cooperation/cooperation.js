// 引入vant提示插件
import Toast from '@vant/weapp/toast/toast'
// 引入统一管理的接口js
const api = require("../../request/api")
// 引入全局对象
const app = getApp()
Page({
    data: {
        name: '',
        phone: '',
        region: '',
        company: '',
        intent: '',
    },

    onInputName(e) {
        this.setData({
            name: e.detail.value
        });
    },

    onInputPhone(e) {
        this.setData({
            phone: e.detail.value
        });
    },

    onInputRegion(e) {
        this.setData({
            region: e.detail.value
        });
    },

    onInputCompany(e) {
        this.setData({
            company: e.detail.value
        });
    },

    onInputIntent(e) {
        this.setData({
            intent: e.detail.value
        });
    },

    submitCooperation() {
        const {
            name,
            phone,
            region
        } = this.data;

        if (!name || !phone || !region) {
            wx.showToast({
                title: '姓名、联系方式和期望合作区域为必填项',
                icon: 'none'
            });
            return;
        }

        // 验证手机号码格式
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            wx.showToast({
                title: '请输入有效的手机号码',
                icon: 'none'
            });
            return;
        }

        const submissionData = {
            license:null,
            email:"Ma3444055841@outlook.com",
            phone_number:this.data.phone,
            description:"asagfbfbaefbfgbasvcas",
            name:this.data.name
        }

        api.cooperation(submissionData)
            .then(res => {
                // 提交逻辑，例如发请求等
                wx.showToast({
                    title: '提交成功',
                    icon: 'success'
                });
                // 清空表单
                this.setData({
                    name: '',
                    phone: '',
                    region: '',
                    company: '',
                    intent: ''
                });
                console.log(res);
            })
            .catch(err => {
                Toast("提交失败")
            })
    }
});