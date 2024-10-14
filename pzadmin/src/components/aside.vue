<!-- 用来显示侧边栏 -->
<template>
  <el-menu
    :style="{ width: !isCollapse ? '230px' : '64px' }"
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="aside-container"
    text-color="#fff"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
    :default-active="active"
  >
    <p class="logo-lg">{{ isCollapse ? "DIDI" : "DIDI陪诊" }}</p>
    <TreeMenu :menuData="menuData" :index="1" />
  </el-menu>
</template>

<script setup>
import { reactive, computed } from "vue";
import TreeMenu from "./treeMenu.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
//在该组件中引入router index.js中所创建的路由实例对象
const router = useRouter();
//创建store,因为要获取store的数据
const store = useStore();
//获取该路由实例对象中的数据
const menuData = computed(() => store.state.menu.routerList);
// console.log(store);

const isCollapse = computed(() => store.state.menu.isCollapse);
//获取默认高亮菜单
const active = computed(() => store.state.menu.menuActive);

const handleOpen = () => {};
const handleClose = () => {};
</script>

<style lang="less" scoped>
.aside-container {
  height: 100%;
}
.logo-lg {
  font-size: 20px;
  text-align: center;
  height: 50px;
  line-height: 50px;
  color: #fff;
}
</style>
