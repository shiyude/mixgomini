<template>
  <div class="wx_wrapper flex">
    <text>{{language.wxcommand.loginMethos}}</text>
    <button class="flex" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
      <image src="/static/images/icon/wx.png" />
      <text>{{language.wxcommand.account}}</text>
    </button>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
export default {
  onLoad() {
    this.$setTitle(this.language.title.wx);
    // this.getSessionKey();
  },
  computed: {
    ...mapState(["language"])
  },
  methods: {
    ...mapMutations(["changeStorageUserInfo"]),
    getPhoneNumber(e) {
      //手机号码授权
      let _this = this;
      if (e.target.errMsg == "getPhoneNumber:ok") {
        wx.checkSession({
          success: function() {
            //session_key 未过期
            if (!wx.getStorageSync("session_key")) {
              //当无缓存时重新请求获取sessionkey
              _this.$getSessionKey(() => {
                console.log('sessionkey未过期，无缓存')
                _this.phoneToLogin(e.target.encryptedData, e.target.iv);
              });
            } else {
              _this.phoneToLogin(e.target.encryptedData, e.target.iv);
            }

            console.log("sessionkey未过期");
          },
          fail: function() {
            // session_key 已经失效，需要重新执行登录流程
            _this.$getSessionKey(() => {
              console.log('sessionkey已过期')
              //失效时重新请求sessionkey
              _this.phoneToLogin(e.target.encryptedData, e.target.iv);
            });
            console.log("sessionkey已过期");
          }
        });
      } else {
        //用户拒绝授权时跳到注册页面注册
        wx.navigateTo({
          url: "../../pages/register/main?type=1"
        });
      }
    },
    phoneToLogin(encryptedData, iv) {
      //手机号码授权登入
      let _this = this;
      _this
        .$axios({
          method: "post",
          url: _this.$api.weixinLogin,
          params: {
            sessionKey: wx.getStorageSync("session_key"),
            encryptedData: encodeURIComponent(encryptedData),
            iv: iv
          }
        })
        .then(res => {
          if (res) {
            if (res.code == 0) {
              if (res.datas.token) {
                //有token时直接登入
                wx.setStorageSync("token", res.datas.token);
                wx.setStorageSync("userInfo", res.datas);
                _this.changeStorageUserInfo(res.datas);
                wx.switchTab({
                  url: "../../pages/user/main"
                });
              } else {
                // //没有token时到注册页面注册
                // wx.navigateTo({
                //   url: `../../pages/register/main?phone=${
                //     res.datas.phone
                //   }&code=1&type=1`
                // });
              }
            } else if (res.code == "-401") {
              //服务器解密错误
              _this.$getSessionKey(() => {
                //失效时重新请求sessionkey
                console.log('登入时服务器返回401')
                _this.phoneToLogin(encryptedData,iv);
              });
            } else {
              console.log(res.msg);
            }
          }
        });
    }
  }
};
</script>
<style scoped lang=scss>
.wx_wrapper {
  flex-direction: column;
  align-items: center;
  text {
    font-size: 24rpx;
    color: #2b2b2b;
    padding: 40rpx 0;
  }
  button {
    align-items: center;
    justify-content: center;
    background-color: #2ac6f7;
    width: 80%;
    height: 80rpx;
    border-radius: 50rpx;
    box-shadow: 0 3px 10px #ddd;
    image {
      width: 60rpx;
      height: 60rpx;
    }
    text {
      font-size: 32rpx;
      color: #eee;
      margin-left: 20rpx;
    }

    &:active {
      background-color: #00b2ee;
    }
  }
}
</style>

