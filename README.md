# Think Like an AI Engineer

A polished content-first MVP for experienced software engineers building practical intuition about where AI fits—and where it does not.

## Run locally

Requirements: Node.js 20.19+ or Node.js 22+.

```bash
npm install
npm run dev
```

Create a production build with `npm run build`, and check code quality with `npm run lint`.

## Configure the waitlist

Copy `.env.example` to `.env.local` and add your Supabase project values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Run this SQL in the Supabase SQL editor:

```sql
create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  role text not null,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

create policy "Anyone can join waitlist"
on public.waitlist
for insert
to anon
with check (true);
```

The public anon key is expected in a browser app. Row Level Security limits anonymous access to inserts only; do not add a public select policy.

## Content model

All local content and its TypeScript types live in `src/content/data.ts`.

### Add a problem

Add an object to `problems` with a unique URL-safe `slug`, title, question, description, category, difficulty (`Simple`, `Medium`, or `Hard`), and an `approaches` array. Each problem has a shareable `/problems/:slug` URL.

`/problems` shows the searchable course overview. The overview and lesson navigator use the same sequence: Simple, Medium, then Hard, preserving content order within each level. The reader consumes one full `Problem`. Completion is saved locally in this browser; there is no account requirement.

### Add an approach

Add an object inside a problem's `approaches` with `title`, `summary`, Markdown in `body`, and `primitives`. Use fenced `ts` blocks for simple TypeScript-like pseudo-code: variables, loops, conditionals, and comments. Do not use `async`, `await`, promises, SDK syntax, or complicated types. Give ordinary helpers plain names and explain their work in comments.

Approaches are free-flow Markdown, not a fixed template. The renderer supports code, tables, blockquote callouts, and Mermaid diagrams. Approach tabs show one program at a time; `?approach=2` links directly to the second approach.

Set `primitives` to the function IDs actually called in the example so related links are generated correctly. `PseudoCode` renders function calls as colored documentation links, leaving strings, comments, and ordinary application helpers unlinked.

### Add a primitive

The five teaching building blocks are `askCheapLLM(prompt)`, `askSmartLLM(prompt)`, `askDecisionModel(input, prompt, options?)`, `embed(text)`, and `similaritySearch(query, indexedItems, limit?)`. Choice, Boolean (yes/no), and Score are output modes of the decision block. Similarity search accepts text or an existing vector, searches a pre-indexed, permission-scoped collection, and returns matching source items rather than generated text. Its default teaching limit is five, with an implementation-defined relevance threshold. These are mental models, not an SDK.

Each primitive includes a mental model, a brief explanation of what happens underneath, use cases, limitations, representative providers, and a commented pseudo-code example. Its `color` and light `tint` are shared across code links, cards, badges, and homepage examples. `input` and `output` create the visual explanation; related problems are inferred from approach primitive IDs.

The primitive reference lives at `/primitives`; canonical detail routes use names such as `/primitives/askDecisionModel`. Older URLs redirect through `primitiveAliases` and `problemAliases`.

## Deployment

The app is a standard Vite SPA suitable for Vercel or Netlify. Set both `VITE_SUPABASE_*` environment variables in the host, use `npm run build`, and publish `dist`. Configure the host to rewrite unknown routes to `/index.html` for React Router.
