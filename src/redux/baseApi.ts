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
import { deleteCookie } from "@/utils/cookies";
import { AuthRoute } from "@/lib/routes";
import { purgePersistedAuth } from "./persistedAuth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const AUTH_LOGIN_PATH = AuthRoute.LOGIN;

const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/signup",
  "/auth/verify-email",
  "/auth/resend-verification",
  "/auth/forgot-password",
  "/auth/reset-password",
  // The token in the request body is the credential for confirming an email
  // change, so this must not carry a bearer token — and it must never trip the
  // 401 path below, which would sign the caller out mid-confirmation.
  "/auth/change-email/confirm",
  "/auth/token/refresh",
  "/auth/reviewer/login",
  "/auth/staff/invitations/accept",
  "/auth/login/google",
  "/auth/signup/google",
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

let isLoggingOut = false;
let sessionRefreshPromise: Promise<SessionRefreshResult> | null = null;

/**
 * Single-flight read of the session cookie through the `jwt` callback, which is
 * the only thing that can rotate the access token.
 *
 * Every request that saw a 401 waits on this same promise. The previous version
 * kept an `isRefreshing` flag and returned "failed" immediately to any *second*
 * caller, which the reauth wrapper read as a dead session — so two queries
 * 401ing together (the common case on a screen with more than one of them)
 * signed the user out and dumped them on the login page.
 */
const refetchSessionToken = (): Promise<SessionRefreshResult> => {
  if (!sessionRefreshPromise) {
    sessionRefreshPromise = (async (): Promise<SessionRefreshResult> => {
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
      }
    })().finally(() => {
      sessionRefreshPromise = null;
    });
  }

  return sessionRefreshPromise;
};

type RefreshOutcome =
  | { sessionLost: false; result: QueryReturnValue<unknown, FetchBaseQueryError, Record<string, never>> }
  | { sessionLost: boolean; result?: undefined };

const attemptTokenRefresh = async (
  api: BaseQueryApi,
  args: string | FetchArgs,
  extraOptions: unknown,
): Promise<RefreshOutcome> => {
  const refreshResult = await refetchSessionToken();

  if (refreshResult.status === "ok") {
    api.dispatch(updateAccessToken(refreshResult.accessToken));
    const retryResult = await dynamicBaseQuery(args, api, extraOptions as object);
    if (!retryResult.error) {
      return { sessionLost: false, result: retryResult };
    }
    // A fresh token that still gets rejected means the session itself is gone.
    return { sessionLost: true };
  }

  if (refreshResult.status === "unavailable") {
    // The session endpoint was unreachable — offline, or the backend mid
    // restart. That says nothing about whether this caller is signed in, so
    // retry once with what we have and surface the error rather than signing
    // somebody out because their connection blipped.
    const retryResult = await dynamicBaseQuery(args, api, extraOptions as object);
    if (!retryResult.error) {
      return { sessionLost: false, result: retryResult };
    }
    return { sessionLost: false };
  }

  return { sessionLost: true };
};

const NEXTAUTH_COOKIE_NAMES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.csrf-token",
  "__Host-next-auth.csrf-token",
];

const handleAuthFailure = (api: BaseQueryApi) => {
  if (isLoggingOut) {
    return;
  }
  isLoggingOut = true;

  api.dispatch(clearAuth());
  api.dispatch(BaseAPI.util.resetApiState());

  if (typeof window !== "undefined") {
    // Only the session cookies. A blanket wipe took unrelated cookies (consent,
    // preferences) with it and lost the user's place in the app.
    NEXTAUTH_COOKIE_NAMES.forEach(deleteCookie);
    purgePersistedAuth();

    const { pathname } = window.location;
    const loginUrl = `${AUTH_LOGIN_PATH}?callbackUrl=${encodeURIComponent(
      `${pathname}${window.location.search}`,
    )}`;

    try {
      window.location.replace(loginUrl);
    } catch {
      // Only reachable if the navigation itself is blocked. Allow a later
      // attempt rather than wedging every subsequent request on this flag.
      isLoggingOut = false;
    }
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
      if (refreshAttempt.result) {
        return refreshAttempt.result;
      }
      if (refreshAttempt.sessionLost) {
        handleAuthFailure(api);
      }
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
        if (refreshAttempt.result) {
          return refreshAttempt.result;
        }
        if (refreshAttempt.sessionLost) {
          handleAuthFailure(api);
        }
      }
    }
  }

  return result;
};

export const BaseAPI = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [
    "Course",
    "Collaborator",
    "CollaboratorInvite",
    "WorkspaceCollaborator",
    "MieDeveloper",
    "MieSubmission",
    "MieRejectionReason",
    "AdminUser",
    "AdminStaff",
    "Assessment",
    "Module",
    "Lesson",
    "ContentBlock",
    "LessonImage",
    "LessonRequirement",
    "MediaAsset",
    "Category",
    "Topic",
    "AdminWallet",
    "AdminTransaction",
    "AdminWithdrawal",
    "AdminCourse",
    "AdminCourseComment",
    "ActivityLog",
    "KycReview",
    "AdminOverview",
    "AdminAnalytics",
    "AdminSystemHealth",
    "AdminPipeline",
    "TopicReservation",
    "Notification",
    "Transaction",
    "QualityCheck",
    "Wallet",
    "PayoutAccount",
    "UserProfile",
    "OnboardingProfile",
    "Role",
    "PermissionGroup",
    "NotificationPreferences",
    "Quiz",
    "QuizQuestion",
    "Mfa",
    "KycSubmission",
    "ReviewerOverview",
    "ReviewerActivity",
    "ReviewQueue",
    "ReviewQueueItem",
    "ReviewQueueComments",
    "ReviewerSettings",
    "CategoryPicker",
    "GenerationJob",
    "AchievementBadge",
  ],
  keepUnusedDataFor: 300,
  refetchOnMountOrArgChange: 30,
});

export default BaseAPI;
