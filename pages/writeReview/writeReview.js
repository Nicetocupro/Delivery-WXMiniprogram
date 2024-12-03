Page({
    data: {
        reviewText: '',
        images: []
    },

    onTextInput: function(e) {
        this.setData({
            reviewText: e.detail.value
        });
    },

    chooseImage: function() {
        this.data.images = [];
        var that = this;
        wx.chooseMedia({
            count: 1, // 最多可以选择的图片张数
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
    }
});
