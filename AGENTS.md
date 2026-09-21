<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


# AGENTS.md — Norocio Frontend

Rules for working in this repository. Strict rules are mandatory; breaking them is a defect in the work.

## Figma fidelity (strict)

The Figma design is the source of truth for every pixel. Never guess, approximate, or trust pre-existing code over the design.

1. **Fetch the design before touching a section.** Before implementing or modifying any UI, call `figma_get_design_context` (and `figma_get_metadata` when geometry/stacking is in question) on the exact node being worked on — the section, its cards, and their children. Do not rely on a remembered or previously fetched version: re-fetch if the design may have changed.

2. **Use exact values from the design context.** Copy positions, sizes, border radii, colors, opacities, font styles, gaps, and transforms verbatim from the generated design code. Do not "round" or "approximate" them, and do not substitute a similar-looking color or size.

3. **Never trust pre-existing approximations.** Existing code may contain guessed values (e.g. a CSS circle used in place of a Figma asset, or an offset like `-top-[600px]`). Treat such code as suspicious until the design node confirms it. If the design uses an image/SVG asset, download the actual asset from the Figma asset server (`http://localhost:3845/assets/<hash>`) into `public/images/products/<product>/` and use it — do not approximate it with CSS shapes.

4. **Verify stacking and clipping.** Match the design's layering order (siblings paint in DOM order; positioned elements paint above static ones), its clipping (`overflow-clip`/`overflow-hidden` on wrappers), and its positioning context. An element that bleeds outside its wrapper in the design is clipped by the wrapper — replicate that wrapper clip.

5. **Check every attribute of the node.** When a node has a fill, blur, shadow, rotation, or skew, the design context must carry it. If the generated code omits something visible, investigate the node's metadata before writing CSS.

6. **Do not add anything the user removed.** If the user (or the design) has deliberately removed an element or property, do not reintroduce it unless asked.

## Verification (strict)

1. **Before finishing any change, run both:**
   - `npm run lint`
   - `npm run typecheck`
   Both must pass with zero errors.

2. **Confirm the render.** After UI changes, fetch the page (`http://localhost:3000/<route>`) and confirm the expected markup/classes/assets are present (status 200, expected elements). Never claim "matches the Figma" without checking the rendered output.

3. **State what was verified.** In the final summary, list exactly which design node was used, which assets were downloaded, and what was verified (lint, typecheck, rendered markup).

## Repository commands

- Dev server: `npm run dev`
- Lint: `npm run lint` (must be zero warnings)
- Typecheck: `npm run typecheck`
- Format: `npm run format` / `npm run format:check`
- Tests: `npm run test` / `npm run e2e`

## General

- Do not add code comments unless asked.
- Follow the existing code style and component patterns in the file being edited.
- Never commit, amend, push, or create PRs unless explicitly asked.
- Never log or commit secrets.

## Upload Utility Rules (strict)

- The upload utility (`src/lib/uploads.ts`) always uses `"general"` as the folder name. The backend only accepts `"general"` — never pass a custom folder name. If you need to organize uploads, use the `file_key` returned by the presign endpoint, not the folder parameter.
- When a feature does not require server-side file storage (e.g., client-side document parsing), do NOT upload the file. Only upload when the backend needs the file.


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

## 6. Route Constants (strict)
- All routes MUST use the enum constants from `@/lib/routes` (`AuthRoute`, `AdminRoute`, `CreatorRoute`, `ReviewerRoute`, `WebsiteRoute`).
- Never hardcode route strings in `href`, `router.push()`, `router.replace()`, or `usePathname()` checks.
- If a route is missing from the enum, add it to the appropriate enum in `src/lib/routes.ts` first.
- For query parameters, template-literal the enum value (e.g., `${CreatorRoute.KYC}?step=2`).
