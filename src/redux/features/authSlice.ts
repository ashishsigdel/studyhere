import { User } from "@/types/user";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    removeAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    resetAuth: () => {
      return initialState;
    },
  },
});

export const { setAuth, removeAuth, resetAuth } = authSlice.actions;

export default authSlice.reducer;
