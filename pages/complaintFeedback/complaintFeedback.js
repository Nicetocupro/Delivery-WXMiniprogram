Page({
    data: {
      showSubmitFeedback: true,
      showRecords: false,
      feedback: '',
      phone: '',
      records: []
    },
  
    showFeedback() {
      this.setData({
        showSubmitFeedback: true,
        showRecords: false
      });
    },
  
    showRecords() {
      this.setData({
        showSubmitFeedback: false,
        showRecords: true
      });
    },
  
    onInputFeedback(e) {
      this.setData({
        feedback: e.detail.value
      });
    },
  
    onInputPhone(e) {
      this.setData({
        phone: e.detail.value
      });
    },
  
    submitFeedback() {
      const { feedback, phone, records } = this.data;
  
      if (!feedback || !phone) {
        wx.showToast({
          title: '请填写反馈和手机号码',
          icon: 'none'
        });
        return;
      }
  
      // 可以在这里添加对手机号码的验证
  
      const newRecord = {
        date: new Date().toLocaleString(),
        content: feedback
      };
  
      records.push(newRecord);
      this.setData({
        records,
        feedback: '',
        phone: ''
      });
  
      wx.showToast({
        title: '反馈提交成功',
        icon: 'success'
      });
    }
  });
  