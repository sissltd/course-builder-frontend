import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { User as AuthUser } from "next-auth";
import type {
  AuthTokens,
  LoginResponse,
  LoginTokensResponse,
  User,
  UserRole,
  UserStatus,
} from "@/modules/auth/types/auth";
import {
  getAccessTokenExpiresAt,
  isAccessTokenExpired,
  shouldRefreshAccessToken,
} from "@/modules/auth/utils/token";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function exchangeGoogleToken(
  idToken: string,
): Promise<LoginTokensResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login/google/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token: idToken }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const error = new Error("Google login failed") as Error & {
      status: number;
      body: unknown;
    };
    error.status = response.status;
    error.body = errorBody;
    throw error;
  }

  const result = (await response.json()) as LoginResponse;

  // A Google sign-in carries no password to challenge, so an MFA prompt here is
  // not something the client flow can currently answer. Fail loudly rather than
  // handing a token-less session downstream and breaking the same way the
  // password login used to.
  if ("mfa_required" in result) {
    const error = new Error(
      "Multi-factor authentication is required for this Google account, which is not supported yet.",
    ) as Error & { status: number };
    error.status = 403;
    throw error;
  }

  return result as LoginTokensResponse;
}


export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
        user: { label: "User", type: "text" },
        workspace: { label: "Workspace", type: "text" },
        role: { label: "Role", type: "text" },
        mfaEnrollmentOverdue: { label: "MFA Enrollment Overdue", type: "text" },
      },
      async authorize(credentials): Promise<AuthUser | null> {
        if (
          !credentials?.accessToken ||
          !credentials?.refreshToken ||
          !credentials?.user
        ) {
          return null;
        }

        const user = JSON.parse(credentials.user) as User;
        const { id, email, ...profile } = user;

        return {
          id,
          email,
          name: `${user.first_name} ${user.last_name}`,
          image: user.avatar_url,
          ...profile,
          accessToken: credentials.accessToken,
          refreshToken: credentials.refreshToken,
          accessTokenExpiresAt: getAccessTokenExpiresAt(credentials.accessToken),
          workspace: credentials.workspace,
          role: credentials.role,
          mfaEnrollmentOverdue: credentials.mfaEnrollmentOverdue === "true",
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      try {
        const parsed = new URL(url);
        if (parsed.origin === baseUrl) {
          return url;
        }
      } catch {
        // Malformed URL — fall through to the login page below.
      }
      return `${baseUrl}/auth/login`;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        token.googleErrorShown = undefined;

        if (!account.id_token) {
          token.googleError = "Google sign in failed. Please try again.";
          return token;
        }

        try {
          const result = await exchangeGoogleToken(account.id_token);
          token.user = {
            id: result.user.id,
            email: result.user.email,
            first_name: result.user.first_name,
            last_name: result.user.last_name,
            country: result.user.country,
            state: result.user.state ?? "",
            address: result.user.address ?? "",
            phone_number: result.user.phone_number ?? "",
            timezone: result.user.timezone,
            avatar_url: result.user.avatar_url,
            terms_accepted_at: result.user.terms_accepted_at ?? "",
            role: result.user.role,
            is_active: result.user.is_active,
            status: result.user.status,
            created_datetime: result.user.created_datetime,
            updated_datetime: result.user.updated_datetime,
            has_completed_onboarding: result.user.has_completed_onboarding,
            category: result.user.category ?? null,
            workspace: result.workspace,
          };
          token.accessToken = result.access;
          token.refreshToken = result.refresh;
          token.accessTokenExpiresAt = getAccessTokenExpiresAt(result.access);
          token.role = result.role;
          token.mfaEnrollmentOverdue = result.mfa_enrollment_overdue;
          token.googleSignupRequired = undefined;
          token.googleIdToken = undefined;
          token.googleError = undefined;
          return token;
        } catch (err) {
          const googleError = err as {
            status?: number;
            body?: { errors?: Array<{ message?: string }> };
          };
          const errorMsg = googleError.body?.errors?.[0]?.message ?? "";
          if (googleError.status === 400 && errorMsg.includes("No account is linked")) {
            token.googleSignupRequired = true;
            token.googleIdToken = account.id_token;
            token.googleError = undefined;
            return token;
          }
          token.user = undefined;
          token.accessToken = undefined;
          token.refreshToken = undefined;
          token.accessTokenExpiresAt = undefined;
          token.googleSignupRequired = undefined;
          token.googleIdToken = account.id_token;
          token.googleError =
            googleError.status === 503
              ? "Google sign-in is temporarily unavailable. Please try again in a few minutes."
              : errorMsg || "Google sign in failed. Please try again.";
          return token;
        }
      }

      if (user) {
        token.user = {
          id: user.id,
          email: user.email ?? "",
          first_name: user.first_name ?? "",
          last_name: user.last_name ?? "",
          country: user.country ?? "",
          state: user.state ?? "",
          address: user.address ?? "",
          phone_number: user.phone_number ?? "",
          timezone: user.timezone ?? "",
          avatar_url: user.avatar_url ?? "",
          terms_accepted_at: user.terms_accepted_at ?? "",
          role: user.role as UserRole,
          is_active: user.is_active ?? false,
          status: user.status as UserStatus,
          created_datetime: user.created_datetime ?? "",
          updated_datetime: user.updated_datetime ?? "",
          has_completed_onboarding: user.has_completed_onboarding ?? false,
          category: user.category ?? null,
          workspace: user.workspace,
        };
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpiresAt = user.accessTokenExpiresAt;
        token.role = user.role;
        token.mfaEnrollmentOverdue = user.mfaEnrollmentOverdue;
        token.googleError = undefined;
        token.googleErrorShown = undefined;
        token.googleSignupRequired = undefined;
        token.googleIdToken = undefined;
        return token;
      }

      if (token.googleError) {
        if (token.googleErrorShown) {
          token.googleError = undefined;
          token.googleErrorShown = undefined;
          token.googleIdToken = undefined;
        } else {
          token.googleErrorShown = true;
        }
        return token;
      }

      if (token.googleSignupRequired) {
        return token;
      }

      if (!token.user) {
        return token;
      }

      // Inside the refresh window (5 min before a 25 min expiry) the access
      // token is rotated. This callback only runs when the session is read, so
      // `SESSION_REFRESH_INTERVAL_MS` in AuthProvider is what actually paces
      // this — it polls well inside the window so the swap always beats expiry.
      if (!shouldRefreshAccessToken(token.accessTokenExpiresAt)) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      session.accessToken = token.accessToken;
      session.accessTokenExpiresAt = token.accessTokenExpiresAt;
      session.role = token.role;
      session.mfaEnrollmentOverdue = token.mfaEnrollmentOverdue;
      session.error = token.error;
      session.googleSignupRequired = token.googleSignupRequired as
        | boolean
        | undefined;
      session.googleIdToken = token.googleIdToken as string | undefined;
      session.googleError = token.googleError as string | undefined;
      return session;
    },
  },
};

