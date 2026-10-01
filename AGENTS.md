# Project conventions

- This is a React 19 + TypeScript + Vite SPA with React Router. Shared UI is in `src/components/ui.tsx`, page components in `src/pages/pages.tsx`, and course content in `src/content/data.ts`.
- Verify changes with `npm run build`, `npm run lint`, and `git diff --check`. There is no committed automated browser-test suite. For UI changes, also exercise mobile navigation, course filters, approach tabs, completion, and direct links in a browser.
- `/problems` is the course overview. `/problems/:slug?approach=N` opens a lesson with a one-based approach selection. Preserve the legacy redirects in the content model.
- The course sequence groups problems by Simple, Medium, then Hard, retaining their content order within each group.
- Lesson completion is stored as an array of known slugs under `tai-completed-v1` in localStorage. Updates synchronize across tabs, with an in-memory fallback when storage is unavailable. Thinking notes are deliberately not persisted.
- `similaritySearch(query, indexedItems, limit?)` accepts text or an embedding vector, searches permission-scoped indexed records, and returns source items. It is a teaching abstraction, not an SDK. Keep each approach's `primitives` list aligned with the actual function calls in its code.
- Explain jargon at first use. Preserve the distinction between AI judgments and deterministic permissions, validations, and actions. Keep examples synchronous, annotated, and provider-independent.
- The homepage walkthrough is a deterministic illustration, not a live model call. Do not add paid API calls or send real waitlist submissions during testing.
- Respect reduced-motion preferences. Check narrow viewports down to 320px; code may scroll inside its panel, but the document must not overflow horizontally.
