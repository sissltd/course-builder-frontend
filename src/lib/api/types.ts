export interface ApiErrorItem {
  type: string;
  code: string;
  message: string;
  field_name: string | null;
}

export interface ApiErrorEnvelope {
  errors: ApiErrorItem[];
}

export interface DetailResponse {
  detail: string;
}

export type ApiErrorResponse = ApiErrorEnvelope | undefined;

export interface PresignRequest {
  filename: string;
  content_type: string;
  folder: string;
  size: number;
}

export interface PresignResponse {
  upload_url: string;
  file_url: string;
  file_key: string;
  expires_in: number;
}
