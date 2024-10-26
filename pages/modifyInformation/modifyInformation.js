Page({
    data: {
      avatarUrl: '', // 头像 URL
      nickname: '',
      name: '',
      idCard: '',
      address: ''
    },
  
    onLoad: function () {
      // 模拟获取用户信息
      const userInfo = wx.getStorageSync('userInfo') || {};
      this.setData({
        avatarUrl: userInfo.avatarUrl || '',
        nickname: userInfo.nickname || '',
        name: userInfo.name || '',
        idCard: userInfo.idCard || '',
        address: userInfo.address || ''
      });
    },
  
    chooseAvatar: function () {
      const that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // 假设上传头像成功后，获取到新头像的 URL
          const avatarUrl = res.tempFilePaths[0];
          that.setData({ avatarUrl });
          // 这里可以添加上传头像到服务器的逻辑
        }
      });
    },
  
    onInputChange: function (e) {
      const field = e.currentTarget.dataset.field;
      this.setData({
        [field]: e.detail.value
      });
    },
  
    onSubmit: function (e) {
      // 保存用户信息
      const { avatarUrl, nickname, name, idCard } = this.data;
      const userInfo = { avatarUrl, nickname, name, idCard };
  
      // 这里可以添加保存到服务器的逻辑
      wx.setStorageSync('userInfo', userInfo);
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      });

      wx.navigateBack(); // 返回上一个页面
    }
  });
  