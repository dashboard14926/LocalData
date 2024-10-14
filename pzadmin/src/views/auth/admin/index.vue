<template>
   <PanelHeader :route="route"/>
  <el-table :data="tableData.list" style="width: 100%">
    <!-- 可以直接从list结构出来对应的数据就用单标签,要解析或者转换显示内容的就用template -->
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="permissions_id" label="所属类别">
      <template #default="scope">
        {{ permissionName(scope.row.permissions_id) }}
      </template>
    </el-table-column #default="scope">
    <el-table-column prop="mobile" label="手机号" />
    <el-table-column prop="active" label="状态">
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success' : 'danger'"  >{{ scope.row.active ? '正常' : '失效' }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="create_time" label="创建时间" >
      <template #default="scope">
          <div class="flex-box">
        <el-icon><Clock /></el-icon>
        <span style="margin-left:10px">{{ scope.row.create_time }}</span>
     </div> </template>
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
      <el-form-item label="手机号" prop="mobile" >
        <el-input v-model="form.mobile" disabled/>
      </el-form-item>
      <el-form-item label="昵称" prop="name" >
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="菜单权限" prop="permissions_id" >
        <el-select
      v-model="form.permissions_id"
      placeholder="请选择菜单权限"
      size="large"
      style="width: 240px"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
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
import { reactive, ref, onMounted} from "vue";
import { authAdmin, menuSelectList,updateUserData } from "../../../api";
import dayjs from 'dayjs'
import { useRoute } from "vue-router";

const route = useRoute()
console.log('route',route);


const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});

//列表数据
const tableData = reactive({
  list: [], //list是一个数组包含所有数据一条一条的
  total: 0, //total是一个list里面的数据的条数(比如有90条)
});
onMounted(() => {
getListdata()
  menuSelectList().then(({ data }) => {
    options.value = data.data;
  });
});

//请求列表
const getListdata = () => {
    authAdmin(paginationData).then(({ data }) => {
    console.log("admin", data);
    //将数据传给表格数据中
    const { list, total } = data.data
    list.forEach(element => {
      element.create_time = dayjs(element.create_time).format('YYYY-MM-DD')
    });
    tableData.list = list 
    tableData.total = total
  });
}
// 用户权限菜单下拉数据
const options = ref([]);
//根据权限id匹配权限名称 (因为需要权限名称,但是后端只是给你一个id,所以你要自己设置)
const permissionName = (id) => {
  const data = options.value.find((el) => el.id === id);
  return data &&  data.name ? data.name : "超级管理员";
};
//分页处理 group里面有原理
const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  getListdata();
};
const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
  getListdata();
};
//控制弹窗
const dialogFormVisible = ref(false)
//关闭弹窗
const beforeClose = () => {
   dialogFormVisible.value = false
} 

const rules =reactive({
  name: [{ required: true, trigger:'blur',message:'请填写昵称'}],
  permissions_id: [{ required: true, trigger: "blur" ,message:'请选择菜单权限'}],
});
// 编辑表单
const formRef =ref()
const form = reactive({
   mobile:'',
  name: '',
  permissions_id: '',
 
})

const open = (rowData) => {
  dialogFormVisible.value = true
  console.log('open',rowData);
  
   Object.assign(form,{mobile:rowData.mobile,  name:rowData.name,permissions_id:rowData.permissions_id})
}
//表单提交    formEl是dom元素
const confirm = async (formEl) => {
  if (!formEl) {
    return;
  }
  await formEl.validate((valid, fields) => {
    if (valid) {
      const {name,permissions_id} = form
      updateUserData({ name, permissions_id }).then(({ data}) => {
        if (data.code === 10000) {
          dialogFormVisible.value = false
           getListdata()
      }
     })
    } else {
      console.log("error submit", fields);
    }
  });
};
  

</script>

<style scoped lang="less">
.flex-box{
  display: flex;
 align-items: center;

}</style>
