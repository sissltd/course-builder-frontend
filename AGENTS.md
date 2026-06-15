<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Iconsax Icons Standards
All `iconsax-react` icons must always be provided with the following props:
1. `variant`: Must be one of "Linear", "Outline", "Bold", "Bulk", "TwoTone", or "Broken".
2. `color`: Must be a valid color string (e.g., hex, named color, or currentColor).

Example:
```tsx
<Home2 variant="Linear" color="#202020" size={24} />
```
