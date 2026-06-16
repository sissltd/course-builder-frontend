import { z } from "zod";

export const requestTopicSchema = z.object({
  topicTitle: z.string().min(3, "Topic title must be at least 3 characters"),
  category: z.string().min(1, "Please select a category"),
});

export type RequestTopicFormData = z.infer<typeof requestTopicSchema>;
