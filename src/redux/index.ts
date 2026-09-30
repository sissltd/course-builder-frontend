"use client";

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from "react-redux";
import { rootReducer } from "./root-reducer";
import BaseAPI from "./baseApi";
import { errorToastMiddleware } from "./errorToastMiddleware";
import { PERSIST_ROOT_KEY } from "./persistedAuth";

const persistConfig = {
  key: PERSIST_ROOT_KEY,
  storage,
  // `auth` is deliberately absent. A persisted access token is at best stale by
  // the time it is rehydrated and at worst already rotated out, so the first
  // request after a reload went out with it, drew a 401, and — before the
  // session resolved — could cost the user their session. The slice is
  // re-seeded from the session within milliseconds instead, and dashboard
  // routes already gate their render on `useSession`.
  whitelist: ["courseBuilder"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(BaseAPI.middleware, errorToastMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;

export default store;
