import type { Assessment } from "./assessment";

export enum BlockType {
  HEADING_1 = "HEADING_1",
  HEADING_2 = "HEADING_2",
  HEADING_3 = "HEADING_3",
  PARAGRAPH = "PARAGRAPH",
  BULLET_LIST = "BULLET_LIST",
  NUMBERED_LIST = "NUMBERED_LIST",
  CODE_BLOCK = "CODE_BLOCK",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  QUIZ = "QUIZ",
  DIVIDER = "DIVIDER",
}

export enum ImageSourceType {
  UPLOAD = "UPLOAD",
  URL = "URL",
}

export enum LessonContentType {
  VIDEO = "VIDEO",
  TEXT = "TEXT",
  QUIZ = "QUIZ",
}

export interface Lesson {
  id: string;
  title: string;
  order: number;
  script: string;
  video_url: string | null;
  learning_objectives: string[];
  duration_minutes: number;
  assessment: Assessment | null;
}

export interface CreateLessonRequest {
  title: string;
  order: number;
  content_type?: LessonContentType;
  script?: string;
  video_url?: string;
  learning_objectives?: string[];
  duration_minutes?: number;
}

export interface ReplaceLessonRequest {
  title: string;
  order: number;
  content_type?: LessonContentType;
  script?: string;
  video_url?: string;
  embedded_link?: string;
  video_script_file?: string;
  learning_objectives?: string;
  duration_minutes?: number;
}

export interface UpdateLessonRequest {
  title?: string;
  order?: number;
  content_type?: LessonContentType;
  script?: string;
  video_url?: string;
  embedded_link?: string;
  video_script_file?: string;
  learning_objectives?: string | string[];
  duration_minutes?: number;
}

export interface ContentBlock {
  id: string;
  lesson: string;
  order: number;
  block_type: BlockType;
  text_content: string | null;
  media_url: string | null;
  quiz: string | null;
}

export interface CreateContentBlockRequest {
  order: number;
  block_type: BlockType;
  text_content?: string;
  media_url?: string;
  quiz?: string;
}

export interface LessonImage {
  id: string;
  lesson: string;
  image: string;
  caption: string;
  source_type: ImageSourceType;
  order: number;
}

export interface CreateLessonImageRequest {
  image: string;
  caption?: string;
  source_type?: ImageSourceType;
  order?: number;
}

export interface LessonRequirement {
  id: string;
  lesson: string;
  text: string;
  order: number;
}

export interface CreateLessonRequirementRequest {
  text: string;
  order?: number;
}

export interface LessonListParams {
  ordering?: string;
  page?: number;
  size?: number;
}

export interface ReorderItem {
  id: string;
  order: number;
}

export interface ReorderRequest {
  order: ReorderItem[];
}

export interface BulkContentBlockRequest {
  order: CreateContentBlockRequest[];
}
