<template>
  <div class="screen_wrapper">
    <scroll-view scroll-y class="screen_scroll">
      <block v-for="(v,k) in newList" :key="k">
        <view class="screen_item">
          <div class="title flex">
            <text>{{v.title}}</text>
          </div>
          <div class="main flex">
            <block v-for="(val,idx) in v.data" :key="idx">
              <div class="sing_select flex" @click="select(k,idx)" :class="val.isChecked?'active':''">
                <text>{{val.name}}</text>
              </div>
            </block>
            <div class="sing_select flex" v-if='(dataList[k].data.length>9)&&(v.data.length !== dataList[k].data.length)' @click="seeAll(k)">
              <text>{{language.screen.open}}</text>
              <image src="/static/images/icon/zk.png" />
            </div>
            <div class="sing_select flex" @click="upData(k)" v-if="newList[k].data.length>9">
              <text>{{language.screen.close}}</text>
              <image src="/static/images/icon/sq.png" />
            </div>
          </div>
        </view>
      </block>
    </scroll-view>
    <div class="bottom flex">
      <div class="reset" @click="reset">
        <text>{{language.screen.reset}}</text>
      </div>
      <div class="sure" @click="sure">
        <text>{{language.screen.sure}}</text>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      newList: [], //后台请求的数据做数据处理
      dataList: [
        {
          title: "品牌",
          data: [
            {
              name: "左右",
              isChecked: false
            },
            {
              name: "左右1",
              isChecked: false
            },
            {
              name: "左右2",
              isChecked: false
            },
            {
              name: "左右3",
              isChecked: false
            },
            {
              name: "左右4",
              isChecked: false
            },
            {
              name: "左右5",
              isChecked: false
            },
            {
              name: "左右6",
              isChecked: false
            },
            {
              name: "左右7",
              isChecked: false
            },
            {
              name: "左右8",
              isChecked: false
            },
            {
              name: "左右9",
              isChecked: false
            }
          ]
        }
      ] //后台请求到的数据
    };
  },
  mounted() {
    this.getData();
    this.initPageLang();
    let session = wx.getStorageSync("screenData");
    //页面初始化缓存中的数据如果不存在则进行数据的处理
    if (!session) {
      this.newList = JSON.parse(JSON.stringify(this.dataList));
      let listArr = this.newList;
      for (let i = 0; i < listArr.length; i++) {
        if (listArr[i].data.length > 9) {
          listArr[i].data = listArr[i].data.slice(0, 9);
        }
      }
      this.resetData();
    }
    //清除确定按钮点击时的缓存
    wx.removeStorage({
      key: "sure"
    });
  },
  computed: {
    ...mapState(["language"])
  },
  methods: {
    seeAll(k) {
      //查看全部将原数据赋值在新的数据上面
      this.newList[k].data = JSON.parse(JSON.stringify(this.dataList[k].data));
    },
    upData(k) {
      //收起时将原数据赋值在新的数据上面
      this.newList[k].data = JSON.parse(
        JSON.stringify(this.dataList[k].data.slice(0, 9))
      );
    },
    select(k, idx) {
      //选择的时候也要将原数组里面对应的数据进行更改
      this.newList[k].data[idx].isChecked = !this.newList[k].data[idx]
        .isChecked;
      this.dataList[k].data[idx].isChecked = !this.dataList[k].data[idx]
        .isChecked;
      if (this.newList[k].data[idx].isChecked) {
        this.checkedSession(this.newList[k].data[idx].name);
      } else {
        this.noCheckedSession(this.newList[k].data[idx].name);
      }
    },
    //重置选择
    reset() {
      this.resetData();
      wx.removeStorage({
        key: "screenData"
      });
    },
    sure() {
      wx.setStorageSync("sure", true); //点击确定的时候缓存状态，避免与回退按钮发生混淆
      wx.navigateBack();
    },
    //重置数据
    resetData() {
      let listArr = this.newList;
      let oldArr = this.dataList;
      //重置新的数据
      for (let i = 0; i < listArr.length; i++) {
        for (let j = 0; j < listArr[i].data.length; j++) {
          if (listArr[i].data[j].isChecked) {
            listArr[i].data[j].isChecked = false;
          }
        }
      }
      // 重置原来的数据
      for (let i = 0; i < oldArr.length; i++) {
        for (let j = 0; j < oldArr[i].data.length; j++) {
          if (oldArr[i].data[j].isChecked) {
            oldArr[i].data[j].isChecked = false;
          }
        }
      }
    },
    //选择的时候将数据放到缓存中
    checkedSession(data) {
      let session = wx.getStorageSync("screenData");
      let newSession = [];
      console.log(session);
      session && (newSession = session);
      if (newSession.indexOf(data) == -1) {
        newSession.push(data);
        wx.setStorage({
          key: "screenData",
          data: newSession
        });
      }
    },
    //取消选择的时候去除缓存里面相应的数据
    noCheckedSession(data) {
      let session = wx.getStorageSync("screenData");
      let index = session.indexOf(data);
      session.splice(index, 1);
      wx.setStorage({
        key: "screenData",
        data: session
      });
    },
    initPageLang() {
      this.$setTitle(this.language.title.screen);
    },
    getData() {}
  }
};
</script>
<style scoped lang=scss>
@import "./index.scss";
</style>

