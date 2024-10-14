<template>
  <PanelHeader :route="route" />
  <div class="btn">
    <el-button :icon="Plus" type="primary" @click="open(null)" size="small"
      >新增</el-button
    >
    <el-popconfirm
      confirm-button-text="是"
      cancel-button-text="否"
      :icon="InfoFilled"
      icon-color="#626AEF"
      title="确定是否删除?"
      @confirm="confirmEvent"
    >
      <template #reference>
        <el-button type="danger" :icon="DeleteFilled" size="small"
          >删除</el-button
        >
      </template>
    </el-popconfirm>
  </div>
  <el-table
    :data="tableData.list"
    style="width: 100%"
    ref="tableRef"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="avatar" label="头像">
      <template #default="scope">
        <el-image style="width: 50px; height: 50px" :src="scope.row.avatar" />
      </template>
    </el-table-column>
    <el-table-column prop="sex" label="性别">
      <template #default="scope">
        {{ scope.row.sex === "1" ? "男" : "女" }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号" />
    <el-table-column prop="active" label="状态">
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success' : 'danger'">{{
          scope.row.active === "0" ? "失效" : "生效"
        }}</el-tag></template
      >
    </el-table-column>
    <el-table-column prop="create_time" label="创建时间">
      <template #default="scope">
        <div class="flex-box">
          <el-icon><Clock /></el-icon>
          <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-info">
    <el-pagination
      v-model:current-page="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      :background="false"
      size="small"
      layout="total, prev, pager, next"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <el-dialog
    v-model="dialogFormVisible"
    :before-close="beforeClose"
    title="陪护师添加"
    width="500"
  >
    <el-form
      label-width="100px"
      label-position="left"
      ref="formRef"
      :model="form"
      :rules="rules"
    >
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id"
      /></el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-button
          v-if="!form.avatar"
          type="primary"
          @click="dialogImgVisible = true"
          >点击上传</el-button
        >
        <el-image
          v-else
          :src="form.avatar"
          style="width: 100px; height: 100px"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age" :min="18" :max="50"
      /></el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="是否生效" prop="active">
        <el-radio-group v-model="form.active">
          <el-radio :value="0">失效</el-radio>
          <el-radio :value="1">生效</el-radio>
        </el-radio-group></el-form-item
      >
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogImgVisible"
    :before-close="beforeClose"
    title="选择图片"
    width="680"
  >
    <div class="image-list">
      <div
        v-for="(item, index) in fileList"
        :key="item.name"
        class="img-box"
        @click="selectImgindex = index"
      >
        <div v-if="selectImgindex === index" class="select">
          <el-icon color="#fff"><check /></el-icon>
        </div>
        <el-image style="width: 148px; height: 148px" :src="item.url" />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogImgVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmImg">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { Plus, DeleteFilled } from "@element-plus/icons-vue";
import { onMounted, reactive, ref, nextTick } from "vue";
import {
  createCompanion,
  phoneList,
  companionList,
  deleteCompanion,
} from "../../../api";
import dayjs from "dayjs";
import { useRoute } from "vue-router";
const route = useRoute();
//获取头像
onMounted(() => {
  phoneList().then(({ data }) => {
    fileList.value = data.data;
  });
  getCompanionList();
});

const dialogFormVisible = ref(false);
const formRef = ref();
const tableRef = ref();
const form = reactive({
  id: "",
  mobile: "",
  active: 1,
  age: 28,
  avatar: "",
  name: "",
  sex: "",
});
const fileList = ref([]); //头像
const selectImgindex = ref(0); //图片选中状态
const dialogImgVisible = ref(false);
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});
const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  getListdata();
};
const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
  getListdata();
};
const selectTableData = ref([]);
const handleSelectionChange = (val) => {
  // 拿到已勾选的数据
  selectTableData.value = val.map((item) => ({ id: item.id }));
};
//列表数据
const tableData = reactive({
  list: [], //list是一个数组包含所有数据一条一条的
  total: 0, //total是一个list里面的数据的条数(比如有90条)
});
//获取陪护师列表
const getCompanionList = () => {
  companionList(paginationData).then(({ data }) => {
    const { list, total } = data.data;
    list.forEach((item) => {
      item.create_time = dayjs(item.create_time).format("YYYY-MM-DD");
    });
    tableData.list = list;
    tableData.total = total;
  });
};
//确认选择头像
const confirmImg = () => {
  dialogImgVisible.value = false;
  form.avatar = fileList.value[selectImgindex.value].url;
};
const validatePhone = (rule, value, callback) => {
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
const rules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入权限名称" }], //这个name是prop
  avatar: [{ required: true, message: "请上传图片" }],
  sex: [{ required: true, trigger: "change", message: "请选择性别" }],
  mobile: [{ required: true, validator: validatePhone, trigger: "blur" }],
});

//删除陪护师
const confirmEvent = () => {
  //没有勾选数据
  if (!selectTableData.value.length) {
    return ElMessage.warning("请至少选择一行数据");
  } else {
    deleteCompanion({ id: selectTableData.value }).then(({ data }) => {
      if (data.code === 10000) {
        ElMessage.success("删除成功");
        getCompanionList();
      }
    });
  }
};
const beforeClose = () => {
  dialogFormVisible.value = false;
  formRef.value.resetFields();
};

const open = (rowData = {}) => {
  dialogFormVisible.value = true;
  nextTick(() => {
    //如果是编辑,因为有数据,不是普通的打开
    if (rowData) {
      Object.assign(form, rowData);
    }
  });
};

const confirm = async (formEl) => {
  if (!formEl) {
    return;
  }
  await formEl.validate((valid, fields) => {
    if (valid) {
      createCompanion(form).then(({ data }) => {
        if (data.code === 10000) {
          ElMessage.success("成功");
          beforeClose();
          getCompanionList();
        } else {
          ElMessage.error(data.message);
        }
      });
    } else {
      console.log("error submit", fields);
    }
  });
};
</script>

<style scoped lang="less">
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
