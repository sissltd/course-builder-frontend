import { z } from "zod";

export const requestCategorySchema = z.object({
  categoryName: z.string().min(3, "Category name must be at least 3 characters"),
});

export type RequestCategoryFormData = z.infer<typeof requestCategorySchema>;
