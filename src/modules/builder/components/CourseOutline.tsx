"use client";

import React, { useState } from "react";
import { 
  Trash, 
  Add, 
  ArrowLeft2, 
  ArrowRight2,
  ArrowDown2,

} from "iconsax-react";
import { cn } from "@/lib/utils";
import { AppInput } from "@/components/form/AppInput";
import { AppTextarea } from "@/components/form/AppTextarea";

interface Module {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  lessons: any[];
  quizQuestions: any[];
}

interface CourseOutlineProps {
  modules: Module[];
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
  onNext?: () => void;
  onBack?: () => void;
}

export const CourseOutline = ({ modules, setModules, onNext, onBack }: CourseOutlineProps) => {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  // Objectives form helper states
  const [isAddingObjectiveForId, setIsAddingObjectiveForId] = useState<string | null>(null);
  const [newObjectiveValue, setNewObjectiveValue] = useState("");
  const [editingObjectiveIndex, setEditingObjectiveIndex] = useState<{ moduleId: string; index: number } | null>(null);
  const [editingObjectiveValue, setEditingObjectiveValue] = useState("");

  const toggleModule = (id: string) => {
    setExpandedModuleId(expandedModuleId === id ? null : id);
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
    setExpandedModuleId(newId);
  };

  const handleRemoveModule = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = modules.filter(m => m.id !== id);
    setModules(updated);
    if (expandedModuleId === id) {
      setExpandedModuleId(null);
    }
  };

  const handleUpdateModuleField = (id: string, field: "title" | "description", value: string) => {
    setModules(modules.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  // Objective Operations
  const handleAddObjective = (moduleId: string) => {
    if (newObjectiveValue.trim()) {
      setModules(modules.map(m => {
        if (m.id === moduleId) {
          return { ...m, objectives: [...m.objectives, newObjectiveValue.trim()] };
        }
        return m;
      }));
      setNewObjectiveValue("");
      setIsAddingObjectiveForId(null);
    }
  };

  const handleSaveEditObjective = (moduleId: string, index: number) => {
    if (editingObjectiveValue.trim()) {
      setModules(modules.map(m => {
        if (m.id === moduleId) {
          const updated = [...m.objectives];
          updated[index] = editingObjectiveValue.trim();
          return { ...m, objectives: updated };
        }
        return m;
      }));
      setEditingObjectiveIndex(null);
      setEditingObjectiveValue("");
    }
  };

  const handleRemoveObjective = (moduleId: string, index: number) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return { ...m, objectives: m.objectives.filter((_, i) => i !== index) };
      }
      return m;
    }));
  };

  return (
    <div className="w-[739px] max-w-full bg-[#FDFDFD] px-[24px] py-[40px] flex flex-col gap-[40px] mx-auto pb-[100px]">
      
      {/* Title / Description */}
      <div className="flex flex-col gap-[12px]">
        <h2 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">Course Outline</h2>
        <p className="text-[16px] text-[#606060] leading-[24px]">
          Create a clear outline for your course to help students understand its structure, expectations, and requirements before they begin.
        </p>
      </div>

      {/* Modules List Box */}
      <div className="flex flex-col gap-[24px]">
        <div className="flex items-end justify-between w-full">
          <h3 className="text-[20px] font-semibold text-[#202020] leading-[28px]">Modules</h3>
          <span className="text-[14px] text-[#606060] font-medium tracking-[-0.28px] leading-[20px]">
            Minimum of 5 required per modules
          </span>
        </div>

        <div className="flex flex-col gap-[16px]">
          {modules.map((mod, modIdx) => {
            const isExpanded = expandedModuleId === mod.id;
            return (
              <div 
                key={mod.id} 
                className={cn(
                  "border border-[#E8E8E8] rounded-[16px] bg-white transition-all overflow-hidden",
                  isExpanded ? "p-[24px] flex flex-col gap-[20px]" : "h-[64px] px-[24px] flex items-center justify-between cursor-pointer"
                )}
                onClick={() => !isExpanded && toggleModule(mod.id)}
              >
                {/* Accordion Header */}
                <div className={cn("flex items-center justify-between w-full", isExpanded && "pb-[4px]")}>
                  <div className="flex items-center gap-[12px]" onClick={(e) => {
                    if (isExpanded) {
                      e.stopPropagation();
                      toggleModule(mod.id);
                    }
                  }}>
                    {isExpanded ? (
                      <ArrowDown2 size={20} variant="Linear" color="#202020" className="cursor-pointer" />
                    ) : (
                      <ArrowRight2 size={20} variant="Linear" color="#202020" className="cursor-pointer" />
                    )}
                    <span className="text-[16px] font-semibold text-[#202020] tracking-[-0.32px]">
                      Module {modIdx + 1}:{mod.title && ` ${mod.title}`}
                    </span>
                  </div>

                  {/* Actions (Delete and Drag) */}
                  <div className="flex items-center gap-[20px]" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={(e) => handleRemoveModule(mod.id, e)}
                      className="text-[#606060] hover:text-[#FF6B00] transition-colors"
                    >
                      <Trash size={20} variant="Linear" color="#FF6B00" />
                    </button>
                    {/* Drag Handle */}
                    <div className="flex flex-col gap-[2px] opacity-35 cursor-grab">
                      <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                      <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                      <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                    </div>
                  </div>
                </div>

                {/* Accordion Content (Visible when Expanded) */}
                {isExpanded && (
                  <div className="flex flex-col gap-[20px] w-full" onClick={(e) => e.stopPropagation()}>
                    <AppInput 
                      label="Title"
                      placeholder="Enter a title for this module"
                      value={mod.title}
                      onChange={(e) => handleUpdateModuleField(mod.id, "title", e.target.value)}
                    />

                    <AppTextarea 
                      label="Description"
                      placeholder="Describe this module"
                      value={mod.description}
                      onChange={(e) => handleUpdateModuleField(mod.id, "description", e.target.value)}
                      rows={3}
                    />

                    {/* Learning Objectives Subsection */}
                    <div className="flex flex-col gap-[12px] mt-[4px]">
                      <span className="text-[14px] font-semibold text-[#202020] tracking-[-0.28px]">
                        Learning objectives
                      </span>

                      <div className="flex flex-col gap-[12px]">
                        {mod.objectives.map((obj, objIdx) => {
                          const isEditing = editingObjectiveIndex?.moduleId === mod.id && editingObjectiveIndex?.index === objIdx;
                          return (
                            <div key={objIdx} className="min-h-[56px] border border-[#D9D9D9] bg-white rounded-[8px] px-[20px] py-[10px] flex items-center justify-between transition-all">
                              {isEditing ? (
                                <div className="flex items-center gap-[12px] w-full">
                                  <input 
                                    value={editingObjectiveValue}
                                    onChange={(e) => setEditingObjectiveValue(e.target.value)}
                                    className="flex-1 border-none focus:ring-0 focus:outline-none h-[40px] text-[14px] text-[#202020]"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") handleSaveEditObjective(mod.id, objIdx);
                                      else if (e.key === "Escape") setEditingObjectiveIndex(null);
                                    }}
                                  />
                                  <div className="flex items-center gap-[12px] shrink-0">
                                    <button 
                                      onClick={() => handleSaveEditObjective(mod.id, objIdx)}
                                      className="text-[14px] text-[#0A60E1] font-semibold hover:underline"
                                    >
                                      Save
                                    </button>
                                    <button 
                                      onClick={() => setEditingObjectiveIndex(null)}
                                      className="text-[14px] text-[#606060] hover:underline"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center gap-[8px] flex-1 mr-[12px]">
                                    <span className="text-[14px] text-[#202020] font-medium min-w-[20px]">
                                      {modIdx + 1}.{objIdx + 1}
                                    </span>
                                    <span className="text-[14px] text-[#202020] tracking-[-0.28px] break-words">
                                      {obj}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-[20px] shrink-0">
                                    <button 
                                      onClick={() => {
                                        setEditingObjectiveIndex({ moduleId: mod.id, index: objIdx });
                                        setEditingObjectiveValue(obj);
                                      }}
                                      className="text-[14px] text-[#606060] tracking-[-0.28px] underline underline-offset-2 hover:text-[#202020]"
                                    >
                                      Edit
                                    </button>
                                    <button 
                                      onClick={() => handleRemoveObjective(mod.id, objIdx)}
                                      className="text-[#606060] hover:text-[#FF6B00] transition-colors"
                                    >
                                      <Trash size={20} variant="Linear" color="#FF6B00" />
                                    </button>
                                    {/* Drag Handle */}
                                    <div className="flex flex-col gap-[2px] opacity-35 cursor-grab">
                                      <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                                      <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                                      <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}

                        {/* Inline Add Objective Input Field */}
                        {isAddingObjectiveForId === mod.id && (
                          <div className="flex items-center gap-[12px] h-[56px] border border-[#0A60E1] bg-white rounded-[8px] px-[20px]">
                            <input 
                              value={newObjectiveValue}
                              onChange={(e) => setNewObjectiveValue(e.target.value)}
                              placeholder="Enter learning objective"
                              className="flex-1 border-none focus:ring-0 focus:outline-none h-[40px] text-[14px] text-[#202020]"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddObjective(mod.id);
                                else if (e.key === "Escape") setIsAddingObjectiveForId(null);
                              }}
                            />
                            <div className="flex items-center gap-[12px] shrink-0">
                              <button 
                                onClick={() => handleAddObjective(mod.id)}
                                className="text-[14px] text-[#0A60E1] font-semibold hover:underline"
                              >
                                Save
                              </button>
                              <button 
                                onClick={() => {
                                  setIsAddingObjectiveForId(null);
                                  setNewObjectiveValue("");
                                }}
                                className="text-[14px] text-[#606060] hover:underline"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Add Objective Trigger Button */}
                      {isAddingObjectiveForId !== mod.id && (
                        <button 
                          onClick={() => setIsAddingObjectiveForId(mod.id)}
                          className="flex items-center gap-[6px] text-[#0A60E1] hover:text-[#0A50C5] transition-colors mt-[4px] self-start"
                        >
                          <Add size={20} variant="Linear" color="#0A60E1" />
                          <span className="text-[14px] font-semibold tracking-[-0.28px]">Add objective</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Module Button */}
        <button 
          onClick={handleAddModule}
          className="flex items-center gap-[6px] text-[#0A60E1] hover:text-[#0A50C5] transition-colors self-start"
        >
          <Add size={20} variant="Linear" color="#0A60E1" />
          <span className="text-[16px] font-semibold tracking-[-0.32px]">Add Module</span>
        </button>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between w-full pt-[24px]">
        <button 
          onClick={onBack}
          className="h-[44px] px-[24px] border border-[#0A60E1] text-[#0A60E1] rounded-[8px] flex items-center gap-[8px] hover:bg-[#0A60E1]/5 transition-colors"
        >
          <ArrowLeft2 size={24} variant="Linear" color="#0A60E1" />
          <span className="text-[14px] font-medium tracking-[-0.28px]">Go back</span>
        </button>
        <button 
          onClick={onNext}
          className="h-[44px] px-[24px] bg-[#0A60E1] text-white rounded-[8px] flex items-center gap-[8px] hover:bg-[#0A50C5] transition-colors"
        >
          <span className="text-[14px] font-medium tracking-[-0.28px]">Save & continue</span>
          <ArrowRight2 size={24} variant="Linear" color="#FFFFFF" />
        </button>
      </div>

    </div>
  );
};
