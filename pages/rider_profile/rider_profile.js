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
})