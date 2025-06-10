import { createSlice } from "@reduxjs/toolkit";

interface MessageState {
  message: string | null;
  type: "success" | "error" | "info" | "warning" | null;
  showOn: string | null;
}

const initialState: MessageState = {
  message: null,
  type: null,
  showOn: null,
};

const popupMessageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.showOn = action.payload.showOn;
    },
    removeMessage: (state) => {
      state.message = null;
      state.type = null;
      state.showOn = null;
    },
  },
});

export const { setMessage, removeMessage } = popupMessageSlice.actions;
export default popupMessageSlice.reducer;
