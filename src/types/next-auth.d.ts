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
    role?: string;
    mfaEnrollmentOverdue?: boolean;
    error?: string;
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiresAt?: number;
    workspace?: string;
    role?: string;
    mfaEnrollmentOverdue?: boolean;
    first_name?: string;
    last_name?: string;
    country?: string;
    state?: string;
    address?: string;
    phone_number?: string;
    timezone?: string;
    avatar_url?: string;
    terms_accepted_at?: string | null;
    is_active?: boolean;
    status?: string;
    created_datetime?: string;
    updated_datetime?: string;
    has_completed_onboarding?: boolean;
    category?: string | null;
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
    role?: string;
    mfaEnrollmentOverdue?: boolean;
    error?: string;
  }
}
