const gaodeMap = require('../../utils/amap-wx.130.js'); // 引入高德sdk
const map = new gaodeMap.AMapWX({
  key: 'f5f85382e92dcaa776f95d468a3bc478' // 高德申请的key
});

Page({
  data: {
    longitude: 121.3, // 默认的经纬度，定位到北京天安门
    latitude: 31.1, //
    distance: 0, // 总距离
    cost: 0, // 总时间
    polyline: [], // 存放路线的经纬度
    markers: [{ // 自己设置的三个mark标记，分别是商家，用户，骑手
      iconPath: "../../asserts/images/rider_map/destination.png",
      id: 0,
      latitude: 31,
      longitude: 121.40,
      width: 20,
      height: 23
    }, {
      iconPath: "../../asserts/images/rider_map/house.png",
      id: 1,
      latitude: 31.23035,
      longitude: 121.473717,
      width: 20,
      height: 23
    }, {
      iconPath: "../../asserts/images/rider_map/rider.png",
      id: 2,
      latitude: 31.1,
      longitude: 121.3,
      width: 20,
      height: 23
    }],
  },

  // 获取用户位置信息
  getUserLocation() {
    let that = this;
    wx.getLocation({
      success: (res) => {
        // 获取用户当前位置
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          ['markers[2].latitude']: res.latitude,
          ['markers[2].longitude']: res.longitude
        }, () => {
          // 第一步：计算骑手到商家的路线
          that.calculateRoute(`${res.longitude},${res.latitude}`, '121.473717,31.23035', 0, (route1Data) => {
            // 第二步：计算商家到用户的路线
            that.calculateRoute('121.473717,31.23035', '116.397128,39.916527', 1, (route2Data) => {
              // 合并两个路线的结果
              let totalDistance = route1Data.distance + route2Data.distance;
              let totalCost = route1Data.duration + route2Data.duration;

              // 更新数据
              that.setData({
                polyline: [...route1Data.polyline, ...route2Data.polyline],
                distance: totalDistance + '米',
                cost: Math.ceil(totalCost / 60) + '分钟', // 转化为分钟
                ['markers[2].longitude']: route2Data.polyline[route2Data.polyline.length - 1].longitude,
                ['markers[2].latitude']: route2Data.polyline[route2Data.polyline.length - 1].latitude
              });
            });
          });
        });
      },
    });
  },

  // 计算路线
  calculateRoute(origin, destination, markerIndex, callback) {
    let that = this;
    map.getRidingRoute({
      origin: origin, // 起点经纬度
      destination: destination, // 终点经纬度
      success: (data) => {
        let points = [];
        let distance = 0;
        let duration = 0;

        if (data.paths && data.paths[0] && data.paths[0].steps) {
          let steps = data.paths[0].steps;
          for (let i = 0; i < steps.length; i++) {
            let poLen = steps[i].polyline.split(';');
            for (let j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              });
            }
          }
        }

        // 获取距离和时间
        if (data.paths[0] && data.paths[0].distance) {
          distance = data.paths[0].distance; // 路线的距离（单位：米）
        }
        if (data.paths[0] && data.paths[0].duration) {
          duration = data.paths[0].duration; // 路线的时间（单位：秒）
        }

        // 更新标记的位置
        that.setData({
          [`markers[${markerIndex}].longitude`]: points[points.length - 1].longitude,
          [`markers[${markerIndex}].latitude`]: points[points.length - 1].latitude
        });

        // 回调返回路线数据
        callback({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }],
          distance: distance,
          duration: duration
        });
      }
    });
  },

  // 用户授权
  userAuth() {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              // 同意授权位置
              this.getUserLocation();
            },
            fail: () => {
              wx.showModal({
                content: '拒绝授权将无法获取您的位置，请授权。',
                showCancel: false,
                success: (r) => {
                  if (r.confirm) {
                    // 打开设置页面让用户手动开启权限
                    wx.openSetting({
                      success: (v) => {}
                    });
                  }
                }
              });
            }
          });
        }
      },
    });
  },

  onLoad: function () {},

  onShow: function () {
    this.userAuth(); // 页面加载时调用授权获取用户位置
  },

  onUnload: function () {
    clearInterval(this.data.timer); // 退出时清理定时器
  }
});
