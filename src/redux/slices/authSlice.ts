import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/modules/auth/types/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

/**
 * `setCredentials` runs on every session read, and the session is read on the
 * 5 minute poll, on window focus, and after every token rotation. Always
 * writing a fresh `user` object gave the slice a new identity each time and
 * re-rendered every `state.auth` subscriber for no change at all.
 */
const isSameUser = (a: User | null, b: User | null): boolean => {
  if (a === b) return true;
  if (!a || !b) return false;

  const keys = Object.keys(b) as (keyof User)[];
  return keys.every((key) => a[key] === b[key]);
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken?: string }>,
    ) => {
      const { user, accessToken } = action.payload;
      const nextAccessToken = accessToken ?? state.accessToken;

      if (
        state.isAuthenticated &&
        state.accessToken === nextAccessToken &&
        isSameUser(state.user, user)
      ) {
        return;
      }

      state.user = user;
      state.accessToken = nextAccessToken;
      state.isAuthenticated = true;
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      if (state.accessToken === action.payload) return;
      state.accessToken = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, updateAccessToken, updateUser, clearAuth } =
  authSlice.actions;

export default authSlice.reducer;
