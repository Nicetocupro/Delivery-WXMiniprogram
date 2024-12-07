// pages/rider_identify/rider_identify.js
const api = require("../../request/api");

Page({
    data: {
        student_name: '',
        student_no: '',
        image: [],
        certificate_image: ''
    },

    NameInput(e) {
        this.setData({
            student_name: e.detail.value
        });
    },

    NoInput(e) {
        this.setData({
            student_no: e.detail.value
        });
    },

    // 选择图片
    chooseImage: function () {
        console.log("进入函数");
        var that = this;
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
                                image: that.data.image.concat({
                                    path: file.tempFilePath,
                                    thumb: res.path // 缩略图路径
                                })
                            });
                            // 检查 image 数组的长度
                            if (that.data.image.length > 1) {
                                wx.showToast({
                                    title: '最多只能上传1张图片',
                                    icon: 'none',
                                    duration: 2000
                                });
                                that.setData({
                                    image: []
                                });
                            }
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

    submit_application: function (e) {
        let header = {
            'Content-Type': 'application/json'
        }
        let session_id = wx.getStorageSync('session_id');

        // 本地session存在,则放到header里
        if (session_id != "" && session_id != null) {
            header.Authorization = session_id;
        }

        if (this.data.image.length != 0) {
            var uploadimage = this.data.image[0]; // 获取第一张图片
            wx.uploadFile({
                url: 'https://www.xiaoqingyanxuan.top/api/v1/wx/customer/image/rider_apply',
                filePath: uploadimage.path,
                name: 'image',
                header: header,
                success: (res) => {
                    console.log(res);
                    try {
                        const parsedData = JSON.parse(res.data);
                        console.log(parsedData);
                        const certificateImage = parsedData.data.image;
                        console.log(certificateImage);
                        this.setData({
                            certificate_image: certificateImage
                        });
                        console.log(this.data.certificate_image);

                        if (this.data.student_name < 2 || this.data.student_name > 20) {
                            console.log("来了");
                            wx.showToast({
                                content: '姓名不符合规范'
                            });
                        }

                        let data = {
                            student_name: this.data.student_name,
                            student_no: this.data.student_no,
                            student_card: this.data.certificate_image
                        };

                        console.log(data);

                        api.Rider_Certificate(data)
                            .then(() => {
                                wx.showToast({
                                    content: '已提交认证'
                                });
                                wx.navigateBack();
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
                    } catch (error) {
                        console.error('JSON Parsing Error:', error);
                        // 处理 JSON 解析错误
                    }
                },
                fail: (err) => {
                    console.error('Upload Failed:', err);
                    // 处理上传失败的情况
                }
            });
        }
    }
})