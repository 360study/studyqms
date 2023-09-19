import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA, tokenName } from '@/config'
import axios from "axios";

export async function login(data) {
  console.log("data");
  console.log(data);
  // if (loginRSA) {
  //   data = await encryptedData(data)
  // }

  //return await axios.post("http://localhost:3000/login", data);
  
  let dd = await request({
    url: "/login?timestamp=" + Date.now(),
    method: "post",
    data,
  });
  return dd;
}

export function getUserInfo(accessToken) {
  return request({
    url: '/userInfo',
    method: 'post',
    data: {
      [tokenName]: accessToken,
    },
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post',
  })
}

export function register() {
  return request({
    url: '/register',
    method: 'post',
  })
}
