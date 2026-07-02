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
  courseInformation: CourseInformationData;
  modules: Module[];
  version: string;
  activeStep: BuilderStep;
  activeModuleIndex: number;
  editingLesson: { moduleId: string; lessonId: string } | null;
  editingQuiz: { moduleId: string; lessonId: string } | null;
}

const initialState: CourseBuilderState = {
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
};

const courseBuilderSlice = createSlice({
  name: "courseBuilder",
  initialState,
  reducers: {
    setCourseInformation: (state, action: PayloadAction<CourseInformationData>) => {
      state.courseInformation = action.payload;
    },
    updateCourseInformation: (state, action: PayloadAction<Partial<CourseInformationData>>) => {
      state.courseInformation = {
        ...state.courseInformation,
        ...action.payload,
      };
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
    },
    updateModule: (state, action: PayloadAction<Module>) => {
      const index = state.modules.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.modules[index] = action.payload;
      }
    },
    removeModule: (state, action: PayloadAction<string>) => {
      state.modules = state.modules.filter((m) => m.id !== action.payload);
      if (state.activeModuleIndex >= state.modules.length) {
        state.activeModuleIndex = Math.max(0, state.modules.length - 1);
      }
    },
    updateModuleField: (
      state,
      action: PayloadAction<{ id: string; field: "title" | "description"; value: string }>
    ) => {
      const { id, field, value } = action.payload;
      const module = state.modules.find((m) => m.id === id);
      if (module) {
        module[field] = value;
      }
    },
    addObjectiveToModule: (state, action: PayloadAction<{ moduleId: string; objective: string }>) => {
      const { moduleId, objective } = action.payload;
      const module = state.modules.find((m) => m.id === moduleId);
      if (module) {
        module.objectives.push(objective);
      }
    },
    editObjectiveInModule: (
      state,
      action: PayloadAction<{ moduleId: string; index: number; objective: string }>
    ) => {
      const { moduleId, index, objective } = action.payload;
      const module = state.modules.find((m) => m.id === moduleId);
      if (module && module.objectives[index] !== undefined) {
        module.objectives[index] = objective;
      }
    },
    removeObjectiveFromModule: (state, action: PayloadAction<{ moduleId: string; index: number }>) => {
      const { moduleId, index } = action.payload;
      const module = state.modules.find((m) => m.id === moduleId);
      if (module) {
        module.objectives = module.objectives.filter((_, i) => i !== index);
      }
    },
    addLessonToModule: (state, action: PayloadAction<{ moduleId: string; type: "video" | "quiz" | "text"; lessonId?: string }>) => {
      const { moduleId, type, lessonId } = action.payload;
      const module = state.modules.find((m) => m.id === moduleId);
      if (module) {
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
        module.lessons.push(newLesson);
      }
    },
    updateLessonInModule: (
      state,
      action: PayloadAction<{ moduleId: string; lessonId: string; updatedLesson: Lesson }>
    ) => {
      const { moduleId, lessonId, updatedLesson } = action.payload;
      const module = state.modules.find((m) => m.id === moduleId);
      if (module) {
        const lessonIndex = module.lessons.findIndex((l) => l.id === lessonId);
        if (lessonIndex !== -1) {
          module.lessons[lessonIndex] = updatedLesson;
        }
      }
    },
    removeLessonFromModule: (state, action: PayloadAction<{ moduleId: string; lessonId: string }>) => {
      const { moduleId, lessonId } = action.payload;
      const module = state.modules.find((m) => m.id === moduleId);
      if (module) {
        module.lessons = module.lessons.filter((l) => l.id !== lessonId);
      }
    },
    addQuizQuestionToModule: (state, action: PayloadAction<{ moduleId: string }>) => {
      const { moduleId } = action.payload;
      const module = state.modules.find((m) => m.id === moduleId);
      if (module) {
        module.quizQuestions.push({
          question: "",
          options: ["", "", "", ""],
        });
      }
    },
    removeQuizQuestionFromModule: (state, action: PayloadAction<{ moduleId: string; index: number }>) => {
      const { moduleId, index } = action.payload;
      const module = state.modules.find((m) => m.id === moduleId);
      if (module) {
        module.quizQuestions = module.quizQuestions.filter((_, i) => i !== index);
      }
    },
    setVersion: (state, action: PayloadAction<string>) => {
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
    setEditingQuiz: (state, action: PayloadAction<{ moduleId: string; lessonId: string } | null>) => {
      state.editingQuiz = action.payload;
    },
    resetCourseBuilder: () => initialState,
  },
});

export const {
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
  resetCourseBuilder,
} = courseBuilderSlice.actions;

export default courseBuilderSlice.reducer;
