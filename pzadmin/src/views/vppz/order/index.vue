<template>
  <div>
    <PanelHeader :route="route" />

    <el-form v-model="searchForm" class="form"
      ><el-form-item
        ><el-input v-model="searchForm.out_trade_no" placeholder="订单号" />
      </el-form-item>
      <el-button type="primary" @click="SubmitEvent(searchForm.out_trade_no)"
        >搜索</el-button
      >
    </el-form>
    <el-table :data="tableData.list" style="width: 100%">
      <el-table-column
        prop="out_trade_no"
        label="订单号"
        width="150"
        fixed="left"
      />
      <el-table-column prop="hospital_name" label="就诊医院" />
      <el-table-column prop="service_name" label="陪诊服务" />
      <el-table-column label="陪护师">
        <template #default="scope">
          <el-image
            style="width: 40px; height: 40px"
            :src="scope.row.companion.avatar"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="companion.mobile"
        label="陪护师手机号"
        width="120"
      />
      <el-table-column prop="price" label="总价" />
      <el-table-column prop="paidPrice" label="已付" />
      <el-table-column prop="starttime" label="下单时间" width="120">
        <template #default="scope">
          {{ dayjs(order_start_time).format("YYYY-MM-DD") }}</template
        >
      </el-table-column>
      <el-table-column label="订单状态">
        <template #default="scope">
          <el-tag :type="stateRes[scope.row.trade_state]">{{
            scope.row.trade_state
          }}</el-tag>
        </template></el-table-column
      >
      <el-table-column prop="service_state" label="接单状态" />
      <el-table-column prop="tel" label="联系人手机号" width="120" />
      <el-table-column label="操作" width="100" disabled>
        <template #default="scope">
          <div style="color: aqua">暂无服务</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
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
</template>

<script setup>
import { useRoute } from "vue-router";
import { orderList, updateOrder } from "../../../api";
import { onMounted, reactive } from "vue";
import dayjs from "dayjs";
const route = useRoute();
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});
const tableData = reactive({
  list: [],
  total: 0,
});
//支付状态管理
const stateRes = {
  待支付: "danger",
  待服务: "primary",
  已完成: "success",
  已取消: "info",
};
onMounted(() => {
  getOrderList();
});
const searchForm = reactive({
  out_trade_no: "",
});
//获取订单列表
const getOrderList = () => {
  orderList(paginationData).then(({ data }) => {
    const { list, total } = data.data;
    tableData.list = list;
    tableData.total = total;
  });
};

const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  getOrderList();
};
const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
  getOrderList();
};
const SubmitEvent = (id) => {};
</script>

<style scoped lang="less">
.form {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0px 10px 0px;
}
</style>
