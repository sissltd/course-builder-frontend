"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux";
import { 
  setActiveStep, 
  setActiveModuleIndex, 
  setEditingLesson, 
  setEditingQuiz,
  addModule, 
  updateModule,
  addLessonToModule,
  updateLessonInModule,
  Module,
  Lesson,
  BuilderStep
} from "@/redux/slices/courseBuilderSlice";
import { BuilderHeader } from "./components/BuilderHeader";
import { BuilderSidebar } from "./components/BuilderSidebar";
import { CourseInformation } from "./components/CourseInformation";
import { CourseOutline } from "./components/CourseOutline";
import { VersionStep } from "./components/VersionStep";
import { ModulesStep } from "./components/ModulesStep";
import { LessonSidebar } from "./components/LessonSidebar";
import { LessonEditView } from "./components/LessonEditView";
import { ThumbnailStep } from "./components/ThumbnailStep";
import { QualityCheckStep } from "./components/QualityCheckStep";
import { CoursePreviewView } from "./components/CoursePreviewView";
import { AddLinkModal } from "./components/AddLinkModal";
import { QuizEditorPageView } from "./components/QuizEditorPageView";

export default function BuilderView() {
  const dispatch = useAppDispatch();
  const activeStep = useAppSelector((state) => state.courseBuilder.activeStep);
  const modules = useAppSelector((state) => state.courseBuilder.modules);
  const activeModuleIndex = useAppSelector((state) => state.courseBuilder.activeModuleIndex);
  const editingLesson = useAppSelector((state) => state.courseBuilder.editingLesson);
  const editingQuiz = useAppSelector((state) => state.courseBuilder.editingQuiz);
  const [showingPreview, setShowingPreview] = React.useState(false);

  const stepsOrder: BuilderStep[] = ["information", "outline", "version", "modules", "thumbnail", "quality"];

  const handleNext = () => {
    const currentIndex = stepsOrder.indexOf(activeStep);
    if (currentIndex < stepsOrder.length - 1) {
      dispatch(setActiveStep(stepsOrder[currentIndex + 1]));
    }
  };

  const handleBack = () => {
    const currentIndex = stepsOrder.indexOf(activeStep);
    if (currentIndex > 0) {
      dispatch(setActiveStep(stepsOrder[currentIndex - 1]));
    } else {
      window.history.back();
    }
  };

  const handleAddModule = () => {
    dispatch(addModule());
  };

  const handleUpdateModule = (updated: Module) => {
    dispatch(updateModule(updated));
  };

  const handleAddLessonForSidebar = (type: "video" | "quiz" | "text") => {
    if (modules.length === 0) return;
    const currentModule = modules[activeModuleIndex];
    const newLessonId = Date.now().toString();
    dispatch(addLessonToModule({ moduleId: currentModule.id, type, lessonId: newLessonId }));
    if (editingLesson) {
      dispatch(setEditingLesson({ moduleId: currentModule.id, lessonId: newLessonId }));
    }
  };

  const handleUpdateLesson = (updatedLesson: Lesson) => {
    if (!editingLesson) return;
    dispatch(
      updateLessonInModule({
        moduleId: editingLesson.moduleId,
        lessonId: editingLesson.lessonId,
        updatedLesson,
      })
    );
  };

  const currentModule = modules[activeModuleIndex] || null;
  const currentLesson = currentModule?.lessons.find(l => l.id === editingLesson?.lessonId) || null;

  return (
    <div className="flex flex-col h-full bg-[#FDFDFD] overflow-hidden">
      
      {/* Dynamic Header Breadcrumbs based on Edit view state */}
      <BuilderHeader 
        moduleName={editingLesson && currentModule ? `Module ${activeModuleIndex + 1}` : undefined}
        onBackToModules={editingLesson ? () => dispatch(setEditingLesson(null)) : undefined}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Preview mode: full-screen course preview */}
        {showingPreview ? (
          <main className="flex-1 overflow-hidden">
            <CoursePreviewView />
          </main>
        ) : editingQuiz ? (
          <main className="flex-1 overflow-y-auto">
            <QuizEditorPageView />
          </main>
        ) : (
          <>
            {/* Sidebar swaps to Lesson List Sidebar when editing a lesson */}
            {editingLesson && currentModule ? (
              <LessonSidebar 
                lessons={currentModule.lessons}
                activeLessonId={editingLesson.lessonId}
                onSelectLesson={(lessonId) => dispatch(setEditingLesson({ moduleId: currentModule.id, lessonId }))}
                onAddLesson={handleAddLessonForSidebar}
                onBack={() => dispatch(setEditingLesson(null))}
              />
            ) : (
              <BuilderSidebar 
                activeStep={activeStep} 
                onChangeStep={(step) => dispatch(setActiveStep(step))} 
                modules={modules.map(m => ({ id: m.id, title: m.title }))}
                activeModuleIndex={activeModuleIndex}
                onChangeActiveModuleIndex={(index) => dispatch(setActiveModuleIndex(index))}
                onAddModule={handleAddModule}
              />
            )}
            
            <main className="flex-1 overflow-y-auto">
              {/* Swap main panel content to Lesson Editor when editing a lesson */}
              {editingLesson && currentLesson ? (
                <LessonEditView 
                  lesson={currentLesson}
                  onUpdateLesson={handleUpdateLesson}
                  onBack={() => dispatch(setEditingLesson(null))}
                />
              ) : (
                <>
                  {activeStep === "information" && (
                    <CourseInformation onNext={handleNext} onBack={handleBack} />
                  )}
                  {activeStep === "outline" && (
                    <CourseOutline 
                      onNext={handleNext} 
                      onBack={handleBack} 
                    />
                  )}
                  {activeStep === "version" && (
                    <VersionStep onNext={handleNext} onBack={handleBack} />
                  )}
                  {activeStep === "modules" && (
                    currentModule ? (
                      <ModulesStep 
                        key={currentModule.id}
                        module={currentModule}
                        onUpdateModule={handleUpdateModule}
                        onEditLesson={(lessonId) => dispatch(setEditingLesson({ moduleId: currentModule.id, lessonId }))}
                        onNext={handleNext}
                        onBack={handleBack}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-[20px] text-[#606060] p-[40px]">
                        <span className="text-[18px] font-medium">Please add at least one module in the Course Outline step</span>
                        <button 
                          onClick={() => dispatch(setActiveStep("outline"))}
                          className="h-[40px] px-[20px] border border-[#0A60E1] text-[#0A60E1] rounded-[8px] hover:bg-[#0A60E1]/5 transition-colors"
                        >
                          Go to Course Outline
                        </button>
                      </div>
                    )
                  )}
                  {activeStep === "thumbnail" && (
                    <ThumbnailStep onNext={handleNext} onBack={handleBack} />
                  )}
                  {activeStep === "quality" && (
                    <QualityCheckStep onNext={handleNext} onBack={handleBack} onPreview={() => setShowingPreview(true)} />
                  )}
                </>
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
}
