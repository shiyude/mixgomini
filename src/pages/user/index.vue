<template>
  <div class="user_wrapper wrapper background_f0f0f0">
    <div class="no_net" v-if="isNet">
      <no-net :refresh-fun="refreshFun"></no-net>
    </div>
    <div class="has_net" v-else>
      <div class="top_section">
        <div class="head flex" @click="headTo">
          <div class="user_left flex">
            <div class="user_image_div">
              <image :src="storageUserInfo.logo?hostUrl+storageUserInfo.logo:'/static/images/index/user.png'" class="user_image" />
            </div>
            <div class="user_message flex" v-if="storageUserInfo">
              <text class="num">{{language.user.accountNumber}}：{{storageUserInfo.phone}}</text>
              <text class="name">{{language.user.nickName}}：{{!storageUserInfo.customerName?"":storageUserInfo.customerName}}</text>
            </div>
            <div class="login_register" v-else>
              <text>{{language.user.loginRegister}}</text>
            </div>
          </div>
          <image src="/static/images/icon/point_right_white.png" class="pointer" />
        </div>
        <div class="user_nav flex background_fff ">
          <div class="inline_flex" @click="toCollection">
            <image src="/static/images/index/shouchang.png" />
            <text class="shouchang">{{language.user.collection}}</text>
          </div>
          <navigator url='../collection/main?type=2' class="inline_flex" hover-class="none">
            <image src="/static/images/index/zuji.png" />
            <text class="zuji">{{language.user.footprint}}</text>
          </navigator>
          <navigator url="../mixgo/main?type=1" class="inline_flex" hover-class="none">
            <image src="/static/images/index/mixgo.png" />
            <text class="mixgo">{{language.user.mixgo}}</text>
          </navigator>
          <navigator url="../accountset/main?type=1" class="inline_flex" hover-class="none">
            <image src="/static/images/index/shezhi.png" />
            <text class="shezhi">{{language.user.setUp}}</text>
          </navigator>
        </div>
      </div>
      <scroll-view class="command" scroll-y @scrolltolower="scrolltolower" @scroll="scroll" :upper-threshold="100">
        <div class="title background_fff">
          <text>--{{language.user.recommended}}--</text>
        </div>
        <list-component :goods-list="goodsList" :is-loading="isLoading" :is-transparent="isTransparent"></list-component>
      </scroll-view>
    </div>
  </div>
</template>
<script>
import listComponent from "@/components/listComponent";
import noNet from "@/components/404";
import { mapState } from "vuex";
export default {
  components: {
    listComponent,
    noNet
  },
  data() {
    return {
      goodsList: undefined,
      page: 1,
      isLoading: true, //loading加载
      isTransparent: true, //loading隐藏
      isBottom: false,
      isNet: false,
      isChangeLang: false,
      isChangeCountry: false,
      hostUrl: ""
    };
  },
  computed: {
    ...mapState([
      "language",
      "langType",
      "storageUserInfo",
      "initCountry"
    ])
  },
  watch: {
    langType() {
      this.isChangeLang = true;
    },
    initCountry() {
      this.isChangeCountry = true;
    }
  },
  onLoad() {
    this.hostUrl = wx.getStorageSync("img_url");
    if (!this.isChangeLang && !this.isChangeCountry) {
      //当城市状态和切换语言都不存在时加载，存在时监听
      this.getRecbest();
    }
  },
  onShow() {
    if (this.isChangeLang || this.isChangeCountry) {
      console.log("主页onShow请求");
      //当语言和城市名切换时重新加载数据
      this.page = 1; //当语言切换时将page置为1
      this.isBottom = false;
      this.isLoading = true;
      this.isTransparent = true;
      this.getRecbest();
    }
    this.initPageLang();
  },
  methods: {
    scrolltolower() {
      if (this.isBottom) {
        this.isTransparent = false;
        this.isBottom = false; //防止用户上拉加载频繁
        this.page++;
        this.$axios({
          url: this.$api.newlist,
          params: { type: 3, pageNo: this.page, pageSize: 8 },
          loading: false
        })
          .then(res => {
            if (res.datas.lists.length < 8) {
              this.isBottom = false;
              this.isLoading = false;
            } else {
              this.isBottom = true;
            }
            this.isTransparent = true;
            this.goodsList = this.goodsList.concat(res.datas.lists);
          })
          .catch(err => {
            this.isTransparent = true;
            this.isBottom = true;
          });
      } else {
        console.log("到底啦");
        return false;
      }
    },
    //页面初始化
    initPageLang() {
      this.$setTitle(this.language.title.user);
      this.$setTabBar(
        this.language.tab.home,
        this.language.tab.find,
        this.language.tab.user
      );
    },
    //精品推荐
    getRecbest() {
      let _this = this;
      this.isNet = false;
      this.goodsList = undefined;
      let timer = setTimeout(() => {
        if (!this.goodsList) {
          this.isNet = true;
        }
      }, 11000);
      this.$axios({
        url: this.$api.newlist,
        params: { type: 3, pageNo: 1, pageSize: 8 }
      })
        .then(res => {
          this.goodsList = res.datas.lists;
          if (res.datas.lists.length < 8) {
            this.isBottom = false;
            this.isLoading = false;
          } else {
            this.isBottom = true;
          }
        })
        .catch(() => {
          clearTimeout(timer);
          wx.hideToast();
          this.isNet = true;
        });
    },
    toCollection() {
      if (this.$judgeToken()) {
        wx.navigateTo({
          url: "../../pages/collection/main?type=1"
        });
      } else {
        return false;
      }
    },
    headTo() {
      if (this.storageUserInfo) {
        //存在跳转到账户设置
        wx.navigateTo({
          url: "../accountset/main?type=2"
        });
      } else {
        //不存在跳转到登入
        wx.navigateTo({
          url: "../commandwx/main"
        });
      }
    },
    refreshFun() {
      let _this = this;
      this.$refreshFun({
        callback: function() {
          _this.getRecbest();
          _this.page = 1;
        }
      });
    }
  },
  onHide() {
    this.isChangeLang = false;
    this.isChangeCountry = false;
  }
};
</script>
<style scoped lang=scss>
@import "./index.scss";
</style>
