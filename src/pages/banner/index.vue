<template>
  <div class="banner_wrapper background_f0f0f0 wrapper">
    <div class="banner_detail">
      <wxParse :content="contentData" />
    </div>
    <div class="goodsLists" v-if="goodsLists.length">
      <div class="lists">
        <list-component :goods-list="goodsLists.objects" :no-data="noData"></list-component>
      </div>
    </div>
  </div>
</template>
<script>
import listComponent from "@/components/listComponent";
import { Base64 } from "js-base64";
import wxParse from "mpvue-wxparse";
export default {
  components: {
    listComponent,
    wxParse
  },
  data() {
    return {
      goodsLists: [],
      noData: false,
      contentData: "<div></div>"
    };
  },
  onLoad() {
    this.goodsLists = [];
    this.contentData = "<div></div>";
  },
  mounted() {
    let id = this.$root.$mp.query.id;
    this.getDetails(id);
  },
  methods: {
    getDetails(id) {
      this.$axios({
        url: this.$api.queryDiscoveryById,
        params: {
          discoveryId: id
        }
      }).then(res => {
        if (res.datas.title) {
          this.$setTitle(res.datas.title);
        }
        if (!res.datas.content) {
          this.contentData = "<div></div>";
        } else {
          let htmlStr = Base64.decode(res.datas.content);
          this.contentData = htmlStr;
        }
        this.getProduct(id);
      });
    },
    getProduct(id) {
      this.goodsLists = [];
      this.$axios({
        url: this.$api.queryGoodsByDiscoveryId,
        params: {
          discoveryId: id,
          pageNo: 1,
          pageSize: 10000
        },
        loading: false
      }).then(res => {
        if (res.datas.lists && res.datas.lists.length) {
          this.goodsLists = res.datas.lists;
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
@import url("~mpvue-wxparse/src/wxParse.css");
.banner_wrapper {
  .banner_detail {
    padding: 30rpx;
    color: #666;
    background-color: #fff;
  }
  .goodsLists {
    .img {
      padding: 0 30rpx 30rpx;
      image {
        width: 100%;
        display: block;
      }
    }
  }
}
</style>


