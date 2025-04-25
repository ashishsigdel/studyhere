import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GuestState {
  email: string | null;
  password: string | null;
}

const initialState: GuestState = {
  email: null,
  password: null,
};

const guestSlice = createSlice({
  name: "guest",
  initialState,
  reducers: {
    setCredientials: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },

    resetGuest: (state) => {
      state.email = initialState.email;
      state.password = initialState.password;
    },
  },
});

export const { setCredientials, resetGuest } = guestSlice.actions;
export default guestSlice.reducer;
