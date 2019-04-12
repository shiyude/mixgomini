<template>
  <div class="good_detail_wrapper">
    <div class="good_banner">
      <image src="/static/images/icon/show.png" class="d_show" @click="toMixgo" />
      <swiper class="banner_swiper" :style='{height:Height}' :autoplay="true">
        <block v-for="(v,k) in goodInfo.imgs" :key="k">
          <swiper-item>
            <image :src="v" style="width:100%" @load="imgLoad" mode="widthFix" />
          </swiper-item>
        </block>
      </swiper>
    </div>
    <div class="good_desc">
      <div class="good_name flex">
        <text>{{goodInfo.goodsName}}</text>
        <image src="/static/images/icon/collection.png" @click="addEnshrine" v-if='!isCollected' />
        <image src="/static/images/icon/collection_active.png" @click="addEnshrine" v-else/>
      </div>
      <div class="desc">
        <div class="flex">
          <div>{{language.goodDetail.code}}{{goodInfo.goodsSerial}}</div>
        </div>
        <div class="flex">
          <div>{{language.goodDetail.origin}}{{goodInfo.origin}}</div>
        </div>
        <div class="flex">
          <div>{{language.goodDetail.num}}{{goodInfo.goodsCode}}</div>
        </div>
        <div class="flex">
          <div>{{language.goodDetail.brand}}{{goodInfo.brandName}}</div>
        </div>
        <div class="flex">
          <div>{{language.goodDetail.size}}{{goodInfo.goodsSize}}</div>
        </div>
        <div class="flex">
          <div>
            {{language.goodDetail.website}}
            <text class="text_overflow">{{goodInfo.website}}</text>
          </div>
        </div>
      </div>
    </div>
    <div class="store">
      <!-- <image src="http://oureboxyv.bkt.clouddn.com/store.jpg" /> -->
      <!-- <image :src="goodInfo.brandbanner"/> -->
    </div>
    <div class="nav flex">
      <div class=" flex" :class="isShowImages?'active':''" @click="isShowImages=true">
        <text>{{language.goodDetail.commodityDetails}}</text>
      </div>
      <div class="flex" :class="!isShowImages?'active':''" @click="isShowImages=false">
        <text>{{language.goodDetail.ParameterSpecification}}</text>
      </div>
    </div>
    <div class="good_info">
      <div class="good_images" v-if="isShowImages">
        <block v-for="(v,k) in goodInfo.detail" :key="k">
          <image :src="v" mode="widthFix" />
        </block>
      </div>
      <div class="good_table" v-else>
        <block v-for="(v,k) in goodItems" :key="k">
          <div class="tr flex">
            <div class="td td_left ">
              <text class="text_overflow">{{v.propertyName}}</text>
            </div>
            <div class="td td_right ">
              <text class="text_overflow">{{v.propertyValue}}</text>
            </div>
          </div>
        </block>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      goodInfo: {},
      isShowImages: true,
      Height: "", //这是swiper要动态设置的高度属性
      goodItems: [],
      isCollected: false,
      id: "",
      hostUrl: ""
    };
  },
  onLoad(options) {
    this.goodInfo = {};
    this.isShowImages = true;
    this.goodItems = [];
    this.isCollected = false;
    this.id = "";
  },
  mounted() {
    let id =
      this.$root.$mp.query.id !== undefined
        ? this.$root.$mp.query.id
        : decodeURIComponent(this.$root.$mp.query.scene);
    console.log(this.$root.$mp.query);
    this.id = id;
    if (wx.getStorageSync("img_url")) {
      this.hostUrl = wx.getStorageSync("img_url");
      this.getDetail(id);
      this.Gitenshrine(id);
    } else {
      this.$axios({
        url: this.$api.querySysConfig,
        loading: false
      }).then(res => {
        this.hostUrl = res.datas[0].value;
        wx.setStorageSync("img_url", res.datas[0].value);
        this.getDetail(id);
        this.Gitenshrine(id);
      });
    }
  },
  computed: {
    ...mapState(["language"])
  },
  methods: {
    imgLoad(e) {
      this.Height = this.$imageLoad(e);
    },
    getDetail(id) {
      let seft = this;
      seft
        .$axios({
          url: seft.$api.queryGoodsById,
          params: {
            goodsId: id
          }
        })
        .then(res => {
          let imgs = res.datas.goodsmap.imgs;
          let details = res.datas.goodsmap.detail;
          seft.goodInfo = res.datas.goodsmap;
          seft.goodItems = res.datas.properties;
          seft.goodInfo.imgs = imgs ? imgs.split(",") : [];
          seft.goodInfo.detail = details ? details.split(",") : [];
          seft.addHostUrl(seft.goodInfo.imgs);
          seft.addHostUrl(seft.goodInfo.detail);

          if (seft.goodInfo.goodsName) {
            seft.$setTitle(seft.goodInfo.goodsName);
          } else {
            seft.$setTitle(seft.language.title.goodDetail);
          }
          //缓存数据
          seft.footprint(seft.goodInfo);
        });
    },
    addHostUrl(arr) {
      if (!arr.length) {
        return;
      } else {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = this.hostUrl + arr[i];
        }
      }
    },
    Gitenshrine(id) {
      // 获取是否收藏
      let seft = this;
      if (wx.getStorageSync("token")) {
        seft
          .$axios({
            url: seft.$api.isFavoriteGoods,
            params: {
              goodsId: id
            },
            loading: false
          })
          .then(res => {
            if (res.datas.num < 1) {
              seft.isCollected = false;
            } else {
              seft.isCollected = true;
            }
          });
      }
    },
    addEnshrine() {
      //添加收藏
      let seft = this;
      if (seft.$judgeToken()) {
        if (seft.isCollected) {
          //已收藏
          seft
            .$axios({
              url: seft.$api.deleteGoodsFavorite,
              params: {
                goodsId: seft.id
              },
              loading: false
            })
            .then(res => {
              if (res) {
                wx.showToast({
                  title: seft.language.alert.cancelCollected,
                  icon: "none",
                  duration: 2000
                });
                seft.isCollected = false;
              }
            });
        } else {
          seft
            .$axios({
              url: seft.$api.addGoodsFavorite,
              params: {
                goodsId: seft.id
              },
              loading: false
            })
            .then(res => {
              if (res) {
                wx.showToast({
                  title: seft.language.alert.collected,
                  icon: "none",
                  duration: 2000
                });
                seft.isCollected = true;
              }
            });
        }
      }
    },
    //用户进入商品详情页面时的足迹
    footprint(data) {
      let footprintSession = wx.getStorageSync("footprint");
      let footprintArr = [];
      if (!footprintSession) {
        footprintArr.push(data);
        wx.setStorageSync("footprint", footprintArr);
      } else {
        for (let i = 0; i < footprintSession.length; i++) {
          if (data.id == footprintSession[i].id) {
            footprintSession.splice(i, 1);
            break;
          }
        }
        if (footprintSession.length > 50) {
          footprintSession.splice(0, 1);
        }
        footprintSession.push(data);
        wx.setStorageSync("footprint", footprintSession);
      }
    },
    toMixgo() {
      wx.navigateTo({
        url: `../../pages/mixgo/main?type=2`
      });
    }
  },
  onShareAppMessage() {
    return {
      title: this.goodInfo.goodsName || this.language.title.goodDetail
    };
  }
};
</script>
<style scoped lang=scss>
@import "./index.scss";
</style>

