<template>
  <div class="find_wrapper wrapper background_fff">
    <div class="no_net" v-if="isNet">
      <no-net :refresh-fun="refreshFun"></no-net>
    </div>
    <div class="has_net" v-else>
      <div class="find_head" v-if="isShowTab">
        <div :class="{'active':categories == 'album'}" @click="changeList('album')">{{language.album}}</div>
        <div :class="{'active':categories == 'design'}" @click="changeList('design')">{{language.designer}}</div>
      </div>
      <scroll-view scroll-y :class="{'find_content_absolute':isShowTab}">
        <block v-for="(v,k) in categoryDatas" :key="k" v-if="categoryDatas&&categoryDatas.length">
          <div class="detail">
            <div class="detail_div view_shadow flex">
              <image :src="hostUrl+v.logo" @click="toBanner(v.id,k)" />
              <text class="desc">{{v.title}}</text>
              <text class="time">{{v.createTime}}</text>
              <div class="heart_eyes flex">
                <div class="heart inline_flex">
                  <image src="/static/images/icon/heart.png" @click="onPraise(v)" />
                  <text>{{v.likeNum}}</text>
                </div>
                <div class="eyes inline_flex">
                  <image src="/static/images/icon/eye.png" mode="widthFix" />
                  <text>{{v.viewNum}}</text>
                </div>
              </div>
            </div>
          </div>
        </block>
        <block v-if="categoryDatas&&!categoryDatas.length">
          <div class="nodata flex">
            <text>{{language.goodsList.noData}}</text>
          </div>
        </block>
      </scroll-view>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import noNet from "@/components/404";
export default {
  components: {
    noNet
  },
  data() {
    return {
      isNet: false,
      isChangeLang: false,
      isChangeCountry: false,
      findAlbumData: [],
      findDesignerData: [],
      categoryDatas: undefined,
      isShowTab: false,
      hostUrl: "",
      categories: "album"
    };
  },
  onLoad() {
    this.hostUrl = wx.getStorageSync("img_url");
    if (!this.isChangeLang && !this.isChangeCountry) {
      //当城市状态和切换语言都不存在时加载，存在时监听
      this.getDiscvlist();
    }
  },
  onShow() {
    if (this.isChangeLang || this.isChangeCountry) {
      //当语言和城市名切换时重新加载数据
      console.log("主页onShow请求");
      this.getDiscvlist();
    }
    this.initPageLang();
  },
  computed: {
    ...mapState(["langType", "initCountry", "language"])
  },
  watch: {
    langType() {
      this.isChangeLang = true;
    },
    initCountry() {
      this.isChangeCountry = true;
    }
  },
  methods: {
    initPageLang() {
      this.$setTitle(this.language.title.find);
    },
    getDiscvlist() {
      this.categoryDatas = undefined;
      this.isShowTab = false;
      this.isNet = false;
      let timer = setTimeout(() => {
        if (!this.categoryDatas) {
          this.isNet = true;
        }
      }, 11000);
      this.$axios({
        url: this.$api.queryDiscoveryList,
        params: { pageNo: 1, pageSize: 10000, type: 0 }
      })
        .then(res => {
          this.findAlbumData = res.datas.lists;
          this.changeDate(this.findAlbumData);
          this.getFindDesigner();
        })
        .catch(err => {
          clearTimeout(timer);
          wx.hideToast();
          this.isNet = true;
        });
    },
    getFindDesigner() {
      this.$axios({
        url: this.$api.queryDiscoveryList,
        params: { pageNo: 1, pageSize: 10000, type: 1 },
        loading: false
      }).then(res => {
        this.findDesignerData = res.datas.lists;
        this.changeDate(this.findDesignerData);
        if (!this.findAlbumData.length && !this.findDesignerData.length) {
          this.categoryDatas = [];
        } else if (!this.findAlbumData.length && this.findDesignerData.length) {
          this.categoryDatas = this.findDesignerData;
        } else if (this.findAlbumData.length && !this.findDesignerData.length) {
          this.categoryDatas = this.findAlbumData;
        } else {
          this.categoryDatas = this.findAlbumData;
          this.isShowTab = true;
        }
      });
    },
    changeDate(arr) {
      if (!arr.length) {
        return;
      } else {
        for (let i = 0; i < arr.length; i++) {
          arr[i].createTime = this.$dateFormat(arr[i].createTime);
        }
      }
    },
    changeList(type) {
      if (type == "album") {
        this.categories = "album";
        this.categoryDatas = this.findAlbumData;
      } else {
        this.categories = "design";
        this.categoryDatas = this.findDesignerData;
      }
    },
    toBanner(id, num) {
      wx.navigateTo({
        url: `../../pages/banner/main?id=${id}`
      });
      this.categoryDatas[num].viewNum =
        parseInt(this.categoryDatas[num].viewNum) + 1;
    },
    //点赞
    onPraise(v) {
      console.log(v);
      let seft = this;
      if (seft.$judgeToken()) {
        if (v.islike == 1) {
          //已经点过
          wx.showToast({
            title: seft.language.alert.praised,
            icon: "none",
            duration: 2000
          });
        } else {
          seft
            .$axios({
              url: seft.$api.addDiscoveryLike,
              params: {
                discoveryId: v.id
              },
              loading: false
            })
            .then(res => {
              if (res) {
                v.likeNum = parseInt(v.likeNum) + 1;
                v.islike = 1;
                wx.showToast({
                  title: seft.language.alert.praise,
                  icon: "none",
                  duration: 2000
                });
              }
            });
        }
      }
    },
    refreshFun() {
      let _this = this;
      this.$refreshFun({
        callback: function() {
          _this.getDiscvlist();
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
