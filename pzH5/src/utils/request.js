//引入axios
import axios from "axios";

const http = axios.create({
  baseURL: "https:/v3pz.itndedu.com/v3pz",
  timeout: 10000,
  headers: { terminal: "h5" },
});

//添加拦截器
http.interceptors.request.use(
  function (config) {
    //config是请求地址
    // 在发送请求之前做些什么  需要token的api   token就是账号密码通过的就获得的通行证
    const token = localStorage.getItem("h5_token");
    //不需要token的api
    const whiteUrl = ["/login"];
    if (token && !whiteUrl.includes(config.url)) {
      config.headers["h-token"] = token;
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  function (response) {
    //对于接口异常数据的用户,给与提示
    if (response.data.code === -1) {
    }
    // 第二种报错  登陆成功进入主页面时token过期,报-2 错误码
    if (response.data.code === -2) {
      localStorage.removeItem("pz_token");
      localStorage.removeItem("pz_userInfo");
      localStorage.removeItem("pz_v3pz");
      //跳转
      window.location.href = window.location.origin;
    }
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default http;
