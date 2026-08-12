import "next-auth";
import "next-auth/jwt";
import type { User as AppUser } from "@/modules/auth/types/auth";

declare module "next-auth" {
  interface Session {
    user: AppUser & {
      workspace?: string;
    };
    accessToken?: string;
    accessTokenExpiresAt?: number;
    error?: string;
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiresAt?: number;
    workspace?: string;
    first_name?: string;
    last_name?: string;
    country?: string;
    timezone?: string;
    avatar_url?: string;
    terms_accepted_at?: string;
    role?: string;
    is_active?: boolean;
    status?: string;
    created_datetime?: string;
    updated_datetime?: string;
    has_completed_onboarding?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: AppUser & {
      workspace?: string;
    };
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiresAt?: number;
    error?: string;
  }
}
