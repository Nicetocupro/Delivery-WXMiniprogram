Page({
    data: {
      addresses: []
    },
  
    onLoad: function () {
      // 模拟从本地获取收货地址数据
      const addresses = wx.getStorageSync('addresses') || [];
      this.setData({ addresses });
    },
  
    addAddress: function () {
      wx.navigateTo({
        url: '/pages/addAddress/addAddress' // 新增收货地址页面的路径
      });
    },
  
    editAddress: function (e) {
      const index = e.currentTarget.dataset.index;
      const address = this.data.addresses[index];
      wx.navigateTo({
        url: `/pages/addAddress/addAddress?index=${index}&address=${JSON.stringify(address)}`
      });
    },
  
    deleteAddress: function (e) {
      const index = e.currentTarget.dataset.index;
      const addresses = this.data.addresses;
      addresses.splice(index, 1);
      wx.setStorageSync('addresses', addresses);
      this.setData({ addresses });
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      });
    },
  
    setDefault: function (e) {
      const index = e.currentTarget.dataset.index;
      const addresses = this.data.addresses;
  
      // 清除之前的默认地址
      addresses.forEach((addr) => addr.isDefault = false);
      // 设置新的默认地址
      addresses[index].isDefault = true;
  
      wx.setStorageSync('addresses', addresses);
      this.setData({ addresses });
      wx.showToast({
        title: '设置成功',
        icon: 'success',
        duration: 2000
      });
    }
  });
  