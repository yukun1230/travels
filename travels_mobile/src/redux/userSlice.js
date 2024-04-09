import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: null,
    avatar: '',
    nickname: '',
    collectTravels: [],
    likeTravels:[],
  },
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.avatar = action.payload.avatar;
      state.nickname = action.payload.nickname;
      state.collectTravels = action.payload.collectTravels;
      state.likeTravels = action.payload.likeTravels;
    },
    clearUser: (state) => {
      state.id = null;
      state.avatar = '';
      state.nickname = '';
      state.collectTravels = [];
      state.likeTravels =[];
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;