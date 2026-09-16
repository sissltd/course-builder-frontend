import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface QuizBuilderOption {
  id: string;
  label: string;
  value: string;
}

export interface QuizBuilderQuestion {
  id: string;
  question: string;
  type: "single" | "multiple" | "essay";
  points: number;
  options: QuizBuilderOption[];
  correctOptionId?: string;
  correctOptionIds?: string[];
  correctAnswer?: string;
  explanation?: string;
}

interface QuizBuilderState {
  questions: QuizBuilderQuestion[];
}

const initialState: QuizBuilderState = {
  questions: [],
};

export const MIN_OPTIONS = 2;

export const optionLetter = (index: number): string => {
  let n = Math.max(0, index);
  let label = "";
  do {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return label;
};

export const createQuizQuestionId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `q-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const createDefaultQuizQuestion = (
  id?: string,
): QuizBuilderQuestion => {
  const questionId = id || createQuizQuestionId();
  return {
    id: questionId,
    question: "",
    type: "single",
    points: 0,
    options: Array.from({ length: MIN_OPTIONS }, (_, i) => {
      const label = optionLetter(i);
      return { id: `${questionId}-${label.toLowerCase()}`, label, value: "" };
    }),
    correctOptionId: undefined,
    explanation: "",
  };
};

export const toQuizBuilderQuestions = (
  questions: QuizBuilderQuestion[] | undefined | null,
): QuizBuilderQuestion[] => {
  if (!Array.isArray(questions)) return [];
  return questions.map((raw, index) => {
    const q = raw as Partial<QuizBuilderQuestion> & { options?: unknown[] };
    const id = q.id || `q-${index}-${createQuizQuestionId()}`;
    const options = Array.isArray(q.options) ? q.options : [];
    return {
      id,
      question: q.question || "",
      type:
        q.type === "multiple" || q.type === "essay" ? q.type : "single",
      points: typeof q.points === "number" ? q.points : 0,
      options: options.map((opt, optionIndex) => {
        const label = optionLetter(optionIndex);
        if (typeof opt === "string") {
          return { id: `${id}-${label.toLowerCase()}`, label, value: opt };
        }
        const option = opt as Partial<QuizBuilderOption>;
        return {
          id: option.id || `${id}-${label.toLowerCase()}`,
          label: option.label || label,
          value: option.value || "",
        };
      }),
      correctOptionId: q.correctOptionId,
      correctOptionIds: q.correctOptionIds,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || "",
    };
  });
};

const quizBuilderSlice = createSlice({
  name: "quizBuilder",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<QuizBuilderQuestion[]>) => {
      state.questions = action.payload;
    },

    resetQuestions: (state) => {
      state.questions = [];
    },

    addQuestion: (state) => {
      state.questions.push(createDefaultQuizQuestion());
    },

    removeQuestion: (state, action: PayloadAction<number>) => {
      state.questions.splice(action.payload, 1);
    },

    updateQuestion: (
      state,
      action: PayloadAction<{ index: number; field: string; value: unknown }>
    ) => {
      const { index, field, value } = action.payload;
      const question = state.questions[index];
      if (question) {
        (question as unknown as Record<string, unknown>)[field] = value;
      }
    },

    addOption: (state, action: PayloadAction<{ qIndex: number }>) => {
      const { qIndex } = action.payload;
      const q = state.questions[qIndex];
      if (!q) return;
      const newLabel = optionLetter(q.options.length);
      q.options.push({
        id: `${q.id}-${newLabel.toLowerCase()}`,
        label: newLabel,
        value: "",
      });
    },

    removeOption: (state, action: PayloadAction<{ qIndex: number; optIndex: number }>) => {
      const { qIndex, optIndex } = action.payload;
      const q = state.questions[qIndex];
      if (!q) return;
      const removedId = q.options[optIndex]?.id;
      q.options.splice(optIndex, 1);
      q.options.forEach((opt, i) => {
        const label = optionLetter(i);
        opt.label = label;
        opt.id = `${q.id}-${label.toLowerCase()}`;
      });
      if (removedId) {
        if (q.correctOptionId === removedId) {
          q.correctOptionId = undefined;
        }
        if (q.correctOptionIds) {
          q.correctOptionIds = q.correctOptionIds.filter((id) => id !== removedId);
        }
      }
    },

    updateOption: (
      state,
      action: PayloadAction<{ qIndex: number; optIndex: number; value: string }>
    ) => {
      const { qIndex, optIndex, value } = action.payload;
      const q = state.questions[qIndex];
      if (q && q.options[optIndex]) {
        q.options[optIndex].value = value;
      }
    },
  },
});

export const {
  setQuestions,
  resetQuestions,
  addQuestion,
  removeQuestion,
  updateQuestion,
  addOption,
  removeOption,
  updateOption,
} = quizBuilderSlice.actions;

export default quizBuilderSlice.reducer;
