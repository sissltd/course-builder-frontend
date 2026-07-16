import { z } from "zod";

export const courseCreateSchema = z.object({
  legalAgreement: z
    .boolean()
    .refine((val) => val === true, "You must agree to the legal policy to proceed"),
  creationMethod: z
    .string()
    .min(1, "Please select a creation method"),
  category: z
    .string()
    .min(1, "Course category is required"),
  topic: z
    .string()
    .min(1, "Course topic is required"),
  courseTitle: z
    .string()
    .min(1, "Course title is required"),
  courseDescription: z
    .string()
    .min(1, "Course description is required"),
});

export type CourseCreateFormData = z.infer<typeof courseCreateSchema>;
