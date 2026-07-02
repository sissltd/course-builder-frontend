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

const quizBuilderSlice = createSlice({
  name: "quizBuilder",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<QuizBuilderQuestion[]>) => {
      state.questions = action.payload;
    },

    addQuestion: (state) => {
      const newId = (state.questions.length + 1).toString();
      state.questions.push({
        id: newId,
        question: "",
        type: "single",
        points: 0,
        options: [
          { id: `${newId}-a`, label: "A", value: "" },
          { id: `${newId}-b`, label: "B", value: "" },
        ],
        correctOptionId: undefined,
        explanation: "",
      });
    },

    removeQuestion: (state, action: PayloadAction<number>) => {
      state.questions.splice(action.payload, 1);
    },

    updateQuestion: (
      state,
      action: PayloadAction<{ index: number; field: string; value: any }>
    ) => {
      const { index, field, value } = action.payload;
      if (state.questions[index]) {
        (state.questions[index] as any)[field] = value;
      }
    },

    addOption: (state, action: PayloadAction<{ qIndex: number }>) => {
      const { qIndex } = action.payload;
      const q = state.questions[qIndex];
      if (!q || q.options.length >= 6) return;
      const LETTERS = ["A", "B", "C", "D", "E", "F"];
      const newLabel = LETTERS[q.options.length];
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
      q.options.splice(optIndex, 1);
      const LETTERS = ["A", "B", "C", "D", "E", "F"];
      q.options.forEach((opt, i) => {
        opt.label = LETTERS[i];
        opt.id = `${q.id}-${LETTERS[i].toLowerCase()}`;
      });
      if (q.correctOptionId === q.options[optIndex]?.id) {
        q.correctOptionId = undefined;
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
  addQuestion,
  removeQuestion,
  updateQuestion,
  addOption,
  removeOption,
  updateOption,
} = quizBuilderSlice.actions;

export default quizBuilderSlice.reducer;
