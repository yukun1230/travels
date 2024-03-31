import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // value: [],
  pageEnter: false
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // addtoCart: (state, product) => {
    //   state.value.push(product.payload);
    //   //去重
    //   const res = new Map();
    //   state.value = state.value.filter((item) => !res.has(item["name"]) && res.set(item["name"], 1)); 
    // },
    changePage: (state) => {
      state.pageEnter = !state.pageEnter
    }
  },
})

// Action creators are generated for each case reducer function
export const { changePage } = appSlice.actions

export default appSlice.reducer