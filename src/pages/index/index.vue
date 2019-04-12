<template>
  <div class="index_wrapper wrapper">
    <!-- 切换国家 -->
    <div class="switch_country" v-if="isShowSwitchCountry&&countrys&&countrys.length>1">
      <div class="flex" v-for="item in countrys" @click="selectCountry(item.countryName)" :key="item">
        <text :class="country == item.countryName?'active':''">{{item.countryName}}</text>
        <image :src="country == item.countryName?'/static/images/icon/radio_active.png':'/static/images/icon/radio.png'" />
      </div>
    </div>
    <!-- 切换国家 -->
    <!-- 无网络的情况 -->
    <div class="no_net" v-if="isNet">
      <no-net :refresh-fun="refreshFun"></no-net>
    </div>
    <!-- 无网络的情况 -->
    <div class="has_net" v-else>
      <!-- 二维码显示 -->
      <div class="app_ewm_wrapper" v-if="isApp">
        <div class="app_ewm flex">
          <image :src="ewm[0]" class="ewm" @click="longtapImg" />
          <image src="/static/images/icon/cancel_ewm.png" class="cancel_ewm" @click="cancelApp" />
          <text>{{language.alert.ewm}}</text>
        </div>
      </div>
      <!-- 二维码显示 -->
      <!-- 小的二维码 -->
      <image src="/static/images/index/mini_ewm.png" class="ewm_mini" v-if="!isApp" @click="openApp" />
      <!-- 小的二维码 -->
      <div class="head flex background_fff">
        <!-- <navigator url="../city/main" class="position flex" hover-class="none">
          <image class="icon" src="/static/images/icon/position_white.png"  mode="widthFix"/>
          <text class="text_overflow">{{city}}</text>
        </navigator> -->
        <div class="position flex" @click="switchCountry">
          <image class="icon" src="/static/images/icon/earth.png" />
          <text>{{country}}</text>
        </div>
        <navigator url="../keysearch/main" class="search flex" hover-class="none">
          <icon type="search" size="15" />
          <text>{{language.home.search}}</text>
        </navigator>
      </div>
      <scroll-view class="bottom_section background_f0f0f0" scroll-y>
        <div class="banner background_fff" v-if="swiperArr&&swiperArr.length">
          <swiper class="banner_swiper" style='height:230px' :autoplay="true" :indicator-dots="true" :indicator-color="'rgb(225,225,225)'" :indicator-active-color="'#2ac6f7'">
            <block v-for="(v,k) in swiperArr" :key="k">
              <swiper-item @click="toBanner(v.id)">
                <image :src="hostUrl+v.logo" style="width:100%;height:230px" @load="imgLoad" />
              </swiper-item>
            </block>
          </swiper>
        </div>
        <!-- <div class="classify  background_fff">
      <scroll-view scroll-x class="scroll border_bottom">
        <block v-for="(v,k) in classifyList" :key="k">
          <view class="view inline_flex" >
              <view class="view_view inline_flex view_shadow">
            <image :src="v.image" mode="widthFix"/>
            <text class="text_overflow">{{v.title}}</text>
        </view>
          </view>
        </block>
      </scroll-view>
     </div> -->
        <div class="store_entity  background_fff" v-if="storeList&&storeList.length">
          <div class="title flex">
            <div class="title_left">
              <text>{{language.home.storeEntity}}</text>
            </div>
            <div class="title_right flex" @click="toStore">
              <text>{{language.home.seeAll}}</text>
              <image class="pointer_right" src="/static/images/icon/point_right.png" />
            </div>
          </div>
          <div class="store_scroll ">
            <scroll-view scroll-x class="scroll border_bottom">
              <block v-for="(v,k) in storeList" :key="k">
                <view class="view inline_flex" @click="toStoreDetail(v.id)">
                  <image :src="hostUrl+v.imgs" />
                  <div class="address flex">
                    <image src="/static/images/icon/position.png" />
                    <text class="text_overflow">{{v.contactAddr}}</text>
                  </div>
                </view>
              </block>
            </scroll-view>
          </div>
        </div>
        <div class="today_choice  background_fff" v-if="choiceList&&choiceList.length">
          <div class="title flex">
            <div class="title_left">
              <text>{{language.home.todayNewSelection}}</text>
            </div>
            <div class="title_right flex" @click="toGoodsList(1)">
              <text>{{language.home.seeAll}}</text>
              <image class="pointer_right" src="/static/images/icon/point_right.png" />
            </div>
          </div>
          <div class="choice_scroll box_scroll">
            <scroll-view scroll-x class="scroll border_bottom">
              <block v-for="(v,k) in choiceList" :key="k">
                <view class="view inline_flex " @click="toGoodDetail(v.id)">
                  <view class="view_view inline_flex view_shadow">
                    <image :src="hostUrl+v.logo" />
                    <div class="image_title">
                      <text class="text_overflow">{{v.goodsName}}</text>
                      <div class="address_brand flex">
                        <text class="brand text_overflow">{{v.brandName}}</text>
                        <text class="address text_overflow">{{v.origin}}</text>
                      </div>
                    </div>
                    <div class="new_3d">
                      <text class="d_text" v-if="v.is3d == 0">AR</text>
                      <!-- <text class="new_text" v-if="v.is_New">NEW</text> -->
                    </div>
                  </view>
                </view>
              </block>
            </scroll-view>
          </div>
        </div>
        <!-- <div class="panoramic_collocation  background_fff">
          <div class="title flex">
            <div class="title_left">
              <text>{{language.home.panoramicCollocation}}</text>
            </div>
            <div class="title_right flex" @click="toPanoramic">
              <text>{{language.home.seeAll}}</text>
              <image class="pointer_right" src="/static/images/icon/point_right.png" />
            </div>
          </div>
          <div class="panoramic_scroll">
            <scroll-view scroll-x class="scroll border_bottom">
              <block v-for="(v,k) in panoramicList" :key="k">
                <view class="view inline_flex">
                  <view class="view_view inline_flex view_shadow" @click="toGoodsList(2,v.id)">
                    <div class="top">
                      <image :src="v.pno_pic" mode="widthFix" />
                    </div>
                    <div class="bottom flex" v-if="v.objects.length">
                      <div class="image_list flex">
                        <div class="image_view inline_flex" v-for="(val,idx) in v.objects" :key="idx" v-if='idx<4'>
                          <div class="view_shadow image_view_view">
                            <image :src="val.image_urls[0]" />
                          </div>
                        </div>
                      </div>
                      <div class="more flex" v-if="v.objects.length>4||v.objects.length == 4">
                        <text class="num">{{v.objcnt}}</text>
                        <text class="eng">More</text>
                      </div>
                    </div>
                  </view>
                </view>
              </block>
            </scroll-view>
          </div>
        </div> -->
        <div class="sell_good  background_fff" v-if="sellerList&&sellerList.length">
          <div class="title flex">
            <div class="title_left">
              <text>{{language.home.sellGoodThings}}</text>
            </div>
            <div class="title_right flex" @click="toGoodsList(3)">
              <text>{{language.home.seeAll}}</text>
              <image class="pointer_right" src="/static/images/icon/point_right.png" />
            </div>
          </div>
          <div class="good_scroll box_scroll">
            <scroll-view scroll-x class="scroll">
              <block v-for="(v,k) in sellerList" :key="k">
                <view class="view inline_flex">
                  <view class="view_view inline_flex view_shadow" @click="toGoodDetail(v.id)">
                    <image :src="hostUrl+v.logo" />
                    <div class="image_title">
                      <text class="text_overflow">{{v.goodsName}}</text>
                      <div class="address_brand flex">
                        <text class="brand text_overflow">{{v.brandName}}</text>
                        <text class="address text_overflow">{{v.origin}}</text>
                      </div>
                    </div>
                    <div class="new_3d">
                      <text class="d_text" v-if="v.is3d == 0">AR</text>
                      <!-- <text class="new_text" v-if="v.is_New">NEW</text> -->
                    </div>
                  </view>
                </view>
              </block>
            </scroll-view>
          </div>
        </div>
        <div class="goods_classify background_fff" v-if="navList&&navList.length">
          <div class="goods_nav">
            <scroll-view scroll-x class="flex nav_scroll">
              <block v-for="(v,k) in navList" :key="k">
                <view :class="k==active?'active':''" @click="switchNav(k,v.id)" class="inline_flex">
                  <text>{{v.groupName}}</text>
                </view>
              </block>
            </scroll-view>
          </div>
        </div>
        <div class="index_goods_list" v-if="goodsList">
          <list-component :goods-list="goodsList"  :is-index="1"></list-component>
        </div>
      </scroll-view>
    </div>
  </div>
