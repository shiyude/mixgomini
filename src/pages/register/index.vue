<template>
  <div class="register_wrapper">
    <div class="register_num flex register_section">
      <input type="number" v-model.trim="phone" :placeholder="language.register.phone" :placeholder-style="style">
      <text @click="getCode" v-if="!isTime">{{language.register.immediatelyVerify}}</text>
      <text class="time" v-if="isTime">{{time}}s</text>
    </div>
    <div class="register_verify register_section flex">
      <input type="text" v-model.trim="code" :placeholder="language.register.pleaseEnter" :placeholder-style="style">
    </div>
    <div class="register_verify register_section flex">
      <input type="text" v-model.trim="password1" :password="true" :placeholder="type==1?language.register.password:language.changePassword.inputPassword" :placeholder-style="style">
    </div>
    <div class="register_verify register_section flex">
      <input type="text" v-model.trim="password2" :password="true" :placeholder="language.register.confirmPassword" :placeholder-style="style">
    </div>
    <div class="login_section flex" v-if="type==1">
      <text>{{language.register.hasAccount}}</text>
      <text @click="toLogin">{{language.register.login}}</text>
    </div>
    <div class="password_command ">
      <text>*{{language.changePassword.PasswordPrompt}}</text>
    </div>
    <div class="btn_div">
      <text @click="verification" v-if="type==1">{{language.register.registered}}</text>
      <text @click="verification" v-if="type==2">{{language.changePassword.updateAcknowledge}}</text>
      <text @click="verification" v-if="type==3">{{language.retrievePassword.done}}</text>
    </div>
  </div>
