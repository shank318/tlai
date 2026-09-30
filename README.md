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

Add an object to `problems` with a unique URL-safe `slug`, title, description, category, difficulty, tags, and an `approaches` array.

### Add an approach

Add an object inside a problem's `approaches` with `title`, `summary`, a TypeScript pseudo-code string in `code`, and short `takeaway`, `tradeoff`, and `measure` explanations. These are illustrative programs, not an executable SDK. Ordinary application helpers, schemas, and indexes may be assumed; use `await` for model calls.

Set `primitives` to the function IDs actually called in the example so related links are generated correctly. `PseudoCode` renders function calls as colored documentation links, leaving strings, comments, and ordinary application helpers unlinked.

### Add a primitive

Add its function name to `PrimitiveId`, then add a matching object to `primitives`. Include a signature, parameters, return contract, mental model, limitations, possible implementations, and an example program. Set a unique `color` and matching light `tint`: this single palette is shared by code links, function cards, badges, and homepage blocks. The `input` and `output` fields create the visual explanation. Related problems are inferred from approach primitive IDs.

The function reference lives at `/primitives`; canonical detail routes use function names such as `/primitives/classify`. Previous concept-based routes are redirected through `primitiveAliases`.

## Deployment

The app is a standard Vite SPA suitable for Vercel or Netlify. Set both `VITE_SUPABASE_*` environment variables in the host, use `npm run build`, and publish `dist`. Configure the host to rewrite unknown routes to `/index.html` for React Router.
