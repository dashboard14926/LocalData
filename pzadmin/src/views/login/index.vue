<!-- 登录页面,也是注册了一个路由,跟Main一样是独立的 -->
<template>
  <el-row class="login-container" justify="center" align="middle">
    <el-card style="max-width: 480px">
      <!-- #是v-shot的缩写 -->
      <template #header>
        <div class="card-header">
          <img :src="imgUrl" alt="" />
        </div>
      </template>
      <div class="jump-link">
        <el-link type="primary" @click="handleChange"
          >{{ formType ? "返回登录" : "立即注册" }}
        </el-link>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        max-width="600px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.userName"
            placeholder="手机号"
            :prefix-icon="UserFilled"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input
            v-model="loginForm.passWord"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="validCode" v-if="formType">
          <el-input
            v-model="loginForm.validCode"
            placeholder="验证码"
            :prefix-icon="Lock"
          >
            <template #append>
              <span @click="changecountDown" class="validcode">{{
                countDown.validText
              }}</span>
            </template></el-input
          >
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :style="{ width: '100%' }"
            @click="submitForm(loginFormRef)"
            >{{ formType ? "注册账号" : "登录" }}</el-button
          ></el-form-item
        >
      </el-form>
    </el-card>
  </el-row>
</template>
<script setup>
import { ref, reactive, computed, toRaw } from "vue";
import { getCode, userAuthentication, login, menuPermissions } from "../../api";
import { ElMessage } from "element-plus";
import { UserFilled, Lock } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
//传入src外层的图标
const imgUrl = new URL("../../../public/login-head.png", import.meta.url).href;
const router = useRouter();
const store = useStore();
//设置登录状态(1登录登录页面,0为注册页面)  登录页面显示立即注册 注册页面显示返回登录
const formType = ref(0);
//表单数据
const loginForm = reactive({
  userName: "",
  passWord: "",
  validCode: "",
});

const routerList = computed(() => store.state.menu.routerList);
//点击切换登录和注册
const handleChange = () => {
  formType.value = formType.value ? 0 : 1;
};

//账号校验   在输入完成或者
const validateUser = (rule, value, callback) => {
  //不能为空
  if (value === "") {
    callback(new Error("请输入账号"));
  } else {
    const phoneReg =
      /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    phoneReg.test(value)
      ? callback()
      : callback(new Error("手机号格式不正确,请输入正确手机号"));
  }
};

//密码校验
const validatePass = (rule, value, callback) => {
  //不能为空
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    const reg = /^[a-zA-Z0-9_-]{4,16}$/;
    reg.test(value)
      ? callback()
      : callback(new Error("密码格式不正确,需要4到16位字符,请确认格式"));
  }
};
//表单校验  校验规则
const rules = reactive({
  userName: [{ validator: validateUser, trigger: "blur" }],
  passWord: [{ validator: validatePass, trigger: "blur" }],
});
//发送短信
const countDown = reactive({
  validText: "获取验证码",
  time: 60,
});
let flag = false;
const changecountDown = () => {
  //如果已发送不处理
  if (flag) return;
  //判断手机号是否正确
  const phoneReg =
    /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
  if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
    return ElMessage({
      message: "请检查手机号是否正确",
      type: "warning",
    });
  }
  //倒计时
  const timeId = setInterval(() => {
    if (countDown.time <= 0) {
      countDown.time = 60;
      countDown.validText = "获取验证码";
      flag = false;
      clearInterval(timeId);
    } else {
      countDown.time -= 1;
      countDown.validText = `验证码倒计时${countDown.time}`;
    }
  }, 1000);
  flag = true;
  getCode({ tel: loginForm.userName }).then(({ data }) => {
    if (data.code === 10000) {
      ElMessage.success("发送成功");
    }
  });
};
const loginFormRef = ref();
//表单提交
const submitForm = async (formEl) => {
  if (!formEl) return;
  //手动触发校验(只是看看)
  await formEl.validate((valid, fields) => {
    if (valid) {
      //注册页面
      if (formType.value) {
        userAuthentication(loginForm).then(({ data }) => {
          if (data.code === 10000) {
            ElMessage.success("注册成功,请完成登录");
            formType.value = 0;
          }
        });
      } else {
        //登录页面
        login(loginForm).then(({ data }) => {
          if (data.code === 10000) {
            ElMessage.success("登录成功");
            console.log(loginForm);

            localStorage.setItem("pz_token", data.data.token);
            localStorage.setItem(
              "pz_userInfo",
              JSON.stringify(data.data.userInfo)
            ); //userInfo是name等等
            //根据不同用户显示不同的页面效果
            menuPermissions().then(({ data }) => {
              store.commit("dynamicMenu", data.data);
              console.log(routerList);
              toRaw(routerList.value).forEach((route) => {
                //动态添加路由
                router.addRoute("main", route);
              });
              router.push("/");
            });
          }
        });
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
<style scoped lang="less">
:deep(.el-card__header) {
  padding: 0;
}
.login-container {
  height: 100%;
  .card-header {
    background-color: #899fe1;
    img {
      width: 430px;
    }
  }
  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
.validcode {
  cursor: pointer;
}
</style>
