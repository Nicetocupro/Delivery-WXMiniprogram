const app = getApp()

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';

Component({
    properties: {
        userInfo: {
            type: Object,
            session_id: null,
            value: {
                avatarUrl: app.globalData.userInfo.avatarUrl,
                nickName: app.globalData.userInfo.nickName,
            }
        }
    },

    data: {},
    // 组件生命周期函数，在组件实例进入页面节点树时调用
    attached: function () {
        this.setData({
            session_id: wx.getStorageSync('session_id'),
            avatarUrl: app.globalData.userInfo.avatarUrl || defaultAvatarUrl,
            nickName: app.globalData.userInfo.nickName,
        })
    },
    methods: {
        // 修改个人信息
        modifyInformation: function () {
            console.log('修改信息_按钮被点击');
            wx.navigateTo({
                url: '/pages/modifyInformation/modifyInformation',
                success: function (res) {
                    console.log('修改信息_跳转成功');
                },
                fail: function (err) {
                    console.error('修改信息_跳转失败', err);
                }
            });
        },

        // 管理收货地址
        manageAddress: function () {
            console.log('收货地址_按钮被点击');
            wx.navigateTo({
                url: '/pages/manageAddress/manageAddress',
                success: function (res) {
                    console.log('收货地址_跳转成功');
                },
                fail: function (err) {
                    console.error('收货地址_跳转失败', err);
                }
            });
        },
        rider_identify: function () {
            wx.navigateTo({
                url: '/pages/rider_identify/rider_identify',
                success: function (res) {
                    console.log('骑手身份认证_跳转成功');
                },
                fail: function (err) {
                    console.error('骑手身份认证_跳转失败', err);
                }
            });
        },

        // 投诉反馈跳转
        complainFeedback: function () {
            console.log('投诉反馈');
            wx.navigateTo({
                url: '/pages/complaintFeedback/complaintFeedback',
                success: function (res) {
                    console.log('收货地址_跳转成功');
                },
                fail: function (err) {
                    console.error('收货地址_跳转失败', err);
                }
            });
        },
    }
});