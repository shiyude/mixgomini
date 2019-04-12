import Vue from 'vue'
//该文件对于wx.request的封装;
import {
  baseUrl
} from '@/config/env';
import md5 from 'js-md5'
const XHR = () => {
  //基础参数
  const user = {
    sign: md5("1f8cdd89fc07211e88da4001e67785195"), // 正式f05e99debd6d11e88da4001e67785195 测试1f8cdd89fc07211e88da4001e67785195
    companyId: "1",
    customerId: wx.getStorageSync("userInfo").id || "", //登陆用户的ID 
    token: wx.getStorageSync("token") || "", // 登陆用户的登陆标识符
    lang: wx.getStorageSync('lang') || Vue.prototype.$store.state.langType, // 请求的多语言系统zh-CN| en_US
    country: wx.getStorageSync('country'), //用户所在的国家信息 
  }
  //
  const errDeal = (res) => {
    // if (res.errcode == 14) {
    //   if (wx.getStorageSync('userInfo')) {
    //     wx.showToast({
    //       title: Vue.prototype.$store.state.language.alert.tokenErr,
    //       icon: "none",
    //       duration: 1500,
    //       mask: true,
    //     });
    //     setTimeout(() => {
    //       wx.switchTab({
    //         url: "../../pages/index/main"
    //       });
    //     }, 1500)
    //     wx.removeStorageSync('userInfo');
    //     wx.removeStorageSync('token');
    //     Vue.prototype.$store.commit('changeStorageUserInfo', '')
    //     return false
    //   }
    // } else 
    if (res.code == 0 || res.code == -201 || res.code == -202 || res.code == -203 || res.code == -204 || res.code == -205||res.code==-301||res.code==-302||res.code==-303||res.code == -401) {
      wx.hideToast();
      return res
    } else {
      if (!res.msg) {
        wx.showToast({
          title: 'fail',
          image: '/static/images/icon/error.png',
          duration: 2000,
          mask: true,
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none",
          duration: 2000,
          mask: true,
        })
      }
      return false
    }
  }
  //成功请求
  const sucFun = (res) => {
    return errDeal(res)
  }
  //失败请求
  const errFun = (err) => {
    wx.showToast({
      title: 'fail',
      image: '/static/images/icon/error.png',
      duration: 2000,
      mask: true,
    })
    return Promise.reject(err);

  }
  return {
    user,
    sucFun,
    errFun
  }
}
/**
 * 
 * @param {*} method 请求方式
 * @param {*} url 请求地址
 * @param {*} params 请求参数
 * @param {*} loading 请求是否需要动画效果
 */
const axios = ({
  method = 'get',
  url = '',
  params = {},
  loading = true,
}) => {
  let {
    user,
    sucFun,
    errFun
  } = XHR();
  let urlGetData = '';
  return new Promise((resolve, reject) => {
    if (loading) {
      wx.showToast({
        title: 'Loading',
        icon: 'loading',
        duration: 10000
      })
    }
    //基础参数全部用get传,所以放在地址栏后面
    for (let key in user) {
      urlGetData += `${key}=${user[key]}&`
    }
    wx.request({
      url:  baseUrl + `${url}?${urlGetData.slice(0, -1)}`,
      data: params,
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: method,
      success: function (req) {
        resolve(req.data)
      },
      fail: function (err) {
        reject(err)
      }
    })
  }).then(sucFun).catch(errFun)
}
Vue.prototype.$axios = axios;
