import axios from "axios";
import {
  baseURL,
  contentType,
  debounce,
  invalidCode,
  noPermissionCode,
  requestTimeout,
  successCode,
  tokenName,
  loginInterception,
} from "@/config";
const instance = axios.create({
  baseURL,
  timeout: requestTimeout,
  headers: {
    "Content-Type": contentType,
    "Access-Control-Allow-Origin": "*",
    // 响应类型
    "Access-Control-Allow-Methods": "*",
    // 响应头设置
    "Access-Control-Allow-Headers": "content-type,token,id",
    "Access-Control-Request-Headers":
      "Origin, X-Requested-With, content-Type, Accept, Authorization",
  },
});
export default instance;
