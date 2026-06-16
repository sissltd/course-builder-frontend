"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AppButton } from "@/components/shared/AppButton";
import { 
  ArrowLeft, 
  SearchNormal1, 
  TickCircle, 
  Magicpen,
  Timer1,
  Play,
  ArrowRight,
  InfoCircle,
  CloseCircle,
} from "iconsax-react";
import { cn } from "@/lib/utils";
import { AppInput } from "@/components/form/AppInput";
import { AppCheckbox } from "@/components/shared/AppCheckbox";
import { AppModal } from "@/components/shared/AppModal";
import { AppTextarea } from "@/components/form/AppTextarea";
import { VideoPlayerModal } from "./components/VideoPlayerModal";
import { RequestTopicModal } from "@/modules/reservation/components/RequestTopicModal";

const CATEGORIES = [
  "Software Development",
  "Leadership",
  "Guidance and counselling",
  "Humanities",
  "Research",
];

const RightArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M8.91016 19.9201L15.4302 13.4001C16.2002 12.6301 16.2002 11.3701 15.4302 10.6001L8.91016 4.08008" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CreateCourseIcon = () => (
  <div className="size-[24px] flex items-center justify-center">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M13.3332 3.5415C13.3332 4.57484 12.4915 5.4165 11.4582 5.4165H8.5415C8.02484 5.4165 7.55817 5.20817 7.2165 4.8665C6.87484 4.52484 6.6665 4.05817 6.6665 3.5415C6.6665 2.50817 7.50817 1.6665 8.5415 1.6665H11.4582C11.9748 1.6665 12.4415 1.87484 12.7832 2.2165C13.1248 2.55817 13.3332 3.02484 13.3332 3.5415Z" fill="#0A60E1"/>
      <path d="M15.6918 4.19225C15.5002 4.03391 15.2835 3.90891 15.0502 3.81725C14.8085 3.72558 14.5668 3.91725 14.5168 4.16725C14.2335 5.59225 12.9752 6.66725 11.4585 6.66725H8.54183C7.7085 6.66725 6.92516 6.34225 6.3335 5.75058C5.90016 5.31725 5.60016 4.76725 5.4835 4.17558C5.4335 3.92558 5.1835 3.72558 4.94183 3.82558C3.97516 4.21725 3.3335 5.10058 3.3335 6.87558V15.0006C3.3335 17.5006 4.82516 18.3339 6.66683 18.3339H13.3335C15.1752 18.3339 16.6668 17.5006 16.6668 15.0006V6.87558C16.6668 5.51725 16.2918 4.68391 15.6918 4.19225ZM6.66683 10.2089H10.0002C10.3418 10.2089 10.6252 10.4922 10.6252 10.8339C10.6252 11.1756 10.3418 11.4589 10.0002 11.4589H6.66683C6.32516 11.4589 6.04183 11.1756 6.04183 10.8339C6.04183 10.4922 6.32516 10.2089 6.66683 10.2089ZM13.3335 14.7922H6.66683C6.32516 14.7922 6.04183 14.5089 6.04183 14.1672C6.04183 13.8256 6.32516 13.5422 6.66683 13.5422H13.3335C13.6752 13.5422 13.9585 13.8256 13.9585 14.1672C13.9585 14.5089 13.6752 14.7922 13.3335 14.7922Z" fill="#0A60E1"/>
    </svg>
  </div>
);

const CreateWithAIIcon = () => (
  <div className="size-[24px] flex items-center justify-center">
    <Magicpen size={20} variant="Bold" color="#0A60E1" />
  </div>
);

