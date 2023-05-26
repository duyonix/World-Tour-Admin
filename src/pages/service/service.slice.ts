import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  categoryOptions: {
    loading: false,
    data: [] as { id: number; name: string; level: number }[],
    error: null
  },
  regionOptions: {
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
    getRegionOptions: state => {
      state.regionOptions.loading = true;
      state.regionOptions.data = [];
      state.regionOptions.error = null;
    },
    getRegionOptionsSuccess: (state, action: PayloadAction<any>) => {
      state.regionOptions.loading = false;
      state.regionOptions.data = action.payload;
      state.regionOptions.error = null;
    },
    getRegionOptionsError: (state, action: PayloadAction<any>) => {
      state.regionOptions.loading = false;
      state.regionOptions.data = [];
      state.regionOptions.error = action.payload;
    }
  }
});

export const serviceActions = serviceSlice.actions;

const serviceReducer = serviceSlice.reducer;
export default serviceReducer;
