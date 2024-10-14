import { createStore } from "vuex";
import menu from "./menu";
//store持久化,Vuex 的状态是存储在 JavaScript 的内存中的，当页面刷新时，所有的内存数据都会被清除，因此 Vuex 中的状态也会丢失,
//而store又管理我们路由数据,所以一刷新数据就没了
import createPersistedstate from "vuex-persistedstate";

const store = createStore({
  plugins: [
    new createPersistedstate({
      key: "pz_v3pz", //原理就是本地存储名为pz_v3pz的字符串以及对应数据
    }),
  ],
  modules: {
    menu,
  },
});

export default store;
