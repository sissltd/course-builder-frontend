export enum AssessmentLevel {
  COURSE = "COURSE",
  MODULE = "MODULE",
  LESSON = "LESSON",
}

export enum QuestionType {
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  ESSAY = "ESSAY",
}

export interface AssessmentOption {
  text: string;
  explanation?: string;
}

export interface SingleChoiceQuestion {
  type: QuestionType.SINGLE_CHOICE;
  question: string;
  points: number;
  options: AssessmentOption[];
  correct_index: number;
}

export interface MultipleChoiceQuestion {
  type: QuestionType.MULTIPLE_CHOICE;
  question: string;
  points: number;
  options: AssessmentOption[];
  correct_indices?: number[];
  correct_index?: number;
}

export interface EssayQuestion {
  type: QuestionType.ESSAY;
  question: string;
  points: number;
  expected_answer?: string;
  explanation?: string;
}

export type AssessmentQuestion =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | EssayQuestion;

export interface AssessmentSummary {
  total_questions: number;
  total_points: number;
  multiple_choice_count: number;
  essay_count: number;
}

export interface Assessment {
  id: string;
  level: AssessmentLevel;
  title: string;
  questions: AssessmentQuestion[];
  summary: AssessmentSummary;
}

export interface UpsertAssessmentRequest {
  title: string;
  questions: AssessmentQuestion[];
}
