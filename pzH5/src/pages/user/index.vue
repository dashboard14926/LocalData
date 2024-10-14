<template>
  <div class="container">
    <div class="header">
      <van-image
        :src="userInfo.avatar"
        style="height: 120px; width: 120px; margin-top: 16px"
      ></van-image>
      <div>{{ userInfo.name }}</div>
    </div>
    <div class="middle">
      <div class="top">
        <div class="left">我的订单</div>
        <div class="right" @click="goOrder">全部</div>
      </div>
      <div class="buttom">
        <div class="text1">
          <van-image
            src="/pzH5/images/dzf.png"
            width="40"
            height="40"
            @click="goOrder(1)"
          ></van-image>
          <div>待支付</div>
        </div>
        <div class="text1">
          <van-image
            src="/pzH5/images/dfw.png"
            width="40"
            height="40"
            @click="goOrder(2)"
          ></van-image>
          <div>待服务</div>
        </div>
        <div class="text1">
          <van-image
            src="/pzH5/images/ywc.png"
            width="40"
            height="40"
            @click="goOrder(3)"
          ></van-image>
          <div>已完成</div>
        </div>
        <div class="text1">
          <van-image
            src="/pzH5/images/yqx.png"
            width="40"
            height="40"
            @click="goOrder(4)"
          ></van-image>
          <div>已取消</div>
        </div>
      </div>
    </div>
    <div class="footer"></div>
    <div class="btn">
      <van-button type="danger" size="large" @click="showConfirm = true"
        >退出登录</van-button
      >
    </div>
    <van-dialog
      v-model:show="showConfirm"
      show-cancel-button
      class="dialog"
      @confirm="logout"
    >
      <template #title> 提示 </template>
      <div style="padding-left: 82px; margin: 13px auto">是否确定退出登录</div>
    </van-dialog>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const userInfo = reactive({});
const showConfirm = ref(false);
onMounted(() => {
  const LocalUserInfo = JSON.parse(localStorage.getItem("h5_userInfo"));
  if (LocalUserInfo) {
    Object.assign(userInfo, LocalUserInfo);
  }
  console.log(userInfo.avatar);
});
const goOrder = (active) => {
  router.push(`/order?active=${active}`);
};
const logout = () => {
  localStorage.removeItem("h5_userInfo");
  localStorage.removeItem("h5_token");
  router.push("/login");
};
</script>
<style scoped lang="less">
.container {
  width: 100%;
  display: flex;
  align-items: center;
  min-height: 100vh;
  flex-direction: column; //垂直排列
  background-color: #f0f0f0;
  .header {
    margin-top: 5px;
    width: 97%;
    height: 215px;
    border-radius: 16px;
    background-color: white;
    flex-direction: column; //垂直排列
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .middle {
    margin-top: 10px;
    width: 97%;
    height: 200px;
    background-color: white;
    .top {
      display: flex;
      flex-direction: row;
      height: 60px;
      margin-top: 30px;
      font-size: 16px;
      .left {
        margin-left: 18px;
        font-size: 18px;
      }
      .right {
        margin-left: 220px;
        font-size: 18px;
        color: #aca9a9;
        font-weight: 500;
      }
    }
    .buttom {
      margin-top: 17px;
      display: flex;
      height: 100px;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .text1 {
        display: flex;
        align-items: center;
        flex-direction: column;
        height: 56px;
        width: 80px;
        margin: 8px;
        padding: 20px;
        div {
          margin-top: 6px;
          font-size: 13px;
        }
      }
    }
  }
  .btn {
    .van-button {
      margin-top: 16px;
      width: 330px;
    }
  }
}
</style>
