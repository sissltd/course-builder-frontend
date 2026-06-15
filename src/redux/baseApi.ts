import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  createApi,
  BaseQueryApi,
  QueryReturnValue,
} from "@reduxjs/toolkit/query/react";

import { updateTokens, clearAuth } from "./slices/authSlice";
import type { RootState } from "./index";
import { getCookie, clearAllCookies } from "@/utils/cookies";

const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/refresh",
  "/auth/signup",
  "/auth/forgot-password",
];

const isPublicEndpoint = (url: string): boolean =>
  PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));

const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const state = api.getState() as RootState;
  const url = typeof args === "string" ? args : args.url;

  const baseUrl = "/api/proxy";

  const customBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const { auth } = state;

      if (!isPublicEndpoint(url)) {
        const token = auth?.tokens?.access;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }

      return headers;
    },
  });

  return customBaseQuery(args, api, extraOptions);
};

let isRefreshing = false;
let isLoggingOut = false;
let refreshPromise: Promise<{
  success: boolean;
  newAccessToken?: string;
}> | null = null;

const performTokenRefresh = async (
  api: BaseQueryApi,
): Promise<{ success: boolean; newAccessToken?: string }> => {
  const state = api.getState() as RootState;
  let refreshToken = state.auth.tokens?.refresh;

  if (!refreshToken && typeof window !== "undefined") {
    refreshToken = getCookie("refreshToken") ?? undefined;
  }

  if (!refreshToken) {
    console.warn("[Auth] No refresh token available for token refresh");
    return { success: false };
  }

  try {
    const refreshResult = await dynamicBaseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        body: { refresh: refreshToken },
      },
      api,
      {}
    );

    if (refreshResult.data) {
      const response = refreshResult.data as {
        success: boolean;
        data?: { access: string; refresh: string };
      };

      if (response.data?.access && response.data?.refresh) {
        const { access, refresh } = response.data;
        api.dispatch(updateTokens({ access, refresh }));
        return { success: true, newAccessToken: access };
      }
    }

    console.warn("[Auth] Token refresh failed - invalid response");
    return { success: false };
  } catch (error) {
    console.error("[Auth] Token refresh error:", error);
    return { success: false };
  }
};

const attemptTokenRefresh = async (
  api: BaseQueryApi,
  args: string | FetchArgs,
  extraOptions: any,
): Promise<{
  success: boolean;
  result?: QueryReturnValue<
    unknown,
    FetchBaseQueryError,
    Record<string, never>
  >;
}> => {
  if (isRefreshing && refreshPromise) {
    const refreshResult = await refreshPromise;
    if (refreshResult.success) {
      const retryResult = await dynamicBaseQuery(args, api, extraOptions);
      return { success: true, result: retryResult };
    }
    return { success: false };
  }

  isRefreshing = true;
  refreshPromise = performTokenRefresh(api);

  try {
    const refreshResult = await refreshPromise;
    if (refreshResult.success) {
      const retryResult = await dynamicBaseQuery(args, api, extraOptions);
      return { success: true, result: retryResult };
    }
    return { success: false };
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
};

const handleAuthFailure = (api: BaseQueryApi) => {
  if (isLoggingOut) {
    return;
  }
  isLoggingOut = true;

  api.dispatch(clearAuth());
  api.dispatch(BaseAPI.util.resetApiState());

  if (typeof window !== "undefined") {
    clearAllCookies();
    localStorage.clear();
    sessionStorage.clear();

    setTimeout(() => {
      window.location.href = "/auth/login";
      isLoggingOut = false;
    }, 100);
  } else {
    isLoggingOut = false;
  }
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await dynamicBaseQuery(args, api, extraOptions);

  if (result.error) {
    if (result.error.status === 401) {
      const refreshAttempt = await attemptTokenRefresh(api, args, extraOptions);
      if (refreshAttempt.success) {
        return refreshAttempt.result as QueryReturnValue<
          unknown,
          FetchBaseQueryError,
          Record<string, never>
        >;
      }
      handleAuthFailure(api);
      return result;
    }

    if (result.error.status === 403) {
      const errorData = result.error.data as {
        errors?: { code: string; message: string }[];
      };
      const isTokenExpired =
        errorData?.errors?.some((error) => error.code === "token_not_valid") ??
        false;

      if (isTokenExpired) {
        const refreshAttempt = await attemptTokenRefresh(api, args, extraOptions);
        if (refreshAttempt.success) {
          return refreshAttempt.result as QueryReturnValue<
            unknown,
            FetchBaseQueryError,
            Record<string, never>
          >;
        }
        handleAuthFailure(api);
      }
    }
  }

  return result;
};

export const BaseAPI = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [],
  keepUnusedDataFor: 300,
  refetchOnMountOrArgChange: 30,
});

export default BaseAPI;
