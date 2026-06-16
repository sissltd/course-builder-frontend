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
import { cn } from "@/lib/utils";
import { AppInput } from "@/components/form/AppInput";
import { AppTextarea } from "@/components/form/AppTextarea";
import { AppSelect } from "@/components/form/AppSelect";

interface CourseInformationProps {
  onNext?: () => void;
  onBack?: () => void;
}

export const CourseInformation = ({ onNext, onBack }: CourseInformationProps) => {
  // Main form states
  const [courseTitle, setCourseTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [duration, setDuration] = useState({ hours: "", minutes: "", seconds: "" });
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Objectives states
  const [objectives, setObjectives] = useState<string[]>([]);
  const [newObjective, setNewObjective] = useState("");
  const [isAddingObjective, setIsAddingObjective] = useState(false);
  const [editingObjectiveIndex, setEditingObjectiveIndex] = useState<number | null>(null);
  const [editingObjectiveValue, setEditingObjectiveValue] = useState("");

  // Tags states
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);

  // File Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Word Counter logic
  const wordCount = description.trim() === "" ? 0 : description.trim().split(/\s+/).length;

  // Objective Handlers
  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective("");
      setIsAddingObjective(false);
    }
  };

  const handleSaveEditObjective = (index: number) => {
    if (editingObjectiveValue.trim()) {
      const updated = [...objectives];
      updated[index] = editingObjectiveValue.trim();
      setObjectives(updated);
      setEditingObjectiveIndex(null);
      setEditingObjectiveValue("");
    }
  };

  const handleRemoveObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  // Tag Handlers
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      setIsAddingTag(false);
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Video Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setVideoFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-[739px] max-w-full bg-[#FDFDFD] px-[24px] py-[40px] flex flex-col gap-[60px] mx-auto pb-[100px]">
      
      {/* Course Info Section */}
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col gap-[12px]">
          <h2 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">Course Information</h2>
          <p className="text-[16px] text-[#606060] leading-[24px]">Give your course a meaning, add relevant information about your course here</p>
        </div>

        <div className="border border-[#E8E8E8] rounded-[16px] p-[24px] flex flex-col gap-[20px] bg-white">
          <AppInput 
            label="Course Title"
            placeholder="Computer appreciation"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            required
          />
          <div className="flex flex-col gap-[6px]">
            <AppTextarea 
              label="Description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
            />
            <span className="text-[12px] text-[#636363] leading-[16px] self-start">
              {wordCount}/500 words
            </span>
          </div>

          <div className="flex flex-col gap-[8px]">
             <AppSelect 
               label="Course category"
               required
               placeholder="Select category"
               options={[
                 { label: "Computer science", value: "computer-science" },
                 { label: "Design", value: "design" },
                 { label: "Business", value: "business" },
                 { label: "Marketing", value: "marketing" }
               ]}
               value={category}
               onValueChange={setCategory}
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

        <AppSelect 
          placeholder="Select level"
          options={[
            { label: "Beginner", value: "beginner" },
            { label: "Intermediate", value: "intermediate" },
            { label: "Advanced", value: "advanced" },
          ]}
          value={difficulty}
          onValueChange={setDifficulty}
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
          {objectives.length > 0 ? (
            <div className="flex flex-col gap-[12px]">
              {objectives.map((obj, i) => (
                <div key={i} className="min-h-[60px] border border-[#D9D9D9] bg-white rounded-[8px] px-[20px] py-[10px] flex items-center justify-between transition-all">
                  {editingObjectiveIndex === i ? (
                    <div className="flex items-center gap-[12px] w-full">
                      <input 
                        value={editingObjectiveValue}
                        onChange={(e) => setEditingObjectiveValue(e.target.value)}
                        className="flex-1 border-none focus:ring-0 focus:outline-none h-[40px] text-[14px] text-[#202020]"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEditObjective(i);
                          else if (e.key === "Escape") setEditingObjectiveIndex(null);
                        }}
                      />
                      <div className="flex items-center gap-[12px] shrink-0">
                        <button 
                          onClick={() => handleSaveEditObjective(i)}
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
                        <div className="flex flex-col gap-[2px] opacity-30 cursor-grab shrink-0">
                          <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                          <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                          <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                        </div>
                        <span className="text-[14px] text-[#202020] tracking-[-0.28px] break-words">{obj}</span>
                      </div>
                      <div className="flex items-center gap-[20px] shrink-0">
                        <button 
                          onClick={() => {
                            setEditingObjectiveIndex(i);
                            setEditingObjectiveValue(obj);
                          }}
                          className="text-[14px] text-[#606060] tracking-[-0.28px] underline underline-offset-2 hover:text-[#202020]"
                        >
                          Edit
                        </button>
                        <button 
                        onClick={() => handleRemoveObjective(i)}
                        className="text-[#606060] hover:text-[#FF6B00] transition-colors"
                      >
                        <Trash size={20} variant="Linear" color="#FF6B00" />
                      </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {isAddingObjective ? (
                <div className="flex items-center gap-[12px] h-[60px] border border-[#0A60E1] bg-white rounded-[8px] px-[20px]">
                  <input 
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Enter learning objective"
                    className="flex-1 border-none focus:ring-0 focus:outline-none h-[40px] text-[14px] text-[#202020]"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddObjective();
                      else if (e.key === "Escape") setIsAddingObjective(false);
                    }}
                  />
                  <div className="flex items-center gap-[12px] shrink-0">
                    <button 
                      onClick={handleAddObjective}
                      className="text-[14px] text-[#0A60E1] font-semibold hover:underline"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => {
                        setIsAddingObjective(false);
                        setNewObjective("");
                      }}
                      className="text-[14px] text-[#606060] hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAddingObjective(true)}
                  className="flex items-center gap-[6px] text-[#202020] hover:text-[#0A60E1] transition-colors mt-[6px] self-start"
                >
                  <Add size={24} variant="Linear" color="#202020" />
                  <span className="text-[16px] tracking-[-0.32px] leading-[24px]">Add more</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-[12px]">
              {isAddingObjective ? (
                <div className="flex items-center gap-[12px] h-[60px] border border-[#0A60E1] bg-white rounded-[8px] px-[20px]">
                  <input 
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Enter learning objective"
                    className="flex-1 border-none focus:ring-0 focus:outline-none h-[40px] text-[14px] text-[#202020]"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddObjective();
                      else if (e.key === "Escape") setIsAddingObjective(false);
                    }}
                  />
                  <div className="flex items-center gap-[12px] shrink-0">
                    <button 
                      onClick={handleAddObjective}
                      className="text-[14px] text-[#0A60E1] font-semibold hover:underline"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => {
                        setIsAddingObjective(false);
                        setNewObjective("");
                      }}
                      className="text-[14px] text-[#606060] hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAddingObjective(true)}
                  className="flex items-center gap-[6px] text-[#202020] hover:text-[#0A60E1] transition-colors self-start"
                >
                  <Add size={24} variant="Linear" color="#202020" />
                  <span className="text-[16px] tracking-[-0.32px] leading-[24px]">Add</span>
                </button>
              )}
            </div>
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
                onKeyDown={(e) => {
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
            <button 
              onClick={() => setIsAddingTag(true)}
              className="h-[32px] px-[12px] flex items-center gap-[8px] text-[#606060] hover:text-[#0A60E1] transition-colors border border-[#F0F0F0] rounded-full bg-white hover:border-[#D9D9D9]"
            >
              <span className="text-[14px] tracking-[-0.28px]">Add</span>
              <Add size={18} variant="Linear" color="#606060" />
            </button>
          )}
        </div>
      </div>

      {/* Course Duration Section */}
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col gap-[8px]">
          <h3 className="text-[20px] font-semibold text-[#202020] leading-[28px]">Course Duration</h3>
          <p className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">Specify the duration for this course</p>
        </div>

        <div className="flex items-center gap-[20px] w-full bg-white border border-[#E8E8E8] rounded-[16px] p-[24px]">
          <div className="flex-1 flex flex-col gap-[6px]">
            <span className="text-[14px] text-[#202020] tracking-[-0.28px]">Hours</span>
            <div className="h-[44px] px-[16px] border border-[#D9D9D9] bg-white rounded-[8px] flex items-center focus-within:border-[#0A60E1] transition-colors">
              <input 
                type="number" 
                placeholder="0" 
                value={duration.hours}
                onChange={(e) => setDuration({ ...duration, hours: e.target.value })}
                className="w-full h-full outline-none text-[14px] text-[#202020]" 
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <span className="text-[14px] text-[#202020] tracking-[-0.28px]">Minutes</span>
            <div className="h-[44px] px-[16px] border border-[#D9D9D9] bg-white rounded-[8px] flex items-center focus-within:border-[#0A60E1] transition-colors">
              <input 
                type="number" 
                placeholder="0" 
                value={duration.minutes}
                onChange={(e) => setDuration({ ...duration, minutes: e.target.value })}
                className="w-full h-full outline-none text-[14px] text-[#202020]" 
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <span className="text-[14px] text-[#202020] tracking-[-0.28px]">Seconds</span>
            <div className="h-[44px] px-[16px] border border-[#D9D9D9] bg-white rounded-[8px] flex items-center focus-within:border-[#0A60E1] transition-colors">
              <input 
                type="number" 
                placeholder="0" 
                value={duration.seconds}
                onChange={(e) => setDuration({ ...duration, seconds: e.target.value })}
                className="w-full h-full outline-none text-[14px] text-[#202020]" 
              />
            </div>
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
            {videoFile ? (
              <div className="flex flex-col items-center gap-[20px] w-full max-w-[400px] text-center">
                <div className="size-[60px] rounded-full bg-[#EBF3FF] flex items-center justify-center text-[#0A60E1]">
                  <Video size={36} variant="Bold" color="#0A60E1" />
                </div>
                <div className="flex flex-col gap-[4px] w-full">
                  <p className="text-[16px] text-[#202020] font-semibold truncate px-[10px]">
                    {videoFile.name}
                  </p>
                  <p className="text-[14px] text-[#606060]">
                    {formatFileSize(videoFile.size)}
                  </p>
                </div>
                <div className="flex items-center gap-[12px]">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-[16px] py-[8px] bg-[#F5F5F5] hover:bg-[#E8E8E8] rounded-[8px] text-[14px] font-medium text-[#606060] transition-colors"
                  >
                    Change video
                  </button>
                  <button 
                    onClick={() => setVideoFile(null)}
                    className="px-[16px] py-[8px] bg-[#FFF0ED] hover:bg-[#FFE5E0] text-[#FF5025] rounded-[8px] text-[14px] font-medium transition-colors"
                  >
                    Remove
                  </button>
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
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-[16px] py-[8px] bg-[rgba(240,240,240,0.8)] rounded-[8px] text-[16px] text-[#606060] text-center tracking-[-0.48px] hover:bg-[#E8E8E8] transition-colors"
                >
                  Choose file
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
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
