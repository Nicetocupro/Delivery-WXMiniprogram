// app.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

App({
    onLaunch() {
       
    },
    globalData: {
        uid: null,
        userInfo: {
            phoneNumber: null,
            avatarUrl: defaultAvatarUrl,
            nickName: '',
        }
    }
})