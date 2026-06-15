import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  type?: string;
  profile_picture_url?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        tokens: AuthTokens;
      }>,
    ) => {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      if (state.tokens) {
        state.tokens.access = action.payload;
      }
    },
    updateTokens: (
      state,
      action: PayloadAction<{ access: string; refresh: string }>,
    ) => {
      state.tokens = {
        access: action.payload.access,
        refresh: action.payload.refresh,
      };
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  setCredentials,
  updateAccessToken,
  updateTokens,
  updateUser,
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;
