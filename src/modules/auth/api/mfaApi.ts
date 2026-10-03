import { BaseAPI } from "@/redux/baseApi";
import type { DetailResponse } from "@/lib/api/types";
import type {
  LoginTokensResponse,
  MfaCodeRequest,
  MfaEnrollResponse,
  MfaRecoveryCodesResponse,
  VerifyMfaChallengeRequest,
} from "@/modules/auth/types/auth";

/**
 * Multi-factor authentication.
 *
 * All of these are authenticated — `baseQuery` attaches the bearer token, so
 * none of them belong in `PUBLIC_ENDPOINTS`. The one exception in spirit is the
 * challenge redemption below, which is how a user gets a token in the first
 * place: it carries the `challenge_token` from the login response instead of a
 * session.
 *
 * NOTE: `/auth/mfa/verify/` is the only path here not confirmed against the
 * backend spec — the challenge redemption endpoint was not documented. It is
 * isolated in this single mutation so the path can be corrected in one place.
 */
export const mfaApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    /** Redeems a `challenge_token` from an MFA-gated login for a session. */
    verifyMfaChallenge: builder.mutation<
      LoginTokensResponse,
      VerifyMfaChallengeRequest
    >({
      query: (body) => ({
        url: "/auth/mfa/verify/",
        method: "POST",
        body,
      }),
    }),

    /** Issues a fresh, unconfirmed secret. Calling again replaces it. */
    startMfaEnroll: builder.mutation<MfaEnrollResponse, void>({
      query: () => ({
        url: "/auth/mfa/enroll/",
        method: "POST",
      }),
      invalidatesTags: ["Mfa"],
    }),

    /** Enables the device and returns the one and only recovery-code batch. */
    confirmMfaEnroll: builder.mutation<
      MfaRecoveryCodesResponse,
      MfaCodeRequest
    >({
      query: (body) => ({
        url: "/auth/mfa/enroll/confirm/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Mfa", "UserProfile"],
    }),

    /** Removes the device and its recovery codes. Forbidden for Admin roles. */
    disableMfa: builder.mutation<DetailResponse, MfaCodeRequest>({
      query: (body) => ({
        url: "/auth/mfa/disable/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Mfa", "UserProfile"],
    }),

    /** Burns the current batch and issues a fresh one. */
    regenerateRecoveryCodes: builder.mutation<
      MfaRecoveryCodesResponse,
      MfaCodeRequest
    >({
      query: (body) => ({
        url: "/auth/mfa/recovery-codes/regenerate/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Mfa"],
    }),
  }),
});

export const {
  useVerifyMfaChallengeMutation,
  useStartMfaEnrollMutation,
  useConfirmMfaEnrollMutation,
  useDisableMfaMutation,
  useRegenerateRecoveryCodesMutation,
} = mfaApi;
