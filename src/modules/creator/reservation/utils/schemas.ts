import { z } from "zod";

export const requestCategorySchema = z.object({
  name: z.string().min(3, "Topic name must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
});

export type RequestCategoryFormData = z.infer<typeof requestCategorySchema>;
