import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { User as AuthUser } from "next-auth";
import type {
  LoginResponse,
  User,
  UserRole,
  UserStatus,
} from "@/modules/auth/types/auth";
import { decodeJwtPayload, getAccessTokenExpiresAt } from "@/modules/auth/utils/token";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const REFRESH_BEFORE_EXPIRY_MS = 5 * 60 * 1000;

async function exchangeGoogleToken(idToken: string): Promise<LoginResponse> {
  console.log("[GoogleAuth] exchangeGoogleToken: calling POST /auth/login/google/", {
    hasIdToken: Boolean(idToken),
    tokenPrefix: idToken ? idToken.substring(0, 20) + "..." : "null",
    apiBase: API_BASE_URL,
  });
  console.log("[GoogleAuth] exchangeGoogleToken: Google id_token (raw):", idToken);

  try {
    const claims = decodeJwtPayload<{
      aud?: string;
      iss?: string;
      email?: string;
    }>(idToken);
    console.log("[GoogleAuth] id_token claims", {
      aud: claims.aud,
      iss: claims.iss,
      email: claims.email,
      expectedAudience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch (err) {
    console.warn("[GoogleAuth] could not decode id_token claims", err);
  }

  const response = await fetch(`${API_BASE_URL}/auth/login/google/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token: idToken }),
  });

  console.log("[GoogleAuth] exchangeGoogleToken: response status", response.status, response.statusText);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    console.error("[GoogleAuth] exchangeGoogleToken: FAILED", {
      status: response.status,
      body: errorBody,
    });
    const error = new Error("Google login failed") as Error & {
      status: number;
      body: unknown;
    };
    error.status = response.status;
    error.body = errorBody;
    throw error;
  }

  const result = (await response.json()) as LoginResponse;
  console.log("[GoogleAuth] exchangeGoogleToken: SUCCESS", {
    hasAccess: Boolean(result.access),
    hasRefresh: Boolean(result.refresh),
    userId: result.user?.id,
    userRole: result.role,
  });
  return result;
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
      console.log("[GoogleAuth] redirect callback: url=", url, "baseUrl=", baseUrl);
      if (url.startsWith("/")) {
        console.log("[GoogleAuth] redirect: relative URL, returning", `${baseUrl}${url}`);
        return `${baseUrl}${url}`;
      }
      try {
        const parsed = new URL(url);
        if (parsed.origin === baseUrl) {
          console.log("[GoogleAuth] redirect: same origin, returning", url);
          return url;
        }
      } catch {
        console.log("[GoogleAuth] redirect: malformed URL, falling through");
      }
      console.log("[GoogleAuth] redirect: external/unknown, redirecting to login");
      return `${baseUrl}/auth/login`;
    },
    async jwt({ token, user, account }) {
      console.log("[GoogleAuth] jwt callback: provider=", account?.provider, {
        hasUser: Boolean(user),
        hasAccount: Boolean(account),
        hasIdToken: Boolean(account?.id_token),
        tokenKeys: Object.keys(token),
      });

      if (account?.provider === "google") {
        console.log("[GoogleAuth] jwt callback: Google provider detected, id_token present:", Boolean(account.id_token));
        console.log("[GoogleAuth] jwt callback: Google id_token (raw):", account.id_token);
        token.googleErrorShown = undefined;

        if (!account.id_token) {
          console.error("[GoogleAuth] jwt callback: NO id_token from Google provider");
          token.googleError = "Google sign in failed. Please try again.";
          return token;
        }

        try {
          console.log("[GoogleAuth] jwt callback: calling exchangeGoogleToken...");
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
          console.log("[GoogleAuth] jwt callback: token populated successfully, user:", token.user?.id, "role:", token.role);
          return token;
        } catch (err) {
          const googleError = err as {
            status?: number;
            body?: { errors?: Array<{ message?: string }> };
          };
          const errorMsg = googleError.body?.errors?.[0]?.message ?? "";
          console.error("[GoogleAuth] jwt callback: exchangeGoogleToken FAILED", {
            status: googleError.status,
            errorMsg,
            fullError: JSON.stringify(err).substring(0, 500),
          });
          if (googleError.status === 400 && errorMsg.includes("No account is linked")) {
            console.log("[GoogleAuth] jwt callback: No linked account — marking googleSignupRequired");
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
          console.log("[GoogleAuth] jwt callback: returning token with googleError:", token.googleError);
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

      if (
        token.accessTokenExpiresAt &&
        Date.now() < token.accessTokenExpiresAt - REFRESH_BEFORE_EXPIRY_MS
      ) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      console.log("[GoogleAuth] session callback: hasUser=", Boolean(token.user), {
        googleError: token.googleError,
        googleSignupRequired: token.googleSignupRequired,
        accessTokenPresent: Boolean(token.accessToken),
        error: token.error,
      });
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
    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: token.refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Refresh failed");
    }

    const data = (await response.json()) as LoginResponse;

    return {
      ...token,
      accessToken: data.access,
      refreshToken: data.refresh,
      accessTokenExpiresAt: getAccessTokenExpiresAt(data.access),
      error: undefined,
    };
  } catch {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}
