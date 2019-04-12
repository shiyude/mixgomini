<template>
<div class="no_net_wrapper">
  <div class="no_net flex">
             <image src="/static/images/index/neterr.jpg"/>
             <text class="text">{{language.home.notNet}}</text>
             <text class="btn_text" @click="refreshFun">{{language.home.refresh}}</text> 
      </div>
      </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: ["refreshFun"],
  computed: {
    ...mapState(["language"])
  }
};
</script>
<style scoped lang=scss>
.no_net {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index:9999;
  image {
    width: 150rpx;
    height:150rpx;
  }
  text {
    font-size: 24rpx;
    &.btn_text {
      margin-top: 40rpx;
      border: 1px solid #808080;
      display: inline-block;
      width: 200rpx;
      padding: 5rpx 0;
      text-align: center;
      border-radius: 10rpx;
    }
  }
}
</style>


