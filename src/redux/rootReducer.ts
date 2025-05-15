import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import aiUploadReducer from "./features/aiUpload";

const rootReducer = combineReducers({
  auth: authReducer,
  aiupload: aiUploadReducer,
});

export const resetAll = () => {
  const initialState = rootReducer(undefined, { type: "" });
  return {
    type: "RESET_ALL",
    payload: initialState,
  };
};

export default rootReducer;
