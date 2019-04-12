<template>
  <div class="list_component_wrapper">
    <block v-if="goodsList.length">
      <div class="store_list flex">
        <div class="store_item flex background_fff view_shadow" v-for="(v,k) in goodsList" :key="k" @click="toGoodDetail(v.id)">
          <image class="store_image" :src="isIndex?v.logo:hostUrl+v.logo" />
          <div class="image_title">
            <text class="text_overflow">{{v.goodsName}}</text>
            <div class="address_brand flex">
              <text class="brand text_overflow">{{v.brandName}}</text>
              <text class="address text_overflow">{{v.origin}}</text>
            </div>
          </div>
          <image src="/static/images/icon/delete1.png" class="delete_img" @click.stop="cancelCollection(v.id)" v-if="isDelete" />
          <div class="new_3d">
            <text class="d_text" v-if="v.is3d == 0">AR</text>
            <!-- <text class="new_text" v-if="v.is_New">NEW</text> -->
          </div>
        </div>
      </div>
    </block>
    <block v-if="noData&&!goodsList.length">
      <div class="nodata flex">
        <text>{{language.goodsList.noData}}</text>
      </div>
    </block>
    <div v-if="isLoading" class="loading flex" :class="isTransparent?'transparent':''">
      <image src="/static/images/icon/loading.gif" />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: {
    goodsList: {
      //商品列表数据
      type: Array,
      default: function() {
        return [];
      }
    },
    isIndex: {
      type: Number,
      default: 0
    },
    noData: {
      //是否在数据为空时显示暂无数据信息
      type: Boolean,
      default: true
    },
    isLoading: {
      //是否开启下拉刷新的动画
      type: Boolean,
      default: false
    },
    isTransparent: {
      type: Boolean,
      default: false //loading的visibility样式
    },
    isDelete: {
      //商品是否有删除功能
      type: Boolean,
      default: false
    },
    isSession: {
      //判断组件内的删除数据如何处理，区分足迹和收藏
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hostUrl: ""
    };
  },
  onLoad() {
    this.hostUrl = wx.getStorageSync("img_url");
  },
  computed: {
    ...mapState(["language"])
  },
  methods: {
    //商品详情
    toGoodDetail(id) {
      wx.navigateTo({
        url: `../../pages/gooddetail/main?id=${id}`
      });
    },
    // 取消收藏
    cancelCollection(id) {
      if (this.isSession) {
        //删除缓存里面的足迹
        this.goodsList.map((item, index) => {
          if (item.id == id) {
            this.goodsList.splice(index, 1);
          }
        });
        wx.showToast({
          title: this.language.alert.footprint,
          icon: "none",
          duration: 2000
        });
        if (this.goodsList.length) {
          //有数据则缓存，没数据则清空缓存
          wx.setStorageSync("footprint", this.goodsList);
        } else {
          wx.removeStorageSync("footprint");
        }
      } else {
        let _this = this;
        this.$axios({
          url: _this.$api.deleteGoodsFavorite,
          params: {
            goodsId: id
          },
          loading: false
        }).then(res => {
          if (res) {
            wx.showToast({
              title: _this.language.alert.cancelCollected,
              icon: "none",
              duration: 2000
            });
            _this.goodsList.map((item, index) => {
              if (item.id == id) {
                _this.goodsList.splice(index, 1);
              }
            });
          }
        });
      }
    }
  }
};
</script>
<style scoped lang=scss>
.list_component_wrapper {
  .store_list {
    flex-wrap: wrap;
    padding-bottom: 20rpx;
    .store_item {
      padding: 10rpx;
      margin: 10px 0 0 10px;
      width: calc(50% - 15px);
      flex-direction: column;
      box-sizing: border-box;
      border-radius: 8rpx;
      position: relative;
      .store_image {
        width: 100%;
        height: 330rpx;
      }
      .image_title {
        text {
          font-size: 30rpx;
          max-width: 100%;
        }
      }
      .address_brand {
        justify-content: space-between;
        text {
          max-width: 70%;
          font-size: 24rpx;
          &.address {
            text-align: right;
            max-width: 30%;
          }
        }
      }
      .delete_img {
        width: 42rpx;
        height: 42rpx;
        position: absolute;
        right: 20rpx;
        top: 10rpx;
      }
      .new_3d {
        position: absolute;
        left: 10rpx;
        top: 0;
        text {
          font-size: 18rpx;
          padding: 0 10rpx;
          border-radius: 10rpx;
          margin: 0 5rpx;
          background-color: #fff;
        }
        .d_text {
          color: #00b2ee;
          border: 1px solid #00b2ee;
        }
        .new_text {
          color: red;
          border: 1px solid red;
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
  .loading {
    align-items: center;
    justify-content: center;
    image {
      width: 60rpx;
      height: 60rpx;
    }
    &.transparent {
      visibility: hidden;
    }
  }
}
</style>

