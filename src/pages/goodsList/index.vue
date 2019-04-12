<template>
  <div class="goods_list_wrapper  background_f0f0f0 wrapper">
    <list-component :goods-list="goodsList" :is-loading="isLoading" :is-transparent="isTransparent"></list-component>
  </div>
</template>
<script>
import listComponent from "@/components/listComponent";
export default {
  components: {
    listComponent
  },
  data() {
    return {
      goodsList: [],
      isLoading: true, //loading加载
      isTransparent: true, //loading隐藏
      isBottom: false,
      page: 1,
      type:"",
    };
  },
  onLoad() {
    this.isBottom = false;
    this.isLoading = true;
    this.isTransparent = true;
    this.page = 1;
    this.goodsList = [];
    this.type = "";
  },
  mounted() {
    let type = this.$root.$mp.query.type;
    this.type = type;
    let axiosParams = this.getAxiosParams(type, 1);
    this.$axios(axiosParams).then(res => {
      if (res.datas.lists.length < 8) {
        this.isBottom = false;
        this.isLoading = false;
      } else {
        this.isBottom = true;
      }

      this.goodsList = res.datas.lists;
    });
  },
  methods: {
    getAxiosParams(type, page) {
      // 根据商品的类型判断该商品请求的接口 type=1 今日新选 type=3 特卖好物品
      let axiosParams = {
        url: this.$api.newlist,
        params: {pageNo: page, pageSize: 8 }
      };
      switch (type) {
        case "1":
          axiosParams.params.type = 1;
          this.$setTitle(this.$store.state.language.title.latest);
          break;
        case "3":
          axiosParams.params.type = 2;
          this.$setTitle(this.$store.state.language.title.goodsSell);
          break;
      }
      return axiosParams;
    }
  },
  onReachBottom() {
    if (this.isBottom) {
      this.isTransparent = false;
      this.isBottom = false;
      this.page++;
      let axiosParams = this.getAxiosParams(this.type, this.page);
      this.$axios({
        ...axiosParams,
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
  }
};
</script>
<style scoped lang=scss>
@import "./index.scss";
</style>

