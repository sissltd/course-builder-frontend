import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

interface AiGenerationPollingState {
  activeJobId: string | null;
  isMinimized: boolean;
}

const initialState: AiGenerationPollingState = {
  activeJobId: null,
  isMinimized: false,
};

const aiGenerationPollingSlice = createSlice({
  name: "aiGenerationPolling",
  initialState,
  reducers: {
    startPolling(state, action: PayloadAction<string>) {
      state.activeJobId = action.payload;
      state.isMinimized = false;
    },
    stopPolling(state) {
      state.activeJobId = null;
      state.isMinimized = false;
    },
    toggleMinimize(state) {
      state.isMinimized = !state.isMinimized;
    },
    setMinimized(state, action: PayloadAction<boolean>) {
      state.isMinimized = action.payload;
    },
  },
});

export const { startPolling, stopPolling, toggleMinimize, setMinimized } =
  aiGenerationPollingSlice.actions;

export const selectActiveJobId = (state: RootState) =>
  state.aiGenerationPolling.activeJobId;
export const selectIsMinimized = (state: RootState) =>
  state.aiGenerationPolling.isMinimized;

export default aiGenerationPollingSlice.reducer;