const ImportDocumentIcon = () => (
  <div className="size-[24px] flex items-center justify-center">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M17.6165 8.25049H10.5665V11.3088L11.8748 10.0005C12.1165 9.75882 12.5165 9.75882 12.7582 10.0005C12.9998 10.2422 12.9998 10.6422 12.7582 10.8838L10.3832 13.2505C10.1415 13.4922 9.7415 13.4922 9.49984 13.2505L7.12484 10.8838C6.99984 10.7588 6.9415 10.6005 6.9415 10.4422C6.9415 10.2838 7.00817 10.1255 7.13317 10.0005C7.37484 9.75882 7.77484 9.75882 8.0165 10.0005L9.3165 11.3005V8.25049H2.38317C1.98317 8.25049 1.6665 8.56716 1.6665 8.96716C1.6665 13.8755 5.0915 17.3005 9.99984 17.3005C14.9082 17.3005 18.3332 13.8755 18.3332 8.96716C18.3332 8.56716 18.0165 8.25049 17.6165 8.25049Z" fill="#0A60E1"/>
      <path d="M10.5664 3.3252C10.5664 2.98353 10.2831 2.7002 9.94141 2.7002C9.59974 2.7002 9.31641 2.98353 9.31641 3.3252V8.24186H10.5664V3.3252Z" fill="#0A60E1"/>
    </svg>
  </div>
);

const TOPICS = [
  "Software Development",
  "Machine Learning",
  "Network Security",
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
];

const VIDEOS = [
  { id: 1, title: "How to create with AI", desc: "This video will teach you how to create your course using ai", duration: "1hr:32min", thumb: "/assets/courses/video-thumb-1.png", isCompleted: true },
  { id: 2, title: "How to create a course", desc: "This video will guide you on how to create your course manually.", duration: "30min", thumb: "/assets/courses/video-thumb-2.png", isCompleted: false },
  { id: 3, title: "How to import a course", desc: "This video will guide you on how to create your course from an existing document.", duration: "30min", thumb: "/assets/courses/video-thumb-3.png", isCompleted: false },
];

