import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  order: null,
  error: null,
  loading: false,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    AddOrderStart: (state) => {
      state.loading = false;
    },
    AddOrderSuccess: (state, action) => {
      state.order = action.payload;
      state.loading = false;
      state.error = null;
    },
    AddOrderFailure: (state, action) => {  
      state.error = action.payload;
      state.loading = true;
    },
    updateOrderStart: (state) => {
      state.loading = true;
    },
    updateOrderSuccess: (state, action) => {
      state.order = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateOrderFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;  
    },
    deleteOrderStart: (state) => {
      state.loading = true;
    },
    deleteOrderSuccess: (state) => {
      state.order = null;
      state.loading = false;
      state.error = null;
    },
    deleteOrderFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { AddOrderStart,AddOrderSuccess,AddOrderFailure,updateOrderStart,
    updateOrderSuccess,updateOrderFailure,deleteOrderStart,deleteOrderSuccess,deleteOrderFailure } = orderSlice.actions;

export default orderSlice.reducer;