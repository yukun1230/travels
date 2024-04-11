import userData from '@/mock/data.json'
import { message } from "antd";
import {getToken} from "@/utils"
import axios from 'axios'

const userList = userData.userInfoList

// 登录请求
function loginAPI(userForm) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      //u.account === userForm.username && u.password === userForm.password
      const info = userList.find((u) => u.account === userForm.username);
      if(info && info.password === userForm.password){
        return res(info);
      }
      message.error("用户名或密码错误");
      return;
    }, 100);
  })
}
// 获取个人信息
function getProfileAPI(){
  const token = getToken()
  return new Promise((res, rej) => {
    setTimeout(() => {
      const info = userList.find((u) => u.token === token);
      return res(info);
    }, 100);
  })
}

// 删除游记mock数据
function delNoteAPI(id){
  return axios({ 
    url:`http://localhost:3004/noteList/${id}`,
    method: 'delete'
  })
}

export {loginAPI, getProfileAPI, delNoteAPI}