export default function CreateCourseView() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0: Video Guide, 1: Legal, 2: Method, 3: Category, 4: Topic, 5: Details, 6: Loading
  const [agreed, setAgreed] = useState(false);
  const [method, setMethod] = useState<string | null>(null);
  const [searchCategory, setSearchCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTopic, setSearchTopic] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);

  const [activeVideo, setActiveVideo] = useState<typeof VIDEOS[0] | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [completedVideos, setCompletedVideos] = useState<number[]>([1]); // Video 1 is completed by default in design

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isRequestSuccessOpen, setIsRequestSuccessOpen] = useState(false);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(0, s - 1));

  useEffect(() => {
    if (step === 6) {
      const timer = setTimeout(() => {
        router.push("/courses/builder");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, router]);

  const filteredCategories = CATEGORIES.filter(c => 
    c.toLowerCase().includes(searchCategory.toLowerCase())
  );

  const filteredTopics = TOPICS.filter(t => 
    t.toLowerCase().includes(searchTopic.toLowerCase())
  );

  const handleVideoClick = (video: typeof VIDEOS[0]) => {
    setActiveVideo(video);
    setIsPlayerOpen(true);
    if (!completedVideos.includes(video.id)) {
        setCompletedVideos([...completedVideos, video.id]);
    }
  };

  const isAllVideosCompleted = completedVideos.length === VIDEOS.length;

  // Step 0: Video Guide
  const renderStep0 = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-in fade-in duration-500">
      <div className="text-center mb-[40px]">
        <h1 className="text-[32px] font-bold text-[#202020] font-quicksand mb-[12px]">Complete course</h1>
        <p className="text-[16px] text-[#636363] max-w-[440px] mx-auto leading-[24px]">
          Begin your journey as a course creator by finishing our Soludesk guide on building courses
        </p>
      </div>

      <div className="w-full max-w-[600px] flex flex-col gap-[40px]">
        <div className="flex flex-col gap-[20px]">
          {VIDEOS.map((video) => {
            const isDone = completedVideos.includes(video.id);
            return (
              <div 
                key={video.id} 
                onClick={() => handleVideoClick(video)}
                className="rounded-[16px] border border-[#d9d9d9] bg-[#f8f8f8] flex items-stretch overflow-hidden hover:border-sd-blue transition-all cursor-pointer group min-h-[120px]"
              >
                <div className="w-[150px] relative shrink-0">
                  <Image src={video.thumb} alt={video.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="size-[32px] rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white">
                        <Play size={16} variant="Bold" color="currentColor"/>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col p-[12px] gap-[8px]">
                  <h3 className="text-[16px] font-semibold text-[#202020] line-clamp-1">{video.title}</h3>
                  <p className="text-[14px] text-[#636363] leading-[20px] line-clamp-2 text-ellipsis overflow-hidden">{video.desc}</p>
                  
                  <div className="flex items-center gap-[12px] mt-auto">
                    <div className={cn(
                      "px-[12px] py-[4px] rounded-full text-[14px] font-normal leading-[20px] tracking-[-0.28px]",
                      isDone ? "bg-[#E6F9EF] text-[#008500]" : "bg-[#F0F0F0] text-[#202020]"
                    )}>
                      {isDone ? "Completed" : "Not completed"}
                    </div>
                    <div className="flex items-center gap-[4px] px-[8px] py-[4px] border border-[#d9d9d9] rounded-full">
                      <Timer1 size={18} variant="Linear" color="#636363" />
                      <span className="text-[14px] text-[#636363] tracking-[-0.28px]">{video.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-[16px]">
          <AppButton 
            variant="app-outline" 
            className="flex-1 h-[44px] text-sd-blue border-sd-blue"
            onClick={() => router.back()}
          >
            Back
          </AppButton>
          <AppButton 
            variant="app-primary" 
            className={cn("flex-1 h-[44px]", !isAllVideosCompleted && "bg-[#CECECE] border-[#CECECE] text-[#636363] hover:bg-[#CECECE] cursor-not-allowed")}
            disabled={!isAllVideosCompleted}
            onClick={nextStep}
          >
            Continue
          </AppButton>
        </div>
      </div>
    </div>
  );

  // ... (renderStep1 to renderStep2 stay mostly same but updated with consistent styles)
  
  const renderStep1 = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="w-full max-w-[485px] bg-white border border-[#F0F0F0] rounded-[24px] p-[24px] ">
        <h1 className="text-[32px] font-bold text-[#202020] tracking-[-0.64px] font-quicksand mb-[40px]">Legal agreements</h1>
        
        <div className="flex flex-col gap-[12px] mb-[40px]">
          <h2 className="text-[18px] font-semibold text-[#202020]">NDA & IP Ownership Agreement</h2>
          <p className="text-[14px] text-[#606060] leading-[24px]">
            By participating as a trainer, you agree that all content created within SoluDesks Course Builder Studio is the exclusive property of SoluDesks. You maintain no ownership or publishing rights over the submitted materials. All intellectual property is transferred upon submission.
          </p>
        </div>

        <div className="mb-[40px]">
          <AppCheckbox 
            checked={agreed} 
            onCheckedChange={(val) => setAgreed(!!val)}
            id="agreement"
            label="I have read this legal agreement and agree to the policy right as stated above."
          />
        </div>

        <div className="flex items-center gap-[16px]">
          <AppButton 
            variant="app-outline" 
            className="flex-1 h-[44px] text-sd-blue border-sd-blue"
            onClick={prevStep}
          >
            Back
          </AppButton>
          <AppButton 
            variant="app-primary" 
            className="flex-1 h-[44px]"
            disabled={!agreed}
            onClick={nextStep}
          >
            Agree and continue
          </AppButton>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-[40px]">
        <h1 className="text-[32px] font-bold text-[#202020] tracking-[-0.64px] font-quicksand mb-[12px]">Start building your course</h1>
        <p className="text-[16px] text-[#606060]">Choose your preferred method to create a new course</p>
      </div>

      <div className="w-full max-w-[500px] flex flex-col gap-[40px]">
        <div className="flex flex-col gap-[24px]">
          <div className="bg-[#EBF3FF] border-l-[4px] border-l-[#0063EF] rounded-r-[8px] p-[16px] flex items-start gap-[12px]">
            <div className="size-[20px] rounded-full bg-[#0063EF] text-white flex items-center justify-center font-bold text-[13px] shrink-0 mt-[2px]">
              !
            </div>
            <p className="text-[14px] text-[#202020] leading-[20px]">
              Courses created manually or imported from documents are subject to higher earning, while AI-generated courses are offered at a more cost-efficient rate.
            </p>
          </div>

          <div className="flex flex-col gap-[16px]">
            {[
              { id: 'manual', title: 'Create course', desc: 'Build your course with custom modules and lessons tailored to your taste.', icon: <CreateCourseIcon />, iconBg: 'bg-[#EBF3FF]' },
              { id: 'ai', title: 'Create with AI', desc: 'Describe what you want and let our ai help you create the perfect tailored course for you', icon: <CreateWithAIIcon />, iconBg: 'bg-[#EBF3FF]' },
              { id: 'import', title: 'Import from a document', desc: 'Convert your course materials into interactive lessons from a document (pdf,doc,txt) etc', icon: <ImportDocumentIcon />, iconBg: 'bg-[#EBF3FF]' },
            ].map((opt) => (
              <div 
                key={opt.id}
                onClick={() => setMethod(opt.id)}
                className={cn(
                  "p-[20px] rounded-[16px] border cursor-pointer transition-all flex items-center gap-[16px] bg-white",
                  method === opt.id ? "border-sd-blue " : "border-[#F0F0F0] hover:border-sd-blue/50"
                )}
              >
                <div className={cn(
                  "size-[20px] rounded-full border flex items-center justify-center shrink-0 transition-colors",
                  method === opt.id ? "border-sd-blue" : "border-sd-grey-6"
                )}>
                  {method === opt.id && (
                    <span className="size-[10px] rounded-full bg-sd-blue" />
                  )}
                </div>

                <div className={cn("size-[36px] rounded-[6px] flex items-center justify-center shrink-0", opt.iconBg)}>
                  {opt.icon}
                </div>

                <div className="flex-1 flex flex-col gap-[4px]">
                  <span className="text-[16px] font-semibold text-[#202020]">{opt.title}</span>
                  <p className="text-[14px] text-sd-grey-11 leading-[20px]">{opt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-[16px]">
          <AppButton 
            variant="app-outline" 
            className="flex-1 h-[44px] text-sd-blue border-sd-blue"
            onClick={prevStep}
          >
            Back
          </AppButton>
          <AppButton 
            variant="app-primary" 
            className="flex-1 h-[44px]"
            disabled={!method}
            onClick={nextStep}
          >
            Continue
          </AppButton>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-[40px]">
        <h1 className="text-[32px] font-bold text-[#202020] tracking-[-0.64px] font-quicksand mb-[12px]">Select your course category</h1>
        <p className="text-[16px] text-[#606060]">Select the category of course you want to build</p>
      </div>

      <div className="w-full max-w-[500px] flex flex-col gap-[32px]">
        <div className="flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[8px] relative">
            <span className="text-[14px] font-medium text-sd-grey-12">
              Course category <span className="text-[#FF5025]">*</span>
            </span>
            
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className={cn(
                "w-full h-[50px] px-[16px] border rounded-[12px] bg-white flex items-center justify-between transition-all text-left",
                isCategoryDropdownOpen ? "border-sd-blue ring-1 ring-sd-blue" : "border-sd-grey-3 hover:border-sd-blue/50"
              )}
            >
              <span className={cn("text-[14px]", selectedCategory ? "text-[#202020] font-semibold" : "text-[#B6B6B6]")}>
                {selectedCategory || "Select option"}
              </span>
              <RightArrowIcon />
            </button>

            {isCategoryDropdownOpen && (
              <div className="absolute top-[86px] left-0 w-full bg-white border border-sd-grey-3 rounded-[16px]  z-20 p-[12px] flex flex-col gap-[12px] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="w-full h-[44px] pl-[36px] pr-[12px] border border-sd-grey-3 rounded-[8px] text-[14px] text-[#202020] placeholder:text-[#B6B6B6] outline-none focus:border-sd-blue"
                  />
                  <SearchNormal1 size={18} variant="Linear" color="#B6B6B6" className="absolute left-[12px] top-1/2 -translate-y-1/2" />
                </div>
                
                <div className="flex flex-col gap-[4px] max-h-[200px] overflow-y-auto">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(c);
                          setIsCategoryDropdownOpen(false);
                          setSearchCategory("");
                        }}
                        className={cn(
                          "w-full text-left px-[12px] py-[10px] text-[14px] font-medium rounded-[8px] transition-colors",
                          selectedCategory === c 
                            ? "bg-sd-grey-2 text-[#202020]" 
                            : "text-[#636363] hover:bg-sd-grey-1 hover:text-[#202020]"
                        )}
                      >
                        {c}
                      </button>
                    ))
                  ) : (
                    <p className="text-[12px] text-[#B6B6B6] text-center py-[12px]">No category found</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div 
            onClick={() => setIsRequestModalOpen(true)}
            className="p-[16px] rounded-[16px] border border-sd-grey-3 bg-white flex items-center justify-between cursor-pointer hover:border-sd-blue/50 transition-colors"
          >
            <div className="flex flex-col gap-[4px]">
              <span className="text-[16px] font-semibold text-[#202020]">Request category</span>
              <p className="text-[14px] text-sd-grey-11">Can’t find your preferred category? request for one</p>
            </div>
            <RightArrowIcon />
          </div>
        </div>

        <div className="flex items-center gap-[16px]">
          <AppButton 
            variant="app-outline" 
            className="flex-1 h-[44px] text-sd-blue border-sd-blue"
            onClick={prevStep}
          >
            Back
          </AppButton>
          <AppButton 
            variant="app-primary" 
            className="flex-1 h-[44px]"
            disabled={!selectedCategory}
            onClick={nextStep}
          >
            Continue
          </AppButton>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-[40px]">
        <h1 className="text-[32px] font-bold text-[#202020] tracking-[-0.64px] font-quicksand mb-[12px]">Select course topic</h1>
        <p className="text-[16px] text-[#606060]">Choose from the list of options your preferred topic</p>
      </div>

      <div className="w-full max-w-[500px] flex flex-col gap-[32px]">
        <div className="flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[8px] relative">
            <span className="text-[14px] font-medium text-sd-grey-12">
              Course topic <span className="text-[#FF5025]">*</span>
            </span>
            
            <button
              type="button"
              onClick={() => setIsTopicDropdownOpen(!isTopicDropdownOpen)}
              className={cn(
                "w-full h-[50px] px-[16px] border rounded-[12px] bg-white flex items-center justify-between transition-all text-left",
                isTopicDropdownOpen ? "border-sd-blue ring-1 ring-sd-blue" : "border-sd-grey-3 hover:border-sd-blue/50"
              )}
            >
              <span className={cn("text-[14px]", selectedTopic ? "text-[#202020] font-semibold" : "text-[#B6B6B6]")}>
                {selectedTopic || "Select option"}
              </span>
              <RightArrowIcon />
            </button>

            {isTopicDropdownOpen && (
              <div className="absolute top-[86px] left-0 w-full bg-white border border-sd-grey-3 rounded-[16px]  z-20 p-[12px] flex flex-col gap-[12px] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTopic}
                    onChange={(e) => setSearchTopic(e.target.value)}
                    className="w-full h-[44px] pl-[36px] pr-[12px] border border-sd-grey-3 rounded-[8px] text-[14px] text-[#202020] placeholder:text-[#B6B6B6] outline-none focus:border-sd-blue"
                  />
                  <SearchNormal1 size={18} variant="Linear" color="#B6B6B6" className="absolute left-[12px] top-1/2 -translate-y-1/2" />
                </div>

                <div className="flex items-center gap-[8px] px-[4px] py-[2px]">
                  <InfoCircle size={16} variant="Linear" color="#F05A25" />
                  <p className="text-[13px] text-[#606060] font-normal leading-[18px]">
                    NB: Prices differ depending on the course topic
                  </p>
                </div>
                
                <div className="flex flex-col gap-[4px] max-h-[200px] overflow-y-auto">
                  {filteredTopics.length > 0 ? (
                    filteredTopics.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setSelectedTopic(t);
                          setIsTopicDropdownOpen(false);
                          setSearchTopic("");
                        }}
                        className={cn(
                          "w-full text-left px-[12px] py-[10px] text-[14px] font-medium rounded-[8px] transition-colors flex items-center justify-between",
                          selectedTopic === t 
                            ? "bg-sd-grey-2 text-[#202020]" 
                            : "text-[#636363] hover:bg-sd-grey-1 hover:text-[#202020]"
                        )}
                      >
                        <span>{t}</span>
                        <span className="bg-[#EBF3FF] text-[#0063EF] text-[12px] font-semibold px-[8px] py-[2px] rounded-[6px]">
                          $25
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="text-[12px] text-[#B6B6B6] text-center py-[12px]">No topic found</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-[16px]">
          <AppButton 
            variant="app-outline" 
            className="flex-1 h-[44px] text-sd-blue border-sd-blue"
            onClick={prevStep}
          >
            Back
          </AppButton>
          <AppButton 
            variant="app-primary" 
            className="flex-1 h-[44px]"
            disabled={!selectedTopic}
            onClick={nextStep}
          >
            Continue
          </AppButton>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-[40px]">
        <h1 className="text-[32px] font-bold text-[#202020] tracking-[-0.64px] font-quicksand mb-[12px]">Enter a title for your course</h1>
        <p className="text-[16px] text-[#606060]">Enter the required information to create your course</p>
      </div>

      <div className="w-full max-w-[500px] flex flex-col gap-[32px]">
        <div className="flex flex-col gap-[20px]">
          <AppInput 
            label="Course title"
            placeholder="Enter course title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <AppTextarea 
            label="Description"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-[16px]">
          <AppButton 
            variant="app-outline" 
            className="flex-1 h-[44px] text-sd-blue border-sd-blue"
            onClick={prevStep}
          >
            Back
          </AppButton>
          <AppButton 
            variant="app-primary" 
            className="flex-1 h-[44px]"
            disabled={!title || !description}
            onClick={nextStep}
          >
            Create course
          </AppButton>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] animate-in fade-in duration-700">
      <div className="relative size-[160px] flex items-center justify-center">
        <div className="absolute inset-0 border-[4px] border-sd-grey-3 rounded-full"></div>
        <div className="absolute inset-0 border-[4px] border-sd-blue rounded-full border-t-transparent animate-spin"></div>
        <div className="size-[80px] bg-[#EBF3FF] rounded-full flex items-center justify-center animate-pulse">
           <Magicpen size={40} variant="Bulk" color="#0063EF" />
        </div>
      </div>
      <p className="mt-[32px] text-[18px] text-[#202020] font-semibold tracking-[-0.36px]">Preparing course builder...</p>
      <p className="mt-[8px] text-[14px] text-sd-grey-11">Please wait while we set up your environment</p>
    </div>
  );

  return (
    <div className="w-full max-w-[1200px] mx-auto px-[20px] py-[40px]">
      {step === 0 && renderStep0()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
      {step === 6 && renderStep6()}

      {activeVideo && (
        <VideoPlayerModal 
          isOpen={isPlayerOpen}
          onOpenChange={setIsPlayerOpen}
          title={activeVideo.title}
          thumbnail={activeVideo.thumb}
        />
      )}

      <RequestTopicModal 
        isOpen={isRequestModalOpen}
        onOpenChange={setIsRequestModalOpen}
        onSuccess={() => {
          setIsRequestModalOpen(false);
          setIsRequestSuccessOpen(true);
        }}
      />

      <AppModal
        isOpen={isRequestSuccessOpen}
        onOpenChange={setIsRequestSuccessOpen}
        showCloseButton={false}
      >
        <div className="flex flex-col items-center py-[20px] text-center">
            <div className="size-[48px] rounded-full bg-[#E6F9EF] flex items-center justify-center mb-[16px]">
              <TickCircle size={24} variant="Bold" color="#008500" />
            </div>
            <h2 className="text-[24px] font-semibold text-[#202020] mb-[8px]">Request sent!</h2>
            <p className="text-[14px] text-sd-grey-11 leading-[20px] mb-[24px]">
              Your request has been successfully sent. You will be notified via email shortly on approval
            </p>
            <AppButton variant="app-primary" className="w-full h-[44px]" onClick={() => setIsRequestSuccessOpen(false)}>
              Done
            </AppButton>
          </div>
      </AppModal>
    </div>
  );
}
