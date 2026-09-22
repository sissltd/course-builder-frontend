import { BaseAPI } from "@/redux/baseApi";
import type { CategoryPickerOption } from "../types";

/**
 * The picker is documented as returning a bare array, unlike every other list
 * endpoint on this API, which wraps results in `{ data: { paginator, results } }`.
 * Ten dropdowns across four modules depend on this hook, so the response is
 * normalised defensively rather than trusting either shape.
 */
const normalizePickerResponse = (response: unknown): CategoryPickerOption[] => {
  if (Array.isArray(response)) {
    return response as CategoryPickerOption[];
  }

  const results = (response as { data?: { results?: unknown } })?.data?.results;
  if (Array.isArray(results)) {
    return results.flat() as CategoryPickerOption[];
  }

  return [];
};

/**
 * Category options for dropdowns. Any authenticated user may call this, which is
 * why it is a separate slice from `categoriesApi` — the CRUD endpoints are
 * Writer / Admin / SuperAdmin only and would 403 for creators and reviewers.
 *
 * There are no query params: filtering by `is_active` is the caller's job.
 */
export const categoryPickerApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryPicker: builder.query<CategoryPickerOption[], void>({
      query: () => ({
        url: "/categories/picker/",
        method: "GET",
      }),
      transformResponse: normalizePickerResponse,
      providesTags: ["CategoryPicker"],
    }),
  }),
});

export const { useGetCategoryPickerQuery } = categoryPickerApi;

/**
 * The three screens that used to ask the list endpoint for `status=ACTIVE`
 * should filter on this instead — the picker returns archived categories too,
 * flagged rather than omitted.
 */
export const selectActivePickerOptions = (
  options: CategoryPickerOption[] | undefined,
): CategoryPickerOption[] => (options ?? []).filter((option) => option.is_active);
