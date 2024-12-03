Page({
    data: {
        reviewText: '',
        restaurant_id : 0,
        order_id: 0,
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

    onTextInput: function(e) {
        this.setData({
            reviewText: e.detail.value
        });
    },

     // 选择图片
     chooseImage: function() {
        var that = this;
        wx.chooseMedia({
            count: 3, // 最多可以选择的图片张数
            mediaType: ['image'], // 指定媒体类型为图片
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFiles;
                tempFilePaths.forEach(file => {
                    wx.getImageInfo({
                        src: file.tempFilePath,
                        success: function(res) {
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

    submitReview: function() {
        // 在这里处理提交评论的逻辑
        console.log('评论内容:', this.data.reviewText);
        console.log('上传的图片:', this.data.images);

        // 
    }
});
