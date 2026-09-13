import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import courseBuilderReducer from "./slices/courseBuilderSlice";
import quizBuilderReducer from "./slices/quizBuilderSlice";
import aiGenerationPollingReducer from "./slices/aiGenerationPollingSlice";
import BaseAPI from "./baseApi";

export const rootReducer = combineReducers({
  [BaseAPI.reducerPath]: BaseAPI.reducer,
  auth: authReducer,
  courseBuilder: courseBuilderReducer,
  quizBuilder: quizBuilderReducer,
  aiGenerationPolling: aiGenerationPollingReducer,
});
