# Backend API Gaps — Action Items for Backend Team

These are the endpoints or field additions the frontend builder requires but the backend API does not yet provide.

---

## 1. File Upload Endpoint (HIGH)

**Problem:** The UI has upload buttons for thumbnails, videos, and lesson media. Currently the frontend sends base64 data URLs in JSON bodies, which is fragile and won't work for large files (videos up to 500MB).

**Need:** A multipart file upload endpoint that accepts binary files and returns a hosted URL.

```
POST /api/v1/upload/
Content-Type: multipart/form-data

Body:
  file: <binary>

Response 201:
{
  "url": "https://storage.example.com/uploads/abc123.mp4",
  "mime_type": "video/mp4",
  "size": 52428800
}
```

**Used by:**
- Thumbnail upload (`ThumbnailStep.tsx`)
- Cover video upload (`CourseInformation.tsx`)
- Lesson media upload (`LessonEditView.tsx`)
- Any future image/file attachments

---

## 2. Bulk Reorder Endpoint (HIGH)

**Problem:** The UI has drag handles on modules and lessons for reordering. No drag library is installed yet, but when it is, we need an efficient way to persist new order. Calling PATCH individually for each item is too slow for a drag-and-drop flow.

**Need:** A bulk reorder endpoint for modules and lessons.

```
PATCH /api/v1/courses/{course_pk}/modules/reorder/
Body:
{
  "order": [
    { "id": "uuid-1", "order": 1 },
    { "id": "uuid-2", "order": 2 },
    { "id": "uuid-3", "order": 3 }
  ]
}

Response 200: 200 OK
```

```
PATCH /api/v1/courses/{course_pk}/modules/{module_pk}/lessons/reorder/
Body:
{
  "order": [
    { "id": "uuid-1", "order": 1 },
    { "id": "uuid-2", "order": 2 }
  ]
}

Response 200: 200 OK
```

**Used by:**
- Module reordering in CourseOutline.tsx
- Lesson reordering in ModulesStep.tsx

---

## 3. Add `version` to UpdateCourseRequest (MEDIUM)

**Problem:** The builder has a Version step where creators select a course version (v1.0, v1.1, v2.0). The value is stored in Redux but never sent to the API because `UpdateCourseRequest` doesn't include a `version` field. The `Course` response model already has `version: string`.

**Need:** Add `version` to the course update request schema.

```
PATCH /api/v1/courses/{id}/
Body:
{
  "version": "v1.0"
}
```

**Frontend change needed:** Add `version: info.version` to the `syncUpdateCourseInfo` body in `builderSync.ts`.

---

## 4. Course Publish Endpoint (MEDIUM)

**Problem:** The builder has a "Publish course" button in the header, but the only state-transition endpoint is `POST /courses/{id}/submit/` which submits for review. There's no direct publish path.

**Need:** Clarify whether publishing should go through the review flow (submit → approve → publish) or if a direct publish endpoint is needed for admins/creators.

**Option A:** If submit is the only path, rename the "Publish course" button to "Submit for Review" in the builder.

**Option B:** If direct publish is needed:
```
POST /api/v1/courses/{id}/publish/
Response 200:
{
  "id": "uuid",
  "status": "PUBLISHED",
  "published_at": "2026-08-31T12:00:00Z"
}
```

---

## 5. Module Lock/Unlock Endpoints (MEDIUM)

**Problem:** The builder has a "Lock module" button and the `Module` model includes `locked_by`, `lock_expires_at`, and `is_locked` fields. But no API endpoint exists to actually lock or unlock a module.

**Need:**

```
POST /api/v1/courses/{course_pk}/modules/{module_pk}/lock/
Response 200:
{
  "locked_by": "user-uuid",
  "lock_expires_at": "2026-08-31T13:00:00Z",
  "is_locked": true
}
```

```
POST /api/v1/courses/{course_pk}/modules/{module_pk}/unlock/
Response 200:
{
  "locked_by": null,
  "lock_expires_at": null,
  "is_locked": false
}
```

---

## 6. Course Preview Endpoint (MEDIUM)

**Problem:** The builder has "Preview" buttons in the header and lesson editor, but no backend endpoint exists to generate a preview.

**Need:** Either a preview URL or a preview render endpoint.

**Option A:** A URL that renders the course as a student would see it:
```
GET /api/v1/courses/{id}/preview/
Response 200:
{
  "preview_url": "https://app.soludeskscb.com/courses/{id}/preview?token=..."
}
```

**Option B:** A flag on the course that makes it temporarily visible without full publication.

---

## 7. Lesson `content` Field in UpdateRequest (HIGH)

**Problem:** The TipTap rich text editor stores HTML in `lesson.content`. The `UpdateLessonRequest` has `script` (for video scripts) and `embedded_link` (for embed URLs), but no field for rich text content. Currently the content is incorrectly stuffed into `script`.

**Need:** Add a `content` field to `UpdateLessonRequest`:

```
PATCH /api/v1/courses/{course_pk}/modules/{module_pk}/lessons/{lesson_pk}/
Body:
{
  "content": "<h1>Introduction</h1><p>This lesson covers...</p>"
}
```

**Alternative:** If the `ContentBlock` system is the intended approach, the frontend needs guidance on how TipTap HTML maps to ContentBlock types.

---

## 8. Category Request Endpoint (LOW)

**Problem:** The course creation page mentions "Can't find your preferred category? request for one" but no API endpoint exists for this.

**Need:**
```
POST /api/v1/category-requests/
Body:
{
  "name": "Data Science",
  "description": "Courses about data analysis and machine learning"
}
Response 201:
{
  "id": "uuid",
  "status": "PENDING"
}
```

---

## Summary

| # | Endpoint/Change | Priority | Blocks |
|---|----------------|----------|--------|
| 1 | File upload (`POST /upload/`) | HIGH | Thumbnails, videos, media |
| 2 | Bulk reorder (`PATCH .../reorder/`) | HIGH | Drag-and-drop |
| 3 | `version` in UpdateCourseRequest | MEDIUM | Version step persistence |
| 4 | Course publish endpoint | MEDIUM | Publish button |
| 5 | Module lock/unlock endpoints | MEDIUM | Lock module button |
| 6 | Course preview endpoint | MEDIUM | Preview buttons |
| 7 | `content` field in UpdateLessonRequest | HIGH | Rich text lessons |
| 8 | Category request endpoint | LOW | Request category feature |
