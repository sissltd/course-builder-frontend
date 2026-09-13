import { z } from "zod";

export const aiGenerationSchema = z.object({
  title: z
    .string()
    .min(1, "Course title is required")
    .max(255, "Course title must be 255 characters or less"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Course category is required"),
  topic: z.string().optional(),
  terms_accepted: z
    .boolean()
    .refine(
      (val) => val === true,
      "You must accept the terms to proceed",
    ),
});

export type AiGenerationFormData = z.infer<typeof aiGenerationSchema>;
