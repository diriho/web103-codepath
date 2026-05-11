# Creatorverse

## Description

Creatorverse is a multi-user web app where each authenticated user curates a private collection of content creators — YouTubers, Twitch streamers, TikTokers, podcasters, Substack writers, anyone whose work shapes their world. Each user signs up, builds their own list, and can add, view, edit, and delete creators. Every Creatorverse is private to its owner, enforced server-side by Supabase Row Level Security.

The aesthetic is intentional: a dark editorial zine — near-black background, off-white text, electric-lime accent, Fraunces display + DM Sans body — meant to feel like a personal magazine, not a CRUD dashboard.

## Features

### Required Features

- [x] Lists all creators with name, image, description, and URL
- [x] Add new creators via a form
- [x] View a single creator on a dedicated detail page
- [x] Edit existing creators
- [x] Delete creators
- [x] Routing via React Router (Landing, Login, SignUp, ShowCreators, ViewCreator, AddCreator, EditCreator)

### Extra Features

- [x] **Multi-user authentication** — Supabase email/password auth with Row Level Security; each user only sees their own creators
- [x] **Platform tags with color-coded badges** — YouTube (red), Twitch (purple), TikTok (off-white), Instagram (pink), Podcast (orange), Substack (orange-red), Other (gray)
- [x] **Inline delete confirmation** — no `window.confirm`; a styled inline prompt appears in place of the action buttons
- [x] **Empty state with CTA** — first-run dashboard prompts you to add your first creator
- [x] **Loading / skeleton states** — shimmer skeleton cards on dashboard fetch, spinner on detail/edit pages
- [x] **404 handling** — friendly not-found page when a creator id is missing or hidden by RLS
- [x] **Fully responsive layout** — 1 / 2 / 3 column grid at mobile / tablet / desktop; navbar collapses email at narrow widths
- [x] **Client-side form validation** — required fields and `http(s)` URL format validation before submitting to Supabase
- [x] **Dark editorial design system** — CSS custom properties for color/spacing/type tokens, Pico CSS as a base, custom overrides for the zine aesthetic

## Tech Stack

- **Frontend**: React 19 + Vite 8 (TypeScript, strict mode + React Compiler)
- **Database & Auth**: Supabase (PostgreSQL + Auth + Row Level Security)
- **Routing**: React Router v7 (declarative mode)
- **Styling**: PicoCSS (base) + custom global stylesheet
- **Fonts**: Fraunces (display) + DM Sans (body) via Google Fonts


## What was built

- **Foundation** — src/types/index.ts, src/lib/supabaseClient.ts, src/lib/platformBadge.ts
- **Design system** — src/index.css (Pico base + dark editorial overrides, electric-lime #c8f135, Fraunces + DM Sans), index.html with Google Fonts preconnect + new title
- **Auth** — ProtectedRoute (three-state session guard, no flash-redirect on hard refresh), Navbar (reactive, hidden on Landing)
- **Pages** — Landing, Login, SignUp (with confirm-password match), ShowCreators (skeleton/empty/grid states), ViewCreator, AddCreator, EditCreator — both forms with http(s) URL validation
- **Card** — CreatorCard — initials placeholder, platform badge, line-clamped description, inline delete confirmation, propagation-safe buttons
- **Routing** — src/App.tsx, src/main.tsx wraps in <BrowserRouter>
- **DB bootstrap** — supabase/schema.sql (table + default auth.uid() safety net + RLS + 4 policies + index)
- **Docs** — README.md replaced with full project doc


## Setup Instructions

1. **Clone & install**
   ```bash
   git clone <your-fork-url> && cd creatorverse
   npm install
   ```

2. **Provision the database**

   Open the [Supabase dashboard](https://supabase.com/dashboard) for your project → **SQL Editor** → **New query** → paste the contents of [supabase/schema.sql](supabase/schema.sql) → **Run**. This creates the `creators` table, enables RLS, and installs four policies (select / insert / update / delete) all keyed on `auth.uid() = user_id`.

   Verify in **Table Editor** that the `creators` table shows a lock icon (RLS enabled) and lists the four policies.

3. **Enable email auth**

   In the Supabase dashboard: **Authentication → Providers → Email** → ensure it's enabled. For local development you may want to **disable "Confirm email"** so signup → login is one step; for production, leave it on.

4. **Configure env**

   Create `.env.local` at the project root:
   ```
   VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```
   Both values come from **Project Settings → API** in the Supabase dashboard.

5. **Run**
   ```bash
   npm run dev
   ```
   Open <http://localhost:5173>. You should see the Landing page.

## Database Schema

The full SQL is in [supabase/schema.sql](supabase/schema.sql). Summary:

```sql
create table public.creators (
  id          bigint generated always as identity primary key,
  user_id     uuid not null default auth.uid()
              references auth.users(id) on delete cascade,
  name        text not null,
  url         text not null,
  description text not null,
  image_url   text,
  platform    text,
  created_at  timestamptz not null default now()
);

alter table public.creators enable row level security;

-- Four policies, all gated on auth.uid() = user_id:
-- select / insert / update / delete
```

Notes:

- `user_id` defaults to `auth.uid()` server-side as a safety net. The client also sets it explicitly on insert; RLS rejects any attempt to write a row with a `user_id` that doesn't match the authenticated user.
- An index on `(user_id)` keeps dashboard reads fast.

## Project Structure

```
creatorverse/
├── public/                       # static assets (favicon)
├── src/
│   ├── components/
│   │   ├── Navbar.tsx            # reactive nav, hidden on Landing
│   │   ├── CreatorCard.tsx       # editorial-style card with inline delete
│   │   └── ProtectedRoute.tsx    # three-state session guard
│   ├── pages/
│   │   ├── Landing.tsx           # public marketing page
│   │   ├── Login.tsx
│   │   ├── SignUp.tsx
│   │   ├── ShowCreators.tsx      # dashboard
│   │   ├── ViewCreator.tsx
│   │   ├── AddCreator.tsx
│   │   └── EditCreator.tsx
│   ├── lib/
│   │   └── supabaseClient.ts
│   ├── types/
│   │   └── index.ts              # Creator + CreatorFormData + Platform
│   ├── App.tsx                   # route table
│   ├── main.tsx                  # BrowserRouter mount
│   └── index.css                 # design system
├── supabase/
│   └── schema.sql
├── .env.local                    # not committed
├── index.html
├── package.json
└── vite.config.ts
```

## Scripts

- `npm run dev` — start the Vite dev server (with hot reload)
- `npm run build` — TypeScript build + production bundle
- `npm run lint` — ESLint with TypeScript rules
- `npm run preview` — serve the production build locally

## Video Walkthrough

_To be filled in._

## License

MIT
