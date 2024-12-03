// app.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

App({
    onLaunch() {
        
    },
    globalData: {
        baseUrl: "https://www.xiaoqingyanxuan.top/api/v1/wx/",
        user: 0,  // 默认是顾客，0表示顾客，1表示骑手
        userInfo: {
            phoneNumber: null,
            avatarUrl: defaultAvatarUrl,
            nickName: '',
        }
    }
})