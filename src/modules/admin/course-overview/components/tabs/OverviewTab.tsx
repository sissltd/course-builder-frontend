import React from "react";
import Image from "next/image";
import { Play, Clock, PlayCircle, Sound, InfoCircle, BookSaved, Task, ArrowDown2, ArrowRight2 } from "iconsax-react";
import { cn } from "@/lib/utils";
import { statCards, modules } from "../../data/mockData";
import { StatCard, ModuleLesson } from "../SharedUI";

interface OverviewTabProps {
  onAddComment?: (title: string, comment: string, highlightedText?: string) => void;
}

export const OverviewTab = ({ onAddComment }: OverviewTabProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [openModules, setOpenModules] = React.useState<Record<number, boolean>>({
    0: true,
    1: true,
  });

  const [commentBtn, setCommentBtn] = React.useState<{ show: boolean; x: number; y: number } | null>(null);
  const [commentModal, setCommentModal] = React.useState<{ show: boolean; x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = React.useState("");

  const [commentTitle, setCommentTitle] = React.useState("");
  const [commentBody, setCommentBody] = React.useState("");

  React.useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".comment-modal-popover") && !target.closest(".comment-trigger-btn")) {
        setCommentBtn(null);
        setCommentModal(null);
      }
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  const toggleModule = (index: number) => {
    setOpenModules((current) => ({ ...current, [index]: !current[index] }));
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLParagraphElement>) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const text = selection.toString().trim();
    if (text.length > 0 && containerRef.current) {
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        setCommentBtn({
          show: true,
          x: rect.right - containerRect.left + containerRef.current.scrollLeft - 10,
          y: rect.bottom - containerRect.top + containerRef.current.scrollTop + 6,
        });
        setSelectedText(text);
      } catch (err) {
        console.error(err);
      }
    } else {
      setCommentBtn(null);
    }
  };

  const handleCommentBtnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (commentBtn) {
      setCommentModal({
        show: true,
        x: commentBtn.x,
        y: commentBtn.y,
      });
      setCommentBtn(null);
      setCommentTitle("");
      setCommentBody("");
    }
  };

  const handleAddCommentSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (commentTitle.trim() && commentBody.trim()) {
      if (onAddComment) {
        onAddComment(commentTitle.trim(), commentBody.trim(), selectedText);
      }
      setCommentModal(null);
      setSelectedText("");
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCommentModal(null);
    setSelectedText("");
    window.getSelection()?.removeAllRanges();
  };

  return (
    <div ref={containerRef} className="relative flex flex-col gap-[20px]">
      <h1 className="text-[20px] font-bold leading-[28px] text-sd-grey-12">
        Introduction to Prompt Engineering
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-[12px]">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[16px]">
        <div className="mb-[12px] text-[14px] font-semibold leading-[20px] text-sd-grey-12">
          Preview Video
        </div>

        <div className="relative overflow-hidden rounded-[10px] border border-sd-grey-3 bg-sd-grey-2">
          <Image
            src="/assets/dashboard/course-img.jpg"
            alt="Course preview"
            width={1200}
            height={680}
            className="h-[290px] w-full object-cover"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <button
              type="button"
              className="flex size-[58px] items-center justify-center rounded-full border border-white/25 bg-white/25 text-white backdrop-blur-[8px] transition-all hover:scale-105 hover:bg-white/40"
              aria-label="Play preview video"
            >
              <Play size={24} variant="Bold" color="currentColor" />
            </button>
          </div>
        </div>

        <div className="mt-[16px] flex flex-wrap items-center gap-[16px] text-[12px] leading-[16px] text-sd-reviewer-muted">
          <span className="flex items-center gap-[6px]">
            <Clock size={16} variant="Linear" color="currentColor" />
            <span>Duration 1:32mins</span>
          </span>
          <span className="flex items-center gap-[6px]">
            <PlayCircle size={16} variant="Linear" color="currentColor" />
            <span>Resolution 1080p</span>
          </span>
          <span className="flex items-center gap-[6px]">
            <Sound size={16} variant="Linear" color="currentColor" />
            <span>Audio Quality -16 LUFS</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-[12px] rounded-[12px] bg-sd-blue-light px-[16px] py-[14px] text-[14px] leading-[20px] text-sd-grey-12 border-l-2 border-l-sd-blue">
        <InfoCircle size={20} variant="Bulk" color="var(--sd-blue)" className="shrink-0" />
        <span>Preview video required to be played before approve is enabled.</span>
      </div>

      <div className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[18px]">
        <h2 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
          Course Description
        </h2>
        <p
          onMouseUp={handleMouseUp}
          className="mt-[10px] text-[14px] leading-[22px] text-sd-reviewer-muted selection:bg-sd-blue/20"
        >
          Dive into the world of technology and innovation with this comprehensive computer
          science course. You&apos;ll explore the foundations of computing, from algorithms and
          data structures to software development, artificial intelligence, and cybersecurity.
          Designed for both beginners and aspiring professionals, this course equips you with
          analytical and problem-solving skills needed to build intelligent systems and design
          efficient programs.
        </p>
      </div>

      <div className="flex flex-col gap-[12px]">
        <h2 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
          Modules &amp; Lessons
        </h2>

        <div className="flex flex-col gap-[16px]">
          {modules.map((module, index) => {
            const isOpen = Boolean(openModules[index]);

            return (
              <div key={module.title} className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleModule(index)}
                  className={cn(
                    "flex w-full items-center justify-between gap-[16px] p-[16px] text-left transition-colors hover:bg-[#E5E5E5]",
                    isOpen ? "bg-[#F0F0F0CC] border-b border-sd-grey-3" : "bg-[#F0F0F0CC]"
                  )}
                >
                  <div className="flex min-w-0 flex-col gap-[6px]">
                    <span className="text-[15px] font-semibold leading-[22px] text-sd-grey-12 truncate">
                      {module.title}
                    </span>
                    <div className="flex flex-wrap items-center gap-[16px] text-[12px] leading-[18px] text-sd-reviewer-muted">
                      <span className="flex items-center gap-[4px]">
                        <BookSaved size={14} variant="Linear" color="currentColor" />
                        <span>12 Lessons</span>
                      </span>
                      <span className="flex items-center gap-[4px]">
                        <Task size={14} variant="Linear" color="currentColor" />
                        <span>12 Assessment</span>
                      </span>
                      <span className="flex items-center gap-[4px]">
                        <Clock size={14} variant="Linear" color="currentColor" />
                        <span>1hr 40m</span>
                      </span>
                    </div>
                  </div>
                  {isOpen ? (
                    <ArrowDown2 size={20} variant="Linear" color="var(--sd-grey-11)" className="shrink-0" />
                  ) : (
                    <ArrowRight2 size={20} variant="Linear" color="var(--sd-grey-11)" className="shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-[16px] bg-[#F0F0F0CC] flex flex-col gap-[12px]">
                    {module.lessons.length > 0 ? (
                      module.lessons.map((lesson) => (
                        <ModuleLesson key={lesson.title} lesson={lesson} />
                      ))
                    ) : (
                      <span className="text-[14px] text-sd-reviewer-muted italic">No lessons in this module</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[18px]">
        <h2 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
          Plagiarism Report{" "}
          <span className="text-[12px] font-normal leading-[16px] text-sd-reviewer-muted ml-[4px]">
            (3% Similarity)
          </span>
        </h2>

        <div className="mt-[16px] flex flex-wrap items-center gap-[16px]">
          <div className="flex size-[58px] items-center justify-center rounded-full bg-[conic-gradient(var(--sd-blue)_0_13%,var(--sd-grey-3)_13%_100%)]">
            <div className="flex size-[42px] items-center justify-center rounded-full bg-sd-grey-1 text-[12px] font-medium leading-[16px] text-sd-grey-12">
              13%
            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <span className="text-[14px] leading-[20px] text-sd-grey-12">
              Threshold: &lt; 15% external similarity
            </span>
            <span className="w-fit rounded-[4px] bg-sd-blue-light px-[8px] py-[3px] text-[12px] leading-[16px] text-sd-blue">
              No significant matches found
            </span>
          </div>
        </div>
      </div>

      {/* Floating Comment Trigger Button */}
      {commentBtn && commentBtn.show && (
        <button
          onClick={handleCommentBtnClick}
          style={{
            left: Math.max(10, Math.min(commentBtn.x, containerRef.current ? containerRef.current.clientWidth - 100 : 400)),
            top: commentBtn.y,
          }}
          className="comment-trigger-btn absolute z-50 flex items-center gap-[6px] bg-white border border-sd-grey-3 rounded-[6px] shadow-[0px_4px_12px_rgba(0,0,0,0.1)] px-[10px] py-[6px] text-[12px] font-semibold text-sd-grey-12 hover:bg-sd-grey-2 transition-all cursor-pointer active:scale-95 duration-100"
        >
          <span className="flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[14px]">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </span>
          <span>Comment</span>
        </button>
      )}

      {/* Floating Comment Form Modal */}
      {commentModal && commentModal.show && (
        <div
          style={{
            left: Math.max(10, Math.min(commentModal.x, containerRef.current ? containerRef.current.clientWidth - 320 : 400)),
            top: commentModal.y,
          }}
          className="comment-modal-popover absolute z-50 w-[300px] bg-white border border-sd-grey-3 rounded-[12px] p-[16px] shadow-[0px_8px_24px_rgba(0,0,0,0.12)] flex flex-col gap-[14px] animate-in fade-in zoom-in-95 duration-100"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between gap-[12px]">
            <span className="text-[15px] font-semibold text-sd-grey-12">
              Comment
            </span>
            <button
              onClick={handleCancel}
              className="text-sd-grey-11 hover:text-sd-grey-12 cursor-pointer transition-colors p-1 rounded-full hover:bg-sd-grey-2"
              aria-label="Close comment dialog"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[16px]">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Modal Inputs */}
          <div className="flex flex-col gap-[12px]">
            {/* Title Field */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[12px] font-semibold text-sd-grey-12">
                Title <span className="text-[#FF5025]">*</span>
              </label>
              <input
                type="text"
                value={commentTitle}
                onChange={(e) => setCommentTitle(e.target.value)}
                placeholder="Description"
                className="w-full rounded-[6px] border border-sd-grey-4 px-[10px] py-[6px] text-[13px] leading-[18px] bg-sd-grey-1 text-sd-grey-12 outline-none focus:border-sd-blue focus:ring-1 focus:ring-sd-blue/20"
                autoFocus
              />
            </div>

            {/* Comment Field */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[12px] font-semibold text-sd-grey-12">
                Comment <span className="text-[#FF5025]">*</span>
              </label>
              <textarea
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                placeholder="Add comment"
                className="w-full rounded-[6px] border border-sd-grey-4 px-[10px] py-[6px] text-[13px] leading-[18px] bg-sd-grey-1 text-sd-grey-12 resize-none h-[72px] outline-none focus:border-sd-blue focus:ring-1 focus:ring-sd-blue/20"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-[10px] pt-[4px]">
            <button
              onClick={handleCancel}
              className="h-[32px] px-[12px] border border-sd-grey-4 text-sd-grey-12 rounded-[6px] text-[12px] font-normal hover:bg-sd-grey-2 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCommentSubmit}
              disabled={!commentTitle.trim() || !commentBody.trim()}
              className="h-[32px] px-[12px] bg-sd-blue text-white rounded-[6px] text-[12px] font-semibold hover:bg-sd-blue-hover disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              Add comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
