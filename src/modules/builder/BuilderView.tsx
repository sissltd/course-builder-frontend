"use client";

import React, { useState } from "react";
import { BuilderHeader } from "./components/BuilderHeader";
import { BuilderSidebar, BuilderStep } from "./components/BuilderSidebar";
import { CourseInformation } from "./components/CourseInformation";
import { CourseOutline } from "./components/CourseOutline";
import { VersionStep } from "./components/VersionStep";
import { ModulesStep, Module, Lesson } from "./components/ModulesStep";
import { LessonSidebar } from "./components/LessonSidebar";
import { LessonEditView } from "./components/LessonEditView";

export default function BuilderView() {
  const [activeStep, setActiveStep] = useState<BuilderStep>("information");
  
  // Elevating modules state to BuilderView for complete interactivity across outline and modules steps
  const [modules, setModules] = useState<Module[]>([]);
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  
  // Lesson editing sub-state
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string; lessonId: string } | null>(null);

  const stepsOrder: BuilderStep[] = ["information", "outline", "version", "modules", "thumbnail", "quality"];

  const handleNext = () => {
    const currentIndex = stepsOrder.indexOf(activeStep);
    if (currentIndex < stepsOrder.length - 1) {
      setActiveStep(stepsOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = stepsOrder.indexOf(activeStep);
    if (currentIndex > 0) {
      setActiveStep(stepsOrder[currentIndex - 1]);
    } else {
      window.history.back();
    }
  };

  const handleAddModule = () => {
    const newId = (modules.length + 1).toString();
    const newModule: Module = {
      id: newId,
      title: "",
      description: "",
      objectives: [],
      lessons: [],
      quizQuestions: []
    };
    setModules([...modules, newModule]);
    setActiveModuleIndex(modules.length);
  };

  const handleUpdateModule = (updated: Module) => {
    setModules(modules.map(m => m.id === updated.id ? updated : m));
  };

  const handleAddLessonForSidebar = (type: "video" | "quiz" | "text") => {
    if (modules.length === 0) return;
    const currentModule = modules[activeModuleIndex];
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: "",
      duration: "0 mins",
      assessments: "0 Assessment",
      type: type,
      objectives: [],
      requirements: "",
      quizQuestions: []
    };
    const updatedModule = {
      ...currentModule,
      lessons: [...currentModule.lessons, newLesson]
    };
    handleUpdateModule(updatedModule);
    if (editingLesson) {
      setEditingLesson({ moduleId: currentModule.id, lessonId: newLesson.id });
    }
  };

  const handleUpdateLesson = (updatedLesson: Lesson) => {
    if (!editingLesson) return;
    const currentModule = modules.find(m => m.id === editingLesson.moduleId);
    if (!currentModule) return;
    const updatedLessons = currentModule.lessons.map(l => l.id === updatedLesson.id ? updatedLesson : l);
    handleUpdateModule({
      ...currentModule,
      lessons: updatedLessons
    });
  };

  const currentModule = modules[activeModuleIndex] || null;
  const currentLesson = currentModule?.lessons.find(l => l.id === editingLesson?.lessonId) || null;

  return (
    <div className="flex flex-col h-full bg-[#FDFDFD] overflow-hidden">
      
      {/* Dynamic Header Breadcrumbs based on Edit view state */}
      <BuilderHeader 
        moduleName={editingLesson && currentModule ? `Module ${activeModuleIndex + 1}` : undefined}
        onBackToModules={editingLesson ? () => setEditingLesson(null) : undefined}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar swaps to Lesson List Sidebar when editing a lesson */}
        {editingLesson && currentModule ? (
          <LessonSidebar 
            lessons={currentModule.lessons}
            activeLessonId={editingLesson.lessonId}
            onSelectLesson={(lessonId) => setEditingLesson({ moduleId: currentModule.id, lessonId })}
            onAddLesson={handleAddLessonForSidebar}
            onBack={() => setEditingLesson(null)}
          />
        ) : (
          <BuilderSidebar 
            activeStep={activeStep} 
            onChangeStep={setActiveStep} 
            modules={modules.map(m => ({ id: m.id, title: m.title }))}
            activeModuleIndex={activeModuleIndex}
            onChangeActiveModuleIndex={setActiveModuleIndex}
            onAddModule={handleAddModule}
          />
        )}
        
        <main className="flex-1 overflow-y-auto">
          {/* Swap main panel content to Lesson Editor when editing a lesson */}
          {editingLesson && currentLesson ? (
            <LessonEditView 
              lesson={currentLesson}
              onUpdateLesson={handleUpdateLesson}
              onBack={() => setEditingLesson(null)}
            />
          ) : (
            <>
              {activeStep === "information" && (
                <CourseInformation onNext={handleNext} onBack={handleBack} />
              )}
              {activeStep === "outline" && (
                <CourseOutline 
                  modules={modules}
                  setModules={setModules}
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
                    module={currentModule}
                    onUpdateModule={handleUpdateModule}
                    onEditLesson={(lessonId) => setEditingLesson({ moduleId: currentModule.id, lessonId })}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-[20px] text-[#606060] p-[40px]">
                    <span className="text-[18px] font-medium">Please add at least one module in the Course Outline step</span>
                    <button 
                      onClick={() => setActiveStep("outline")}
                      className="h-[40px] px-[20px] border border-[#0A60E1] text-[#0A60E1] rounded-[8px] hover:bg-[#0A60E1]/5 transition-colors"
                    >
                      Go to Course Outline
                    </button>
                  </div>
                )
              )}
              {activeStep !== "information" && activeStep !== "outline" && activeStep !== "version" && activeStep !== "modules" && (
                <div className="flex flex-col items-center justify-center h-full gap-[20px] text-[#606060] p-[40px]">
                  <span className="text-[18px] font-medium capitalize">{activeStep} Step Content Coming Soon...</span>
                  <button 
                    onClick={handleBack}
                    className="h-[40px] px-[20px] border border-[#0A60E1] text-[#0A60E1] rounded-[8px] hover:bg-[#0A60E1]/5 transition-colors"
                  >
                    Go back
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
