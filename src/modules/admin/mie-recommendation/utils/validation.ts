import { z } from "zod";
import { MiePlanType } from "../types";

/**
 * Onboarding. `webhook_url` must be reachable over https — the backend posts
 * decision callbacks to it, so a plain-http or malformed URL silently strands
 * every notification for that developer.
 */
export const onboardDeveloperSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  webhook_url: z
    .string()
    .min(1, "Webhook URL is required")
    .url("Enter a full URL, e.g. https://example.com/hooks/mie")
    .refine(
      (value) => value.startsWith("https://"),
      "Webhook URL must use https://",
    ),
  plan_type: z.enum([
    MiePlanType.PAID_PER_SUBMISSION,
    MiePlanType.BYPASS_PER_SUBMISSION,
    MiePlanType.BYPASS_ACCOUNT,
  ]),
});

export type OnboardDeveloperFormData = z.infer<typeof onboardDeveloperSchema>;

/** Rejecting a submission requires a reason drawn from the shared taxonomy. */
export const rejectSubmissionSchema = z.object({
  rejection_reason: z.string().min(1, "Select a rejection reason"),
  rejection_note: z.string().max(1000, "Keep the note under 1000 characters"),
});

export type RejectSubmissionFormData = z.infer<typeof rejectSubmissionSchema>;

export const rejectionReasonSchema = z.object({
  label: z
    .string()
    .min(1, "Label is required")
    .max(120, "Keep the label under 120 characters"),
  description: z.string().max(500, "Keep the description under 500 characters"),
  is_active: z.boolean(),
});

export type RejectionReasonFormData = z.infer<typeof rejectionReasonSchema>;

/**
 * Demand signals. The score is required by the endpoint; earnings are optional
 * and sent as a decimal string with at most two places.
 */
export const demandSignalsSchema = z.object({
  demand_score: z
    .string()
    .min(1, "Demand score is required")
    .refine((value) => /^\d{1,3}$/.test(value), "Whole numbers only")
    .refine((value) => Number(value) >= 0 && Number(value) <= 100, "Must be between 0 and 100"),
  estimated_monthly_earnings: z
    .string()
    .refine(
      (value) => value === "" || /^\d{1,10}(\.\d{1,2})?$/.test(value),
      "Use a plain amount, e.g. 4200 or 4200.00",
    ),
});

export type DemandSignalsFormData = z.infer<typeof demandSignalsSchema>;
