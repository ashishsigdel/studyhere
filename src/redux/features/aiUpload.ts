import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GuestState {
  previewUrl: string | null;
  picture: File | null;
}

const initialState: GuestState = {
  previewUrl: null,
  picture: null,
};

const aiUploadSlice = createSlice({
  name: "aiupload",
  initialState,
  reducers: {
    setPhotos: (
      state,
      action: PayloadAction<{ previewUrl: string; picture: File }>
    ) => {
      state.previewUrl = action.payload.previewUrl;
      state.picture = action.payload.picture;
    },

    resetPhotos: (state) => {
      state.previewUrl = initialState.previewUrl;
      state.picture = initialState.picture;
    },
  },
});

export const { setPhotos, resetPhotos } = aiUploadSlice.actions;
export default aiUploadSlice.reducer;
