import userData from '@/mock/data.json'
import { message } from "antd";

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

export {loginAPI}