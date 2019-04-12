 <template>
  <div class="store_detail_wrapper background_f0f0f0 wrapper">
    <div class="store_image background_fff">
      <image :src="imgs" />
    </div>
    <div class="store_popularity flex background_fff">
      <image :src="logo" class="store_logo" />
      <div class="popularity_right flex">
        <text class="name">{{shopDetail.storeName}}</text>
        <div class="praise_collection flex">
          <div class="praise flex">
            <image src="/static/images/icon/zan.png" @click="onPraise" />
            <text>{{shopDetail.likeNum}}</text>
          </div>
          <div class="collection flex">
            <image src="/static/images/icon/collection.png" @click="addEnshrine" v-if='!isCollected' />
            <image src="/static/images/icon/collection_active.png" @click="addEnshrine" v-else/>
            <text>{{shopDetail.favoriteCount}}</text>
          </div>
        </div>
      </div>
    </div>
    <div class="store_detail flex background_fff">
      <div class="detail_left">
        <div class="address flex">
          <image src="/static/images/icon/position.png" />
          <text>{{shopDetail.contactAddr}}</text>
        </div>
        <div class="time flex">
          <image src="/static/images/icon/grade.png" />
          <text>{{language.storeDetail.time}}{{shopDetail.working}}</text>
        </div>
        <div class="phone flex">
          <image src="/static/images/icon/call.png" />
          <text>{{language.storeDetail.phone}}</text>
          <text class="call_phone" @click="callPhone">{{shopDetail.contactPhone}}</text>
        </div>
      </div>
      <!-- <div class="detail_right flex">
        <image src="/static/images/icon/air.png" />
        <text>{{shopDetail.distance}}</text>
      </div> -->
    </div>
    <list-component :goods-list="goodsList" :no-data="noData" :is-index="1"></list-component>
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
      shopDetail: {},
      isCollected: false,
      id: "",
      noData: false,
      hostUrl: "",
      categoryLists: undefined,
      imgs: "",
      logo: ""
    };
  },
  onLoad() {
    this.shopDetail = {};
    this.goodsList = [];
    this.isCollected = false;
    this.id = "";
  },
  mounted() {
    let id =
      this.$root.$mp.query.id !== undefined
        ? this.$root.$mp.query.id
        : decodeURIComponent(this.$root.$mp.query.scene);
        console.log(this.$root.$mp.query)
    this.id = id;
    if (wx.getStorageSync("img_url")) {
      this.hostUrl = wx.getStorageSync("img_url");
      this.getShopInfo(id);
      this.getShopOfCategory(id);
      this.GitShopFav(id);
    } else {
      this.$axios({
        url: this.$api.querySysConfig,
        loading: false
      }).then(res => {
        this.hostUrl = res.datas[0].value;
        wx.setStorageSync("img_url", res.datas[0].value);
        this.getShopInfo(id);
        this.getShopOfCategory(id);
        this.GitShopFav(id);
      });
    }
  },
  computed: {
    ...mapState(["language"])
  },
  methods: {
    getShopInfo(id) {
      this.$axios({
        url: this.$api.queryStoreById,
        params: { storeId: id },
        loading: false
      })
        .then(res => {
          this.shopDetail = res.datas;
          this.imgs = this.hostUrl + res.datas.imgs;
          this.logo = this.hostUrl + res.datas.logo;
          if (res.datas.storeName) {
            this.$setTitle(res.datas.storeName);
          } else {
            this.$setTitle(this.language.title.storeDetail);
          }
          this.getShopOfGoods();
        })
        .catch(() => {
          this.$setTitle(this.language.title.storeDetail);
        });
    },
    getShopOfGoods(id = "") {
      this.goodsList = [];
      this.$axios({
        url: this.$api.queryStoreGoods,
        params: {
          storeCategory: id,
          storeId: this.id,
          pageNo: 1,
          pageSize: 10000
        }
      }).then(res => {
        this.goodsList = res.datas.lists;
        this.addHostUrl(this.goodsList);
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
    getShopOfCategory(id) {
      this.categoryLists = undefined;
      this.$axios({
        url: this.$api.queryStoreCategory,
        params: { storeId: id },
        loading: false
      }).then(res => {
        if (res.datas && res.datas.length) {
          this.categoryLists = res.datas;
        }
      });
    },
    GitShopFav(id) {
      //检测门店是否被收藏
      let seft = this;
      if (wx.getStorageSync("token")) {
        seft
          .$axios({
            url: seft.$api.isFavoriteStore,
            params: {
              storeId: id
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
    //收藏
    addEnshrine() {
      let seft = this;
      if (seft.$judgeToken()) {
        if (seft.isCollected) {
          //被收藏
          seft
            .$axios({
              url: seft.$api.deleteStoreFavorite,
              params: {
                storeId: seft.id
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
                if (seft.shopDetail.favoriteCount !== undefined) {
                  seft.shopDetail.favoriteCount =
                    parseInt(seft.shopDetail.favoriteCount) - 1;
                }
              }
            });
        } else {
          //未被收藏
          seft
            .$axios({
              url: seft.$api.addStoreFavorite,
              params: {
                storeId: seft.id
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
                if (seft.shopDetail.favoriteCount !== undefined) {
                  seft.shopDetail.favoriteCount =
                    parseInt(seft.shopDetail.favoriteCount) + 1;
                }
              }
            });
        }
      }
    },
    //点赞
    onPraise() {
      let seft = this;
      if (seft.$judgeToken()) {
        if (seft.shopDetail.islike == 1) {
          //已经点过
          wx.showToast({
            title: seft.language.alert.praised,
            icon: "none",
            duration: 2000
          });
        } else {
          seft
            .$axios({
              url: seft.$api.addStoreLike,
              params: {
                storeId: seft.id
              },
              loading: false
            })
            .then(res => {
              if (res) {
                seft.shopDetail.likeNum = parseInt(seft.shopDetail.likeNum) + 1;
                seft.shopDetail.islike = 1;
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
    callPhone() {
      if (!this.shopDetail.contactPhone) {
        return;
      }
      wx.makePhoneCall({
        phoneNumber: this.shopDetail.contactPhone
      });
    }
  },
  onShareAppMessage() {
    return {
      title: this.shopDetail.storeName || this.language.title.storeDetail
    };
  }
};
</script>
 <style scoped lang=scss>
@import "./index.scss";
</style>
 
 
