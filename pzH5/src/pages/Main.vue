<template>
  <RouterView />
  <van-tabbar v-model="active">
    <van-tabbar-item
      v-for="(item, index) in routeList"
      :to="item.path"
      :icon="item.meta.icon"
      :key="item.meta.name"
      :url="`#/${item.path}`"
      >{{ item.meta.name }}</van-tabbar-item
    >
  </van-tabbar>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute(); //是指当前路由信息也就是在你点进入了哪个路由就显示那个路由信息

const routeList = router.options.routes[0].children;
const active = ref(0);
//初始化
onMounted(() => {
  //判断给active一个索引值  当/item.path =route.path时     就是  / +  home  =  /home 这种关系判断
  active.value = routeList.findIndex((item) => "/" + item.path === route.path);
});
</script>
<style scoped lang="less"></style>
