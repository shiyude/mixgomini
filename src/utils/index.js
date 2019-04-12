import Vue from 'vue';
import md5 from 'js-md5'
// 引入SDK核心类
let QQMapWX = require("../../static/js/qqmap-wx-jssdk.min.js");

//利用腾讯地图api将经纬度转换为地址
const QQFun = (data) => {
  // 实例化API核心类
  let toGetAddress = new QQMapWX({
    key: "D2RBZ-TMMLG-TGCQ7-IRKA5-NBQGJ-T7FO4" // 必填
  });
  // 调用接口
  return new Promise((resolve, reject) => {
    toGetAddress.reverseGeocoder({
      location: {
        latitude: data.latitude,
        longitude: data.longitude
      },
      success: function (res) {
        resolve(res)
      },
      complete: function (res) {
        if (res.status == 1000) {
          wx.showToast({
            title: Vue.prototype.$store.state.language.alert.addressErr,
            icon: "none",
            duration: 1500,
            mask: true,
          });
          reject(res)
        }
      }
    });
  })
}
//轮播时改变图片的大小
const imageLoad = ((eObj, paddingWith = 0) => {
  let winWid = wx.getSystemInfoSync().windowWidth - paddingWith; //获取当前屏幕的宽度
  let imgh = eObj.target.height; //图片高度
  let imgw = eObj.target.width; //图片宽度
  let swiperH = winWid * imgh / imgw + "px"; //等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
  return swiperH; //返回高度
})
//修改tabBar上面的文字
const setTabBar = (home = '', find = '', user = '') => {
  wx.setTabBarItem({
      index: 0,
      text: home
    }),
    wx.setTabBarItem({
      index: 1,
      text: find
    }),
    wx.setTabBarItem({
      index: 2,
      text: user
    })
}
//修改页面的title
const setTitle = (data) => {
  wx.setNavigationBarTitle({
    title: data
  })
}
//密码加密功能
const encodeMd5 = (password) => {
  return md5(password+'922eb641bbbc11e88da4001e67785195')
}
//判断token是否存在
const judgeToken = () => {
  if (wx.getStorageSync('token')) {
    return true
  } else {
    wx.showToast({
      title: Vue.prototype.$store.state.language.alert.accountErr,
      icon: 'none',
      duration: 2000
    });
    return false
  }
}
const refreshFun = ({
  callback = function () {}
}) => {
  callback()
}
const getSessionKey = (callback = "") => { //获取sessionkey
  wx.login({
    success: function (loginRes) {
      if (loginRes.code) {
        Vue.prototype
          .$axios({
            method: "get",
            url: Vue.prototype.$api.getSessionKey,
            params: {
              jsCode: loginRes.code
            },
            loading: false
          })
          .then(res => {
            if (res) {
              wx.setStorageSync("session_key", res.datas);
              if (callback) {
                callback();
              }
            }
          }).catch(err => {
            console.log(err)
          });
      } else {
        console.log(loginRes, "获取wxlogin的code失效");
      }
    }
  });
}
const dateFormat = (date) => {

  if (!date) return ''
  let date_format = new Date(date)
  let year = date_format.getFullYear()
  let month = date_format.getMonth() + 1
  if (month < 10) month = '0' + month
  let mydate = date_format.getDate()
  if (mydate < 10) mydate = '0' + mydate
  let hours = date_format.getHours()
  if (hours < 10) hours = '0' + hours
  let minutes = date_format.getMinutes()
  if (minutes < 10) minutes = '0' + minutes
  let seconds = date_format.getSeconds()
  if (seconds < 10) seconds = '0' + seconds
  let time = `${year}-${month}-${mydate} ${hours}:${minutes}:${seconds}`
  return time
}
Vue.prototype.$setTitle = setTitle
Vue.prototype.$setTabBar = setTabBar
Vue.prototype.$QQFun = QQFun;
Vue.prototype.$md5 = md5;
Vue.prototype.$imageLoad = imageLoad;
Vue.prototype.$encodeMd5 = encodeMd5;
Vue.prototype.$judgeToken = judgeToken;
Vue.prototype.$refreshFun = refreshFun;
Vue.prototype.$getSessionKey = getSessionKey;
Vue.prototype.$dateFormat = dateFormat
