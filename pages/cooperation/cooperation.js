// 引入统一管理的接口js
const api = require("../../request/api");

Page({
    data: {
        name: '',
        phone: '',
        email: '',
        description: '',
        image: null,
        imagePath: '',
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

    onInputEmail(e) {
        this.setData({
            email: e.detail.value
        });
    },

    onInputDescription(e) {
        this.setData({
            description: e.detail.value
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
                    wx.getImageInfo({
                        src: file.tempFilePath,
                        success: function (res) {
                            that.setData({
                                image: {
                                    path: file.tempFilePath,
                                    thumb: res.path // 缩略图路径
                                }
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

    submitCooperation() {
        const {
            name,
            phone,
            email,
            description,
            image
        } = this.data;

        if (!name || !phone || !email || !description || !image) {
            wx.showToast({
                title: '所有字段均为必填项',
                icon: 'none'
            });
            return;
        }

        // 验证姓名格式
        if (name.length < 2 || name.length > 20) {
            wx.showToast({
                title: '请输入有效的姓名',
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

        // 验证邮箱格式
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            wx.showToast({
                title: '请输入有效的邮箱地址',
                icon: 'none'
            });
            return;
        }

        // 验证描述格式
        if (description.length < 1 || description.length > 300) {
            wx.showToast({
                title: '商店描述长度应在1到300字之间',
                icon: 'none'
            });
            return;
        }

        // 上传图片
        if (image != null) {
            var uploadimage = image; // 获取第一张图片
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
                url: 'https://www.xiaoqingyanxuan.top/api/v1/wx/customer/image/merchant-license',
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
                            imagePath: certificateImage
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
        } else {
            // 如果没有图片，直接提交表单
            this.submitForm();
        }
    },

    submitForm() {
        const submissionData = {
            description: this.data.description, // 1 - 300
            email: this.data.email,
            phone_number: "+86" + this.data.phone,
            name: this.data.name,
            path: this.data.imagePath
        };

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
                    email: '',
                    description: '',
                    image: null,
                    imagePath: ''
                });
                console.log(res);
            })
    }
});