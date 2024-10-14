<template>
  <div class="container">
    <div class="header">
      <van-icon
        name="arrow-left"
        size="30"
        @click="goBack"
        style="margin-top: 7px"
      />
      <p>订单详情</p>
    </div>
    <headerNav :item="stateMap[detialData.trade_state]" />
    <div class="charge-state" v-if="detialData.trade_state === '待支付'">
      <div class="text1">订单待支付</div>
      <div class="text2">
        请在<Counter :second="second" />内完成支付,超时订单自动取消
      </div>
      <div class="text3">
        <van-button type="success" @click="payfor">支付0.5元</van-button>
        <van-dialog
          class="code"
          v-model:show="showCode"
          show-confirm-button="false"
          @confirm="confirmCode"
        >
          <van-icon name="cross" class="icon" @click="showCode = false" />
          <div class="text1">微信支付</div>
          <van-image :src="codeUrl" width="150" height="150" />
          <div>微信二维码付款</div>
        </van-dialog>
      </div>
    </div>
    <div class="dfw" v-if="detialData.trade_state === '待服务'">
      <div class="text1">正在为您安排服务员...</div>
      <div class="text2">请保持手机畅通,稍后有服务专员与您联系</div>
    </div>
    <div class="ywc" v-if="detialData.trade_state === '已完成'">
      <div class="text1">服务已完成</div>
      <div class="text2">如有售后问题,请联系客服</div>
    </div>
    <div class="yqx" v-if="detialData.trade_state === '已取消'">
      <div class="text1">订单已取消</div>
      <div class="text2">期待您的使用,如有需要请联系客服</div>
    </div>
    <van-cell-group class="content">
      <div class="header-text">预约信息</div>
      <van-cell title="预约服务" :value="detialData.service_name" />
      <van-cell title="就诊医院" :value="detialData.hospital_name" />
      <van-cell title="期望就诊时间" :value="detialData.starttime" />
      <van-cell title="就诊人" :value="client.name" />
      <van-cell title="就诊人电话" :value="client.mobile" />
      <van-cell title="接送地址" :value="detialData.receiveAddress" />
      <van-cell title="其他需求" :value="detialData.demand" />
    </van-cell-group>
    <van-cell-group class="content">
      <div class="header-text">订单信息</div>
      <van-cell title="就诊人电话" :value="detialData.tel" />
      <van-cell title="下单时间" :value="detialData.hospital_name" />
      <van-cell title="应付金额" :value="detialData.order_start_time" />
      <van-cell title="订单编号" :value="detialData.out_trade_no" />
    </van-cell-group>
  </div>
</template>
<script setup>
//预约信息
import { useRouter, useRoute } from "vue-router";
import headerNav from "../../components/headerNav.vue";
import Counter from "../../components/counter.vue";
import { computed, getCurrentInstance, onMounted, reactive, ref } from "vue";
import Qrcode from "qrcode";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
//页面数据
const detialData = reactive({});
const stateMap = {
  待支付: 10,
  待服务: 20,
  已完成: 30,
  已取消: 40,
};
const client = {
  name: "",
  mobile: "",
};
const showCode = ref(false);
//二维码地址
const codeUrl = ref("");
//计算倒计时
const second = computed(() => {
  return detialData.order_start_time
    ? detialData.order_start_time + 7200000 - Date.now()
    : 0;
});
onMounted(async () => {
  const { data } = await proxy.$api.orderDetial({ oid: route.query.oid });
  Object.assign(detialData, data.data);
  client.name = detialData.client.name;
  client.mobile = detialData.client.mobile;
  console.log(client);

  Qrcode.toDataURL(detialData.code_url).then((url) => {
    codeUrl.value = url;
  });
  console.log("detialData", detialData);
});
//退回按钮
const goBack = () => {
  router.go(-1);
};

const payfor = () => {
  showCode.value = true;
};
//支付弹窗
const confirmCode = () => {
  router.push("/order");
  showCode.value = false;
};
</script>
<style scoped lang="less">
.container {
  display: flex;
  height: auto;
  flex-direction: column;
  background-color: #f0f0f0;
  .header {
    background-color: white;
    display: flex;
    p {
      margin-left: 140px;
    }
  }
  .charge-state {
    .text1 {
      padding-left: 20px;
      padding-top: 16px;
      font-weight: bold;
      font-size: 22px;
    }
    .text2 {
      padding-left: 20px;
      color: #a59e9e;
    }
    .text3 {
      display: flex;
      margin-top: 10px;
      justify-content: center;

      .van-button {
        width: 270px;
        font-size: 18px;
      }
    }
  }
  .dfw {
    .text1 {
      font-weight: bold;
      font-size: 24px;
      margin-top: 20px;
      padding-left: 30px;
    }
    .text2 {
      padding-left: 30px;
      color: #a59e9e;
    }
  }
  .ywc {
    .text1 {
      font-weight: bold;
      font-size: 24px;
      margin-top: 20px;
      padding-left: 30px;
    }
    .text2 {
      padding-left: 30px;
      color: #a59e9e;
    }
  }
  .yqx {
    .text1 {
      font-weight: bold;
      font-size: 24px;
      margin-top: 20px;
      padding-left: 30px;
    }
    .text2 {
      padding-left: 30px;
      color: #a59e9e;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    .header-text {
      display: inline-block;
      height: 14px;
      width: 100px;
      padding: 10px 10px;
      margin-left: 7px;
      margin-top: 3px;
      font-size: 16px;
      border-left: 4px solid red;
      font-weight: bold;
    }
  }
}
.code {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  .van-image {
    padding-left: 80px;
    margin-top: 40px;
    align-items: center;
    justify-content: center;
    display: flex;
  }
  div {
    align-items: center;
    justify-content: center;
    display: flex;
  }
}
</style>
