import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface QuizQuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface QuizQuestionData {
  question: string;
  type: "single" | "multiple" | "essay";
  points: number;
  options: QuizQuestionOption[];
  correctOptionId?: string;
  correctOptionIds?: string[];
  correctAnswer?: string;
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration?: string;
  assessments?: string;
  type: "video" | "quiz" | "text";
  objectives?: string[];
  requirements?: string;
  content?: string;
  videoScript?: string;
  embedLink?: string;
  quizQuestions?: QuizQuestionData[];
  quizId?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  lessons: Lesson[];
  quizQuestions: QuizQuestion[];
  quizId?: string;
}

export interface CourseInformationData {
  courseTitle: string;
  description: string;
  category: string;
  difficulty: string;
  objectives: string[];
  tags: string[];
  hours: number;
  minutes: number;
  seconds: number;
  coverVideo: { name: string; size: number; type: string } | null;
  coverVideoUrl?: string;
  thumbnail?: string;
  topic?: string;
  creationMethod?: string;
}

export type BuilderStep =
  | "information"
  | "outline"
  | "version"
  | "modules"
  | "thumbnail"
  | "quality";

export interface CourseBuilderState {
  courseId: string | null;
  courseInformation: CourseInformationData;
  modules: Module[];
  version: string;
  activeStep: BuilderStep;
  activeModuleIndex: number;
  editingLesson: { moduleId: string; lessonId: string } | null;
  editingQuiz: { moduleId: string; lessonId: string } | null;
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  lastSavedAt: number | null;
}

const initialState: CourseBuilderState = {
  courseId: null,
  courseInformation: {
    courseTitle: "",
    description: "",
    category: "",
    difficulty: "",
    objectives: [],
    tags: [],
    hours: 0,
    minutes: 0,
    seconds: 0,
    coverVideo: null,
    topic: "",
    creationMethod: "",
  },
  modules: [],
  version: "v1.0",
  activeStep: "information",
  activeModuleIndex: 0,
  editingLesson: null,
  editingQuiz: null,
  isLoading: false,
  isSaving: false,
  isDirty: false,
  lastSavedAt: null,
};