</template>
<script>
import listComponent from "@/components/listComponent";
import noNet from "@/components/404";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    listComponent,
    noNet
  },
  data() {
    return {
      swiperArr: undefined, //轮播数据
      Height: "", //这是swiper要动态设置的高度属性
      active: 0, //分组的初始位置
      classifyList: undefined, //主标数据
      storeList: undefined, //门店数据
      choiceList: undefined, //今日新选数据
      panoramicList: undefined, //全景数据
      sellerList: undefined, //特卖好物数据
      navList: undefined, //分组的导航数据
      goodsList: undefined, //分组的数据
      ewm: ["https://www.mymixgo.com/public/dist/uploads/app_ewm.png"],
      isNet: false,
      isChangeLang: false,
      isApp: false,
      isShowSwitchCountry: false,
      hostUrl: undefined,
      countrys: undefined,
      country: undefined,
    };
  },
  onLoad() {
    this.getCountryLists();
    
  },
  onShow() {
    if (this.isChangeLang) {
        console.log('语言切换')
      //当语言切换时重新加载数据
      this.getCountryLists();
    }
  },
  computed: {
    ...mapState(["language", "langType"])
  },
  watch: {
    langType() {
      this.isChangeLang = true;
    }
  },
  methods: {
    ...mapMutations(["changeLanguage", "changeLangType","changeInitCountry"]),
    //动态创建轮播图的高度
    imgLoad(e) {
      this.Height = this.$imageLoad(e, 30);
    },
    //分组推荐的点击事件
    switchNav(k, id) {
      this.active = k;
      this.getRecprpData(id);
    },
    //请求banner图
    getBanner() {
      this.swiperArr = undefined;
      this.$axios({ url: this.$api.banner }).then(res => {
        if (res) {
          this.swiperArr = res.datas;
        }
      });
    },
    //请求主标模块
    getMmark() {
      this.classifyList = undefined;
      this.$axios({ url: this.$api.mmark }).then(res => {
        if (res) {
          let lists = res.lists;
          this.classifyList = lists;
        }
      });
    },
    // 请求热门门店
    getShophot() {
      this.storeList = undefined;
      this.$axios({ url: this.$api.shophot }).then(res => {
        if (res) {
          this.storeList = res.datas;
        }
      });
    },
    //请求今日新选
    getNewlist() {
      this.choiceList = undefined;
      this.$axios({
        url: this.$api.newlist,
        params: { type: 1, pageNo: 1, pageSize: 4 }
      }).then(res => {
        if (res) {
          this.choiceList = res.datas.lists;
        }
      });
    },
    //请求特卖好物
    getHotlist() {
      this.sellerList = undefined;
      this.$axios({
        url: this.$api.newlist,
        params: { type: 2, pageNo: 1, pageSize: 4 }
      }).then(res => {
        if (res) {
          this.sellerList = res.datas.lists;
        }
      });
    },
    //请求分组推荐
    getRecgrp() {
      this.navList = undefined;
      this.$axios({
        url: this.$api.queryRecommandGroups
      }).then(res => {
        if (res.datas.length) {
          if (res) {
            this.navList = res.datas;
            this.switchNav(0, res.datas[0].id);
          }
        }
      });
    },
    getRecprpData(id) {
      this.goodsList = undefined;
      this.$axios({
        url: this.$api.recgrp,
        params: { groupId: id, pageNo: 1, pageSize: 10000 },
        loading: false
      }).then(res => {
        if (res) {
          this.goodsList = res.datas.lists;
          this.addHostUrl(this.goodsList);
        }
      });
    },
    addHostUrl(arr) {
      if (!arr.length) {
        return;
      } else {
        for (let i = 0; i < arr.length; i++) {
          arr[i].logo = this.hostUrl + arr[i].logo;
        }
      }
    },
    //由于小程序的navigitor组件点击时会出现延时,所以所有的跳转用js去控制
    //banner
    toBanner(id) {
      wx.navigateTo({
        url: `../../pages/banner/main?id=${id}`
      });
    },
    //门店
    toStore() {
      wx.navigateTo({
        url: "../../pages/store/main"
      });
    },
    // 门店详情
    toStoreDetail(id) {
      wx.navigateTo({
        url: `../../pages/storedetail/main?id=${id}`
      });
    },
    // //全景列表
    // toPanoramic() {
    //   wx.navigateTo({
    //     url: "../../pages/panoramic/main"
    //   });
    // },
    //商品列表
    toGoodsList(type) {
      //type=1 今日新选 type=3 特卖好物
      let url = `../../pages/goodsList/main?type=${type}`;
      wx.navigateTo({
        url: url
      });
    },
    //商品详情
    toGoodDetail(id) {
      wx.navigateTo({
        url: `../../pages/gooddetail/main?id=${id}`
      });
    },
    getCountryLists() {
      if (this.countrys && this.countrys.length) {
        this.getAllData();
      } else {
        this.countrys = undefined;
        this.$axios({ url: this.$api.queryCountry }).then(res => {
          if (res) {
            this.countrys = res.datas;
            console.log(this.countrys);
            let countryID = wx.getStorageSync("country");
            let index = this.countrys.findIndex(value => {
              return value.id == countryID;
            });
            if (index < 0) {
              index = 0;
            }
            this.country = this.countrys[index].countryName;
            this.changeInitCountry(this.countrys[index].id);
            this.getAllData();
          }
        });
      }
    },
    switchCountry() {
      this.isShowSwitchCountry = !this.isShowSwitchCountry;
    },
    selectCountry(name) {
      // 切换国家
      let self = this;
      self.isShowSwitchCountry = false;
      if (self.countrys) {
        let index = self.countrys.findIndex(value => {
          return value.countryName == name;
        });
        this.changeInitCountry(self.countrys[index].id);
        self.country = name;
      }
      this.getCountryLists();
    },
    //页面初始化的方法
    initPageLang() {
      //由于非tabbar页面不能设置tabbar,所以需要在有tabbar的页面设置
      this.$setTitle(this.language.title.home);
      this.$setTabBar(
        this.language.tab.home,
        this.language.tab.find,
        this.language.tab.user
      );
    },
    //页面请求方法 type=0则表示下拉刷新时不将数据置空，为1时置空
    getAllData() {
      this.isNet = false;
      setTimeout(() => {
        if (
          !this.countrys&&
          !this.hostUrl&&
          !this.swiperArr &&
          !this.storeList &&
          !this.choiceList &&
          !this.sellerList
        ) {
          this.isNet = true;
        }
      }, 11000);
      if (wx.getStorageSync("img_url")) {
        this.hostUrl = wx.getStorageSync("img_url");
        this.getBanner();
        this.getShophot();
        this.getNewlist();
        this.getHotlist();
        this.getRecgrp();
        this.initPageLang();
      } else {
        this.$axios({
          url: this.$api.querySysConfig
        }).then(res => {
          if (res) {
            this.hostUrl = res.datas[0].value;
            wx.setStorageSync("img_url", res.datas[0].value);
            this.getBanner();
            this.getShophot();
            this.getNewlist();
            this.getHotlist();
            this.getRecgrp();
            this.initPageLang();
          }
        });
      }
    },
    //取消mask
    cancelApp() {
      this.isApp = false;
    },
    //打开App
    openApp() {
      this.isApp = true;
    },
    longtapImg() {
      wx.previewImage({
        urls: this.ewm
      });
    },
    refreshFun() {
      let _this = this;
      this.$refreshFun({
        callback: function() {
          _this.getCountryLists();
        }
      });
    }
  },
  onHide() {
    this.isChangeLang = false;
    this.isShowSwitchCountry = false;
  }
};
</script>

<style scoped lang=scss>
@import "./index.scss";
</style>
