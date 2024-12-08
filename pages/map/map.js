Page({
    data: {
      latitude: 23.099994,  // 默认纬度
      longitude: 113.324520,  // 默认经度
      markers: [],  // 存储所有标记
      searchQuery: ''  // 搜索框的输入内容
    },
  
    onLoad: function() {
      this.getUserLocation();
    },
  
    // 获取用户位置
    getUserLocation: function() {
      wx.getLocation({
        type: 'wgs84', // 获取经纬度，'wgs84' 是常见标准
        success: (res) => {
          this.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            markers: [{
              iconPath: "/resources/marker.png",  // 设置标记图标
              id: 1,
              latitude: res.latitude,
              longitude: res.longitude,
              width: 50,
              height: 50,
              title: '当前位置'
            }]
          });
        },
        fail: (err) => {
          console.error("获取位置失败", err);
        }
      });
    },
  
    // 搜索框输入事件
    onSearchInput: function(event) {
      this.setData({
        searchQuery: event.detail.value  // 更新搜索框的输入内容
      });
    },
  
    // 搜索地点（按下回车或确认）
    onSearchConfirm: function() {
      const query = this.data.searchQuery;
      if (query) {
        this.searchPlace(query);
      }
    },

    // 使用腾讯地图API搜索地点
    searchPlace: function(query) {
      wx.request({
        url: `https://apis.map.qq.com/ws/place/v1/search`,  // 腾讯地图API搜索接口
        data: {
          keyword: query,
          boundary: `nearby(${this.data.latitude},${this.data.longitude},5000,1)`,  // 搜索当前位置周围5公里的地点
          key: 'GUZBZ-FB3RJ-RYWFL-XRVSQ-GVTFV-NVFO4',  // 替换为API密钥
        },
        success: (res) => {
          if (res.data.status === 0 && res.data.data.length > 0) {
            // 获取搜索结果的第一个地点
            const firstPlace = res.data.data[0];
            const newMarker = {
              iconPath: "../../asserts/images/mapMark/mark.jpg",
              id: this.data.markers.length + 1,  // 确保每个标记ID唯一
              latitude: firstPlace.location.lat,
              longitude: firstPlace.location.lng,
              width: 50,
              height: 50,
              title: firstPlace.title
            };
  
            // 保留当前位置的标记，添加新标记
            this.setData({
              markers: [this.data.markers[0], newMarker]  // 保留第一个标记
            });
          } else {
            wx.showToast({
              title: '未找到该地点',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          console.error("地点搜索失败", err);
          wx.showToast({
            title: '搜索失败，请重试',
            icon: 'none'
          });
        }
      });
    },
  
    // 点击地图自定义添加标记
    onMapTap: function(event) {
      const latitude = event.detail.latitude;
      const longitude = event.detail.longitude;
  
      // 添加新的标记到地图
      const newMarker = {
        iconPath: "/resources/marker.png",
        id: this.data.markers.length + 1,  // 确保每个标记ID唯一
        latitude: latitude,
        longitude: longitude,
        width: 50,
        height: 50,
        title: '自定义地点'
      };
  
      // 保留当前位置的标记，添加新标记
      this.setData({
        markers: [this.data.markers[0], newMarker]  // 保留第一个标记
      });
    },
  
    // 开始导航
    openNavigation: function() {
      wx.openLocation({
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        name: '当前位置',
        address: '用户的当前位置',
        scale: 15
      });
    },
  
    // 返回上一页
    goBack: function() {
      wx.navigateBack({
        delta: 1  // 返回上一页
      });
    }
  });
  