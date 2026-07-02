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
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import { Button } from "@/components/shared/Button";
import { useAppDispatch, useAppSelector } from "@/redux";
import { 
  addModule, 
  removeModule, 
  updateModuleField, 
  addObjectiveToModule, 
  editObjectiveInModule, 
  removeObjectiveFromModule,
  Module
} from "@/redux/slices/courseBuilderSlice";
import { courseOutlineSchema } from "../utils/schemas";

interface CourseOutlineProps {
  onNext?: () => void;
  onBack?: () => void;
}

export const CourseOutline = ({ onNext, onBack }: CourseOutlineProps) => {
  const dispatch = useAppDispatch();
  const modules = useAppSelector((state) => state.courseBuilder.modules);

  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  // Objectives form helper states
  const [isAddingObjectiveForId, setIsAddingObjectiveForId] = useState<string | null>(null);
  const [newObjectiveValue, setNewObjectiveValue] = useState("");
  const [editingObjectiveIndex, setEditingObjectiveIndex] = useState<{ moduleId: string; index: number } | null>(null);
  const [editingObjectiveValue, setEditingObjectiveValue] = useState("");

  // Validation States
  const [validationErrors, setValidationErrors] = useState<string | null>(null);
  const [moduleErrors, setModuleErrors] = useState<Record<string, { title?: string; description?: string; objectives?: string }> | null>(null);

  const toggleModule = (id: string) => {
    setExpandedModuleId(expandedModuleId === id ? null : id);
  };

  const handleAddModule = () => {
    dispatch(addModule());
    const newId = (modules.length + 1).toString();
    setExpandedModuleId(newId);
  };

  const handleRemoveModule = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeModule(id));
    if (expandedModuleId === id) {
      setExpandedModuleId(null);
    }
  };

  const handleUpdateModuleField = (id: string, field: "title" | "description", value: string) => {
    dispatch(updateModuleField({ id, field, value }));
  };

  // Objective Operations
  const handleAddObjective = (moduleId: string) => {
    if (newObjectiveValue.trim()) {
      dispatch(addObjectiveToModule({ moduleId, objective: newObjectiveValue.trim() }));
      setNewObjectiveValue("");
      setIsAddingObjectiveForId(null);
    }
  };

  const handleSaveEditObjective = (moduleId: string, index: number) => {
    if (editingObjectiveValue.trim()) {
      dispatch(editObjectiveInModule({ moduleId, index, objective: editingObjectiveValue.trim() }));
      setEditingObjectiveIndex(null);
      setEditingObjectiveValue("");
    }
  };

  const handleRemoveObjective = (moduleId: string, index: number) => {
    dispatch(removeObjectiveFromModule({ moduleId, index }));
  };

  const handleSaveAndContinue = () => {
    const result = courseOutlineSchema.safeParse({ modules });
    if (!result.success) {
      const errors: Record<string, { title?: string; description?: string; objectives?: string }> = {};
      let globalError = null;

      result.error.issues.forEach((err) => {
        if (err.path[0] === "modules" && typeof err.path[1] === "number") {
          const index = err.path[1];
          const field = err.path[2];
          const mod = modules[index];
          if (mod) {
            if (!errors[mod.id]) errors[mod.id] = {};
            if (field === "title") errors[mod.id].title = err.message;
            if (field === "description") errors[mod.id].description = err.message;
            if (field === "objectives") errors[mod.id].objectives = err.message;
          }
        } else {
          globalError = err.message;
        }
      });
      
      setModuleErrors(errors);
      setValidationErrors(globalError);
      
      const firstErrorModuleId = Object.keys(errors)[0];
      if (firstErrorModuleId) {
        setExpandedModuleId(firstErrorModuleId);
      }
      return;
    }

    setValidationErrors(null);
    setModuleErrors(null);
    onNext?.();
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
                    <Button 
                      variant="app-outline"
                      isGhost
                      onClick={(e: React.MouseEvent) => handleRemoveModule(mod.id, e)}
                    >
                      <Trash size={20} variant="Linear" color="#FF6B00" />
                    </Button>
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
                    <FormInput
                      name={`module_title_${mod.id}`}
                      label="Title"
                      placeholder="Enter a title for this module"
                      value={mod.title}
                      onChange={(e) => handleUpdateModuleField(mod.id, "title", e.target.value)}
                      error={moduleErrors?.[mod.id]?.title}
                    />

                    <FormTextarea
                      name={`module_desc_${mod.id}`}
                      label="Description"
                      placeholder="Describe this module"
                      value={mod.description}
                      onChange={(e) => handleUpdateModuleField(mod.id, "description", e.target.value)}
                      rows={3}
                      error={moduleErrors?.[mod.id]?.description}
                    />

                    {/* Learning Objectives Subsection */}
                    <div className="flex flex-col gap-[12px] mt-[4px]">
                      <span className="text-[14px] font-semibold text-[#202020] tracking-[-0.28px]">
                        Learning objectives
                      </span>
                      {moduleErrors?.[mod.id]?.objectives && (
                        <p className="text-caption-xs text-[#FF5025]">{moduleErrors[mod.id].objectives}</p>
                      )}

                      <div className="flex flex-col gap-[12px]">
                        {mod.objectives.map((obj, objIdx) => {
                          const isEditing = editingObjectiveIndex?.moduleId === mod.id && editingObjectiveIndex?.index === objIdx;
                          return (
                            <div key={objIdx} className="min-h-[56px] border border-[#D9D9D9] bg-white rounded-[8px] px-[20px] py-[10px] flex items-center justify-between transition-all">
                              {isEditing ? (
                                <div className="flex items-center gap-[12px] w-full">
                                  <FormInput
                                    name="editingObjectiveValue"
                                    value={editingObjectiveValue}
                                    onChange={(e) => setEditingObjectiveValue(e.target.value)}
                                    containerClassName="flex-1"
                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                      if (e.key === "Enter") handleSaveEditObjective(mod.id, objIdx);
                                      else if (e.key === "Escape") setEditingObjectiveIndex(null);
                                    }}
                                  />
                                  <div className="flex items-center gap-[12px] shrink-0">
                                    <Button 
                                      variant="app-outline"
                                      isGhost
                                      onClick={() => handleSaveEditObjective(mod.id, objIdx)}
                                    >
                                      Save
                                    </Button>
                                    <Button 
                                      variant="app-outline"
                                      isGhost
                                      onClick={() => setEditingObjectiveIndex(null)}
                                    >
                                      Cancel
                                    </Button>
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
                                    <Button 
                                      variant="app-outline"
                                      isGhost
                                      onClick={() => {
                                        setEditingObjectiveIndex({ moduleId: mod.id, index: objIdx });
                                        setEditingObjectiveValue(obj);
                                      }}
                                    >
                                      Edit
                                    </Button>
                                    <Button 
                                      variant="app-outline"
                                      isGhost
                                      onClick={() => handleRemoveObjective(mod.id, objIdx)}
                                    >
                                      <Trash size={20} variant="Linear" color="#FF6B00" />
                                    </Button>
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
                            <FormInput
                              name="newObjectiveValue"
                              value={newObjectiveValue}
                              onChange={(e) => setNewObjectiveValue(e.target.value)}
                              containerClassName="flex-1"
                              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if (e.key === "Enter") handleAddObjective(mod.id);
                                else if (e.key === "Escape") setIsAddingObjectiveForId(null);
                              }}
                            />
                            <div className="flex items-center gap-[12px] shrink-0">
                              <Button 
                                variant="app-outline"
                                isGhost
                                onClick={() => handleAddObjective(mod.id)}
                              >
                                Save
                              </Button>
                              <Button 
                                variant="app-outline"
                                isGhost
                                onClick={() => {
                                  setIsAddingObjectiveForId(null);
                                  setNewObjectiveValue("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Add Objective Trigger Button */}
                      {isAddingObjectiveForId !== mod.id && (
                        <Button 
                          variant="app-outline"
                          isGhost
                          onClick={() => setIsAddingObjectiveForId(mod.id)}
                          leftIcon={<Add size={20} variant="Linear" color="#0A60E1" />}
                          className="self-start mt-[4px]"
                        >
                          Add objective
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Module Button */}
        <Button 
          variant="app-outline"
          isGhost
          onClick={handleAddModule}
          leftIcon={<Add size={20} variant="Linear" color="#0A60E1" />}
          className="self-start"
        >
          Add Module
        </Button>
      </div>

      {validationErrors && (
        <p className="text-caption-xs text-[#FF5025] text-center">{validationErrors}</p>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between w-full pt-[24px]">
        <Button 
          variant="app-outline"
          onClick={onBack}
          leftIcon={<ArrowLeft2 size={24} variant="Linear" color="#0A60E1" />}
        >
          Go back
        </Button>
        <Button 
          variant="app-primary"
          onClick={handleSaveAndContinue}
          rightIcon={<ArrowRight2 size={24} variant="Linear" color="#FFFFFF" />}
        >
          Save & continue
        </Button>
      </div>

    </div>
  );
};
