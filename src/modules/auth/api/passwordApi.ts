import { BaseAPI } from "@/redux/baseApi";
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/modules/auth/types/auth";

export const passwordApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    forgotPassword: builder.mutation<{ detail: string }, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/auth/forgot-password/",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<{ detail: string }, ResetPasswordRequest>({
      query: (body) => ({
        url: "/auth/reset-password/",
        method: "POST",
        body,
      }),
    }),
    changePassword: builder.mutation<
      { detail: string },
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: "/auth/change-password/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = passwordApi;
