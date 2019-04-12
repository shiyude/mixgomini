<template>
  <div class="login_wrapper">
    <div class="login_verify login_section flex">
      <input type="number" v-model="phone" :placeholder="language.login.phone" :placeholder-style="style">
    </div>
    <div class="login_verify login_section flex">
      <input type="text" v-model="password" :password="true" :placeholder="language.login.password" :placeholder-style="style">
    </div>
    <div class="register flex">
      <text @click="toRegister(1)">{{language.login.sign}}</text>
      <text @click="toRegister(3)">{{language.login.forgetPassword}}</text>
    </div>
    <div class="btn_div">
      <text @click="verification">{{language.login.login}}</text>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      style: "font-size:24rpx;",
      phone: "",
      password: ""
    };
  },
  onLoad() {
    this.phone = "";
    this.password = "";
    this.$setTitle(this.language.title.login);
  },
  mounted() {
    let phone = this.$root.$mp.query.phone;
    this.phone = phone;
  },
  computed: {
    ...mapState(["language"])
  },
  methods: {
    ...mapMutations(["changeStorageUserInfo"]),
    //登入
    login() {
      let _this = this;
      let password = this.$encodeMd5(this.password);
      this.$axios({
        method: "post",
        url: _this.$api.login,
        params: { phone: _this.phone, password: password }
      }).then(res => {
        if (res) {
          if (res.code != 0) {
            wx.showToast({
              title: res.msg,
              icon: "none",
              duration: 1500,
              mask: true
            });
            return;
          }
          wx.setStorageSync("token", res.datas.token);
          wx.setStorageSync("userInfo", res.datas);
          this.changeStorageUserInfo(res.datas);
          wx.switchTab({
            url: "../../pages/user/main"
          });
        }
      });
    },
    verification() {
      if (!this.phone) {
        wx.showToast({
          title: this.language.alert.loginPhone,
          icon: "none",
          duration: 2000
        });
      } else if (!this.password) {
        wx.showToast({
          title: this.language.alert.loginPassword,
          icon: "none",
          duration: 2000
        });
      } else {
        this.login();
      }
    },
    toRegister(type) {
      if (type == 1) {//注册
        wx.redirectTo({
          url: `../../pages/register/main?type=${type}`
        });
      } else {
        wx.navigateTo({//忘记密码
          url: `../../pages/register/main?type=${type}`
        });
      }
    }
  }
};
</script>
<style scoped lang=scss>
.login_wrapper {
  .login_section {
    margin: 0 30rpx;
    height: 100rpx;
    border-bottom: 1px solid #f0f0f0;
    align-items: center;
    input {
      flex: 1;
      padding: 0 10rpx;
    }
  }
  .register {
    padding: 5rpx 30rpx 20rpx;
    justify-content: space-between;
    text {
      color: #2ac6f7;
      font-size: 24rpx;
    }
  }
  .wx_section {
    flex-direction: column;
    align-items: center;
    text {
      font-size: 24rpx;
      color: #2b2b2b;
      padding: 20rpx;
    }
    button {
      color: #eee;
      font-size: 32rpx;
      background-color: #2ac6f7;
      width: 80%;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 50rpx;
      box-shadow: 0 3px 10px #ddd;
      &:active {
        background-color: #00b2ee;
      }
    }
  }
}
</style>


