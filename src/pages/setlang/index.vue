<template>
  <div class="setlang">
    <div class="setlang_item flex" @click="setCn">
      <text>{{language.setlang.chinese}}</text>
      <icon type="success_no_circle" size="20" color="#2ac6f7" v-if="isActive" />
    </div>
    <div class="setlang_item flex" @click="setEn">
      <text>{{language.setlang.english}}</text>
      <icon type="success_no_circle" size="20" color="#2ac6f7" v-if="!isActive" />
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      isActive: true
    };
  },
  mounted() {
    this.initPageLang();
  },
  computed: {
    ...mapState(["language", "langType"])
  },
  methods: {
    ...mapMutations(["changeLanguage", "changeLangType"]),
    //设置中文
    setCn() {
      const lang = require("../../language/cn-zh.json");
      this.isActive = true;
      this.changeLanguage(lang);
      this.changeLangType("zh-CN");
      wx.setStorageSync("lang", "zh-CN");

      this.changeLang();
    },
    // 设置英文
    setEn() {
      const lang = require("../../language/en-us.json");
      this.isActive = false;
      this.changeLanguage(lang);
      this.changeLangType("en_US");
      wx.setStorageSync("lang", "en_US");
      this.changeLang();
    },
    changeLang() {
      this.$setTitle(this.language.title.language);
    },
    initPageLang() {
      this.$setTitle(this.language.title.language);
      if (this.langType == "zh-CN") {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
    }
  }
};
</script>
<style scoped lang=scss>
.setlang {
  padding: 0 30rpx;
  height: 100%;
  position: relative;
  .setlang_item {
    height: 100rpx;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #eeeded;
    text {
      font-size: 30rpx;
      color: #2b2b2b;
    }
  }
}
</style>

