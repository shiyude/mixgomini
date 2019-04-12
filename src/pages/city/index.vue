<template>
  <div class="list-wrapper">
    <view class='list-search'>
      <view class='list-search-box'>
        <icon type="search" size="15" />
        <input :placeholder="language.city.placeholder" v-model="cityVal" />
      </view>
      <button class='search-button' @click='searchMt'>{{language.city.search}}</button>
    </view>
    <block v-if="cityList.length != 0 ">
      <scroll-view class="list-scroll top" :scroll-into-view="jumpNum" scroll-y :scroll-with-animation="false" @scroll="scrollFun">
        <view>
          <view class='list-title'>{{language.city.currentCity}}</view>
          <view class='list-horizontal'>
            <view class='list-name'>
              {{city}}
            </view>
          </view>
        </view>
        <view v-for="(v,k) in cityList" :key="k" :id="'index'+k">
          <view class='list-title'>{{v.title}}</view>
          <view>
            <view v-for="(val,idx) in v.item" :key="idx" :class='idx === 0 ?"":"border"' class="list-name" @click='detailMt(val.name)'>
              {{val.name}}
            </view>
          </view>
        </view>
      </scroll-view>
      <view class='list-right-wrapper'>
        <view class='right-item' v-for="(v,k) in rightArr" :key="k" @click="jumpMt('index'+k)">
          {{v}}
        </view>
      </view>
    </block>
    <block v-else>
      <view class='nodata'>{{language.city.noData}}</view>
    </block>
  </div>
</template>
<script>
let cityData = require("@/utils/city.json");
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      myCity: "", //我的城市
      cityList: [], //城市列表
      rightArr: [], //字母列表
      jumpNum: "", //跳转的id
      cityVal: "" //搜索字段
    };
  },
  onLoad() {
    this.initPageLang();
  },
  mounted() {
    this.resetRight(cityData);
  },
  computed: {
    ...mapState(["language", "city"])
  },
  methods: {
    ...mapMutations(["changeCity", "changeCityStatus"]),
    // 数据重新渲染
    resetRight(data) {
      let rightArr = [];
      for (let i in data) {
        rightArr.push(data[i].title.substr(0, 1));
      }
      this.rightArr = rightArr;
      this.cityList = data;
    },
    // 右侧字母点击事件
    jumpMt(k) {
      this.jumpNum = k;
      console.log(this.jumpNum);
    },
    // 基础搜索功能
    searchMt() {
      this._search();
    },
    _search() {
      let newData = [];
      for (let i = 0; i < cityData.length; i++) {
        let itemArr = [];
        for (let j = 0; j < cityData[i].item.length; j++) {
          if (cityData[i].item[j].name.indexOf(this.cityVal) > -1) {
            let itemJson = {};
            for (let k in cityData[i].item[j]) {
              itemJson[k] = cityData[i].item[j][k];
            }
            itemArr.push(itemJson);
          }
        }
        if (itemArr.length === 0) {
          continue;
        }
        newData.push({
          title: cityData[i].title,
          item: itemArr
        });
      }
      this.resetRight(newData);
    },
    // 列表点击事件
    detailMt(val) {
      this.changeCity(`${val}市`);
      wx.navigateBack();
    },
    scrollFun() {
      this.jumpNum = "";
    },
    initPageLang() {
      this.$setTitle(this.language.title.city);
    }
  },
  onUnload() {
    this.cityVal = "";
    this.jumpNum = "";
  }
};
</script>
<style scoped lang=scss>
@import "./index.scss";
</style>

