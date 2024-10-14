<!-- Main路由用来显示主页面,即是登录后的页面他是被routers包含主了,所以也是有一个显示页面 
    path: "/",
    component: Layout, -->

<template>
  <div class="common-layout">
    <el-container>
      <!-- <el-aside width="200px">Aside </el-aside> -->
      <!-- 挂载Aside小组件 ,就是左边侧边栏-->
      <Aside> </Aside>
      <el-container>
        <!-- header部分 --><!-- <el-header>Header</el-header> -->
        <el-header>
          <Header />
        </el-header>
        <!-- Main部分 -->
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Aside from "../components/Aside.vue";
import Header from "../components/headerNav.vue";
</script>
<style lang="less">
.common-layout {
  height: 100%;
  .el-container {
    height: 100%;
  }
}
</style>