const courseBuilderSlice = createSlice({
  name: "courseBuilder",
  initialState,
  reducers: {
    setCourseId: (state, action: PayloadAction<string>) => {
      state.courseId = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setIsSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    markSaved: (state) => {
      state.isDirty = false;
      state.isSaving = false;
      state.lastSavedAt = Date.now();
    },
    setCourseInformation: (state, action: PayloadAction<CourseInformationData>) => {
      state.courseInformation = action.payload;
    },
    updateCourseInformation: (state, action: PayloadAction<Partial<CourseInformationData>>) => {
      state.courseInformation = {
        ...state.courseInformation,
        ...action.payload,
      };
      state.isDirty = true;
    },
    setModules: (state, action: PayloadAction<Module[]>) => {
      state.modules = action.payload;
    },
    addModule: (state) => {
      const newId = (state.modules.length + 1).toString();
      const newModule: Module = {
        id: newId,
        title: "",
        description: "",
        objectives: [],
        lessons: [],
        quizQuestions: [],
      };
      state.modules.push(newModule);
      state.activeModuleIndex = state.modules.length - 1;
      state.isDirty = true;
    },
    updateModule: (state, action: PayloadAction<Module>) => {
      const index = state.modules.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.modules[index] = action.payload;
        state.isDirty = true;
      }
    },
    removeModule: (state, action: PayloadAction<string>) => {
      state.modules = state.modules.filter((m) => m.id !== action.payload);
      if (state.activeModuleIndex >= state.modules.length) {
        state.activeModuleIndex = Math.max(0, state.modules.length - 1);
      }
      state.isDirty = true;
    },
    updateModuleField: (
      state,
      action: PayloadAction<{ id: string; field: "title" | "description"; value: string }>
    ) => {
      const { id, field, value } = action.payload;
      const mod = state.modules.find((m) => m.id === id);
      if (mod) {
        mod[field] = value;
        state.isDirty = true;
      }
    },
    addObjectiveToModule: (state, action: PayloadAction<{ moduleId: string; objective: string }>) => {
      const { moduleId, objective } = action.payload;
      const mod = state.modules.find((m) => m.id === moduleId);
      if (mod) {
        mod.objectives.push(objective);
        state.isDirty = true;
      }
    },
    editObjectiveInModule: (
      state,
      action: PayloadAction<{ moduleId: string; index: number; objective: string }>
    ) => {
      const { moduleId, index, objective } = action.payload;
      const mod = state.modules.find((m) => m.id === moduleId);
      if (mod && mod.objectives[index] !== undefined) {
        mod.objectives[index] = objective;
        state.isDirty = true;
      }
    },
    removeObjectiveFromModule: (state, action: PayloadAction<{ moduleId: string; index: number }>) => {
      const { moduleId, index } = action.payload;
      const mod = state.modules.find((m) => m.id === moduleId);
      if (mod) {
        mod.objectives = mod.objectives.filter((_, i) => i !== index);
        state.isDirty = true;
      }
    },
    addLessonToModule: (state, action: PayloadAction<{ moduleId: string; type: "video" | "quiz" | "text"; lessonId?: string }>) => {
      const { moduleId, type, lessonId } = action.payload;
      const mod = state.modules.find((m) => m.id === moduleId);
      if (mod) {
        const newLesson: Lesson = {
          id: lessonId || Date.now().toString(),
          title: "",
          duration: "0 mins",
          assessments: "0 Assessment",
          type,
          objectives: [],
          requirements: "",
          content: "",
          quizQuestions: [],
        };
        mod.lessons.push(newLesson);
        state.isDirty = true;
      }
    },
    updateLessonInModule: (
      state,
      action: PayloadAction<{ moduleId: string; lessonId: string; updatedLesson: Lesson }>
    ) => {
      const { moduleId, lessonId, updatedLesson } = action.payload;
      const mod = state.modules.find((m) => m.id === moduleId);
      if (mod) {
        const lessonIndex = mod.lessons.findIndex((l) => l.id === lessonId);
        if (lessonIndex !== -1) {
          mod.lessons[lessonIndex] = updatedLesson;
          state.isDirty = true;
        }
      }
    },
    removeLessonFromModule: (state, action: PayloadAction<{ moduleId: string; lessonId: string }>) => {
      const { moduleId, lessonId } = action.payload;
      const mod = state.modules.find((m) => m.id === moduleId);
      if (mod) {
        mod.lessons = mod.lessons.filter((l) => l.id !== lessonId);
        state.isDirty = true;
      }
    },
    addQuizQuestionToModule: (state, action: PayloadAction<{ moduleId: string }>) => {
      const { moduleId } = action.payload;
      const mod = state.modules.find((m) => m.id === moduleId);
      if (mod) {
        mod.quizQuestions.push({
          question: "",
          options: ["", "", "", ""],
        });
        state.isDirty = true;
      }
    },
    removeQuizQuestionFromModule: (state, action: PayloadAction<{ moduleId: string; index: number }>) => {
      const { moduleId, index } = action.payload;
      const mod = state.modules.find((m) => m.id === moduleId);
      if (mod) {
        mod.quizQuestions = mod.quizQuestions.filter((_, i) => i !== index);
        state.isDirty = true;
      }
    },
    setVersion: (state, action: PayloadAction<string>) => {
      state.version = action.payload;
      state.isDirty = true;
    },
    setActiveStep: (state, action: PayloadAction<BuilderStep>) => {
      state.activeStep = action.payload;
    },
    setActiveModuleIndex: (state, action: PayloadAction<number>) => {
      state.activeModuleIndex = action.payload;
    },
    setEditingLesson: (state, action: PayloadAction<{ moduleId: string; lessonId: string } | null>) => {
      state.editingLesson = action.payload;
    },
    setEditingQuiz: (state, action: PayloadAction<{ moduleId: string; lessonId: string } | null>) => {
      state.editingQuiz = action.payload;
    },
    replaceModuleId: (state, action: PayloadAction<{ oldId: string; newId: string }>) => {
      const { oldId, newId } = action.payload;
      const mod = state.modules.find((m) => m.id === oldId);
      if (mod) {
        mod.id = newId;
        if (state.editingLesson?.moduleId === oldId) {
          state.editingLesson.moduleId = newId;
        }
        if (state.editingQuiz?.moduleId === oldId) {
          state.editingQuiz.moduleId = newId;
        }
      }
    },
    setQuizIdForLesson: (
      state,
      action: PayloadAction<{ moduleId: string; lessonId: string; quizId: string }>
    ) => {
      const { moduleId, lessonId, quizId } = action.payload;
      const mod = state.modules.find((m) => m.id === moduleId);
      if (mod) {
        const lesson = mod.lessons.find((l) => l.id === lessonId);
        if (lesson) {
          lesson.quizId = quizId;
        }
      }
    },
    setQuizQuestionsForLesson: (
      state,
      action: PayloadAction<{ moduleId: string; lessonId: string; questions: QuizQuestionData[] }>
    ) => {
      const { moduleId, lessonId, questions } = action.payload;
      const mod = state.modules.find((m) => m.id === moduleId);
      if (mod) {
        const lesson = mod.lessons.find((l) => l.id === lessonId);
        if (lesson) {
          lesson.quizQuestions = questions;
          state.isDirty = true;
        }
      }
    },
    setModuleQuizId: (
      state,
      action: PayloadAction<{ moduleId: string; quizId: string }>
    ) => {
      const mod = state.modules.find((m) => m.id === action.payload.moduleId);
      if (mod) {
        mod.quizId = action.payload.quizId;
      }
    },
    replaceLessonId: (
      state,
      action: PayloadAction<{ moduleId: string; oldLessonId: string; newLessonId: string }>
    ) => {
      const { moduleId, oldLessonId, newLessonId } = action.payload;
      const mod = state.modules.find((m) => m.id === moduleId);
      if (mod) {
        const lesson = mod.lessons.find((l) => l.id === oldLessonId);
        if (lesson) {
          lesson.id = newLessonId;
          if (state.editingLesson?.lessonId === oldLessonId) {
            state.editingLesson.lessonId = newLessonId;
          }
          if (state.editingQuiz?.lessonId === oldLessonId) {
            state.editingQuiz.lessonId = newLessonId;
          }
        }
      }
    },
    resetCourseBuilder: () => initialState,
  },
});

export const {
  setCourseId,
  setIsLoading,
  setIsSaving,
  markSaved,
  setCourseInformation,
  updateCourseInformation,
  setModules,
  addModule,
  updateModule,
  removeModule,
  updateModuleField,
  addObjectiveToModule,
  editObjectiveInModule,
  removeObjectiveFromModule,
  addLessonToModule,
  updateLessonInModule,
  removeLessonFromModule,
  addQuizQuestionToModule,
  removeQuizQuestionFromModule,
  setVersion,
  setActiveStep,
  setActiveModuleIndex,
  setEditingLesson,
  setEditingQuiz,
  setQuizIdForLesson,
  setQuizQuestionsForLesson,
  setModuleQuizId,
  replaceModuleId,
  replaceLessonId,
  resetCourseBuilder,
} = courseBuilderSlice.actions;

export default courseBuilderSlice.reducer;
