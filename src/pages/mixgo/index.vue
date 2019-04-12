<template>
  <div class="mixgo_wrapper  wrapper">
    <div class="mixgo_intro" v-if="isCompany">
      <image src="/static/images/index/company.png" class="company" />
      <div class="compony_intr">
        <text>{{companyData.description}}</text>
      </div>
      <div class="compony_des">
        <div class="des_item flex">
          <image src="/static/images/icon/company_user.png" />
          <text>{{companyData.contactName}}</text>
        </div>
        <div class="des_item flex">
          <image src="/static/images/icon/company_phone.png" />
          <text>{{companyData.contactPhone}}</text>
        </div>
        <div class="des_item flex">
          <image src="/static/images/icon/company_email.png" />
          <text>{{companyData.contactEmail}}</text>
        </div>
        <div class="des_item flex">
          <image src="/static/images/icon/company_position.png" />
          <text>{{companyData.contactAddr}}</text>
        </div>
      </div>
      <div class="btn_div">
        <text @click="callPhone">{{language.mixgo.contactUs}}</text>
      </div>
    </div>
    <div class="goods_ewm flex" v-if="isEwm">
      <image :src="ewm[0]" class="ewm" mode="widthFix" @click="longtapImg" />
      <text>{{language.mixgo.ewm}}</text>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      isCompany: false,
      isEwm: false,
      ewm: ["https://www.mymixgo.com/public/dist/uploads/app_ewm.png"],
      companyData: {},
      hostUrl: ""
    };
  },
  onLoad() {
    this.hostUrl = wx.getStorageSync("img_url");
    this.isCompany = false;
    this.isEwm = false;
    this.companyData = {};
  },
  mounted() {
    let type = this.$root.$mp.query.type;
    if (type == 1) {
      this.isCompany = true;
      this.getCompanyData();
    } else {
      this.isEwm = true;
    }
  },
  computed: {
    ...mapState(["language"])
  },
  methods: {
    callPhone() {
      if (this.companyData.contactPhone) {
        wx.makePhoneCall({
          phoneNumber: this.companyData.contactPhone
        });
      } else {
        return;
      }
    },
    longtapImg() {
      wx.previewImage({
        urls: this.ewm
      });
    },
    getCompanyData() {
      this.$axios({
        url: this.$api.queryCompany
      }).then(res => {
        if (res) {
          this.companyData = res.datas;
          if (res.datas.companyName) {
            this.$setTitle(res.datas.companyName);
          }
        }
      });
    }
  }
};
</script>
<style lang=scss scoped>
.mixgo_wrapper {
  position: relative;
  .mixgo_intro {
    .company {
      width: 100%;
      height: 380rpx;
    }
    .compony_intr {
      padding: 30rpx;
      text {
        font-size: 24rpx;
        color: #000;
      }
    }
    .compony_des {
      .des_item {
        align-items: center;
        padding: 10rpx 30rpx;
        image {
          height: 44rpx;
          width: 44rpx;
        }
        text {
          margin-left: 20rpx;
          font-size: 24rpx;
          color: #2b2b2b;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
    .btn_div {
      margin-top: 20rpx;
      text {
        height: 60rpx;
        line-height: 60rpx;
        border-radius: 50rpx;
        font-size: 24rpx;
      }
    }
  }
  .goods_ewm {
    position: absolute;
    left: 0;
    right: 0;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    top: 50%;
    transform: translateY(-50%);
    .ewm {
      width: 70%;
    }
    text {
      display: inline-block;
      width: 70%;
      font-size: 28rpx;
      margin-top: 20rpx;
      word-break: break-all;
      text-align: center;
    }
  }
}
</style>


