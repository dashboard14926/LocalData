<template>
  <div class="container">
    <div class="header">
      <p>我的订单</p>
      <van-tabs v-model:active="active" class="nav" @click-tab="onClickTab">
        <van-tab title="全部" name="" />
        <van-tab title="待支付" name="1" />
        <van-tab title="待服务" name="2" />
        <van-tab title="已完成" name="3" />
        <van-tab title="已取消" name="4" />
      </van-tabs>
    </div>
    <van-row
      class="row"
      v-for="(item, index) in orderTable"
      :key="orderTable.out_trade_no"
      @click="goDetial(item)"
    >
      <van-col span="5"
        ><van-image
          :src="item.serviceImg"
          style="width: 50px; height: 50px"
          redius="5"
      /></van-col>
      <van-col span="14"
        ><div class="text1">{{ item.service_name }}</div>
        <div class="text2">{{ item.hospital_name }}</div>
        <div class="text2">预约时间:{{ item.starttime }}</div></van-col
      >
      <van-col
        span="5"
        :style="{ color: colorRes[item.trade_state] }"
        class="charge"
        >{{ item.trade_state }}
        <Counter :second="item.timer" v-if="item.trade_state === '待支付'" />
      </van-col>
    </van-row>
    <div class="end">没有更多了</div>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import Counter from "../../components/counter.vue";
import { useRouter } from "vue-router";
const active = ref([]);
const router = useRouter();
const { proxy } = getCurrentInstance();
//支付状态管理
const colorRes = {
  待支付: "#ffa200",
  待服务: "#1da6fd",
  已完成: "#21c521",
  已取消: "grey",
};
//订单列表显示
const orderTable = ref([]);
onMounted(() => {
  getOrderList("");
});
//获取订单列表
const getOrderList = async (state) => {
  const { data } = await proxy.$api.orderList({ state });
  data.data.forEach((element) => {
    element.timer = element.order_start_time + 7200000 - Date.now();
  });
  orderTable.value = data.data;
  console.log(orderTable.value);
};
const onClickTab = (item) => {
  //item是这个van-tab实例对象,可以获取到name,title等等
  getOrderList(item.name);
};
//点击订单跳转至订单的详情
const goDetial = (item) => {
  router.push(`/detail?oid=${item.out_trade_no}`);
};
</script>
<style scoped lang="less">
.container {
  display: flex;
  height: 100vh;
  flex-direction: column; //垂直排列
  background-color: #f0f0f0;
  .header {
    background-color: white;
    text-align: center;
  }
  .row {
    background-color: white;
    padding: 5px;
    margin: 5px;
    .text1 {
      padding-top: 0px;
      font-weight: bold;
      font-size: 16px;
    }
    .text2 {
      font-size: 14px;
      color: rgb(188, 188, 178);
    }
    .charge {
      font-size: 15px;
    }
  }
  .end {
    margin-top: 3px;
    text-align: center;
    font-size: 20px;
    color: #848181;
  }
}
</style>
