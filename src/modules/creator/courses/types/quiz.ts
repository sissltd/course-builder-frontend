export enum QuizLevel {
  LESSON = "LESSON",
  MODULE = "MODULE",
  COURSE = "COURSE",
}

export enum QuizQuestionType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  ESSAY = "ESSAY",
}

export interface QuizOption {
  id?: string;
  option_text: string;
  is_correct: boolean;
  explanation: string;
  order: number;
}

export interface QuizQuestionItem {
  id?: string;
  quiz?: string;
  question_text: string;
  question_type: QuizQuestionType;
  points: number;
  model_response_guide: string;
  order: number;
  options: QuizOption[];
}

export interface Quiz {
  id: string;
  level: QuizLevel;
  title: string;
  description: string;
  lesson: string | null;
  module: string | null;
  course: string | null;
  passing_score: number;
  time_limit_minutes: number;
  attempts_allowed: number;
  shuffle_questions: boolean;
  randomize_options: boolean;
  questions: QuizQuestionItem[];
}

export interface CreateQuizRequest {
  level: QuizLevel;
  title: string;
  description?: string;
  lesson?: string;
  module?: string;
  course?: string;
  passing_score?: number;
  time_limit_minutes?: number;
  attempts_allowed?: number;
  shuffle_questions?: boolean;
  randomize_options?: boolean;
  questions?: QuizQuestionItem[];
}

export interface UpdateQuizRequest {
  level?: QuizLevel;
  title?: string;
  description?: string;
  lesson?: string;
  module?: string;
  course?: string;
  passing_score?: number;
  time_limit_minutes?: number;
  attempts_allowed?: number;
  shuffle_questions?: boolean;
  randomize_options?: boolean;
  questions?: QuizQuestionItem[];
}

export interface QuizListParams {
  level?: QuizLevel;
  passing_score?: number;
  ordering?: string;
  page?: number;
  size?: number;
}

export interface CreateQuestionRequest {
  quiz: string;
  question_text: string;
  question_type: QuizQuestionType;
  points: number;
  model_response_guide?: string;
  order: number;
  options?: QuizOption[];
}

export interface UpdateQuestionRequest {
  quiz?: string;
  question_text?: string;
  question_type?: QuizQuestionType;
  points?: number;
  model_response_guide?: string;
  order?: number;
  options?: QuizOption[];
}

export interface QuestionListParams {
  quiz?: string;
  question_type?: QuizQuestionType;
  ordering?: string;
  page?: number;
  size?: number;
}
