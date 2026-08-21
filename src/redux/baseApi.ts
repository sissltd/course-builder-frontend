import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  createApi,
  BaseQueryApi,
  QueryReturnValue,
} from "@reduxjs/toolkit/query/react";

import { updateAccessToken, clearAuth } from "./slices/authSlice";
import type { RootState } from "./index";
import { clearAllCookies } from "@/utils/cookies";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/signup",
  "/auth/verify-email",
  "/auth/resend-verification",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/token/refresh",
  "/auth/reviewer/login",
];

const isPublicEndpoint = (url: string): boolean =>
  PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));

const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = typeof args === "string" ? args : args.url;

  const customBaseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const { auth } = state;

      if (!isPublicEndpoint(url)) {
        const token = auth?.accessToken;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }

      return headers;
    },
  });

  return customBaseQuery(args, api, extraOptions);
};

type SessionRefreshResult =
  | { status: "ok"; accessToken: string }
  | { status: "failed" }
  | { status: "unavailable" };

let isRefreshing = false;
let isLoggingOut = false;
let sessionRefreshPromise: Promise<SessionRefreshResult> | null = null;

const refetchSessionToken = async (): Promise<SessionRefreshResult> => {
  if (sessionRefreshPromise) {
    return sessionRefreshPromise;
  }

  sessionRefreshPromise = (async () => {
    try {
      const response = await fetch(`/api/auth/session?_=${Date.now()}`, {
        cache: "no-store",
      });
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        return { status: "unavailable" };
      }
      if (!response.ok) {
        return { status: "failed" };
      }
      const data = (await response.json()) as {
        accessToken?: string;
        error?: string;
      };
      if (data.error === "RefreshAccessTokenError") {
        return { status: "failed" };
      }
      if (data.accessToken) {
        return { status: "ok", accessToken: data.accessToken };
      }
      return { status: "failed" };
    } catch {
      return { status: "unavailable" };
    } finally {
      sessionRefreshPromise = null;
    }
  })();

  return sessionRefreshPromise;
};

const attemptTokenRefresh = async (
  api: BaseQueryApi,
  args: string | FetchArgs,
  extraOptions: unknown,
): Promise<{
  success: boolean;
  result?: QueryReturnValue<
    unknown,
    FetchBaseQueryError,
    Record<string, never>
  >;
}> => {
  if (isRefreshing) {
    return { success: false };
  }

  isRefreshing = true;

  try {
    const refreshResult = await refetchSessionToken();

    if (refreshResult.status === "ok") {
      api.dispatch(updateAccessToken(refreshResult.accessToken));
      const retryResult = await dynamicBaseQuery(args, api, extraOptions as object);
      if (!retryResult.error) {
        return { success: true, result: retryResult };
      }
      return { success: false };
    }

    if (refreshResult.status === "unavailable") {
      const retryResult = await dynamicBaseQuery(args, api, extraOptions as object);
      if (!retryResult.error) {
        return { success: true, result: retryResult };
      }
      return { success: false };
    }

    return { success: false };
  } finally {
    isRefreshing = false;
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
  tagTypes: ["Course", "Collaborator", "AdminUser", "AdminStaff"],
  keepUnusedDataFor: 300,
  refetchOnMountOrArgChange: 30,
});

export default BaseAPI;
