// 引入统一管理的接口js
const api = require("../../request/api");

var app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {
            phoneNumber: null
        },
        inputCode: null,
        correctVerificationCode: null,
        btnText: '获取验证码', // 按钮的文本内容
        btnIsDisabled: false, // 按钮是否禁用的状态
        countdown: 60, // 倒计时时间，单位为秒
        timer: null, // 保存倒计时的定时器
        isChecked: false, // 控制复选框是否打勾
        showModal: false, // 定义微信登录弹窗
    },

    // 进行手机号的数据绑定
    phoneNumberInput: function (e) {
        this.setData({
            "userInfo.phoneNumber": e.detail.value
        });
    },

    // 进行验证码的数据绑定
    codeInput: function (e) {
        this.setData({
            inputCode: e.detail.value
        });
    },

    // 发送验证码函数，封装发送验证码的具体业务逻辑，返回一个Promise以便处理成功或失败情况
    sendVerificationCode: function (phoneNumber) {
        return new Promise((resolve, reject) => {
            // 这里应该调用真正的发送验证码接口，比如通过网络请求等方式
            // 假设调用某个发送短信的函数sendCode(phoneNumber)，并根据其返回结果处理Promise状态
            // 示例中简单模拟返回成功或失败情况
            const isSuccess = this.validatePhoneNumber(phoneNumber); // 先简单验证手机号格式（实际需完善验证逻辑）
            if (isSuccess) {
                // 实际应用中这里调用接口发送验证码
                resolve(); 
            } else {
                reject(new Error('手机号格式不正确'));
            }
        });
    },

    // 验证手机号格式的简单函数（实际应用中可完善更严格的验证规则）
    validatePhoneNumber: function (phoneNumber) {
        // 简单正则验证示例，实际需更严谨判断
        const phoneReg = /^1[3-9]\d{9}$/;
        return phoneReg.test(phoneNumber);
    },

    // getCodeBtn根据手机号获取验证码
    getCodeBtn: function () {
        if (this.data.btnIsDisabled) return;

        const phoneNumber = this.data.userInfo.phoneNumber;
        this.sendVerificationCode(phoneNumber)
           .then(() => {
                // 在这里将手机号进行存储，防止手机号变更。
                app.globalData.userInfo.phoneNumber = phoneNumber;

                wx.showToast({
                    title: '验证码已发送',
                    icon: 'success',
                    duration: 2000,
                });

                // 开始倒计时
                this.startCountdown();
            })
           .catch((err) => {
                wx.showToast({
                    title: err.message,
                    icon: 'error',
                    duration: 2000,
                });
            });
    },

    // 倒计时函数
    startCountdown() {
        let countdown = this.data.countdown; // 倒计时时间，单位为秒

        // 设置按钮为禁用状态，并且更新文本
        this.setData({
            btnIsDisabled: true,
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
                    btnIsDisabled: false,
                });
            } else {
                // 继续倒计时，更新按钮文本
                this.setData({
                    btnText: `重新发送(${countdown}s)`,
                });
            }
        }, 1000);
    },

    // 验证验证码的函数，提取出来使登录逻辑更清晰
    verifyCode: function () {
        const inputCode = this.data.inputCode;
        const correctCode = this.data.correctVerificationCode;
        if (!inputCode || inputCode === '') {
            return false;
        }
        return inputCode === correctCode;
    },

    // 登录函数
    logIn: function () {
        if (this.data.isChecked === false) {
            wx.showToast({
                title: '请同意使用协议',
                icon: 'error',
                duration: 2000
            });
            return;
        }

        if (this.verifyCode()) {
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
    checkBoxChange: function (e) {
        if (this.data.isChecked) {
            this.setData({
                isChecked: false
            });
        } else {
            this.showAgreement();
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
                    });
                }

                if (res.confirm) {
                    this.setData({
                        isChecked: true
                    });
                }
            }
        });
    },

    // 微信快捷登陆
    weixin: function () {
        this.setData({
            showModal: true
        });
    },

    // 当点击遮罩层的时候，弹窗应该消失
    bindModalMask: function () {
        if (this.data.showModal) {
            this.setData({
                showModal: false
            });
        }
    },

    // 微信快捷登录，优化使用async/await语法（需小程序环境支持）
    async wxLogin() {
        try {
            const res = await wx.login();
            if (res.code) {
                await this.loginWithCode(res.code);
            } else {
                console.error('登录失败！' + res.errMsg);
                wx.showToast({
                    title: '登录失败，无法获取登录code',
                    icon: 'none',
                });
            }
        } catch (error) {
            console.error('微信登录出现异常', error);
            wx.showToast({
                title: '微信登录异常，请重试',
                icon: 'none',
            });
        }
    },

    loginWithCode(code) {
        const data = {
            code: code
        };
        return api.login(data)
           .then(res => {
               console.log('登录成功');
                wx.setStorageSync('session_id', res.data);
                // 处理登录成功后的逻辑
                wx.navigateTo({
                    url: '/pages/index/index',
                    success: function (res) {
                        console.log('index 跳转成功');
                    },
                    fail: function (err) {
                        console.error('index 跳转失败', err);
                    }
                });
            })
           .catch(err => {
                console.error('登录失败', err);
                wx.showToast({
                    title: '登录失败，请重试',
                    icon: 'none',
                });
            });
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