import Vue from 'vue'
//所有接口的名称全部在该文件中描述
const api = {
  // 登陆注册
  login: "mixgo-customer-api/customer/login", //登录
  register: "mixgo-customer-api/customer/register", //注册
  sendCode: "mixgo-customer-api/customer/sendCode", //发送验证码
  weixinLogin:"mixgo-customer-api/weixin/weixinLogin",//微信登录
  getSessionKey:"mixgo-customer-api/weixin/getSessionKey",//获取session_key
  modifyPassword:"mixgo-customer-api/customer/modifyPassword",//修改密码（找回密码）
  queryCompany:"mixgo-goods-api/config/queryCompany",//关于我们
  //首页
  querySysConfig: 'mixgo-goods-api/config/querySysConfig', // 初始化接口
  queryCountry: "mixgo-goods-api/config/queryCountry", //查询国家列表
  banner: "mixgo-goods-api/discovery/queryHomeDiscovery", //轮播
  mmark: "mixgo-goods-api/home/queryHomeMainmark", //主标模块
  newlist: "mixgo-goods-api/home/queryHomeHot", //今日新选
  shophot: "mixgo-goods-api/store/queryHomeStore", //热门门店
  panohot: "panohot", //热门全景
  queryRecommandGroups: "mixgo-goods-api/home/queryRecommandGroups", //查询分组列表
  recgrp: "mixgo-goods-api/home/queryRecommandByGroupId", //查询分组下的推荐商品列表
  //门店
  queryStoreById: "mixgo-goods-api/store/queryStoreById", //门店详情
  queryStoreGoods: "mixgo-goods-api/store/queryStoreGoods", //查询门店商品列表
  queryStoreCategory: "mixgo-goods-api/store/queryStoreCategory", //查询门店类别
  queryStoreCategoryGoods: "mixgo-goods-api/store/queryStoreCategoryGoods", //查询门店类别下的商品列表
  isFavoriteStore: "mixgo-customer-api/favorite/isFavoriteStore", //是否收藏门店
  addStoreFavorite: "mixgo-customer-api/favorite/addStoreFavorite", //门店收藏
  queryFavoriteStore: "mixgo-customer-api/favorite/queryFavoriteStore", //查询收藏门店列表
  deleteStoreFavorite: "mixgo-customer-api/favorite/deleteStoreFavorite", //取消收藏门店
  queryStoreList: 'mixgo-goods-api/store/queryStoreList', // 查询门店列表
  addStoreLike: "mixgo-goods-api/store/addStoreLike", //门店点赞
  //全景
  panolist: "panolist", // 全景列表
  pano: "pano", //全景详情
  // 列表接口
  lists: "lists", //搜索
  //商品详情
  queryGoodsById: "mixgo-goods-api/goods/queryGoodsById", //查询商品详情
  condition: "mixgo-goods-api/goods/condition", //查询条件列表
  queryGoodsList: "mixgo-goods-api/goods/queryGoodsList", //查询商品列表
  isFavoriteGoods: "mixgo-customer-api/favorite/isFavoriteGoods", //是否收藏商品
  addGoodsFavorite: "mixgo-customer-api/favorite/addGoodsFavorite", //商品收藏
  queryFavoriteGoods: "mixgo-customer-api/favorite/queryFavoriteGoods", //查询收藏商品列表
  deleteGoodsFavorite: "mixgo-customer-api/favorite/deleteGoodsFavorite", //取消收藏商品
  // 基础接口
  category: "category", //分类
  stylelist: "stylelist", //分类
  spacelist: "spacelist", //空间
  brandlist: "brandlist", //品牌
  // 筛选条件
  filter: "filter", //筛选条件
  /**发现 开始 */
  queryDiscoveryById: "mixgo-goods-api/discovery/queryDiscoveryById", //查询发现详情
  queryDiscoveryList: "mixgo-goods-api/discovery/queryDiscoveryList", //查询发现列表
  addDiscoveryLike: "mixgo-goods-api/discovery/addDiscoveryLike", //发现点赞
  queryGoodsByDiscoveryId: "mixgo-goods-api/discovery/queryGoodsByDiscoveryId", //查询发现详情下的商品
  //用户中心
  // recbest: "recbest", //精品推荐
  // profile: "profile", // 账户信息
  // //收藏
  // getfav: "getfav", // 收藏接口，根据TYPE类型不同 type=3 是商店 
  // addfav: 'addfav', // 添加收藏
  // removefav: 'removefav', // 取消收藏
  // addlike: 'addlike', // 点赞
}
Vue.prototype.$api = api;
