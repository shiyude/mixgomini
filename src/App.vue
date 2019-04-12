
<script>
import { mapState, mapMutations } from "vuex";
export default {
  onLaunch() {
    this.initCountryConfig();
    this.initLang();
    this.$getSessionKey();
  },
  methods: {
    ...mapMutations(["changeInitCountry", "changeLanguage", "changeLangType"]),
    initCountryConfig() {
      let country = wx.getStorageSync("country") || "1";
      this.changeInitCountry(country);
    },
    initLang() {
      const storageLang = wx.getStorageSync("lang") || "";
      const EnglishJson = require("./language/en-us.json");
      const ChineseJson = require("./language/cn-zh.json");
      let langType = null; //语言类型
      if (!storageLang) {
        try {
          const res = wx.getSystemInfoSync(); //获取系统语言
          console.log(res.language);
          if (res.language == "zh_CN") {
            langType = 1;
          } else {
            langType = 2;
          }
        } catch (e) {
          langType = 1;
        }
      } else {
        if (storageLang == "zh-CN") {
          langType = 1;
        } else {
          langType = 2;
        }
      }
      if (langType == 1) {
        //中文
        wx.setStorageSync("lang", "zh-CN");
        this.changeLanguage(ChineseJson);
        this.changeLangType("zh-CN");
      } else {
        //英文
        wx.setStorageSync("lang", "en_US");
        this.changeLanguage(EnglishJson);
        this.changeLangType("en_US");
      }
    }
  }
};
</script>

<style>
</style>
