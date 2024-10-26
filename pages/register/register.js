var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {
            phoneNumber: null
        },
        InputCode: null,
        TrueCode: null,
        btnText: '获取验证码', // 按钮的文本内容
        BtnisDisabled: false, // 按钮是否禁用的状态
        countdown: 60, // 倒计时时间，单位为秒
        timer: null, // 保存倒计时的定时器
        isChecked: false, // 控制复选框是否打勾
        showModal: false, // 定义微信登录弹窗
    },

    // 进行手机号的数据绑定
    phoneNumberInput: function (e) {
        console.log(e)
        this.setData({
            "userInfo.phoneNumber": e.detail.value
        })
        console.log(this.data.userInfo.phoneNumber)
    },

    // 进行验证码的数据绑定
    CodeInput: function (e) {
        console.log(e)
        this.setData({
            InputCode: e.detail.value
        })
        console.log(this.data.InputCode)
    },

    // getCodeBtn根据手机号获取验证码
    getCodeBtn: function () {

        if (this.data.isDisabled) return;

        /**
         * 这里应该有一个函数根据电话号码获取验证码，并无返回值
         * sendCode(this.data.userInfo.phoneNumber)
         * 如果按钮处于禁用状态，不再处理点击事件
         * sendCode同样要返回是否能正确发送给该手机号短信
         * 返回一个真实的TrueCode
         * */

        // 在这里将手{机号进行存储，防止手机号变更。
        app.globalData.userInfo.phoneNumber = this.data.userInfo.phoneNumber;

        wx.showToast({
            title: '验证码已发送',
            icon: 'success',
            duration: 2000,
        });

        // 开始倒计时
        this.startCountdown();
    },

    // 倒计时函数
    startCountdown() {
        let countdown = this.data.countdown; // 倒计时时间，单位为秒

        // 设置按钮为禁用状态，并且更新文本
        this.setData({
            BtnisDisabled: true,
            btnText: `重新发送(${countdown}s)`,
        });

        // 开始倒计时，每秒更新一次
        this.data.timer = setInterval(() => {
            countdown--;

            if (countdown <= 0) {
                // 倒计时结束，恢复按钮
                clearInterval(this.data.timer);
                this.setData({
                    btnText: '获取验证码',
                    BtnisDisabled: false,
                });
            } else {
                // 继续倒计时，更新按钮文本
                this.setData({
                    btnText: `重新发送(${countdown}s)`,
                });
            }
        }, 1000);
    },

    // 登录函数
    LogIn: function () {
        if (this.data.isChecked == false) {
            wx.showToast({
                title: '请同意使用协议',
                icon: 'error',
                duration: 2000
            });
        } else if (this.data.InputCode !== null && this.data.InputCode == this.data.TrueCode && this.data.BtnisDisabled) {
            // 如果验证码正确，提示登录成功
            wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 2000
            });

            // 在这里可以进行其他操作，比如保存用户登录状态或跳转到其他页面
            // 假设要跳转到主页，可以使用以下代码：
            wx.navigateTo({
                url: '/pages/home/home' // 假设这是主页的路径
            });
        } else {
            // 如果验证码不正确，提示验证码错误
            wx.showToast({
                title: '验证码错误',
                icon: 'error',
                duration: 2000
            });

        }
    },

    // 该函数用于检测复选框是否勾上，如果勾上就可以叉掉，如果没有，则先弹窗协议。
    CheckBoxChange: function (e) {
        if (this.data.isChecked) {
            this.setData({
                isChecked: false
            })
        } else {
            this.showAgreement()
        }
    },

    // 弹窗协议
    showAgreement: function () {
        wx.showModal({
            title: '使用协议',
            content: '欢迎使用本小程序。在使用本小程序之前，请仔细阅读以下条款：\n' +
                '1. 用户在注册、登录、使用本小程序时，须遵守国家相关法律法规，不得利用本小程序从事违法违规行为。\n' +
                '2. 本小程序提供的所有内容、功能及服务，均仅供合法用途，用户不得将本小程序用于任何非法目的。\n' +
                '3. 用户在使用本小程序过程中，应保持良好的网络文明，不得传播虚假信息、恶意代码、垃圾广告等内容。\n' +
                '4. 我们承诺保护用户的隐私安全，未经用户同意，我们不会向任何第三方泄露用户的个人信息。\n' +
                '5. 如果您不同意本协议的任何条款，请立即停止使用本小程序。您继续使用本小程序，即表示您同意本协议的全部内容。\n' +
                '感谢您对我们的信任与支持！',
            complete: (res) => {
                if (res.cancel) {
                    this.setData({
                        isChecked: false
                    })
                }

                if (res.confirm) {
                    this.setData({
                        isChecked: true
                    })
                }
            }
        })
    },

    // 微信快捷登陆
    WeiXinLogIn: function () {
        this.setData({
            showModal: true
        })
    },

    // 当点击遮罩层的时候，弹窗应该消失
    BindModalMask: function () {
        if (this.data.showModal) {
            this.setData({
                showModal: false
            })
        }
    },

    /**微信快捷登录，暂未实现，等后端 */
    getPhoneNumber: function (e) {
        console.log("getPhoneNumber")
        console.log(e.detail.errMsg)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData)
        if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '未授权',
                success: function (res) {}
            })
        } else {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '同意授权',
                success: function (res) {}
            })

            // 转到目前的个人信息页面
            wx.switchTab({
                url: '/pages/profile/profile'
            });
        }

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        // 页面卸载时清除定时器，防止内存泄漏
        if (this.data.timer) {
            clearInterval(this.data.timer);
        }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})