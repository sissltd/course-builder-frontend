"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Trash, 
  Add, 
  Video, 
  ArrowLeft2, 
  ArrowRight2,
  Play,
} from "iconsax-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import { FormSelect } from "@/components/form/FormSelect";
import { Button } from "@/components/shared/Button";
import { useAppDispatch, useAppSelector } from "@/redux";
import { setCourseInformation } from "@/redux/slices/courseBuilderSlice";
import { syncSetCoverVideo } from "@/redux/slices/builderSync";
import { useDebouncedCourseSave } from "../hooks/useDebouncedCourseSave";
import { courseInformationSchema, CourseInformationFormData } from "../utils/schemas";
import { useGetCategoriesQuery } from "@/modules/creator/courses/hooks";
import { CategoryStatus } from "@/modules/creator/courses/types/category";
import { VideoPlayerModal } from "@/modules/creator/courses/components/VideoPlayerModal";

interface CourseInformationProps {
  onNext?: () => void;
  onBack?: () => void;
}

export const CourseInformation = ({ onNext, onBack }: CourseInformationProps) => {
  const dispatch = useAppDispatch();
  const info = useAppSelector((state) => state.courseBuilder.courseInformation);
  const { updateAndSave } = useDebouncedCourseSave();
  const { data: categoriesResponse } = useGetCategoriesQuery({ status: CategoryStatus.ACTIVE });
  const categories = categoriesResponse?.data?.results || [];

  // Main form
  const methods = useForm<CourseInformationFormData>({
    resolver: zodResolver(courseInformationSchema) as never,
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
  const watchedDifficulty = watch("difficulty");
  const wordCount = description?.trim() === "" ? 0 : (description?.trim()?.split(/\s+/).length ?? 0);

  useEffect(() => {
    if (watchedDifficulty && watchedDifficulty !== info.difficulty) {
      updateAndSave({ difficulty: watchedDifficulty });
    }
  }, [watchedDifficulty, info.difficulty, updateAndSave]);

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
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(null);

  // Objective Handlers
  const handleAddObjective = () => {
    if (newObjective.trim()) {
      const updated = [...objectives, newObjective.trim()];
      setObjectives(updated);
      setValue("objectives", updated, { shouldValidate: true });
      updateAndSave({ objectives: updated });
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
      updateAndSave({ objectives: updated });
      setEditingObjectiveIndex(null);
      setEditingObjectiveValue("");
    }
  };

  const handleRemoveObjective = (index: number) => {
    const updated = objectives.filter((_, i) => i !== index);
    setObjectives(updated);
    setValue("objectives", updated, { shouldValidate: true });
    updateAndSave({ objectives: updated });
  };

  // Tag Handlers
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updated = [...tags, newTag.trim()];
      setTags(updated);
      setValue("tags", updated, { shouldValidate: true });
      updateAndSave({ tags: updated });
      setNewTag("");
      setIsAddingTag(false);
    }
  };

  const handleRemoveTag = (index: number) => {
    const updated = tags.filter((_, i) => i !== index);
    setTags(updated);
    setValue("tags", updated, { shouldValidate: true });
    updateAndSave({ tags: updated });
  };

  // Video Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (videoObjectUrl) URL.revokeObjectURL(videoObjectUrl);
      setVideoFile(file);
      setSavedVideoName(file.name);
      setSavedVideoSize(file.size);
      setVideoObjectUrl(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (videoObjectUrl) URL.revokeObjectURL(videoObjectUrl);
      setVideoFile(file);
      setSavedVideoName(file.name);
      setSavedVideoSize(file.size);
      setVideoObjectUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveVideo = () => {
    if (videoObjectUrl) URL.revokeObjectURL(videoObjectUrl);
    setVideoFile(null);
    setSavedVideoName(null);
    setSavedVideoSize(null);
    setVideoObjectUrl(null);
  };

  useEffect(() => {
    return () => {
      if (videoObjectUrl) URL.revokeObjectURL(videoObjectUrl);
    };
  }, []);

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
    if (videoFile) {
      dispatch(syncSetCoverVideo(videoFile));
    }
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
                options={categories.map((c) => ({
                  label: c.name,
                  value: c.id,
                }))}
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
              { label: "Beginner", value: "BEGINNER" },
              { label: "Intermediate", value: "INTERMEDIATE" },
              { label: "Advanced", value: "ADVANCED" },
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
                            type="button"
                            onClick={() => handleSaveEditObjective(i)}
                          >
                            Save
                          </Button>
                          <Button 
                            variant="app-outline"
                            isGhost
                            type="button"
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
                            type="button"
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
                            type="button"
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
                        type="button"
                        onClick={handleAddObjective}
                      >
                        Save
                      </Button>
                      <Button 
                        variant="app-outline"
                        isGhost
                        type="button"
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
                    type="button"
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
                        type="button"
                        onClick={handleAddObjective}
                      >
                        Save
                      </Button>
                      <Button 
                        variant="app-outline"
                        isGhost
                        type="button"
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
                    type="button"
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
                  type="button"
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
                  type="button"
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
                type="button"
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
              {(videoFile || savedVideoName || info.coverVideoUrl) ? (
                <div className="flex flex-col items-center gap-[20px] w-full h-full">
                  <div
                    className="relative w-full flex-1 rounded-[8px] overflow-hidden bg-black cursor-pointer group"
                    onClick={() => setShowPlayerModal(true)}
                  >
                    <video
                      src={videoObjectUrl || info.coverVideoUrl}
                      className="w-full h-full object-contain"
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-100 transition-opacity">
                      <div className="size-[64px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                        <Play size={32} variant="Bold" color="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-[12px]">
                    <Button 
                      variant="app-outline"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change video
                    </Button>
                    <Button 
                      variant="app-outline"
                      type="button"
                      onClick={handleRemoveVideo}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
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
                    type="button"
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
            type="button"
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

      <VideoPlayerModal
        isOpen={showPlayerModal}
        onOpenChange={setShowPlayerModal}
        title={info.courseTitle || "Cover Video"}
        videoUrl={videoObjectUrl || info.coverVideoUrl}
      />
    </FormProvider>
  );
};
