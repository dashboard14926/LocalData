<template>
  <!-- <el-sub-menu index="1">
    <template #title>
      <el-icon><location /></el-icon>
      <span>Navigator One</span>
    </template>
    <el-menu-item-group title="Group One">
      <el-menu-item index="1-1">item one</el-menu-item>
      <el-menu-item index="1-2">item two</el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group title="Group Two">
      <el-menu-item index="1-3">item three</el-menu-item>
    </el-menu-item-group>
    <el-sub-menu index="1-4">
      <template #title>item four</template>
      <el-menu-item index="1-4-1">item one</el-menu-item>
    </el-sub-menu>
  </el-sub-menu>
  <el-menu-item index="2">
    <el-icon><icon-menu /></el-icon>
    <span>Navigator Two</span>
  </el-menu-item>
  <el-menu-item index="3" disabled>
    <el-icon><document /></el-icon>
    <span>Navigator Three</span>
  </el-menu-item> -->

  <template v-for="(item, index) in props.menuData">
    <!-- 表示没有子菜单的进行这种方式的渲染 -->
    <el-menu-item
      @click="handleClick(item, `${props.index}-${item.meta.id}`)"
      v-if="!item.children || item.children.length == 0"
      :index="`${props.index}-${item.meta.id}`"
      :id="`${props.index}-${item.meta.id}`"
    >
      <!-- <el-icon>: 这是 Element Plus UI 库中的一个组件，用于显示图标。size="20" 属性设置图标的大小为 20 像素。
      图标的内容: <el-icon> 组件的内容是动态的，具体由 <component :is="item.meta.icon"></component> 决定。 -->
      <el-icon size="20">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.name }}</span>
    </el-menu-item>

    <!-- 有子菜单的渲染 -->
    <el-sub-menu
      v-else
      :index="`${props.index}-${item.meta.id}`"
      :id="`${props.index}-${item.meta.id}`"
    >
      <!-- 父菜单名称以及图标 -->
      <template #title>
        <el-icon size="20">
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.name }}</span>
      </template>
      <!-- 子菜单显示,蛮力遍历法 -->
      <!-- <template v-for="(child, childindex) in item.children">
        <el-menu-item
          :index="`${props.index}-${child.meta.id}`"
          :id="`${props.index}-${child.meta.id}`"
          >${{ child.meta.name }}
        </el-menu-item>
      </template> -->

      <!-- 子菜单显示treeMenu递归遍历,就是重新传数据(index,menudata),然后props接到的是新传入的数据,
       然后重新判断v-if是否有child在进行渲染
        -->
      <tree-menu
        :index="`${props.index}-${item.meta.id}`"
        :menuData="item.children"
      />
    </el-sub-menu>
  </template>
</template>
<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const props = defineProps(["menuData", "index"]);
//创建router实例,就有数据了
const router = useRouter();
//创建store实例
const store = useStore();
//点击菜单触发路由跳转  (item:就是点击哪个菜单就传进来哪个菜单的数,可以获得哪个路由的信息  active是索引值)
const handleClick = (item, active) => {
  // console.log("item", item);
  store.commit("addMenu", item.meta);
  store.commit("updateMenuActive", active);
  router.push(item.meta.path);
};
</script>
<style scoped></style>
