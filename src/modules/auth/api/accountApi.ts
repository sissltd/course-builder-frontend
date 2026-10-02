import { BaseAPI } from "@/redux/baseApi";
import type {
  ResendVerificationRequest,
  SignupRequest,
  SignupResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ChangePasswordRequest,
  ChangeEmailRequest,
  ConfirmChangeEmailRequest,
} from "@/modules/auth/types/auth";

export const accountApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (body) => ({
        url: "/auth/signup/",
        method: "POST",
        body,
      }),
    }),
    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailRequest>({
      query: (body) => ({
        url: "/auth/verify-email/",
        method: "POST",
        body,
      }),
    }),
    resendVerification: builder.mutation<
      { detail: string },
      ResendVerificationRequest
    >({
      query: (body) => ({
        url: "/auth/resend-verification/",
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
    changeEmail: builder.mutation<{ detail: string }, ChangeEmailRequest>({
      query: (body) => ({
        url: "/auth/change-email/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserProfile"],
    }),
    confirmChangeEmail: builder.mutation<
      { detail: string },
      ConfirmChangeEmailRequest
    >({
      query: (body) => ({
        url: "/auth/change-email/confirm/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useChangePasswordMutation,
  useChangeEmailMutation,
  useConfirmChangeEmailMutation,
} = accountApi;
