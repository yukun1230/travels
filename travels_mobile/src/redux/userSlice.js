import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: null,
    avatar: '',
    nickname: '',
  },
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.avatar = action.payload.avatar;
      state.nickname = action.payload.nickname;
    },
    clearUser: (state) => {
      state.id = null;
      state.avatar = '';
      state.nickname = '';
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;