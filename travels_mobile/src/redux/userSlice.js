import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  // redux用户信息仓库
  name: 'user',
  initialState: {
    id: null,
    avatar: '',
    nickname: '',
    username:'',
    gender: '',
    introduction: '',
    collectTravels: [],
    likeTravels:[],
  },
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.avatar = action.payload.avatar;
      state.nickname = action.payload.nickname;
      state.username = action.payload.username;
      state.gender = action.payload.gender;
      state.introduction = action.payload.introduction;
      state.collectTravels = action.payload.collectTravels;
      state.likeTravels = action.payload.likeTravels;
    },
    clearUser: (state) => {
      state.id = null;
      state.avatar = '';
      state.nickname = '';
      state.username = '';
      state.gender = '';
      state.introduction = '';
      state.collectTravels = [];
      state.likeTravels =[];
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;