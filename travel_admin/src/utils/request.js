import axios from "axios";
import { getToken } from "./token";

const request = axios.create({
  baseURL: '',
  timeout: 5000
})

//添加请求拦截器 请求发送前进行统一处理
request.interceptors.request.use((config)=>{
  // const token = getToken()
  // if(token){
  //   config.headers.Authorization = `Bearer ${token}`
  // }
  return config
},(error)=>{
  return Promise.reject(error)
})

//添加响应拦截器 请求响应后处理数据
request.interceptors.response.use((response) => {
  return response.data
},(error)=>{
  return Promise.reject(error)
})

export {request}