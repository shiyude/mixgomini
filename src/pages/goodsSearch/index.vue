<template>
  <div class="goods_search_wrapper background_f0f0f0 wrapper">
    <div class="search_nav flex background_fff">
      <block v-for="(v,k) in language.goodsSearch.navList" :key="k">
        <div class="nav_item" :class="k==index?'active':''">
          <div class="text_or_image" @click="switchNav(k)">
            <text>{{v.text}}</text>
            <image v-if="v.src" :src="v.src" />
          </div>
        </div>
      </block>
    </div>
    <div class="goods_list">
      <list-component :goods-list="goodsList"></list-component>
    </div>
  </div>
</template>
<script>
import listComponent from "@/components/listComponent";
import { mapState } from "vuex";
export default {
  components: {
    listComponent
  },
  data() {
    return {
      goodsList: [
        {
          pic: "/static/images/index/1.png",
          des: "沙发 实木 三人座",
          price: "2018",
          address: "深圳"
        },
        {
          pic: "/static/images/index/1.png",
          des: "沙发 实木 三人座",
          price: "2018",
          address: "深圳"
        },
        {
          pic: "/static/images/index/1.png",
          des: "沙发 实木 三人座",
          price: "2018",
          address: "深圳"
        },
        {
          pic: "/static/images/index/1.png",
          des: "沙发 实木 三人座",
          price: "2018",
          address: "深圳"
        },
        {
          pic: "/static/images/index/1.png",
          des: "沙发 实木 三人座",
          price: "2018",
          address: "深圳"
        },
        {
          pic: "/static/images/index/1.png",
          des: "沙发 实木 三人座",
          price: "2018",
          address: "深圳"
        },
        {
          pic: "/static/images/index/1.png",
          des: "沙发 实木 三人座",
          price: "2018",
          address: "深圳"
        },
        {
          pic: "/static/images/index/1.png",
          des: "沙发 实木 三人座",
          price: "2018",
          address: "深圳"
        },
        {
          pic: "/static/images/index/1.png",
          des: "沙发 实木 三人座",
          price: "2018",
          address: "深圳"
        },
        {
          pic: "/static/images/index/1.png",
          des: "沙发 实木 三人座",
          price: "2018",
          address: "深圳"
        }
      ],
      index: 0
    };
  },
  mounted() {
    this.index = 0;
    this.initPageLang();
  },
  onShow() {
    let session = wx.getStorageSync("screenData");
    let sure = wx.getStorageSync("sure");
    if (session && session.length !== 0 && sure) {
      console.log("请求分类数据");
    }
  },
  computed: {
    ...mapState(["language"])
  },
  methods: {
    switchNav(k) {
      this.index = k;
      if (k == 3) {
        wx.navigateTo({
          url: "../screen/main"
        });
      }
    },
    initPageLang() {
      this.$setTitle(this.language.title.goodsSearch);
      let length = this.language.goodsSearch.navList.length;
      this.language.goodsSearch.navList[length - 1].src =
        "/static/images/icon/shaixuan.png";
    }
  },
  onPullDownRefresh() {
    this.goodsList.push({
      pic: "/static/images/index/1.png",
      des: "沙发 实木 三人座",
      price: "2018",
      address: "深圳"
    });
    wx.stopPullDownRefresh();
  }
};
</script>
<style scoped lang=scss>
@import "./index.scss";
</style>

