import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const appReducer = (state: any, action: any) => {
  if (action.type === "RESET_ALL") {
    return rootReducer(undefined, action.payload);
  }
  return rootReducer(state, action);
};

export const store = configureStore({
  reducer: appReducer,
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
