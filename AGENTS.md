<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Standards & Guidelines

## 1. Iconsax Icons Standards
All `iconsax-react` icons MUST always be provided with the following props:
- `variant`: One of "Linear", "Outline", "Bold", "Bulk", "TwoTone", or "Broken".
- `color`: A valid color string (e.g., hex, named color, or currentColor).

Example:
```tsx
<Home2 variant="Linear" color="#202020" size={24} />
```

## 2. Shared Components Usage
ALWAYS use shared components located in `src/components/shared/` or `src/components/form/` instead of raw HTML or base UI components (`src/components/ui/`) directly when a shared wrapper exists.
- **Modals:** Use `AppModal` instead of `Dialog` directly.
- **Buttons:** Use `AppButton`.
- **Inputs:** Use `AppInput` or `FormInput`.
- **Textarea:** Use `AppTextarea` or `FormTextarea`.
- **Checkboxes:** Use `AppCheckbox` or `FormCheckbox`.
- **Tables:** Use `BaseTable`.
- **Pagination:** Use `AppPagination`.
- **Stats:** Use `StatCard`.

## 3. Modular Architecture
The project follows a modular structure in `src/modules/`.
- Each module should encapsulate its own components, hooks, views, and utilities.
- Page files in `src/app/` should be lean and primarily import/render views from the `modules` directory.
- Shared logic and UI components that are used across multiple modules should be placed in `src/components/shared/`, `src/lib/`, or `src/utils/`.

## 4. Color Palette & States
- **Primary Brand Color:** `--sd-primary` (Orange).
- **Active/Focused State:** `--sd-blue` (`#0063EF`). Use this for input focus borders and active selections.
- **Greyscale:** Use `--sd-grey-1` through `--sd-grey-12` for backgrounds, borders, and text.

## 5. Component Specifics
- **StatCard:** Always use the `StatCard` component for displaying overview metrics.
- **AppInput/AppTextarea:** Ensure they have appropriate focus states using `sd-blue`.
