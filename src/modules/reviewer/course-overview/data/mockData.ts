import { BookOpen, LibraryBig, CirclePlay } from "lucide-react";
import { Task } from "iconsax-react";

export type LessonTone = "warning" | "soft" | "success";

export interface Lesson {
  title: string;
  meta: string;
  note: string;
  tone: LessonTone;
  type: "video" | "lesson" | "assessment";
}

export interface ModuleBlock {
  title: string;
  meta: string;
  open: boolean;
  lessons: Lesson[];
}

export const statCards = [
  {
    icon: BookOpen,
    value: "95%",
    label: "Structure",
    iconBg: "bg-white",
    iconColor: "var(--sd-orange)",
  },
  {
    icon: LibraryBig,
    value: "4",
    label: "Total Modules",
    iconBg: "bg-white",
    iconColor: "var(--sd-blue)",
  },
  {
    icon: CirclePlay,
    value: "24",
    label: "Total Lessons",
    iconBg: "bg-white",
    iconColor: "var(--sd-orange)",
  },
  {
    icon: Task,
    value: "24",
    label: "Total Assessment",
    iconBg: "bg-white",
    iconColor: "var(--sd-orange)",
  },
];

export const creatorInfo = [
  { label: "Name", value: "Osaite Emmanuel" },
  { label: "Date created", value: "25 May 2026" },
];

export const courseInfo = [
  { label: "Category", value: "AI & Machine Learning" },
  { label: "Modules", value: "5 Modules" },
  { label: "Duration", value: "3hr 20min" },
];

export const modules: ModuleBlock[] = [
  {
    title: "Module 1: Introduction to Computer Science",
    meta: "12 Lessons  •  12 Assessment  •  1hr 40m",
    open: true,
    lessons: [
      {
        title: "Introductory class",
        meta: "1 hours 25 minutes  •  4 Assessment",
        note: "1 flag issue (video requirement not met)",
        tone: "warning",
        type: "video",
      },
      {
        title: "Understanding Basic Computing Concept",
        meta: "2 hours 25 minutes  •  4 Assessment",
        note: "Below required script 420/500",
        tone: "soft",
        type: "lesson",
      },
      {
        title: "Conclusion",
        meta: "2 hours 25 minutes  •  4 Assessment",
        note: "Pass",
        tone: "success",
        type: "lesson",
      },
      {
        title: "Lesson Assessment",
        meta: "2 hours 25 minutes  •  4 Assessment",
        note: "Pass",
        tone: "success",
        type: "assessment",
      },
    ],
  },
  {
    title: "Module 2: Classification of Computers",
    meta: "12 Lessons  •  12 Assessment  •  1hr 40m",
    open: true,
    lessons: [
      {
        title: "Computer classification",
        meta: "1 hours 25 minutes  •  4 Assessment",
        note: "Plagiarism 13% similarity, approaching the 15% threshold. Section 2 of this lesson is the flagged passage. Borderline: reviewer judgement required",
        tone: "warning",
        type: "video",
      },
      {
        title: "Understanding Basic Computing Concept",
        meta: "2 hours 25 minutes  •  4 Assessment",
        note: "Pass",
        tone: "success",
        type: "lesson",
      },
      {
        title: "Conclusion",
        meta: "2 hours 25 minutes  •  4 Assessment",
        note: "Pass",
        tone: "success",
        type: "lesson",
      },
      {
        title: "Lesson Assessment",
        meta: "2 hours 25 minutes  •  4 Assessment",
        note: "Pass",
        tone: "success",
        type: "assessment",
      },
    ],
  },
  {
    title: "Module 3: Classification of Computers",
    meta: "12 Lessons  •  12 Assessment  •  1hr 40m",
    open: false,
    lessons: [],
  },
  {
    title: "Module 4: Summary",
    meta: "12 Lessons  •  12 Assessment  •  1hr 40m",
    open: false,
    lessons: [],
  },
];

export const quizQuestions = [
  {
    prompt: "What are storage units?",
    options: [
      { text: "They hold part of the computer memory", isCorrect: false, explanation: "There are only three types of computers which can be classififed as" },
      { text: "They're that part of the computer designed for storing information", isCorrect: true, explanation: "There are only three types of computers which can be classififed as" },
      { text: "They're classified as the floppy disk", isCorrect: false, explanation: "There are more than two types of computers" },
      { text: "They're classified as the hard disk drive", isCorrect: false, explanation: "There are more than two types of computers" },
    ],
    note: "This question has 74% similarity to Question 2 in the Module 1 quiz. Review both questions; if they test the same learning point, one must be revised to avoid duplication.",
  },
  {
    prompt: "What are storage units?",
    options: [
      { text: "They hold part of the computer memory", isCorrect: false, explanation: "There are only three types of computers which can be classififed as" },
      { text: "They're that part of the computer designed for storing information", isCorrect: true, explanation: "There are only three types of computers which can be classififed as" },
      { text: "They're classified as the floppy disk", isCorrect: false, explanation: "There are more than two types of computers" },
      { text: "They're classified as the hard disk drive", isCorrect: false, explanation: "There are more than two types of computers" },
    ],
    note: "This question has 74% similarity to Question 2 in the Module 1 quiz. Review both questions; if they test the same learning point, one must be revised to avoid duplication.",
  },
  {
    prompt: "What are storage units?",
    options: [
      { text: "They hold part of the computer memory", isCorrect: false, explanation: "There are only three types of computers which can be classififed as" },
      { text: "They're that part of the computer designed for storing information", isCorrect: true, explanation: "There are only three types of computers which can be classififed as" },
      { text: "They're classified as the floppy disk", isCorrect: false, explanation: "There are more than two types of computers" },
      { text: "They're classified as the hard disk drive", isCorrect: false, explanation: "There are more than two types of computers" },
    ],
    note: "This question has 74% similarity to Question 2 in the Module 1 quiz. Review both questions; if they test the same learning point, one must be revised to avoid duplication.",
  },
];

