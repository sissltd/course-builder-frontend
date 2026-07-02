"use client";

import React, { useState, useRef } from "react";
import { 
  Trash, 
  Add, 
  Video, 
  ArrowLeft2, 
  ArrowRight2,
  CloseCircle
} from "iconsax-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import { FormSelect } from "@/components/form/FormSelect";
import { Button } from "@/components/shared/Button";
import { useAppDispatch, useAppSelector } from "@/redux";
import { setCourseInformation } from "@/redux/slices/courseBuilderSlice";
import { courseInformationSchema, CourseInformationFormData } from "../utils/schemas";

interface CourseInformationProps {
  onNext?: () => void;
  onBack?: () => void;
}

export const CourseInformation = ({ onNext, onBack }: CourseInformationProps) => {
  const dispatch = useAppDispatch();
  const info = useAppSelector((state) => state.courseBuilder.courseInformation);

  // Main form
  const methods = useForm<CourseInformationFormData>({
    resolver: zodResolver(courseInformationSchema) as any,
    mode: "onBlur",
    values: {
      courseTitle: info.courseTitle,
      description: info.description,
      category: info.category,
      difficulty: info.difficulty,
      hours: info.hours,
      minutes: info.minutes,
      seconds: info.seconds,
      objectives: info.objectives,
      tags: info.tags,
    },
  });

  const { handleSubmit, watch, setValue, formState: { errors } } = methods;
  const description = watch("description");
  const wordCount = description?.trim() === "" ? 0 : (description?.trim()?.split(/\s+/).length ?? 0);

  // Objectives states
  const [objectives, setObjectives] = useState<string[]>(info.objectives);
  const [newObjective, setNewObjective] = useState("");
  const [isAddingObjective, setIsAddingObjective] = useState(false);
  const [editingObjectiveIndex, setEditingObjectiveIndex] = useState<number | null>(null);
  const [editingObjectiveValue, setEditingObjectiveValue] = useState("");

  // Tags states
  const [tags, setTags] = useState<string[]>(info.tags);
  const [newTag, setNewTag] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);

  // File Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [savedVideoName, setSavedVideoName] = useState<string | null>(info.coverVideo?.name || null);
  const [savedVideoSize, setSavedVideoSize] = useState<number | null>(info.coverVideo?.size || null);

  // Objective Handlers
  const handleAddObjective = () => {
    if (newObjective.trim()) {
      const updated = [...objectives, newObjective.trim()];
      setObjectives(updated);
      setValue("objectives", updated, { shouldValidate: true });
      setNewObjective("");
      setIsAddingObjective(false);
    }
  };

  const handleSaveEditObjective = (index: number) => {
    if (editingObjectiveValue.trim()) {
      const updated = [...objectives];
      updated[index] = editingObjectiveValue.trim();
      setObjectives(updated);
      setValue("objectives", updated, { shouldValidate: true });
      setEditingObjectiveIndex(null);
      setEditingObjectiveValue("");
    }
  };

  const handleRemoveObjective = (index: number) => {
    const updated = objectives.filter((_, i) => i !== index);
    setObjectives(updated);
    setValue("objectives", updated, { shouldValidate: true });
  };

  // Tag Handlers
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updated = [...tags, newTag.trim()];
      setTags(updated);
      setValue("tags", updated, { shouldValidate: true });
      setNewTag("");
      setIsAddingTag(false);
    }
  };

  const handleRemoveTag = (index: number) => {
    const updated = tags.filter((_, i) => i !== index);
    setTags(updated);
    setValue("tags", updated, { shouldValidate: true });
  };

  // Video Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setVideoFile(file);
      setSavedVideoName(file.name);
      setSavedVideoSize(file.size);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setSavedVideoName(file.name);
      setSavedVideoSize(file.size);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const onSubmit = (data: CourseInformationFormData) => {
    dispatch(setCourseInformation({
      courseTitle: data.courseTitle,
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      objectives: data.objectives,
      tags: data.tags,
      hours: data.hours,
      minutes: data.minutes,
      seconds: data.seconds,
      coverVideo: videoFile
        ? { name: videoFile.name, size: videoFile.size, type: videoFile.type }
        : savedVideoName
          ? { name: savedVideoName, size: savedVideoSize || 0, type: "" }
          : null,
    }));
    onNext?.();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-[739px] max-w-full bg-[#FDFDFD] px-[24px] py-[40px] flex flex-col gap-[60px] mx-auto pb-[100px]">
        
        {/* Course Info Section */}
        <div className="flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[12px]">
            <h2 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">Course Information</h2>
            <p className="text-[16px] text-[#606060] leading-[24px]">Give your course a meaning, add relevant information about your course here</p>
          </div>

          <div className="border border-[#E8E8E8] rounded-[16px] p-[24px] flex flex-col gap-[20px] bg-white">
            <FormInput 
              name="courseTitle"
              label="Course Title"
              placeholder="Computer appreciation"
              required
            />
            <div className="flex flex-col gap-[6px]">
              <FormTextarea 
                name="description"
                label="Description"
                placeholder="Enter description"
                required
                rows={5}
              />
              <span className="text-[12px] text-[#636363] leading-[16px] self-start">
                {wordCount}/500 words
              </span>
            </div>

            <div className="flex flex-col gap-[8px]">
              <FormSelect 
                name="category"
                label="Course category"
                required
                placeholder="Select category"
                options={[
                  { label: "Software Development", value: "Software Development" },
                  { label: "Leadership", value: "Leadership" },
                  { label: "Guidance and counselling", value: "Guidance and counselling" },
                  { label: "Humanities", value: "Humanities" },
                  { label: "Research", value: "Research" }
                ]}
                triggerClassName="h-[44px] bg-white border-[#D9D9D9] text-[#202020]"
              />
            </div>
          </div>
        </div>

        {/* Difficulty Level Section */}
        <div className="flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[8px]">
            <h3 className="text-[20px] font-semibold text-[#202020] leading-[28px]">Difficulty Level</h3>
            <p className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">Specify the difficult level for this course</p>
          </div>

          <FormSelect 
            name="difficulty"
            placeholder="Select level"
            options={[
              { label: "Beginner", value: "beginner" },
              { label: "Intermediate", value: "intermediate" },
              { label: "Advanced", value: "advanced" },
            ]}
            triggerClassName="h-[44px] bg-white border-[#D9D9D9] text-[#202020]"
          />
        </div>

        {/* Learning Objectives Section */}
        <div className="flex flex-col gap-[24px]">
          <div className="flex items-end justify-between w-full">
            <div className="flex flex-col gap-[8px] max-w-[486px]">
              <h3 className="text-[20px] font-semibold text-[#202020] leading-[28px]">Learning Objectives</h3>
              <p className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">Add what you expect your student to gain at the end of this course.</p>
            </div>
            <span className="text-[14px] text-[#606060] font-medium tracking-[-0.28px] leading-[20px]">
              Minimum of 5 required
            </span>
          </div>

          <div className="border border-[#E8E8E8] rounded-[16px] p-[24px] flex flex-col gap-[16px] bg-white">
            {objectives.length > 0 && (
              <div className="flex flex-col gap-[12px]">
                {objectives.map((obj, i) => (
                  <div key={i} className="min-h-[60px] border border-[#D9D9D9] bg-white rounded-[8px] px-[20px] py-[10px] flex items-center justify-between transition-all">
                    {editingObjectiveIndex === i ? (
                      <div className="flex items-center gap-[12px] w-full">
                        <input
                          type="text"
                          value={editingObjectiveValue}
                          onChange={(e) => setEditingObjectiveValue(e.target.value)}
                          className="flex-1 h-[44px] bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-[14px] text-[#202020]"
                          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleSaveEditObjective(i);
                            }
                            else if (e.key === "Escape") setEditingObjectiveIndex(null);
                          }}
                          autoFocus
                        />
                        <div className="flex items-center gap-[12px] shrink-0">
                          <Button 
                            variant="app-outline"
                            isGhost
                            onClick={() => handleSaveEditObjective(i)}
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
                          <div className="flex flex-col gap-[2px] opacity-30 cursor-grab shrink-0">
                            <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                            <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                            <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                          </div>
                          <span className="text-[14px] text-[#202020] tracking-[-0.28px] break-words">{obj}</span>
                        </div>
                        <div className="flex items-center gap-[20px] shrink-0">
                          <Button 
                            variant="app-outline"
                            isGhost
                            onClick={() => {
                              setEditingObjectiveIndex(i);
                              setEditingObjectiveValue(obj);
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="app-outline"
                            isGhost
                            onClick={() => handleRemoveObjective(i)}
                          >
                            <Trash size={20} variant="Linear" color="#FF6B00" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {isAddingObjective ? (
                  <div className="flex items-center gap-[12px] h-[60px] border border-[#0A60E1] bg-white rounded-[8px] px-[20px]">
                    <input
                      type="text"
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      placeholder="Add learning objective"
                      className="flex-1 h-[44px] bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-[14px] text-[#202020]"
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddObjective();
                        }
                        else if (e.key === "Escape") setIsAddingObjective(false);
                      }}
                      autoFocus
                    />
                    <div className="flex items-center gap-[12px] shrink-0">
                      <Button 
                        variant="app-outline"
                        isGhost
                        onClick={handleAddObjective}
                      >
                        Save
                      </Button>
                      <Button 
                        variant="app-outline"
                        isGhost
                        onClick={() => {
                          setIsAddingObjective(false);
                          setNewObjective("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="app-outline"
                    isGhost
                    onClick={() => setIsAddingObjective(true)}
                    leftIcon={<Add size={24} variant="Linear" color="#202020" />}
                    className="self-start mt-[6px]"
                  >
                    Add more
                  </Button>
                )}
              </div>
            )}
            {objectives.length === 0 && (
              <div className="flex flex-col gap-[12px]">
                {isAddingObjective ? (
                  <div className="flex items-center gap-[12px] h-[60px] border border-[#0A60E1] bg-white rounded-[8px] px-[20px]">
                    <input
                      type="text"
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      placeholder="Add learning objective"
                      className="flex-1 h-[44px] bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-[14px] text-[#202020]"
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddObjective();
                        }
                        else if (e.key === "Escape") setIsAddingObjective(false);
                      }}
                      autoFocus
                    />
                    <div className="flex items-center gap-[12px] shrink-0">
                      <Button 
                        variant="app-outline"
                        isGhost
                        onClick={handleAddObjective}
                      >
                        Save
                      </Button>
                      <Button 
                        variant="app-outline"
                        isGhost
                        onClick={() => {
                          setIsAddingObjective(false);
                          setNewObjective("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="app-outline"
                    isGhost
                    onClick={() => setIsAddingObjective(true)}
                    leftIcon={<Add size={24} variant="Linear" color="#202020" />}
                    className="self-start"
                  >
                    Add
                  </Button>
                )}
              </div>
            )}
            {errors.objectives && (
              <p className="text-caption-xs text-[#FF5025]">{errors.objectives.message}</p>
            )}
          </div>
        </div>

        {/* Tags Section */}
        <div className="flex flex-col gap-[24px]">
          <div className="flex items-end justify-between w-full">
            <div className="flex flex-col gap-[8px] max-w-[486px]">
              <h3 className="text-[20px] font-semibold text-[#202020] leading-[28px]">Tags</h3>
              <p className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">Add relevant tag to your course. For easy searching</p>
            </div>
            <span className="text-[14px] text-[#606060] font-medium tracking-[-0.28px] leading-[20px]">
              Minimum of 3 required
            </span>
          </div>

          <div className="flex items-center gap-[9px] flex-wrap bg-white border border-[#E8E8E8] rounded-[16px] p-[24px]">
            {tags.map((tag, i) => (
              <div key={i} className="h-[32px] flex items-center gap-[6px] bg-transparent">
                <span className="text-[14px] text-black tracking-[-0.28px] font-medium">{tag}</span>
                <button 
                  onClick={() => handleRemoveTag(i)}
                  className="text-black hover:text-[#FF6B00] transition-colors text-[14px] font-light px-[2px]"
                >
                  x
                </button>
              </div>
            ))}

            {isAddingTag ? (
              <div className="flex items-center gap-[8px] bg-white border border-[#D9D9D9] h-[32px] px-[12px] rounded-full">
                <input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") handleAddTag();
                    else if (e.key === "Escape") {
                      setIsAddingTag(false);
                      setNewTag("");
                    }
                  }}
                  placeholder="Tag name..."
                  className="w-[100px] text-[14px] bg-transparent outline-none border-none text-[#202020]"
                  autoFocus
                />
                <button 
                  onClick={handleAddTag} 
                  className="text-[#0A60E1] font-semibold hover:text-[#0051C8] text-[14px]"
                >
                  Save
                </button>
              </div>
            ) : (
              <Button 
                variant="app-outline"
                isGhost
                onClick={() => setIsAddingTag(true)}
                rightIcon={<Add size={18} variant="Linear" color="#606060" />}
                className="h-[32px] px-[12px] rounded-full"
              >
                Add
              </Button>
            )}
          </div>
          {errors.tags && (
            <p className="text-caption-xs text-[#FF5025]">{errors.tags.message}</p>
          )}
        </div>

        {/* Course Duration Section */}
        <div className="flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[8px]">
            <h3 className="text-[20px] font-semibold text-[#202020] leading-[28px]">Course Duration</h3>
            <p className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">Specify the duration for this course</p>
          </div>

          <div className="flex items-center gap-[20px] w-full bg-white border border-[#E8E8E8] rounded-[16px] p-[24px]">
            <div className="flex-1">
              <FormInput 
                name="hours"
                label="Hours"
                type="number"
                placeholder="0"
                containerClassName="[&_input]:[appearance:textfield] [&_input]::-webkit-inner-spin-button:[appearance:none] [&_input]::-webkit-outer-spin-button:[appearance:none]"
              />
            </div>
            <div className="flex-1">
              <FormInput 
                name="minutes"
                label="Minutes"
                type="number"
                placeholder="0"
                containerClassName="[&_input]:[appearance:textfield] [&_input]::-webkit-inner-spin-button:[appearance:none] [&_input]::-webkit-outer-spin-button:[appearance:none]"
              />
            </div>
            <div className="flex-1">
              <FormInput 
                name="seconds"
                label="Seconds"
                type="number"
                placeholder="0"
                containerClassName="[&_input]:[appearance:textfield] [&_input]::-webkit-inner-spin-button:[appearance:none] [&_input]::-webkit-outer-spin-button:[appearance:none]"
              />
            </div>
          </div>
        </div>

        {/* Cover Video Section */}
        <div className="flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[8px] w-full">
            <h3 className="text-[20px] font-semibold text-[#202020] leading-[28px]">Add a cover video</h3>
            <p className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">
              Add a cover video to your course. This cover video serves as means of giving first hand information about your course. Kindly ensure your video has a (Minimum 720p (1280 x 720 pixels). 1080p recommended). or <a href="#" className="text-[#0A60E1] underline underline-offset-2 hover:text-[#0051C8]">Learn more</a> about uploading your cover video
            </p>
          </div>

          <input 
            ref={fileInputRef}
            type="file" 
            accept="video/*" 
            onChange={handleFileChange}
            className="hidden"
          />

          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="h-[312px] bg-[#F0F0F0] rounded-[16px] p-[12px] w-[691px] max-w-full"
          >
            <div className="w-full h-full border border-dashed border-[#D9D9D9] bg-white rounded-[8px] flex flex-col items-center justify-center p-[20px]">
              {(videoFile || savedVideoName) ? (
                <div className="flex flex-col items-center gap-[20px] w-full max-w-[400px] text-center">
                  <div className="size-[60px] rounded-full bg-[#EBF3FF] flex items-center justify-center text-[#0A60E1]">
                    <Video size={36} variant="Bold" color="#0A60E1" />
                  </div>
                  <div className="flex flex-col gap-[4px] w-full">
                    <p className="text-[16px] text-[#202020] font-semibold truncate px-[10px]">
                      {videoFile ? videoFile.name : savedVideoName}
                    </p>
                    <p className="text-[14px] text-[#606060]">
                      {videoFile ? formatFileSize(videoFile.size) : formatFileSize(savedVideoSize || 0)}
                    </p>
                  </div>
                  <div className="flex items-center gap-[12px]">
                    <Button 
                      variant="app-outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change video
                    </Button>
                    <Button 
                      variant="app-outline"
                      onClick={() => {
                        setVideoFile(null);
                        setSavedVideoName(null);
                        setSavedVideoSize(null);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-[20px] w-[330px] cursor-pointer"
                >
                  <div className="size-[60px] rounded-full bg-[#FAFAFA] flex items-center justify-center">
                    <Video size={40} variant="Bulk" color="#686868" />
                  </div>
                  <div className="flex flex-col items-center gap-[12px] w-full">
                    <p className="text-[16px] text-[#1E1E1E] tracking-[-0.32px] text-center leading-[24px]">
                      Click to upload <span className="text-[#686868]">or Drag and drop your file here</span>
                    </p>
                    <p className="text-[14px] text-[#686868] tracking-[-0.28px] text-center">
                      MP4, 720p+, under 500MB
                    </p>
                  </div>
                  <Button 
                    variant="app-outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Choose file
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
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
            type="submit"
            rightIcon={<ArrowRight2 size={24} variant="Linear" color="#FFFFFF" />}
          >
            Save & continue
          </Button>
        </div>

      </form>
    </FormProvider>
  );
};
