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