async function refreshAccessToken(token: {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAt?: number;
}) {
  if (!token.refreshToken) {
    return { ...token, error: "RefreshAccessTokenError" };
  }

  try {
    const data = await refreshTokens(token.refreshToken);

    return {
      ...token,
      accessToken: data.access,
      refreshToken: data.refresh,
      accessTokenExpiresAt: getAccessTokenExpiresAt(data.access),
      error: undefined,
    };
  } catch {
    // The refresh is *proactive* — it runs while the current access token may
    // still have minutes left. Marking the session dead the moment it failed
    // turned any backend hiccup into a hard sign-out and a trip to the login
    // page. Only report an error once the token has genuinely expired; until
    // then keep the live one and let the next session read try again.
    if (isAccessTokenExpired(token.accessTokenExpiresAt)) {
      return { ...token, error: "RefreshAccessTokenError" };
    }

    return { ...token, error: undefined };
  }
}

/**
 * Single-flight rotation, keyed by refresh token.
 *
 * The session is read from three places at once — the 5 minute poll in
 * `AuthProvider`, `SessionProvider`'s window-focus refetch, and the reactive
 * retry in `baseApi`. Refresh tokens rotate on use, so letting those race meant
 * the loser got a rejected refresh and reported the session as broken. Sharing
 * one in-flight promise makes them all observe the same successful rotation.
 */
const inFlightRefreshes = new Map<string, Promise<AuthTokens>>();

async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  const existing = inFlightRefreshes.get(refreshToken);
  if (existing) return existing;

  const pending = (async () => {
    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Refresh failed");
    }

    return (await response.json()) as AuthTokens;
  })();

  inFlightRefreshes.set(refreshToken, pending);

  try {
    return await pending;
  } finally {
    inFlightRefreshes.delete(refreshToken);
  }
}

