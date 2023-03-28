import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/pages/auth/auth.slice";
import serviceReducer from "@/pages/service/service.slice";

const rootReducer = combineReducers({
  auth: authReducer,
  service: serviceReducer
});

export default rootReducer;
