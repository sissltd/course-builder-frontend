"use client";

import React, { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shared/Button";
import {
  SearchNormal1,
  TickCircle,
  Magicpen,
  InfoCircle,
} from "iconsax-react";
import { cn } from "@/lib/utils";
import { FormInput } from "@/components/form/FormInput";
import { FormCheckbox } from "@/components/form/FormCheckbox";
import { Modal } from "@/components/shared/Modal";
import { FormTextarea } from "@/components/form/FormTextarea";
import { GuideVideosStep } from "./components/GuideVideosStep";
import { RequestTopicModal } from "@/modules/creator/reservation/components/RequestTopicModal";
import { courseCreateSchema, CourseCreateFormData } from "./utils/validation";
import { useAppDispatch } from "@/redux";
import { updateCourseInformation } from "@/redux/slices/courseBuilderSlice";
import { useCreateCourseMutation } from "./hooks";
import {
  useGetCategoryPickerQuery,
  selectActivePickerOptions,
} from "@/modules/categories/api/categoryPickerApi";
import { useGetTopicsQuery } from "@/modules/topics/api/topicsApi";
import { TopicStatus } from "@/modules/topics/types";
import { normalizeApiError } from "@/lib/api/errors";
import { CreatorRoute } from "@/lib/routes";
import { toast } from "sonner";
import {
  buildMethodEntryHref,
  clampCreateCourseStep,
  CREATE_COURSE_STEP_PARAM,
  createCourseStepHref,
  parseCreateCourseStep,
} from "./utils/createCourseNavigation";

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

const CreateCourseStep = {
  VideoGuide: 0,
  Legal: 1,
  Method: 2,
  Category: 3,
  Topic: 4,
  Details: 5,
  Loading: 6,
} as const;

export default function CreateCourseView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  // 0: Video Guide, 1: Legal, 2: Method, 3: Category, 4: Topic, 5: Details, 6: Loading
  const step = parseCreateCourseStep(
    searchParams.get(CREATE_COURSE_STEP_PARAM),
  );
  const [searchCategory, setSearchCategory] = useState("");
  const [searchTopic, setSearchTopic] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);

  // Categories and topics are only reachable from the last two steps. Asking
  // for them on the opening step burned a request — and, with a not-yet-valid
  // token, a 401 and refresh round-trip — before the user had scrolled.
  const needsCategories = step >= CreateCourseStep.Category;
  const needsTopics = step >= CreateCourseStep.Topic;

  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useGetCategoryPickerQuery(undefined, { skip: !needsCategories });
  // The picker returns archived categories too; only live ones may be chosen.
  const categories = selectActivePickerOptions(categoriesResponse);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isRequestSuccessOpen, setIsRequestSuccessOpen] = useState(false);

  const methods = useForm<CourseCreateFormData>({
    resolver: zodResolver(courseCreateSchema),
    mode: "onBlur",
    defaultValues: {
      legalAgreement: false,
      creationMethod: "",
      category: "",
      topic: "",
      courseTitle: "",
      courseDescription: "",
    },
  });

  const {
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const agreed = watch("legalAgreement");
  const method = watch("creationMethod");
  const selectedCategory = watch("category");
  const selectedTopic = watch("topic");
  const courseTitle = watch("courseTitle");
  const courseDescription = watch("courseDescription");

  const { data: topicsResponse, isLoading: isLoadingTopics } = useGetTopicsQuery(
    selectedCategory ? { category: selectedCategory, status: TopicStatus.ACTIVE } : { status: TopicStatus.ACTIVE },
    { skip: !needsTopics || !selectedCategory }
  );
  const topics = topicsResponse?.data?.results || [];

  // Every wizard step lives in the URL, so each one is deep-linkable,
  // survives a refresh and works with browser Back/Forward.
  const goToStep = useCallback(
    (next: number) => {
      router.push(createCourseStepHref(clampCreateCourseStep(next)));
    },
    [router],
  );

  const nextStep = () => goToStep(step + 1);
  const prevStep = () => goToStep(step - 1);
  // The first step has nowhere to go inside the wizard — exit to the list.
  const handleExitWizard = () => router.push(CreatorRoute.COURSES);

  const filteredCategories = (categories ?? []).filter(c =>
    c.name.toLowerCase().includes(searchCategory.toLowerCase())
  );

  const filteredTopics = topics.filter(t => 
    t.name.toLowerCase().includes(searchTopic.toLowerCase())
  );

  const handleLegalNext = async () => {
    const isValid = await trigger(["legalAgreement"]);
    if (isValid) nextStep();
  };

  const handleMethodNext = async () => {
    const isValid = await trigger(["creationMethod"]);
    if (isValid) {
      if (method === "ai") {
        router.push(buildMethodEntryHref(CreatorRoute.COURSES_AI_CREATE));
      } else if (method === "import") {
        router.push(buildMethodEntryHref(CreatorRoute.COURSES_IMPORT));
      } else {
        nextStep();
      }
    }
  };

  const handleCategoryNext = async () => {
    const isValid = await trigger(["category"]);
    if (isValid) nextStep();
  };

  const handleTopicNext = async () => {
    const isValid = await trigger(["topic"]);
    if (isValid) nextStep();
  };

  const onSubmit = async (data: CourseCreateFormData) => {
    try {
      const result = await createCourse({
        category: data.category,
        title: data.courseTitle,
        description: data.courseDescription,
        terms_accepted: true,
      }).unwrap();

      dispatch(
        updateCourseInformation({
          courseTitle: data.courseTitle,
          description: data.courseDescription,
          category: data.category,
          topic: data.topic,
          creationMethod: data.creationMethod,
        }),
      );

      nextStep();
      setTimeout(() => {
        router.push(`${CreatorRoute.COURSES_BUILDER}?id=${result.id}`);
      }, 3000);
    } catch (err) {
      const { message } = normalizeApiError(
        err as Parameters<typeof normalizeApiError>[0],
      );
      toast.error(message ?? "Failed to create course");
    }
  };

  const renderStep1 = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="w-full max-w-[485px] bg-white border border-[#F0F0F0] rounded-[24px] p-[24px] ">
        <h1 className="text-[32px] font-bold text-[#202020] tracking-[-0.64px] font-quicksand mb-[40px]">Legal agreements</h1>
        
        <div className="flex flex-col gap-[12px] mb-[40px]">
          <h2 className="text-[18px] font-semibold text-[#202020]">NDA & IP Ownership Agreement</h2>
          <p className="text-[14px] text-[#606060] leading-[24px]">
            By participating as a trainer, you agree that all content created within SoluDeskss Course Builder Studio is the exclusive property of SoluDeskss. You maintain no ownership or publishing rights over the submitted materials. All intellectual property is transferred upon submission.
          </p>
        </div>

        <div className="mb-[40px]">
          <FormCheckbox 
            name="legalAgreement"
            label="I have read this legal agreement and agree to the policy right as stated above."
          />
        </div>

        <div className="flex items-center gap-[16px]">
          <Button 
            type="button"
            variant="app-outline" 
            className="flex-1 h-[44px] text-sd-blue border-sd-blue"
            onClick={prevStep}
          >
            Back
          </Button>
          <Button 
            type="button"
            variant="app-primary" 
            className="flex-1 h-[44px]"
            disabled={!agreed}
            onClick={handleLegalNext}
          >
            Agree and continue
          </Button>
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
                onClick={() => setValue("creationMethod", opt.id, { shouldValidate: true })}
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
            {errors.creationMethod && (
              <p className="text-caption-xs text-[#FF5025] mt-[4px]">{errors.creationMethod.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-[16px]">
          <Button 
            type="button"
            variant="app-outline" 
            className="flex-1 h-[44px] text-sd-blue border-sd-blue"
            onClick={prevStep}
          >
            Back
          </Button>
          <Button 
            type="button"
            variant="app-primary" 
            className="flex-1 h-[44px]"
            disabled={!method}
            onClick={handleMethodNext}
          >
            Continue
          </Button>
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
                {selectedCategory ? (categories ?? []).find(c => c.id === selectedCategory)?.name || "Selected" : "Select option"}
              </span>
              <RightArrowIcon />
            </button>

            {errors.category && (
              <p className="text-caption-xs text-[#FF5025] mt-[4px]">{errors.category.message}</p>
            )}

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
                  {isLoadingCategories ? (
                    <p className="text-[12px] text-[#B6B6B6] text-center py-[12px]">Loading categories...</p>
                  ) : filteredCategories.length > 0 ? (
                    filteredCategories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setValue("category", c.id, { shouldValidate: true });
                          setIsCategoryDropdownOpen(false);
                          setSearchCategory("");
                        }}
                        className={cn(
                          "w-full text-left px-[12px] py-[10px] text-[14px] font-medium rounded-[8px] transition-colors flex items-center justify-between",
                          selectedCategory === c.id 
                            ? "bg-sd-grey-2 text-[#202020]" 
                            : "text-[#636363] hover:bg-sd-grey-1 hover:text-[#202020]"
                        )}
                      >
                        <span>{c.name}</span>
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
          <Button 
            type="button"
            variant="app-outline" 
            className="flex-1 h-[44px] text-sd-blue border-sd-blue"
            onClick={prevStep}
          >
            Back
          </Button>
          <Button 
            type="button"
            variant="app-primary" 
            className="flex-1 h-[44px]"
            disabled={!selectedCategory}
            onClick={handleCategoryNext}
          >
            Continue
          </Button>
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
                {selectedTopic ? topics.find(t => t.id === selectedTopic)?.name || "Selected" : "Select option"}
              </span>
              <RightArrowIcon />
            </button>

            {errors.topic && (
              <p className="text-caption-xs text-[#FF5025] mt-[4px]">{errors.topic.message}</p>
            )}

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
                  {isLoadingTopics ? (
                    <p className="text-[12px] text-[#B6B6B6] text-center py-[12px]">Loading topics...</p>
                  ) : filteredTopics.length > 0 ? (
                    filteredTopics.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setValue("topic", t.id, { shouldValidate: true });
                          setIsTopicDropdownOpen(false);
                          setSearchTopic("");
                        }}
                        className={cn(
                          "w-full text-left px-[12px] py-[10px] text-[14px] font-medium rounded-[8px] transition-colors flex items-center justify-between",
                          selectedTopic === t.id 
                            ? "bg-sd-grey-2 text-[#202020]" 
                            : "text-[#636363] hover:bg-sd-grey-1 hover:text-[#202020]"
                        )}
                      >
                        <span>{t.name}</span>
                        <span className="bg-[#EBF3FF] text-[#0063EF] text-[12px] font-semibold px-[8px] py-[2px] rounded-[6px]">
                          ${t.creator_price}
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
          <Button 
            type="button"
            variant="app-outline" 
            className="flex-1 h-[44px] text-sd-blue border-sd-blue"
            onClick={prevStep}
          >
            Back
          </Button>
          <Button 
            type="button"
            variant="app-primary" 
            className="flex-1 h-[44px]"
            disabled={!selectedTopic}
            onClick={handleTopicNext}
          >
            Continue
          </Button>
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
          <FormInput
            name="courseTitle"
            label="Course title"
            placeholder="Enter course title"
            required
          />
          <FormTextarea
            name="courseDescription"
            label="Description"
            placeholder="Enter description"
            required
          />
        </div>

        <div className="flex items-center gap-[16px]">
          <Button 
            type="button"
            variant="app-outline" 
            className="flex-1 h-[44px] text-sd-blue border-sd-blue"
            onClick={prevStep}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="app-primary"
            className="flex-1 h-[44px]"
            disabled={!courseTitle || !courseDescription || isCreating}
            isLoading={isCreating}
          >
            Create course
          </Button>
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
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[1200px] mx-auto px-[20px] py-[40px]">
        {step === CreateCourseStep.VideoGuide && (
          <GuideVideosStep
            onBack={handleExitWizard}
            onContinue={nextStep}
          />
        )}
        {step === CreateCourseStep.Legal && renderStep1()}
        {step === CreateCourseStep.Method && renderStep2()}
        {step === CreateCourseStep.Category && renderStep3()}
        {step === CreateCourseStep.Topic && renderStep4()}
        {step === CreateCourseStep.Details && renderStep5()}
        {step === CreateCourseStep.Loading && renderStep6()}

        <RequestTopicModal 
          isOpen={isRequestModalOpen}
          onOpenChange={setIsRequestModalOpen}
          onSuccess={() => {
            setIsRequestModalOpen(false);
            setIsRequestSuccessOpen(true);
          }}
        />

        <Modal
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
              <Button variant="app-primary" type="button" className="w-full h-[44px]" onClick={() => setIsRequestSuccessOpen(false)}>
                Done
              </Button>
            </div>
        </Modal>
      </form>
    </FormProvider>
  );
}
