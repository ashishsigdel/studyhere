import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { persistReducer, persistStore } from "redux-persist";
import rootReducer from "./rootReducer";

// Persist config
const persistConfig = {
  key: "root",
  storage,
};

// Apply persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Optional: handle RESET_ALL
const appReducer = (state: any, action: any) => {
  if (action.type === "RESET_ALL") {
    return persistedReducer(undefined, action.payload);
  }
  return persistedReducer(state, action);
};

// Create store
export const store = configureStore({
  reducer: appReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // suppress redux-persist warnings
    }),
});

// ✅ Export persistor
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
