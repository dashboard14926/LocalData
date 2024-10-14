<template>
  <div class="container">
    <div class="header">
      <van-icon name="arrow-left" size="30" @click="goBack" />
      <p style="text-align: center">填写服务菜单</p>
    </div>
    <HeaderNav item="0" />
    <van-cell class="middle">
      <template #title>
        <van-image :src="createInfo.service.serviceImg" />
        <span>{{ createInfo.service.serviceName }}</span>
      </template>
      <template #default>
        <van-icon name="info-o" style="margin-right: 18px" />
        <span>服务内容</span>
      </template>
    </van-cell>
    <van-cell-group class="form">
      <van-cell class="cell"
        ><template #title> 就诊医院 </template>
        <template #default
          ><span @click="showHospitals = true">{{
            form.hospital_name ? form.hospital_name : "请选择医院"
          }}</span
          ><van-icon name="arrow"></van-icon>
        </template>
      </van-cell>
      <van-popup
        round
        v-model:show="showHospitals"
        position="bottom"
        :style="{ height: '35%' }"
        lock-scroll="false"
      >
        <van-picker
          :columns="columnsHospitals"
          @confirm="confirmHospitals"
          @cancel="showHospitals = false"
        />
      </van-popup>
      <van-cell class="cell"
        ><template #title> 就诊时间 </template>
        <template #default
          ><span @click="showTime = true"
            >{{ currentDate ? currentDate : "请选择时间" }} </span
          ><van-icon name="arrow"></van-icon>
        </template>
      </van-cell>
      <van-popup
        round
        v-model:show="showTime"
        position="bottom"
        :style="{ height: '35%' }"
      >
        <van-date-picker
          title="选择年月"
          @cancel="showTime = false"
          @confirm="confirmTime"
        />
      </van-popup>
      <van-cell class="cell"
        ><template #title>陪诊师 </template>
        <template #default
          ><span @click="showCompanion = true">{{
            companionName ? companionName : "请选择陪诊师"
          }}</span
          ><van-icon name="arrow"></van-icon>
        </template>
      </van-cell>
      <van-popup
        round
        v-model:show="showCompanion"
        position="bottom"
        :style="{ height: '35%' }"
      >
        <van-picker
          :columns="columnsCompanion"
          @confirm="confirmCompanion"
          @cancel="showCompanion = false"
        />
      </van-popup>
      <van-cell class="cell">
        <template #title> 接送地址 </template>
        <van-field
          input-align="right"
          v-model="form.receiveAddress"
          placeholder="请填写请填写地址"
      /></van-cell>
      <van-cell class="cell">
        <template #title> 联系电话 </template
        ><van-field
          input-align="right"
          v-model="form.tel"
          placeholder="请填写电话号码"
      /></van-cell>
      <van-cell class="deft">
        <template #title>
          <p>服务需求</p>
        </template></van-cell
      >
      <van-cell>
        <van-field
          v-model="form.demand"
          style="height: 100px"
          placeholder="简单描述你选择科室的目的"
        />
      </van-cell>
    </van-cell-group>
    <van-button block type="primary" @click="submitForm" class="btn"
      >提交订单
    </van-button>
    <!-- 支付二维码 -->
    <van-dialog
      class="code"
      v-model:show="showCode"
      show-confirm-button="false"
      @confirm="confirmCode"
    >
      <van-icon name="cross" class="icon" @click="showCode = false" />
      <div style="margin-top: 10px">微信支付</div>
      <van-image :src="codeUrl" width="150" height="150" />
      <div>请使用本人微信二维码付款</div>
    </van-dialog>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import HeaderNav from "../../components/headerNav.vue";
