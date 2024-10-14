import request from "../utils/request";

//登录
export default {
  login(data) {
    return request.post("/login", data);
  },

  //home主页图片数据
  index() {
    return request.get("/Index/index");
  },

  //订单详情  h5/companion
  h5companion() {
    return request.get("h5/companion");
  },

  //订单提交       /createOrder
  createOrder(data) {
    return request.post("/createOrder", data);
  },

  //订单列表
  orderList(params) {
    return request.get("/order/list", { params });
  },

  //订单详情  /order/detail
  orderDetial(params) {
    return request.get("/order/detail", { params });
  },
};
