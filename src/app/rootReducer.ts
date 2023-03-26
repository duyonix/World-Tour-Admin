import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/pages/auth/auth.slice";

const rootReducer = combineReducers({
  auth: authReducer
});

export default rootReducer;
