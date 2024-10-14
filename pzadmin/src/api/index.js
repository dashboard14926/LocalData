import request from "../utils/request";

//发送验证码
export const getCode = (data) => {
  return request.post("/get/code", data); //
};

//注册用户
export const userAuthentication = (data) => {
  return request.post("/user/authentication", data);
};

//登录
export const login = (data) => {
  return request.post("/login", data);
};

//用户权限管理列表 获得一些注册过用户的数据账号
export const authAdmin = (params) => {
  return request.get("/auth/admin", { params });
};

//菜单权限数据  就是获得哪些权限有哪些权限 树里面
export const userGetmenu = () => {
  return request.get("/user/getmenu");
};

//菜单权限修改   就是添加或者修改把新添加或者修改的数据data传给后端
export const userSetmenu = (data) => {
  return request.post("/user/setmenu", data);
};

//菜单权限列表  获取新的权限列表数据在表格中
export const menuList = (params) => {
  return request.get("/menu/list", { params });
};

//用户权限菜单下拉      /menu/selectlist
export const menuSelectList = () => {
  return request.get("/menu/selectlist");
};

//用户信息更新
export const updateUserData = (data) => {
  return request.post("/update/user", data);
};

//用户菜单权限  因为不同的用户可以管理的东西不一样,显示的东西也不一样比如管理员的权限更加丰富
export const menuPermissions = () => {
  return request.get("/menu/permissions");
};

//陪护师创建 此时要把数据给后端
export const createCompanion = (data) => {
  return request.post("/companion", data);
};

//陪护师头像列表 /photo/list
export const phoneList = () => {
  return request.get("/photo/list");
};

//陪护师列表  /companion/list
export const companionList = (params) => {
  return request.get("/companion/list", { params });
};

//陪护师删除  /delete/companion
export const deleteCompanion = (data) => {
  return request.post("/delete/companion", data);
};

//获取订单列表
export const orderList = (params) => {
  return request.get("/admin/order", { params });
};

//服务状态完成 /update/order
export const updateOrder = (data) => {
  return request.post("/update/order", data);
};
