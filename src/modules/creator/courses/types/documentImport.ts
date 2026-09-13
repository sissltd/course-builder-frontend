export type DocumentImportStatus =
  | "UPLOADING"
  | "PARSING"
  | "MAPPING"
  | "REVIEW"
  | "CONFIRMING"
  | "COMPLETED"
  | "FAILED";

export interface ParsedSection {
  id: string;
  title: string;
  level: number;
  content: string;
  children: ParsedSection[];
}

export interface ParsedModule {
  id: string;
  title: string;
  description: string;
  lessons: ParsedLesson[];
}

export interface ParsedLesson {
  id: string;
  title: string;
  content: string;
  type: "text";
}

export interface DocumentImportState {
  status: DocumentImportStatus;
  file: File | null;
  fileUrl: string | null;
  parsedStructure: ParsedModule[] | null;
  error: string | null;
  progress: number;
}

export const ACCEPTED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
] as const;

export const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".txt"] as const;

export const MAX_FILE_SIZE_MB = 20;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const DOCUMENT_IMPORT_STORAGE_KEY = "document-import-state";
