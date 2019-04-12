<template>
  <div class="panoramic_wrapper">
    <block v-for="(v,k) in panolist" :key="k">
      <div class="panoramic_item" @click="toGoodsLists(v.id)">
        <image :src="v.pno_pic" mode="widthFix" />
        <div class="list flex">
          <div class="image_list">
            <block v-for="(val,idx) in v.objects" :key="idx" v-if='idx<4'>
              <image :src="val.image_urls[0]" mode="widthFix" />
            </block>
          </div>
          <div class="more flex" v-if="v.objects.length>4||v.objects.length == 4">
            <text class="num">{{v.objcnt}}</text>
            <text class="eng">More</text>
          </div>
        </div>
      </div>
    </block>
  </div>
</template>
<script>
export default {
  data() {
    return {
      panolist: []
    };
  },
  onLoad() {
    this.panolist = [];
  },
  mounted() {
    this.initPageLang();
    this.getPanolist();
  },
  methods: {
    initPageLang() {
      this.$setTitle(this.$store.state.language.title.panoramic);
    },
    getPanolist() {
      this.$axios({
        url: this.$api.panolist
      }).then(res => {
        if (res) {
          let lists = lists;
          this.panolist = res.lists;
          console.log(res);
        }
      });
    },
    toGoodsLists(id) {
      wx.navigateTo({
        url: "../../pages/goodsList/main?id=" + id + "&type=2"
      });
    }
  }
};
</script>
<style scoped lang=scss>
@import "./index.scss";
</style>

