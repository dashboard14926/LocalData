import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PanelHeader from "./components/panelHeader.vue";
//引入element图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

//刷新后的动态路由添加
const localData = localStorage.getItem("pz_v3pz");
if (localData) {
  store.commit("dynamicMenu", JSON.parse(localData).menu.routerList);
  store.state.menu.routerList.forEach((item) => {
    router.addRoute("main", item);
  });
}
//路由守卫
router.beforeEach((to, from) => {
  const token = localStorage.getItem("pz_token");
  //非登录页面token不存在 直接回到登录页面
  if (!token && to.path !== "/login") {
    return "/login";
  }
  //有token并且在登录页面 肯定让他通过
  else if (token && to.path === "/login") {
    return "/";
  }
  //其他情况不处理
  else {
    return true;
  }
});

const app = createApp(App);
// 全局注册element图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

//因为很多页面中都要用到这个组件,所以全局注册比较合适
app.component(PanelHeader, "PanelHeader");

//路由挂载    过载在App上面
app.use(router);
//Store挂载 (vuex引入)
app.use(store);
app.mount("#app");
