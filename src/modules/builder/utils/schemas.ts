import { z } from "zod";

export const courseInformationSchema = z.object({
  courseTitle: z.string().min(1, "Course title is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .refine(
      (val) => val.trim().split(/\s+/).length <= 500,
      "Description must be 500 words or less"
    ),
  category: z.string().min(1, "Please select a category"),
  difficulty: z.string().min(1, "Please select a difficulty level"),
  objectives: z
    .array(z.string().min(1, "Objective cannot be empty"))
    .min(5, "Minimum of 5 learning objectives required"),
  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .min(3, "Minimum of 3 tags required"),
  hours: z.coerce.number().min(0, "Hours cannot be negative"),
  minutes: z.coerce.number().min(0, "Minutes cannot be negative").max(59, "Minutes must be 0-59"),
  seconds: z.coerce.number().min(0, "Seconds cannot be negative").max(59, "Seconds must be 0-59"),
}).refine(
  (data) => data.hours > 0 || data.minutes > 0 || data.seconds > 0,
  {
    message: "Course duration must be greater than zero",
    path: ["hours"],
  }
);

export type CourseInformationFormData = z.infer<typeof courseInformationSchema>;

export const courseOutlineModuleSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Module title is required"),
  description: z.string().min(1, "Module description is required"),
  objectives: z.array(z.string().min(1, "Objective cannot be empty")).min(5, "Minimum of 5 learning objectives required per module"),
});

export type CourseOutlineModuleFormData = z.infer<typeof courseOutlineModuleSchema>;

export const courseOutlineSchema = z.object({
  modules: z.array(courseOutlineModuleSchema).min(1, "At least one module is required"),
});

export type CourseOutlineFormData = z.infer<typeof courseOutlineSchema>;

export const versionSchema = z.object({
  version: z.string().min(1, "Please select a version"),
});

export type VersionFormData = z.infer<typeof versionSchema>;

export const quizBuilderOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string().min(1, "Option value cannot be empty"),
});

export const quizBuilderQuestionSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string(),
    question: z.string().min(1, "Question is required"),
    type: z.literal("single"),
    points: z.number().min(0, "Points cannot be negative"),
    options: z.array(quizBuilderOptionSchema).min(2, "At least 2 options required").max(6, "Maximum 6 options"),
    correctOptionId: z.string().min(1, "Please select the correct option"),
    explanation: z.string().optional(),
  }),
  z.object({
    id: z.string(),
    question: z.string().min(1, "Question is required"),
    type: z.literal("multiple"),
    points: z.number().min(0, "Points cannot be negative"),
    options: z.array(quizBuilderOptionSchema).min(2, "At least 2 options required").max(6, "Maximum 6 options"),
    correctOptionIds: z.array(z.string()).min(1, "Select at least one correct option"),
    explanation: z.string().optional(),
  }),
  z.object({
    id: z.string(),
    question: z.string().min(1, "Question is required"),
    type: z.literal("essay"),
    points: z.number().min(0, "Points cannot be negative"),
    correctAnswer: z.string().optional(),
    explanation: z.string().optional(),
  }),
]);

export const quizBuilderFormSchema = z.object({
  questions: z.array(quizBuilderQuestionSchema).min(1, "At least one question is required"),
});

export type QuizBuilderFormData = z.infer<typeof quizBuilderFormSchema>;

export const quizQuestionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .min(2, "At least 2 options required"),
  correctAnswer: z.string().optional(),
});

export type QuizQuestionFormData = z.infer<typeof quizQuestionSchema>;

export const lessonSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Lesson title is required"),
  duration: z.string().optional(),
  assessments: z.string().optional(),
  type: z.enum(["video", "quiz", "text"]),
  objectives: z.array(z.string()).optional(),
  requirements: z.string().optional(),
  content: z.string().optional(),
  embedLink: z.string().optional(),
  videoScript: z.string().optional(),
  quizQuestions: z.array(quizQuestionSchema).optional(),
});

export type LessonFormData = z.infer<typeof lessonSchema>;

export const moduleSchema = z.object({
  title: z.string().min(1, "Module title is required"),
  description: z.string().min(1, "Module description is required"),
  objectives: z.string()
    .min(1, "Module objectives are required")
    .refine(
      (val) => {
        const list = val.split(",").map((o) => o.trim()).filter(Boolean);
        return list.length >= 5;
      },
      "Minimum of 5 learning objectives required per module"
    ),
  lessons: z.array(lessonSchema).optional(),
  quizQuestions: z.array(quizQuestionSchema).optional(),
});

export type ModuleFormData = z.infer<typeof moduleSchema>;
