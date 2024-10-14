<template>
  <div class="login-container">
    <h2>用户登录</h2>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="form.userName"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="form.passWord"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>
<script setup>
import { reactive, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
//获取当前Vue实例
const { proxy } = getCurrentInstance();
//表单数据
const form = reactive({
  userName: "",
  passWord: "",
});
//表单提交
const onSubmit = async () => {
  const { data } = await proxy.$api.login(form);
  console.log(data);

  if (data.code === 10000) {
    showToast("恭喜你,登陆成功");
    localStorage.setItem("h5_token", data.data.token);
    localStorage.setItem("h5_userInfo", JSON.stringify(data.data.userInfo));
    router.push("/home");
  }
};
</script>
<style scoped lang="less">
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* 可选：如果您希望表单水平居中 */
  justify-content: flex-start; /* 确保内容从顶部开始 */
  height: 100vh; /* 设置高度为 100vh 以使其占满整个视口高度 */
  padding-top: 20px; /* 可选：增加顶部间距 */
}
</style>
