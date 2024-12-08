// pages/rider_profile/rider_profile.js
Component({
    properties: {
        userInfo: {
            type: Object,
            value: {
            avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
            nickName: '礼堂顶真',
            }
        }
    },
    data: {
        menuItems: [
            {
              icon: '/asserts/images/profile/order.png', // 图标路径
              title: '已完成订单',
              version: ''
            },
            {
              icon: '/asserts/images/profile/customer-service.png',
              title: '联系客服',
              version: ''
            },
            {
              icon: '/asserts/images/profile/password.png',
              title: '修改密码',
              version: ''
            },
            {
              icon: '/asserts/images/profile/version.png',
              title: '检查更新',
              version: 'V1.114514'
            }
          ]
    },
    methods: {
        Logout(){
            wx.showModal({
              title: '提示',
              content: '您确定要退出登录吗',
              success: function (res) {
                if (res.confirm) {//这里是点击了确定以后
                  console.log('用户点击确定')
                  wx.setStorageSync('token', '');//将token置空
                  wx.redirectTo({
                    url: '/pages/register/register',//跳去登录页
                  })
                } else {//这里是点击了取消以后
                  console.log('用户点击取消')
                }
              }
            })
        }
    }
})