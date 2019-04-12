export default {
  changeLanguage(state, val) {
    state.language = val
  },
  changeLangType(state, val) {
    state.langType = val;
  },
  changeStorageUserInfo(state, val) {
    state.storageUserInfo = val;
  },
  changeAddress(state, val) {
    state.address = val;
  },
  changeCityStatus(state, val) {
    state.cityStatus = val;
  },
  changeInitCountry(state, val) {
    state.initCountry = val;
    wx.setStorageSync('country', val)
  },
  changeCity(state, val) {
    state.city = val;
  }
}