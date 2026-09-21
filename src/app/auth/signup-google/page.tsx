"use client";

import React, { useEffect } from "react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { AuthHeader } from "@/modules/auth/components/AuthHeader";
import { AuthInput } from "@/modules/auth/components/AuthInput";
import { AuthButton } from "@/modules/auth/components/AuthButton";
import { FormCheckbox } from "@/components/form/FormCheckbox";
import { FormSelect } from "@/components/form/FormSelect";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  googleSignupSchema,
  GoogleSignupFormData,
} from "@/modules/auth/utils/schemas";
import { useGoogleSignupMutation } from "@/modules/auth/api/sessionApi";
import { normalizeApiError } from "@/lib/api/errors";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useAppDispatch } from "@/redux";
import { setCredentials } from "@/redux/slices/authSlice";
import { getDashboardRoute } from "@/modules/auth/utils/workspace";
import { AuthRoute, WebsiteRoute } from "@/lib/routes";
import { Country as CountryMeta } from "country-state-city";

const countryOptions = CountryMeta.getAllCountries().map((c) => ({
  label: c.name,
  value: c.isoCode,
  searchValue: `${c.name} ${c.isoCode}`,
}));

const SIGNUP_FIELD_MAP: Record<string, string> = {
  first_name: "firstName",
  last_name: "lastName",
  country: "country",
  terms_accepted: "agreeToTerms",
};

export default function GoogleSignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const [googleSignup, { isLoading }] = useGoogleSignupMutation();

  const methods = useForm<GoogleSignupFormData>({
    resolver: zodResolver(googleSignupSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      country: "",
      agreeToTerms: false,
    },
  });

  const { handleSubmit, setError, setValue } = methods;

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.first_name) {
        setValue("firstName", session.user.first_name);
      }
      if (session.user.last_name) {
        setValue("lastName", session.user.last_name);
      }
    }
  }, [session, status, setValue]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(AuthRoute.LOGIN);
    }
  }, [status, router]);

  const onSubmit = handleSubmit(async (data) => {
    const googleIdToken = session?.googleIdToken;
    if (!googleIdToken) {
      toast.error("Google session expired. Please sign in again.");
      router.push(AuthRoute.LOGIN);
      return;
    }

    try {
      const result = await googleSignup({
        id_token: googleIdToken,
        first_name: data.firstName,
        last_name: data.lastName,
        country: data.country,
        terms_accepted: data.agreeToTerms,
      }).unwrap();

      const signInResult = await signIn("credentials", {
        accessToken: result.access,
        refreshToken: result.refresh,
        user: JSON.stringify(result.user),
        workspace: result.workspace,
        role: result.role,
        mfaEnrollmentOverdue: String(result.mfa_enrollment_overdue ?? false),
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error("Sign up failed. Please try again.");
        return;
      }

      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.access,
        }),
      );

      router.push(getDashboardRoute(result.workspace));
      router.refresh();
    } catch (error) {
      const { fieldErrors, message } = normalizeApiError(
        error as never,
        SIGNUP_FIELD_MAP,
      );
      for (const [field, fieldMessage] of Object.entries(fieldErrors)) {
        setError(field as keyof GoogleSignupFormData, {
          type: "server",
          message: fieldMessage,
        });
      }
      const errorMessage =
        message ??
        (Object.keys(fieldErrors).length > 0
          ? Object.values(fieldErrors)[0]
          : null);
      if (errorMessage) {
        toast.error(errorMessage);
      }
    }
  });

  if (status === "loading") {
    return null;
  }

  return (
    <AuthLayout showNav showLogo>
      <AuthHeader
        title="Complete your sign up"
        description="Provide the following information to create your account"
        linkPrefix="Already have an account?"
        linkText="Log In"
        linkHref={AuthRoute.LOGIN}
      />

      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className="flex flex-col gap-[40px] w-full">
          <div className="flex flex-col gap-[16px]">
            <AuthInput
              name="firstName"
              label="First name"
              placeholder="Enter first name"
              required
            />
            <AuthInput
              name="lastName"
              label="Last name"
              placeholder="Enter last name"
              required
            />
            <FormSelect
              name="country"
              label="Country/Region"
              placeholder="Select country"
              required
              searchable
              searchPlaceholder="Search country"
              options={countryOptions}
            />

            <FormCheckbox
              name="agreeToTerms"
              label="I agree to the Terms & Condition and Privacy Policy including all product services"
              className="mt-1"
            />
          </div>

          <div className="flex flex-col gap-[16px]">
            <AuthButton type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </AuthButton>
            <p className="text-center text-caption-xs leading-[16px] text-sd-grey-11 font-medium">
              By clicking on continue, you agree to SoluDesks{" "}
              <Link href={WebsiteRoute.TERMS} className="underline">
                Terms of Use
              </Link>{" "}
              and{" "}
              <Link href={WebsiteRoute.PRIVACY} className="underline">
                privacy policy
              </Link>
            </p>
          </div>
        </form>
      </FormProvider>
    </AuthLayout>
  );
}
