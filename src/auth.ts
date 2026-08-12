import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User as AuthUser } from "next-auth";
import type {
  LoginResponse,
  User,
  UserRole,
  UserStatus,
} from "@/modules/auth/types/auth";
import { getAccessTokenExpiresAt } from "@/modules/auth/utils/token";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const REFRESH_BEFORE_EXPIRY_MS = 5 * 60 * 1000;

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
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email ?? "",
          first_name: user.first_name ?? "",
          last_name: user.last_name ?? "",
          country: user.country ?? "",
          timezone: user.timezone ?? "",
          avatar_url: user.avatar_url ?? "",
          terms_accepted_at: user.terms_accepted_at ?? "",
          role: user.role as UserRole,
          is_active: user.is_active ?? false,
          status: user.status as UserStatus,
          created_datetime: user.created_datetime ?? "",
          updated_datetime: user.updated_datetime ?? "",
          has_completed_onboarding: user.has_completed_onboarding ?? false,
          workspace: user.workspace,
        };
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpiresAt = user.accessTokenExpiresAt;
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
      if (token.user) {
        session.user = token.user;
      }
      session.accessToken = token.accessToken;
      session.accessTokenExpiresAt = token.accessTokenExpiresAt;
      session.error = token.error;
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
