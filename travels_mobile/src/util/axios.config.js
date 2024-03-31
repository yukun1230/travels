import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {storeToken, getToken, removeToken} from './tokenRelated'

// Add a request interceptor 请求拦截器
axios.interceptors.request.use(async function (config) {
  // Do something before request is sent
  const token = await getToken()  // 获取token
  config.headers.Authorization = `Bearer ${token}`
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


// Add a response interceptor 响应拦截器
axios.interceptors.response.use(async function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data

  const { authorization } = response.headers  // 取出token
  authorization && await storeToken(authorization)  //将要token存入本地localstorage

  return response;  // 返回响应
}, async function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  const { status } = error.response
  if (status === 401) {
    await removeToken()
    // window.location.href = "#/login"
  }
  return Promise.reject(error);
});