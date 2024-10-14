<template>
  <div class="header">
    <div class="header-left">
      <van-icon name="location" />
      <span>中部地区</span> <van-icon name="arrow" style="margin-left: 10px" />
    </div>
    <div class="header-right" style="margin-left: 15px">
      <van-search
        v-model="searchValue"
        placeholder="请输入搜索关键词"
        shape="round"
      />
    </div>
  </div>
  <div class="banner">
    <van-swipe :autoplay="3000" lazy-render height="170px">
      <van-swipe-item v-for="(image, index) in homeData.slides" :key="image.id">
        <van-image :src="image.pic_image_url" radius="10px" />
      </van-swipe-item>
    </van-swipe>
  </div>
  <van-row justify="space-around">
    <van-col
      v-for="(image, index) in homeData.nav2s"
      span="11"
      :key="image.id"
      @click="goOederTwo(index)"
      ><van-image :src="image.pic_image_url"
    /></van-col>
  </van-row>
  <van-row
    justify="space-around"
    v-for="(item, index) in homeData.hospitals"
    :key="item.id"
    class="middle-box"
    @click="goOrder(item)"
  >
    <van-col :key="item.id" span="6" class="image-column"
      ><van-image :src="item.avatar_url" class="image"
    /></van-col>
    <van-col span="15" class="text-column">
      <div class="text-content">
        <h3 class="h3">{{ item.name }}</h3>
        <!-- 第一段 -->
        <span style="margin-right: 10px">{{ item.rank }}</span
        ><span>{{ item.label }}</span>
        <!-- 第二段 -->
        <p>{{ item.intro }}</p>
        <!-- 第三段 -->
      </div>
    </van-col>
  </van-row>
</template>
<script setup>
import { onMounted, ref, getCurrentInstance, reactive } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const searchValue = ref("");
const { proxy } = getCurrentInstance();
const homeData = reactive({
  hospitals: [],
  nav2s: [],
  navs: [],
  now: "",
  slides: [],
});
// setTimeout(() => {  可打印
//   console.log("homeData.hospitals", JSON.stringify(homeData.hospitals));
//   console.log("homeData.nav2s", JSON.stringify(homeData.nav2s));
//   console.log("homeData", JSON.stringify(homeData));
// }, 1000);
//快捷入口middle  //执行的异步操作会在consolog后面执行,所以刚开始打印出的解构会是空的,然后后面在赋值就可以渲染到dom里面了
//console.log("homeData.hospitals", JSON.stringify(homeData.hospitals));
//console.log("homeData.nav2s", JSON.stringify(homeData.nav2s));
// console.log("homeData", JSON.stringify(homeData));

//快捷入口
const goOederTwo = (index) => {
  router.push(`/createOrder?id=${homeData.hospitals[index].id}`);
};

//医院列表点击快捷入口
const goOrder = (data) => {
  router.push(`/createOrder?id=${data.id}`);
};
onMounted(async () => {
  const { data } = await proxy.$api.index();
  homeData.hospitals = data.data.hospitals;
  homeData.nav2s = data.data.nav2s;
  homeData.navs = data.data.navs;
  homeData.now = data.data.now;
  homeData.slides = data.data.slides;
  console.log(homeData.nav2s);
});
</script>
<style scoped lang="less">
.header {
  display: flex; /* 使用 Flexbox 布局 */
  align-items: center; /* 垂直居中对齐 */
  padding: 5px; /* 添加一些内边距 */
  height: 100%;
}
.banner {
  display: flex;
  width: 100%;
  justify-content: center;
  .van-image {
    border: 5px solid transparent;
  }
}
.flex-box {
  display: flex;
  align-items: center;
}
.middle-box {
  margin-bottom: 20px; /* 行之间的间距 */
}

.image-column {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: flex-start; /* 使图片与文本顶部对齐 */
}

.image {
  padding-top: 10px;
  max-width: 100%; /* 图片自适应宽度 */
  height: 110px; /* 保持纵横比 */
}

.text-column {
  display: flex;
  flex-direction: column; /* 垂直排列文本 */
  justify-content: flex-start; /* 将内容对齐到顶部 */
  padding: 10px; /* 内边距 */
  height: 110px;
}

.text-content {
  text-align: left; /* 文本左对齐 */
  .h3 {
    padding-top: 0;
  }
  span {
    font-weight: bolder;
    color: rgb(113, 149, 149);
  }
  p {
    margin-bottom: 5px;
    font-size: 14px;
  }
}

.text-content h3 {
  margin: 0; /* 去掉默认外边距 */
  padding: 0; /* 去掉内边距 */
}

.text-content p {
  margin: 5px 0; /* 设置段落之间的外边距 */
}
</style>
