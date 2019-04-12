<template>
  <div class="store_wrapper">
    <block v-for="(v,k) in shopList" :key="k">
      <div  class="store_item" @click="toShopDetail(v.id)">
        <image class="good" :src="hostUrl+v.imgs" />
        <div class="address flex">
          <image src="/static/images/icon/position.png" mode="widthFix" />
          <text>{{v.contactAddr}}</text>
        </div>
      </div>
    </block>
  </div>
</template>
<script>
export default {
  data() {
    return {
      shopList: [],
      hostUrl: "",
    };
  },
  onLoad() {
    this.hostUrl = wx.getStorageSync("img_url");
    this.shopList = [];
  },
  mounted() {
    this.initPageLang();
    this.getShopList();
  },
  methods: {
    initPageLang() {
      this.$setTitle(this.$store.state.language.title.store);
    },
    getShopList() {
      this.$axios({ url: this.$api.shophot }).then(res => {
        this.shopList = res.datas;
      });
    },

    toShopDetail(id) {
      console.log(id)
      wx.navigateTo({
        url: "../../pages/storedetail/main?id=" + id
      });
    }
  }
};
</script>
<style scoped lang=scss>
@import "./index.scss";
</style>

