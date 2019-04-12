<template>
  <div class="keySearch_wrapper  wrapper background_f0f0f0">
    <view class='list-search'>
      <view class='list-search-box'>
        <icon type="search" size="15" />
        <input :placeholder="language.keySearch.placeholder" v-model="goodsKey" @confirm="searchGoods" auto-focus>
      </view>
    </view>
    <scroll-view class="search_result" scroll-y @scrolltolower="scrolltolower" :upper-threshold="100">
      <list-component :goods-list="goodsList" :is-loading="isLoading" :is-transparent="isTransparent"></list-component>
    </scroll-view>
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
      goodsKey: "",
      goodsList: [],
      page: 1,
      isLoading: true, //loading加载
      isTransparent: true, //loading隐藏
      isBottom: false
    };
  },
  onLoad() {
    this.$setTitle(this.language.title.search);
    this.isBottom = false;
    this.isLoading = true;
    this.isTransparent = true;
    this.page = 1;
    this.goodsKey = "";
    this.goodsList = [];
  },
  computed: {
    ...mapState(["language"])
  },
  methods: {
    scrolltolower() {
      if (this.isBottom) {
        this.isTransparent = false;
        this.isBottom = false;
        this.page++;
        this.$axios({
          url: this.$api.queryGoodsList,
          params: { searchKey: this.goodsKey, pageNo: this.page, pageSize: 8 },
          loading: false
        })
          .then(res => {
            if (res) {
              if (res.datas.lists.length < 8) {
                this.isBottom = false;
                this.isLoading = false;
              } else {
                this.isBottom = true;
              }
              this.isTransparent = true;
              this.goodsList = this.goodsList.concat(res.datas.lists);
            }
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
    searchGoods() {
      if (!this.goodsKey) {
        return false;
      }
      this.page = 1;
      this.isBottom = false;
      this.isLoading = true;
      this.isTransparent = true;
      this.getLists();
    },
    //请求搜索的关键字
    getLists() {
      this.goodsList = [];
      this.$axios({
        url: this.$api.queryGoodsList,
        params: { searchKey: this.goodsKey, pageNo: this.page, pageSize: 8 }
      }).then(res => {
        if (res) {
          this.goodsList = res.datas.lists;
          if (res.datas.lists.length < 8) {
            this.isBottom = false;
            this.isLoading = false;
          } else {
            this.isBottom = true;
          }
        }
      });
    }
  }
};
</script>
<style scoped lang=scss>
.keySearch_wrapper {
  .list-search {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    z-index: 20;
    padding: 30rpx 50rpx;
    background-color: #2ac6f7;
    border-bottom: 1px solid #f0f0f0;
    .list-search-box {
      display: flex;
      align-items: center;
      padding: 0 30rpx;
      width: 100%;
      height: 60rpx;
      background: #fff;
      border-radius: 90rpx;
      font-size: 28rpx;
      box-sizing: border-box;
      input {
        width: 100%;
        padding-left: 10rpx;
      }
    }
    .search-button {
      flex-shrink: 0;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 28rpx;
      margin-left: 20rpx;
      background-color: #fff;
    }
  }
  .search_result {
    position: absolute;
    top: 120rpx;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
}
</style>

