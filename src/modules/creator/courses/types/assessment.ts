export enum AssessmentLevel {
  COURSE = "COURSE",
  MODULE = "MODULE",
  LESSON = "LESSON",
}

export enum QuestionType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  ESSAY = "ESSAY",
}

export interface AssessmentOption {
  text: string;
  explanation: string;
}

export interface MultipleChoiceQuestion {
  type: QuestionType.MULTIPLE_CHOICE;
  question: string;
  points: number;
  options: AssessmentOption[];
  correct_index: number;
}

export interface EssayQuestion {
  type: QuestionType.ESSAY;
  question: string;
  points: number;
  explanation: string;
}

export type AssessmentQuestion = MultipleChoiceQuestion | EssayQuestion;

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
