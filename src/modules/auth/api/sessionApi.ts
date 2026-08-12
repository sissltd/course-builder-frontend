import { BaseAPI } from "@/redux/baseApi";
import type {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshRequest,
  RefreshResponse,
} from "@/modules/auth/types/auth";

export const sessionApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login/",
        method: "POST",
        body,
      }),
    }),
    reviewerLogin: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/reviewer/login/",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation<{ detail: string }, LogoutRequest>({
      query: (body) => ({
        url: "/auth/logout/",
        method: "POST",
        body,
      }),
    }),
    logoutAll: builder.mutation<{ detail: string }, void>({
      query: () => ({
        url: "/auth/logout-all/",
        method: "POST",
      }),
    }),
    refreshTokens: builder.mutation<RefreshResponse, RefreshRequest>({
      query: (body) => ({
        url: "/auth/token/refresh/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useReviewerLoginMutation,
  useLogoutMutation,
  useLogoutAllMutation,
  useRefreshTokensMutation,
} = sessionApi;
