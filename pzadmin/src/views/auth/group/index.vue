<template>
  <PanelHeader :route="route" />
  <div class="btn">
    <el-button :icon="Plus" type="primary" @click="open(null)" size="small"
      >添加</el-button
    >
  </div>
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="permissionName" label="菜单权限" width="500px" />
    <el-table-column label="操作">
      <!-- 行渲染: el-table 会遍历这个数据源数组，并为每一行生成一个对应的 DOM 元素。在这个过程中，
       Element Plus 会为每一行自动创建一个上下文对象（即 scope），这个对象包含了与当前行相关的信息().
       scope 对象的概念主要适用于表格组件 
       就是这个具名插槽放在哪个表格就获取哪个表格中数据
       -->
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
    title="添加权限"
    width="500"
  >
    <el-form
      ref="formRef"
      label-width="100px"
      label-position="left"
      :model="form"
      :rules="rules"
    >
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写权限名称" />
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree
          ref="treeRef"
          style="max-width: 600px"
          :data="permissionData"
          node-key="id"
          show-checkbox
          :default-checked-keys="defaultKeys"
          :default-expanded-keys="[2]"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import { userGetmenu, userSetmenu, menuList } from "../../../api";
import { Plus } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
const route = useRoute();
onMounted(() => {
  //菜单数据
  userGetmenu().then(({ data }) => {
    //data收到的是后端给的数据 这段数据将影响el-tree中的结构 data是一个形参对象,要获取data对象的data数据
    //将树形菜单权限数据 进行更新
    permissionData.value = data.data;
  });
  getListdata();
});

//列表数据
const tableData = reactive({
  list: [], //list是一个数组包含所有数据一条一条的
  total: 0, //total是一个list里面的数据的条数(比如有90条)
});

//弹窗打开
const open = (rowData = {}) => {
  dialogFormVisible.value = true;
  //弹窗打开form生成是异步的
  nextTick(() => {
    if (rowData) {
      // 因为这个是编辑内容,所以要获取当前列表的数据,并把数据自动填充懂到form表单中
      Object.assign(form, { id: rowData.id, name: rowData.name });
      // 设置目前勾选的节点，使用此方法必须提前设置 node-key 属性
      treeRef.value.setCheckedKeys(rowData.permission);
    }
  });
};
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});
//把每页显示多少个数据给后端
const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  getListdata();
};
//这个就是获取页码比如点到第二页val就是2,然后把2给paginationData.pageNum
// 然后调用 getListdata();就可以把页码给后端,后端就根据页码2的话,假如一页10条数据
// 就根据(page_num - 1) * page_size设置为开始索引就是11
//start_index + page_size 设置为结束索引就知道取哪里的数据 这就是分页的原理
const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
  getListdata();
};
//请求列表数据
const getListdata = () => {
  //发这个页码,以及
  menuList(paginationData).then(({ data }) => {
    console.log(data);
    const { list, total } = data.data;
    tableData.list = list;
    tableData.total = total;
  });
};

const formRef = ref();
//form的数据
const form = reactive({
  name: "",
  permissions: "",
  id: "",
});

//树形菜单权限数据
const permissionData = ref([]);

//控制弹窗的显示隐藏
const dialogFormVisible = ref(false);

//关闭前弹窗的回调
const beforeClose = () => {
  dialogFormVisible.value = false;
  //重置表单
  formRef.value.resetFields();
  //tree选择重置
  treeRef.value.setCheckedKeys(defaultKeys);
};

//选中权限   (因为要点击弹窗默认勾选菜单管理,权限管理,这些数据都是从后端获取的
// 因为default-checked-keys对应的值应该要为id,因为不止一个需要默认勾选,所以应该把值是一个数组defaultKeys然后再给default-checked-keys)
const defaultKeys = [4, 5];
const treeRef = ref();

const rules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入权限名称" }],
});
//表单提交    formEl是dom元素
const confirm = async (formEl) => {
  if (!formEl) {
    return;
  }
  await formEl.validate((valid, fields) => {
    if (valid) {
      //获取到选择的checkbox数据
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys());
      //把修改后的数据传给后端
      userSetmenu({ name: form.name, permissions, id: form.id }).then(
        ({ data }) => {
          //data是响应数据,就是后端接收请求后,做出响应的数据
          console.log(data);
          beforeClose(),
            //重新获取更新后的列表
            getListdata();
        }
      );
    } else {
      console.log("error submit", fields);
    }
  });
};
</script>

<style scoped></style>