export const mediaChecklist = [
  { label: "Preview video", value: "1:32 mins", tone: "success" as const },
  { label: "Resolution", value: "1080p", tone: "success" as const },
  { label: "Audio quality", value: "-16 LUFS", tone: "success" as const },
  { label: "Playback requirement", value: "Needs verification", tone: "warning" as const },
];

export const mediaReviewItems = [
  {
    title: "Introductory class",
    type: "Video",
    duration: "1:32mins",
    resolution: "1080p",
    audio: "-16 LUFS",
    status: "Pass",
    tone: "success" as const,
  },
  {
    title: "Computer classification",
    type: "Video",
    duration: "1:12mins",
    resolution: "720p",
    audio: "-20 LUFS",
    status: "Needs review",
    tone: "warning" as const,
  },
  {
    title: "Conclusion",
    type: "Video",
    duration: "1:05mins",
    resolution: "1080p",
    audio: "-16 LUFS",
    status: "Pass",
    tone: "success" as const,
  },
];

export const scriptDescription =
  "Explore the fascinating world of Artificial Intelligence in this comprehensive course. You'll learn about the principles of AI, its applications in various industries, and the ethical considerations surrounding its use. Through engaging lectures and hands-on projects, you'll gain the skills needed to understand and implement AI technologies effectively.";

export const scriptBody = [
  "Dive into the world of technology and innovation with this comprehensive Computer Science course. You’ll explore the foundations of computing—from algorithms and data structures to software development, artificial intelligence, and cybersecurity. Designed for both beginners and aspiring professionals, this course equips you with the analytical and problem‑solving skills needed to build intelligent systems, design efficient programs, and understand how technology shapes our modern world.",
  "By the end, you’ll be ready to apply computational thinking to real‑world challenges and pursue careers in software engineering, data science, or tech entrepreneurship.",
];

export const scriptObjectives = [
  {
    number: "1.1",
    text: "Understand how artificial intelligence plays a role in modern computing and analytics",
  },
  {
    number: "1.2",
    text: "Understand how artificial intelligence plays a role in modern computing and analytics",
  },
  {
    number: "1.3",
    text: "Understand how artificial intelligence plays a role in modern computing and analytics",
  },
  {
    number: "1.4",
    text: "Understand how artificial intelligence plays a role in modern computing and analytics",
  },
];

export const plagiarismModules = [
  {
    id: 1,
    title: "Module 1: Introduction to Computer Science",
    note: "Below 15% threshold, reviewer judgement required",
    lessons: [
      { id: "1-1", title: "Lesson 1: Introductory class", score: "2%", status: "success" },
      { 
        id: "1-2", 
        title: "Lesson 2: Introductory class", 
        score: "15%", 
        status: "warning",
        content: [
          "Dive into the world of technology and innovation with this comprehensive Computer Science course. You'll explore the foundations of computing—from algorithms and data structures to software development, artificial intelligence, and cybersecurity. Designed for both beginners and aspiring professionals, this course equips you with the analytical and problem-solving skills needed to build intelligent systems, design efficient programs, and understand how technology shapes our modern world.",
          "By the end, you'll be ready to apply computational thinking to real-world challenges and pursue careers in software engineering, data science, or tech entrepreneurship."
        ],
        warning: "Below 15% threshold: Reviewer judgement required",
        source: "scdc.com/informationtech/computer language"
      },
      { id: "1-3", title: "Lesson 3: Introductory class", score: "2%", status: "success" },
      { id: "1-4", title: "Lesson 4: Introductory class", score: "2%", status: "success" },
    ]
  },
  {
    id: 2,
    title: "Module 2: Introduction to Computer Science",
    note: "Below 4% threshold",
    lessons: [
      { id: "2-1", title: "Lesson 1: Introductory class", score: "2%", status: "success" },
      { id: "2-2", title: "Lesson 2: Classification of Computers", score: "2%", status: "success" },
    ]
  }
];
