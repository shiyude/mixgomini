<template>
  <div class="accountset_wrapper">
    <div class="account_section" v-if="isShowAccount">
      <div class="title">
        <text>{{language.setup.personalData}}</text>
      </div>
      <div class="set flex">
        <text>{{language.setup.headPortrait}}</text>
        <div class="set_right flex">
          <image :src="storageUserInfo.logo?hostUrl+storageUserInfo.logo:'/static/images/index/user.png'" mode="widthFix" class="user_photo" />
        </div>
      </div>
      <div class="set flex">
        <text>{{language.setup.nickname}}</text>
        <div class="set_right flex">
          <block v-if="storageUserInfo.customerName">
            <text>{{storageUserInfo.customerName}}</text>
          </block>
          <block v-else>
            <text>{{language.setup.notSet}}</text>
          </block>
        </div>
      </div>
      <div class="set flex">
        <text>{{language.setup.personalizedSignature}}</text>
        <div class="set_right flex">
          <block v-if="storageUserInfo.label">
            <text>{{storageUserInfo.label}}</text>
          </block>
          <block v-else>
            <text>{{language.setup.notSet}}</text>
          </block>
        </div>
      </div>
      <div class="set flex">
        <text>{{language.setup.sex}}</text>
        <div class="set_right flex">
          <block v-if="storageUserInfo.sex == -1">
            <text>{{language.setup.notSet}}</text>
          </block>
          <block v-else-if="storageUserInfo.sex == 0">
            <text>{{language.setup.boy}}</text>
          </block>
          <block v-else>
            <text>{{language.setup.girl}}</text>
          </block>
        </div>
      </div>
      <div class="set flex">
        <text>{{language.setup.birthday}}</text>
        <div class="set_right flex">
          <block v-if="storageUserInfo.birth">
            <text>{{storageUserInfo.birth}}</text>
          </block>
          <block v-else>
            <text>{{language.setup.notSet}}</text>
          </block>
        </div>
      </div>
      <div class="set flex">
        <text>{{language.setup.profession}}</text>
        <div class="set_right flex">
          <block v-if="storageUserInfo.occupation">
            <text>{{storageUserInfo.occupation}}</text>
          </block>
          <block v-else>
            <text>{{language.setup.notSet}}</text>
          </block>
        </div>
      </div>
    </div>
    <div class="set_section" v-if="isShowSet">
      <navigator url="../setlang/main" class=" set setup_item flex" hover-class="none">
        <text>{{language.setup.language}}</text>
        <div class="set_right flex">
          <text>{{langType=='zh-CN'?language.setup.chinese:language.setup.english}}</text>
          <image src="/static/images/icon/point_right.png" mode="widthFix" />
        </div>
      </navigator>
      <div class=" set setup_item flex" @click="toRegister">
        <text>{{language.setup.accountSecurity}}</text>
        <div class="set_right flex">
          <image src="/static/images/icon/point_right.png" mode="widthFix" />
        </div>
      </div>
      <navigator url="../mixgo/main?type=1" class=" set setup_item flex" hover-class="none">
        <text>{{language.setup.aboutUs}}</text>
        <div class="set_right flex">
          <image src="/static/images/icon/point_right.png" mode="widthFix" />
        </div>
      </navigator>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      isShowSet: false,
      isShowAccount: false
    };
  },
  onLoad() {
    this.isShowSet = false;
    this.isShowAccount = false;
  },
  mounted() {
    let type = this.$root.$mp.query.type; //type为1表示设置 type为2表示账户设置
    if (type == 1) {
      this.isShowSet = true;
    } else {
      this.isShowAccount = true;
    }
  },
  onShow() {
    let type = this.$root.$mp.query.type;
    this.initPageLang(type);
  },
  computed: {
    ...mapState(["language", "langType", "storageUserInfo"])
  },
  methods: {
    initPageLang(type) {
      if (type == 1) {
        this.$setTitle(this.language.title.set);
      } else {
        this.$setTitle(this.language.title.accountSetting);
      }
    },
    toRegister() {
      if (this.$judgeToken()) {
        wx.navigateTo({
          url: `../../pages/register/main?phone=${
            this.storageUserInfo.phone
          }&type=2`
        });
      } else {
        return false;
      }
    }
  }
};
</script>
<style scoped lang=scss>
.accountset_wrapper {
  .title {
    height: 100rpx;
    padding: 0 30rpx;
    font-size: 30rpx;
    background-color: #eeeded;
    line-height: 100rpx;
  }
  .set {
    margin-left: 30rpx;
    height: 100rpx;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #eeeded;
    text {
      font-size: 30rpx;
      color: #2b2b2b;
    }
    .set_right {
      align-items: center;
      padding-right: 30rpx;
      image {
        width: 10rpx;
        margin-left: 10rpx;
        &.user_photo {
          width: 70rpx;
          border-radius: 50%;
        }
      }
    }
  }
  .setup_item {
    margin: 0 30rpx;
  }
}
</style>

