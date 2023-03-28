import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  categoryOptions: {
    loading: false,
    data: [],
    error: null
  },
  scopeOptions: {
    loading: false,
    data: [],
    error: null
  }
};

export const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    getCategoryOptions: state => {
      state.categoryOptions.loading = true;
      state.categoryOptions.data = [];
      state.categoryOptions.error = null;
    },
    getCategoryOptionsSuccess: (state, action: PayloadAction<any>) => {
      state.categoryOptions.loading = false;
      state.categoryOptions.data = action.payload;
      state.categoryOptions.error = null;
    },
    getCategoryOptionsError: (state, action: PayloadAction<any>) => {
      state.categoryOptions.loading = false;
      state.categoryOptions.data = [];
      state.categoryOptions.error = action.payload;
    },
    getScopeOptions: state => {
      state.scopeOptions.loading = true;
      state.scopeOptions.data = [];
      state.scopeOptions.error = null;
    },
    getScopeOptionsSuccess: (state, action: PayloadAction<any>) => {
      state.scopeOptions.loading = false;
      state.scopeOptions.data = action.payload;
      state.scopeOptions.error = null;
    },
    getScopeOptionsError: (state, action: PayloadAction<any>) => {
      state.scopeOptions.loading = false;
      state.scopeOptions.data = [];
      state.scopeOptions.error = action.payload;
    }
  }
});

export const serviceActions = serviceSlice.actions;

const serviceReducer = serviceSlice.reducer;
export default serviceReducer;
