Page({
    data: {
      name: '',
      phone: '',
      selectedSchool: '同济大学',
      selectedCampus: '四平校区',
      selectedBuilding: '',
      schools: ['同济大学', '其他'],
      campuses: ['四平校区'],
      buildings: [],
      detail: '',
      index: null // 用于编辑时存储索引
    },
  
    onLoad: function (options) {
      if (options.index) {
        const address = JSON.parse(options.address);
        this.setData({
          name: address.name,
          phone: address.phone,
          selectedSchool: address.school,
          selectedCampus: address.campus,
          selectedBuilding: address.building,
          detail: address.detail,
          index: options.index
        });
  
        this.updateCampusAndBuilding(address.school, address.campus); // 更新校区和楼栋
      }
    },
  
    onInputChange: function (e) {
      const field = e.currentTarget.dataset.field;
      this.setData({
        [field]: e.detail.value
      });
    },
  
    onSchoolChange: function (e) {
      const school = this.data.schools[e.detail.value];
      this.setData({ 
        selectedSchool: school,
        campuses: school === '同济大学' ? ['四平校区', '嘉定校区', '沪西校区', '彰武校区'] : ['其他'],
        selectedCampus: school === '同济大学' ? '四平校区' : '其他',
        buildings: [],
        selectedBuilding: ''
      });
      
      this.updateCampusAndBuilding(school, this.data.selectedCampus); // 更新校区和楼栋
    },
  
    onCampusChange: function (e) {
      const campus = this.data.campuses[e.detail.value];
      this.setData({
        selectedCampus: campus,
        buildings: this.getBuildings(campus),
        selectedBuilding: ''
      });
    },
  
    getBuildings: function (campus) {
      if (campus === '四平校区') {
        return ['西南一', '西南二', '西南三', '西南四', '西南五', '西南六', '西南七', '西南八', '西南九', '西南十', '西南十一', '西南十二', '西北一', '西北二', '西北三', '西北四', '西北五'];
      } else if (campus === '嘉定校区') {
        return Array.from({ length: 20 }, (_, i) => `友园${i + 1}号楼`).concat(Array.from({ length: 5 }, (_, i) => `朋园${i + 1}号楼`));
      } else {
        return []; // 其他情况没有楼栋
      }
    },
  
    onBuildingChange: function (e) {
      const building = this.data.buildings[e.detail.value];
      this.setData({
        selectedBuilding: building
      });
    },
  
    onSubmit: function (e) {
      const { name, phone, selectedSchool, selectedCampus, selectedBuilding, detail, index } = this.data;
      const address = { name, phone, school: selectedSchool, campus: selectedCampus, building: selectedBuilding, detail };
  
      let addresses = wx.getStorageSync('addresses') || [];
      if (index !== null) {
        addresses[index] = address; // 编辑
      } else {
        addresses.push(address); // 新增
      }
  
      wx.setStorageSync('addresses', addresses);
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      });
  
    //   wx.navigateBack(); // 返回上一个页面（但是不会刷新页面，导致新增的地址没有显示）
    wx.navigateTo({
        url: '/pages/manageAddress/manageAddress' // 这样返回上一个页面的效率不高，还有改进空间
      });
    }
  });
  