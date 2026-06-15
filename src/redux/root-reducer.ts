import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import BaseAPI from "./baseApi";

export const rootReducer = combineReducers({
  [BaseAPI.reducerPath]: BaseAPI.reducer,
  auth: authReducer,
});
