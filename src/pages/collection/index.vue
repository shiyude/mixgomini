<template>
  <div class="collection_wrapper background_f0f0f0 wrapper">
    <div class="collect_head background_fff" v-if="!isSession">
      <div :class="{'active':categories == 'goods'}" @click="changeList('goods')">{{language.wish_list}}</div>
      <div :class="{'active':categories == 'stores'}" @click="changeList('stores')">{{language.shop_to_collect}}</div>
    </div>
    <scroll-view scroll-y :class="{'collect_content_absolute':!isSession}">
      <list-component :goods-list="goodsList" :is-delete='true' :is-session='isSession' v-if="categories == 'goods'||isSession"></list-component>
      <div class="shop_lists" v-show="categories == 'stores'">
        <div class="item_lists" v-if="storesList.length">
          <block v-for="(v,k) in storesList" :key="k">
            <div class="store_item" @click="toShopDetail(v.id)">
              <image src="/static/images/icon/delete1.png" class="delete_img" @click.stop="deleteStore(v.id)" />
              <image class="good" :src="hostUrl+v.imgs" />
              <div class="address flex">
                <image src="/static/images/icon/position.png" mode="widthFix" />
                <text>{{v.contactAddr}}</text>
              </div>
            </div>
          </block>
        </div>
        <div class="nodata flex" v-else>
          <text> {{language.goodsList.noData}}</text>
        </div>
      </div>
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
      goodsList: [],
      storesList: [],
      isSession: true,
      categories: "goods",
      hostUrl: ""
    };
  },
  onLoad() {
    this.hostUrl = wx.getStorageSync("img_url");
    this.goodsList = [];
    this.storesList = [];
    this.isSession = true;
    this.categories = "goods";
  },
  onShow() {
    let type = this.$root.$mp.query.type;
    if (type == 1) {
      this.getEnshrineList();
      this.getShopList();
      this.isSession = false;
      this.$setTitle(this.language.title.collection);
    } else {
      this.isSession = true;
      this.$setTitle(this.language.title.footprint);
      if (wx.getStorageSync("footprint")) {
        this.goodsList = wx.getStorageSync("footprint");
      }
    }
  },
  computed: {
    ...mapState(["language"])
  },
  methods: {
    deleteStore(id) {
      //取消门店的收藏
      let _this = this;
      this.$axios({
        url: _this.$api.deleteStoreFavorite,
        params: {
          storeId: id
        },
        loading: false
      }).then(res => {
        if (res) {
          wx.showToast({
            title: _this.language.alert.cancelCollected,
            icon: "none",
            duration: 2000
          });
          _this.storesList.map((item, index) => {
            if (item.id == id) {
              _this.storesList.splice(index, 1);
            }
          });
        }
      });
    },
    toShopDetail(id) {
      //跳转到门店详情
      wx.navigateTo({
        url: "../../pages/storedetail/main?id=" + id
      });
    },
    changeList(type) {
      if (type == "goods") {
        this.categories = "goods";
      } else {
        this.categories = "stores";
      }
    },
    //商品收藏
    getEnshrineList() {
      this.$axios({
        url: this.$api.queryFavoriteGoods,
        params: {
          pageNo: 1,
          pageSize: 100000
        }
      }).then(res => {
        if (res) {
          this.goodsList = res.datas.lists;
        }
      });
    },
    //门店收藏
    getShopList() {
      this.$axios({
        url: this.$api.queryFavoriteStore,
        params: {
          pageNo: 1,
          pageSize: 100000
        }
      }).then(res => {
        if (res) {
          this.storesList = res.datas.lists;
        }
      });
    }
  }
};
</script>
<style lang=scss scoped>
.collection_wrapper {
  .collect_head {
    display: flex;
    height: 80rpx;
    font-size: 14px;
    box-shadow: 0 6rpx 20rpx #ddd;
    div {
      flex: 1;
      height: 100%;
      line-height: 80rpx;
      text-align: center;
      box-sizing: border-box;
      &.active {
        border-bottom: 2px solid #2ac6f7;
      }
    }
  }

  .collect_content_absolute {
    position: absolute;
    top: 80rpx;
    bottom: 0;
  }
  .shop_lists {
    .item_lists {
      padding: 15rpx 30rpx;
      .store_item {
        position: relative;
        margin: 15rpx 0 30rpx;
        .delete_img {
          width: 42rpx;
          height: 42rpx;
          position: absolute;
          right: 20rpx;
          top: 10rpx;
        }
        .good {
          height: 354rpx;
          width: 100%;
          display: block;
        }
        .address {
          position: absolute;
          bottom: 30rpx;
          height: 60rpx;
          width: 70%;
          left: 15%;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 10rpx;
          image {
            width: 24rpx;
            margin-left: 10rpx;
          }
          text {
            margin-left: 10rpx;
            font-size: 26rpx;
            color: #fff;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }
  }
  .nodata {
    flex-direction: column;
    align-items: center;
    padding: 30rpx;
    text {
      color: #808080;
      font-size: 24rpx;
      margin-top: 15rpx;
    }
  }
}
</style>