import { getCurrentInstance, onMounted, reactive, ref, computed } from "vue";
import Qrcode from "qrcode";
const { proxy } = getCurrentInstance();
const router = useRouter();
const createInfo = reactive({
  companion: [],
  hospitals: [],
  service: {},
});
//二维码地址
const codeUrl = ref("");
//控制二维码弹窗
const showCode = ref(false);
const showHospitals = ref(false);
//默认开始时间
const currentDate = ref();
const showTime = ref(false);
//订单成功要提交给后端的数据c选择的医院
const form = reactive({
  hospital_id: "",
  hospital_name: "",
  starttime: "",
  companion_id: "",
  receiveAddress: "",
  tel: "",
  demand: "",
});
const showCompanion = ref(false);
const companionName = ref("");
onMounted(async () => {
  const data = await proxy.$api.h5companion();
  Object.assign(createInfo, data.data.data);
  console.log(createInfo.hospitals);
});

//popup弹出框里面pickup选择框数据
const columnsHospitals = computed(() => {
  return createInfo.hospitals.map((item) => {
    return { text: item.name, value: item.id };
  });
});
//需要遍历的陪诊师列表
const columnsCompanion = computed(() => {
  return createInfo.companion.map((item) => {
    return { text: item.name, value: item.id };
  });
});
//时间正确显示
// const selectTime = computed(() => {
//   return Object.values(timeArr.value).join("-");
// });
//点击退回主页面
const goBack = () => {
  // router.push("/home");
  router.go(-1);
};
//确认选择医院
const confirmHospitals = ({ selectedOptions }) => {
  showHospitals.value = false;
  form.hospital_id = selectedOptions[0].value;
  console.log("form.hospital_id ", form.hospital_id);

  form.hospital_name = selectedOptions[0].text;
};
//确认时间选择
const confirmTime = ({ selectedValues }) => {
  //将数组形式时间转换为字符串
  const datastr = selectedValues.join("-");
  currentDate.value = datastr;
  //时间转化为时间戳
  form.starttime = new Date(datastr).getTime();
  showTime.value = false;
};
//确认陪诊师选择
const confirmCompanion = (data) => {
  form.companion_id = data.selectedValues[0];
  console.log(form.companion_id);
  companionName.value = data.selectedOptions[0].text;
  showCompanion.value = false;
};

//表单提交
const submitForm = async () => {
  console.log(form);
  const item = [
    "hospital_id",
    "hospital_name",
    "starttime",
    "companion_id",
    "receiveAddress",
    "tel",
    "demand",
  ];
  for (const i of item) {
    if (!form[i]) {
      //遍历form对象,判断是否为空,form["hospital_id"] 对象值特殊写法
      showNotify({ message: "请把每一项都填写" });
      return;
    }
  }
  const data = await proxy.$api.createOrder(form);
  console.log(data.data.data.wx_code);
  //将后端发送的图片数据转化为二维码 ,并且返回一个二维码链接
  Qrcode.toDataURL(data.data.data.wx_code).then((url) => {
    codeUrl.value = url;
    showCode.value = true;
  });
};

//支付弹窗
const confirmCode = () => {
  router.push("/order");
  showCode.value = false;
};
</script>
<style scoped lang="less">
.container {
  position: relative;
  background-color: #f0f0f0;
  height: 100vh;
}
.header {
  display: flex;
  align-items: center; /* header里面的盒子垂直居中对齐 */
  p {
    font-size: 16px;
    margin-left: 120px;
  }
}
.middle {
  width: 95%;
  margin: 0 auto;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px; /* 设置高度以便更好地查看对齐效果 */

  .van-image {
    height: 25px;
    width: 25px;
    padding-right: 10px;
  }
  ::v-deep(.van-cell__title) {
    display: flex;
    align-items: center;
  }
  span {
    font-size: 16px;
    line-height: 17px;
  }
}
.form {
  flex-direction: column;
  display: flex;
  width: 95%;
  margin: 5px auto;
  align-items: center;
  justify-content: center;
  .cell {
    height: 55px;
    align-items: center;
    justify-content: center;
  }
}
.deft {
  background-color: #f0f0f0;
}
.btn {
  position: absolute;
  bottom: 0;
}
.code {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  .icon {
    position: absolute; /* 绝对定位图标 */
    top: 15px; /* 距离顶部10px */
    left: 15px; /* 距离左侧10px */
    align-items: center;
    justify-content: center;
    display: flex;
  }
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
