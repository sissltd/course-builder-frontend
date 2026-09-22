import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { QuizBuilderQuestion } from "./quizBuilderSlice";

export type QuizQuestionData = QuizBuilderQuestion;

export interface Lesson {
  id: string;
  title: string;
  duration?: string;
  estimatedDuration?: string;
  assessments?: string;
  type: "video" | "text";
  objectives?: string[];
  requirements?: string;
  content?: string;
  videoScript?: string;
  embedLink?: string;
  videoUrl?: string;
  mediaFileName?: string;
  quizQuestions?: QuizQuestionData[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  lessons: Lesson[];
  quizQuestions: QuizQuestionData[];
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

export interface FinalAssessmentData {
  title: string;
  quizQuestions: QuizQuestionData[];
}

export type EditingQuizTarget =
  | { level: "lesson"; moduleId: string; lessonId: string }
  | { level: "course" };

export interface CourseBuilderState {
  courseId: string | null;
  courseInformation: CourseInformationData;
  modules: Module[];
  finalAssessment: FinalAssessmentData;
  version: string;
  activeStep: BuilderStep;
  activeModuleIndex: number;
  editingLesson: { moduleId: string; lessonId: string } | null;
  editingQuiz: EditingQuizTarget | null;
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  lastSavedAt: number | null;
  saveDepth: number;
  savedFingerprints: Record<string, string>;
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
  finalAssessment: {
    title: "Final Assessment",
    quizQuestions: [],
  },
  version: "",
  activeStep: "information",
  activeModuleIndex: 0,
  editingLesson: null,
  editingQuiz: null,
  isLoading: false,
  isSaving: false,
  isDirty: false,
  lastSavedAt: null,
  saveDepth: 0,
  savedFingerprints: {},
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
    beginSave: (state) => {
      state.saveDepth = (state.saveDepth || 0) + 1;
      state.isSaving = true;
    },
    endSave: (state) => {
      state.saveDepth = Math.max(0, (state.saveDepth || 0) - 1);
      if (state.saveDepth === 0) {
        state.isSaving = false;
      }
    },
    markSaved: (state) => {
      state.isDirty = false;
      state.isSaving = false;
      state.saveDepth = 0;
      state.lastSavedAt = Date.now();
    },
    setFingerprint: (
      state,
      action: PayloadAction<{ key: string; value: string }>
    ) => {
      if (!state.savedFingerprints) state.savedFingerprints = {};
      state.savedFingerprints[action.payload.key] = action.payload.value;
    },
    setFingerprints: (state, action: PayloadAction<Record<string, string>>) => {
      state.savedFingerprints = {
        ...(state.savedFingerprints || {}),
        ...action.payload,
      };
    },
    clearFingerprints: (state) => {
      state.savedFingerprints = {};
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
    setFinalAssessment: (state, action: PayloadAction<FinalAssessmentData>) => {
      state.finalAssessment = action.payload;
    },
    updateFinalAssessment: (
      state,
      action: PayloadAction<Partial<FinalAssessmentData>>
    ) => {
      state.finalAssessment = {
        ...(state.finalAssessment || { title: "", quizQuestions: [] }),
        ...action.payload,
      };
      state.isDirty = true;
    },
    addModule: (state) => {
      const newId = Date.now().toString();
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
    addLessonToModule: (state, action: PayloadAction<{ moduleId: string; type: "video" | "text"; lessonId?: string }>) => {
      const { moduleId, type, lessonId } = action.payload;
      const mod = state.modules.find((m) => m.id === moduleId);
      if (mod) {
        const newLesson: Lesson = {
          id: lessonId || Date.now().toString(),
          title: "",
          duration: "0 mins",
          estimatedDuration: "0 mins",
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
          id: `${moduleId}-${mod.quizQuestions.length + 1}`,
          question: "",
          type: "single",
          points: 0,
          options: [
            { id: `${moduleId}-${mod.quizQuestions.length + 1}-a`, label: "A", value: "" },
            { id: `${moduleId}-${mod.quizQuestions.length + 1}-b`, label: "B", value: "" },
          ],
          explanation: "",
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
    hydrateVersion: (state, action: PayloadAction<string>) => {
      state.version = action.payload;
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
    setEditingQuiz: (state, action: PayloadAction<EditingQuizTarget | null>) => {
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
        if (state.editingQuiz?.level === "lesson" && state.editingQuiz.moduleId === oldId) {
          state.editingQuiz.moduleId = newId;
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
        }
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
          if (state.editingQuiz?.level === "lesson" && state.editingQuiz.lessonId === oldLessonId) {
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
  beginSave,
  endSave,
  markSaved,
  setFingerprint,
  setFingerprints,
  clearFingerprints,
  setCourseInformation,
  updateCourseInformation,
  setModules,
  setFinalAssessment,
  updateFinalAssessment,
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
  hydrateVersion,
  setActiveStep,
  setActiveModuleIndex,
  setEditingLesson,
  setEditingQuiz,
  setQuizQuestionsForLesson,
  replaceModuleId,
  replaceLessonId,
  resetCourseBuilder,
} = courseBuilderSlice.actions;

export default courseBuilderSlice.reducer;
