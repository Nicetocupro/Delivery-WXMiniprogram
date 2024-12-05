const api = require("../../request/api");

Page({
    data: {
        reviewText: '',
        restaurant_id: 1,
        order_id: 1,
        images: [],
        stars_num: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5], // 每个星星代表的数字
        stars_select: '../../asserts/images/starbox/star.png',
        stars_unselect: '../../asserts/images/starbox/star_check.png',
        stars_score: 0 // 初始化 stars_score 为 0
    },


    // 星星点击
    starsClick: function (e) {
        let score = e.currentTarget.dataset.score;
        this.setData({
            stars_score: score
        });
        console.log(this.data.stars_score);
    },

    onTextInput: function (e) {
        this.setData({
            reviewText: e.detail.value
        });
    },

    // 选择图片
    chooseImage: function () {
        var that = this;
        wx.chooseMedia({
            count: 3, // 最多可以选择的图片张数
            mediaType: ['image'], // 指定媒体类型为图片
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFiles;
                tempFilePaths.forEach(file => {
                    wx.getImageInfo({
                        src: file.tempFilePath,
                        success: function (res) {
                            that.setData({
                                images: that.data.images.concat({
                                    path: file.tempFilePath,
                                    thumb: res.path // 缩略图路径
                                })
                            });

                            // 检查 images 数组的长度
                            if (that.data.images.length > 3) {
                                wx.showToast({
                                    title: '最多只能上传3张图片',
                                    icon: 'none',
                                    duration: 2000
                                });
                                that.setData({
                                    images: []
                                });
                            }
                        }
                    });
                });
            }
        });
    },

    submitReview: function (e) {
        // 在这里处理提交评论的逻辑
        console.log('评论内容:', this.data.reviewText);
        console.log('上传的图片:', this.data.images);

        let header = {
            'Content-Type': 'application/json'
        }
        let session_id = wx.getStorageSync('session_id');

        // 本地session存在,则放到header里
        if (session_id != "" && session_id != null) {
            header.Authorization = session_id;
        }

        var uploadedImages = [];

        if (this.data.images.length != 0) {
            var promises = this.data.images.map(image => {
                return new Promise((resolve, reject) => {
                    wx.uploadFile({
                        url: 'https://www.xiaoqingyanxuan.top/api/v1/wx/customer/comment/image',
                        filePath: image.path,
                        name: 'image',
                        header: header,
                        success(res) {
                            const parsedData = JSON.parse(res.data);
                            console.log(parsedData);
                            uploadedImages.push(parsedData.data.image);
                            resolve(res.data); // 上传成功，解析 Promise
                        },
                        fail(err) {
                            reject(err); // 上传失败，拒绝 Promise
                        }
                    });
                });
            });

            // 等待所有上传操作完成
            Promise.all(promises)
                .then(results => {
                    console.log('All uploads completed:', uploadedImages);
                    // 在这里可以进行后续操作
                })
                .catch(error => {
                    console.error('Upload failed:', error);
                });
        }

        let data = {
            content: this.data.reviewText,
            images: uploadedImages,
            order_id: this.data.order_id,
            rating: this.data.stars_score
        };

        console.log(data);

        api.SendComment(this.data.restaurant_id, data)
            .then(() => {
                wx.showToast({
                  content: '已上传评论'
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
    }
});