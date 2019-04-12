import Vue from 'vue'
import App from './App'
import '@/style/main.scss'
import '@/utils/axios'
import '@/api/index'
import '@/utils/index'
import store from '@/store/index'
Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$store = store
const app = new Vue(App)
app.$mount()
export default {
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页
    pages: [
      'pages/find/main',
      '^pages/index/main',
      'pages/user/main',
      'pages/city/main',
      'pages/store/main',
      'pages/storedetail/main',
      'pages/panoramic/main',
      'pages/gooddetail/main',
      "pages/goodsList/main",
      // "pages/goodsSearch/main",
      // "pages/screen/main",
      "pages/setlang/main",
      "pages/login/main",
      'pages/register/main',
      'pages/banner/main',
      'pages/commandwx/main',
      'pages/keysearch/main',
      'pages/collection/main',
      'pages/mixgo/main',
      'pages/accountset/main'
    ],
    window: {
      backgroundTextStyle: 'black',
      navigationBarBackgroundColor: '#2ac6f7',
      navigationBarTitleText: ' ',
      navigationBarTextStyle: 'black',
      onReachBottomDistance: 10,
    },
    tabBar: {
      selectedColor: "#2ac6f7",
      backgroundColor: "#fff",
      list: [{
          pagePath: "pages/index/main",
          text: " ",
          iconPath: "./static/images/icon/icon-home.png",
          selectedIconPath: "./static/images/icon/icon-home-active.png"
        },
        {
          pagePath: "pages/find/main",
          text: " ",
          iconPath: "./static/images/icon/icon-find.png",
          selectedIconPath: "./static/images/icon/icon-find-active.png"
        },
        {
          pagePath: "pages/user/main",
          text: " ",
          iconPath: "./static/images/icon/icon-me.png",
          selectedIconPath: "./static/images/icon/icon-me-active.png"
        }
      ]
    },
    networkTimeout: {
      "request": 10000
    },
  }
}
