<template>
  <div class="header-container">
    <div class="header-left flex-box">
      <el-icon class="icon" size="20" @click="store.commit('collapseMenu')"
        ><Fold />
      </el-icon>
      <ul class="flex-box">
        <li
          v-for="(item, index) in selectMenu"
          :key="item.path"
          class="tab flex-box"
          :class="{ selected: route.path === item.path }"
        >
          <el-icon size="12">
            <component :is="item.icon"></component>
          </el-icon>
          <router-link class="text flex-box" :to="{ path: item.path }">
            {{ item.name }}
          </router-link>
          <el-icon size="12" class="close" @click="closeTab(item, index)"
            ><Close
          /></el-icon>
        </li>
      </ul>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleClick">
        <div class="el-dropdown-link flex-box">
          <el-avatar :src="userInfo.avatar" />
          <p class="user-name">{{ userInfo.name }}</p>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="cancel">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
const store = useStore();
const route = useRoute();
const router = useRouter();
const selectMenu = computed(() => store.state.menu.selectMenu);

const userInfo = JSON.parse(localStorage.getItem("pz_userInfo"));

//点击关闭tab
const closeTab = (item, index) => {
  //调用menu.js中mutations的closeTab
  store.commit("closeMenu", item);
  //删除的是非当前页
  if (route.path !== item.path) {
    return;
  }
  const selectMenuData = selectMenu.value; //computed获取的是ref值
  // 删除的列表中最后一项  此时index应该是从1开始,这样索引index 才能对应数组长度
  if (index === selectMenuData.length) {
    //如果tag只有最后一个元素  删除就没了就回到个根目录
    if (!selectMenuData.length) {
      router.push("/");
    }
    //如果不止有一个元素,删除掉了当前的tag,就会呈现前一个tag了
    else {
      router.push({
        path: selectMenuData[index - 1].path,
      });
    }
  } else {
    //如果删除的是中间tag 删除了当前的就显示后面的新索引对应的tag
    router.push({
      path: selectMenuData[index].path,
    });
  }
};
const handleClick = (command) => {
  if (command === "cancel") {
    localStorage.removeItem("pz_token");
    localStorage.removeItem("pz_userInfo");
    localStorage.removeItem("pz_v3pz");
    // 使用 window.location.href = window.location.origin 可以简单地重定向到应用的根 URL，从而清除当前页面的状态。
    //原理就是访问主页,触发路由守卫
    window.location.href = window.location.origin;

    // router.push("/login");
  }
};
</script>
<style scoped lang="less">
.flex-box {
  display: flex;
  align-items: center;
  height: 100%;
}
.header-container {
  display: flex;
  justify-content: space-between; //把容器里面的内容放周围两边
  align-items: center;
  height: 100%;
  background-color: #fff;
  padding-right: 25px;
  .header-left {
    height: 100%;
    .icon {
      width: 45px;
      height: 100%;
    }
    .icon:hover {
      background-color: #f5f5f5; //鼠标放上去有颜色变化
      cursor: pointer; //鼠标放上去变成小手
    }

    .tab {
      padding: 0 10px;
      height: 100%;
      .text {
        margin: 0 5px;
      }
      .close {
        visibility: hidden;
      }
      &.selected {
        a {
          color: #409eff;
        }
        i {
          color: #409eff;
        }
        background-color: #f5f5f5;
      }
    }
    .tab:hover {
      background-color: #f5f5f5;
      .close {
        visibility: inherit;
        cursor: pointer;
      }
    }
  }
  .header-right {
    .user-name {
      padding-left: 10px;
    }
  }
  a {
    height: 100%;
    color: #333;
    font-size: 15px;
  }
}
</style>
