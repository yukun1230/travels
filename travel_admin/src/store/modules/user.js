import { createSlice } from "@reduxjs/toolkit";
import { saveToken,getToken,removeToken } from "@/utils";
import {loginAPI, getProfileAPI} from "@/api"
 
const userStore = createSlice({
  name: 'user',
  initialState: {
    userInfo:{},
    token: getToken() || ''
  },
  reducers: {
    setToken(state, action){
      state.token = action.payload
      saveToken(state.token)
    },
    setUserInfo: function(state,action){
      state.userInfo = action.payload
    },
    clearUserInfo: function(state){
      state.userInfo = {}
      state.token = ''
      removeToken()
    }
  }
})

//解构Action方法
const {setToken, setUserInfo, clearUserInfo} = userStore.actions

const userReducer = userStore.reducer

const fetchLogin = (loginForm) => {
  console.log(loginForm);
  return async (dispatch) => {
    const res = await loginAPI(loginForm);
    dispatch(setToken(res.token))
    dispatch(setUserInfo(res))
  }
}

const fetchUserInfo = () => {
  return async (dispatch) => {
    const res = await getProfileAPI();
    dispatch(setUserInfo(res))
  }
  
}
export {fetchLogin, fetchUserInfo, clearUserInfo}
export default userReducer