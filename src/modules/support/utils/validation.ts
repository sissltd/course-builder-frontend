import { z } from "zod";

export { appealSchema, type AppealFormData } from "@/modules/creator/help/utils/validation";

/**
 * `POST /support/tickets/` shares its body with appeals, so the two schemas are
 * identical — kept as separate names so each form's intent stays readable and a
 * divergence in the API can be made in one place.
 */
export const ticketSchema = z.object({
  title: z.string().min(1, "Title is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  webLink: z.string().optional(),
  description: z.string().min(1, "Description is required"),
});

export type TicketFormData = z.infer<typeof ticketSchema>;

/**
 * `POST /support/contact/` — the public form. Nothing here is optional because
 * an anonymous submitter is the only record the request carries; a signed-in
 * caller reaching the in-app variant still fills these in.
 */
export const contactSchema = z.object({
  firstName: z.string().min(2, "Enter your first name"),
  lastName: z.string().min(2, "Enter your last name"),
  email: z.string().min(1, "Enter your email address").email("Enter a valid email address"),
  country: z.string().min(1, "Select your country/region"),
  message: z.string().min(10, "Enter a message"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Resolution notes for `POST /support/requests/{id}/resolve/`. Optional
 * server-side, so an empty box is allowed — but a half-typed note is not.
 */
export const resolveNotesSchema = z.object({
  notes: z.string().max(2000, "Keep resolution notes under 2000 characters"),
});

export type ResolveNotesFormData = z.infer<typeof resolveNotesSchema>;
