import { updateUserData } from "../api";

const localData = localStorage.getItem("pz_v3pz");

const state = localData
  ? localData.menu
  : {
      isCollapse: false,
      selectMenu: [],
      routerList: [], //动态路由数据
      menuActive: "1-1",
    };

const mutations = {
  collapseMenu(state) {
    state.isCollapse = !state.isCollapse;
  },
  addMenu(state, payload) {
    //state是state里面的源数据,而payload是传入的新数据
    //对数据进去去重 (防止疯狂点击重复添加相同数据)
    if (
      state.selectMenu.findIndex((item) => item.path === payload.path) === -1
    ) {
      state.selectMenu.push(payload);
    }
  },
  closeMenu(state, payload) {
    //找到点击数据的索引值
    const index = state.selectMenu.findIndex(
      (item) => item.name === payload.name
    );
    //通过索引删除数组指定元素
    state.selectMenu.splice(index, 1);
  },

  //添加路由数据
  dynamicMenu(state, payload) {
    //通过glob动态导入文件
    const modules = import.meta.glob("../views/**/**/*.vue"); //获取view的所有路由数据
    console.log("Payload:", payload);
    function routerSet(router) {
      router.forEach((route) => {
        //判断没有子菜单,拼接数据
        if (!route.children) {
          const url = `../views${route.meta.path}/index.vue`;
          //拿到获取的vue组件
          route.component = modules[url];
        } else {
          routerSet(route.children);
        }
      });
      return router;
    }
    state.routerList = routerSet(payload);
  },

  updateMenuActive(state, payload) {
    state.menuActive = payload;
  },
};

export default {
  state,
  mutations,
};
