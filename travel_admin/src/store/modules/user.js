import { request } from "@/utils";
import { createSlice } from "@reduxjs/toolkit";
import { saveToken,getToken,removeKey } from "@/utils";

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
  }
})

//解构Action方法
const {setToken,setUserInfo} = userStore.actions

const userReducer = userStore.reducer

const fetchLogin = (loginForm) => {
  console.log(loginForm);
  return async (dispatch) => {
    const res = await request.get('http://localhost:3004/userInfoList');
    const info = res.find((u) => u.account === loginForm.username);
    dispatch(setToken(info.token))
    dispatch(setUserInfo(info))
  }
}

export {fetchLogin}
export default userReducer