</template>
<script>
//type为1表示注册，type为2表示修改密码，type为3表示忘记密码
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      style: "font-size:24rpx;",
      isTime: false,
      time: 60,
      phone: "",
      code: "",
      password1: "",
      password2: "",
      type: "",
      timer: null
    };
  },
  onLoad() {
    this.isTime = false;
    this.phone = "";
    this.code = "";
    this.type = "";
    this.password1 = "";
    this.password2 = "";
    this.$setTitle(this.language.title.registered);
  },
  mounted() {
     let _this = this;
    this.time = 60;
    if (this.timer !== null) {
      //单页应用定时器需要手动清除
      clearInterval(_this.timer);
    }
    let phone = this.$root.$mp.query.phone;
    let type = this.$root.$mp.query.type;
    this.phone = phone;
    this.type = type;
    this.initPageLang(type);
  },
  computed: {
    ...mapState(["language"])
  },
  methods: {
    ...mapMutations(["changeStorageUserInfo"]),
    timeReduce() {
      let _this = this;
      this.isTime = true;
      this.timer = setInterval(() => {
        if (_this.time == 0) {
          this.isTime = false;
          this.time = 60;
          clearInterval(_this.timer);
        } else {
          _this.time--;
        }
      }, 1000);
    },
    //获取验证码
    getCode() {
      let _this = this;
      if (!this.phone) {
        return;
      }
      let token = wx.getStorageSync("token") || "";
      let axiosParams = {
        phone: _this.phone
      };
      if (_this.type == 1) {
        axiosParams.sendType = "sms_reg";
        axiosParams.smsSign = this.$md5(
          _this.phone + "sms_reg" + "f8cdd89fc07211e88da4001e67785195"
        );
      } else {
        axiosParams.sendType = "sms_findpass";
        axiosParams.smsSign = this.$md5(
          _this.phone + "sms_findpass" + "f8cdd89fc07211e88da4001e67785195"
        );
      }
      this.$axios({
        url: this.$api.sendCode,
        params: axiosParams,
        loading: false
      }).then(res => {
        if (res) {
          if (res.code == 0) {
            wx.showToast({
              title: _this.language.alert.verificationCode,
              icon: "none",
              duration: 2000,
              mask: true
            });
            _this.timeReduce();
          } else {
            wx.showToast({
              title: res.msg,
              icon: "none",
              duration: 2000,
              mask: true
            });
          }
        }
      });
    },
    //注册
    register(code) {
      let _this = this;
      let password = this.$encodeMd5(this.password1);
      let axiosParams = {
        phone: _this.phone,
        validateCode: code,
        password: password
      };
      let url = "";
      if (this.type == 1) {
        //注册
        url = _this.$api.register;
        axiosParams.source = "weixin";
      } else {
        //修改密码
        url = _this.$api.modifyPassword;
        axiosParams.sendType = "sms_findpass";
      }
      this.$axios({
        method: "post",
        url: url,
        params: axiosParams
      }).then(res => {
        let title = "";
        let callback = null;
        if (res) {
          if (res.code == 0) {
            if (_this.type == 1) {
              //表示注册
              title = _this.language.alert.loginSuccess;
              callback = function() {
                wx.redirectTo({
                  url: `../../pages/login/main?phone=${_this.phone}`
                });
              };
            } else {
              title = _this.language.alert.passwordChanged;
              //修改密码 清空token和用户信息重新登入
              wx.removeStorageSync("userInfo");
              wx.removeStorageSync("token");
              this.changeStorageUserInfo(0); //账号异地登入时置空，会刷新首屏接口，所以这里修改完密码后变为0，防止冲突
              callback = function() {
                wx.redirectTo({
                  url: `../../pages/login/main?phone=${_this.phone}`
                });
              };
            }
            wx.showToast({
              title: title,
              icon: "none",
              duration: 2000,
              mask: true,
              success: function() {
                setTimeout(() => {
                  callback();
                }, 1000);
              }
            });
          } else {
            wx.showToast({
              title: res.msg,
              icon: "none",
              duration: 2000,
              mask: true
            });
          }
        }
      });
    },
    verification() {
      let regPassword = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/; //正则匹配密码
      console.log(this.code);
      console.log(regPassword.test(this.password1));
      if (!this.phone) {
        wx.showToast({
          title: this.language.alert.phone,
          icon: "none",
          duration: 2000,
          mask: true
        });
      } else if (!regPassword.test(this.password1)) {
        wx.showToast({
          title: this.language.alert.password,
          icon: "none",
          duration: 2000,
          mask: true
        });
      } else if (this.password1 !== this.password2) {
        wx.showToast({
          title: this.language.alert.comparePass,
          icon: "none",
          duration: 2000,
          mask: true
        });
      } else {
        if (!this.code) {
          wx.showToast({
            title: this.language.alert.code,
            icon: "none",
            duration: 2000,
            mask: true
          });
        } else {
          this.register(this.code);
        }
      }
    },
    toLogin() {
      wx.redirectTo({
        url: "../../pages/login/main"
      });
    },
    initPageLang(type) {
      if (type == 1) {
        this.$setTitle(this.language.title.registered);
      } else if (type == 2) {
        this.$setTitle(this.language.title.changePassword);
      } else {
        this.$setTitle(this.language.title.retrievePassword);
      }
    }
  }
};
</script>
<style scoped lang=scss>
.register_wrapper {
  .register_section {
    margin: 0 30rpx;
    height: 100rpx;
    border-bottom: 1px solid #f0f0f0;
    align-items: center;
    input {
      flex: 1;
      padding: 0 10rpx;
    }
    &.register_num {
      text {
        display: inline-block;
        width: 250rpx;
        text-align: center;
        font-size: 28rpx;
        color: #6a6a6a;
      }
    }
  }
  .login_section {
    padding: 5rpx 30rpx 20rpx;
    justify-content: flex-end;
    text {
      font-size: 24rpx;
      color: #6a6a6a;
      &:last-child {
        color: #2ac6f7;
      }
    }
  }
  .password_command {
    padding: 5rpx 30rpx 20rpx;
    text {
      font-size: 24rpx;
      color: #6a6a6a;
      word-break: break-all;
    }
  }
}
</style>