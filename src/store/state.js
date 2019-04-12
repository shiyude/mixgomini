
const storageUserInfo = wx.getStorageSync('userInfo') || '';
const city = ''; //城市名
let initCountry = null;
let language = null;
let langType = null;
let cityStatus = false; //授权获取城市名
let address = {}; //经纬度，以便刷新的时候用于请求,
export default {
  language,
  langType,
  storageUserInfo,
  city,
  address,
  cityStatus,
  initCountry,
}
