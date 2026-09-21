import { z } from "zod";

export const appealSchema = z.object({
  title: z.string().min(1, "Title is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  webLink: z.string().optional(),
  description: z.string().min(1, "Description is required"),
});

export type AppealFormData = z.infer<typeof appealSchema>;
