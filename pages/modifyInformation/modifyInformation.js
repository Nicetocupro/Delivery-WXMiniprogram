const api = require("../../request/api");
var app = getApp();

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';

Page({
    data: {
        phoneNumber: '',
        nickName: '',
        isLoading: false, // 加载状态
        errorMessage: '', // 错误信息
        image: null,
        imagePath: '',
        AvatarUrl: defaultAvatarUrl,
        session_id: null,
    },

    onLoad: function () {
        let phoneNumber = app.globalData.userInfo.phoneNumber;
        if (phoneNumber.startsWith('+86')) {
            phoneNumber = phoneNumber.substring(3); // 去掉 +86
        }
        this.setData({
            imagePath: app.globalData.userInfo.avatarUrl,
            nickName: app.globalData.userInfo.nickName,
            phoneNumber: phoneNumber,
            session_id: wx.getStorageSync('session_id')
        });
    },

    chooseImage() {
        const that = this;
        wx.chooseMedia({
            count: 1, // 最多可以选择的图片张数
            mediaType: ['image'], // 指定媒体类型为图片
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFiles;
                if (tempFilePaths.length > 0) {
                    var file = tempFilePaths[0];
                    // 检查图片格式
                    const validImageTypes = ['jpg', 'jpeg', 'png'];
                    const fileExtension = file.tempFilePath.split('.').pop().toLowerCase();
                    if (!validImageTypes.includes(fileExtension)) {
                        wx.showToast({
                            title: '图片格式必须是 JPG、JPEG 或 PNG',
                            icon: 'none'
                        });
                        return;
                    }
                    // 检查图片大小
                    if (file.size > 8 * 1024 * 1024) {
                        wx.showToast({
                            title: '图片大小不能超过 8MB',
                            icon: 'none'
                        });
                        return;
                    }
                    wx.getImageInfo({
                        src: file.tempFilePath,
                        success: function (res) {
                            that.setData({
                                image: {
                                    path: file.tempFilePath,
                                    thumb: res.path // 缩略图路径
                                },
                                AvatarUrl: file.tempFilePath // 更新 imagePath 以显示选择的图片
                            });
                        },
                        fail: function (error) {
                            console.error('获取图片信息失败:', error);
                        }
                    });
                }
            },
            fail: function (error) {
                console.error('选择图片失败:', error);
            }
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

        // 上传图片
        var uploadimage = this.data.image; // 获取选择的图片
        if (!uploadimage) {
            this.submitForm();
            return;
        }

        // 请求头
        let header = {
            'Content-Type': 'application/json'
        }
        let session_id = wx.getStorageSync('session_id');

        // 本地session存在,则放到header里
        if (session_id != "" && session_id != null) {
            header.Authorization = session_id;
        }

        wx.uploadFile({
            url: 'https://www.xiaoqingyanxuan.top/api/v1/wx/customer/image/profile',
            filePath: uploadimage.path,
            name: 'image',
            header: header,
            success: (res) => {
                console.log(res);
                try {
                    const parsedData = JSON.parse(res.data);
                    console.log(parsedData);
                    const certificateImage = parsedData.data.image;
                    this.setData({
                        imagePath: certificateImage // 更新 imagePath 以显示上传后的图片
                    });
                    console.log(this.data.imagePath);

                    // 图片上传成功后再进行表单提交
                    this.submitForm();
                } catch (error) {
                    console.error('JSON Parsing Error:', error);
                    wx.showToast({
                        title: '图片上传失败',
                        icon: 'none'
                    });
                }
            },
            fail: (err) => {
                console.error('Upload Failed:', err);
                wx.showToast({
                    title: '图片上传失败',
                    icon: 'none'
                });
            }
        });
    },

    submitForm() {
        let data = {
            phone_number: `+86${this.data.phoneNumber}`,
            profile_image_url: this.data.imagePath,
            nickname: this.data.nickName
        };

        api.ChangeProfile(data)
            .then(() => {
                // 更新 app.globalData 中的数据
                app.globalData.userInfo.avatarUrl = this.data.imagePath;
                app.globalData.userInfo.nickName = this.data.nickName;
                app.globalData.userInfo.phoneNumber = `+86${this.data.phoneNumber}`;
                
                // 通知上一个页面刷新
                const pages = getCurrentPages();
                if (pages.length > 1) {
                    const prevPage = pages[pages.length - 2];
                    prevPage.onRefresh();
                }

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