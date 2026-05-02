# CodeFolio

A multi-tenant developer-portfolio SaaS. Developers sign up with Clerk, fill in
their profile / projects / skills via a dashboard with live preview, choose a
template (Neon Dark or Minimal Light), and get a public portfolio at
`/<username>`.

## Stack

- **Monorepo:** pnpm workspace
- **Frontend:** React + Vite + Tailwind + shadcn/ui + Framer Motion (artifact: `codefolio`)
- **Backend:** Express 5 + Clerk (`@clerk/express`) + Drizzle ORM (artifact: `api-server`)
- **Database:** Replit Postgres (Drizzle migrations via `pnpm --filter @workspace/db push`)
- **Auth:** Clerk (`VITE_CLERK_PUBLISHABLE_KEY` on frontend, JWT verified by per-route `clerkMiddleware` on backend)
- **Routing:** Wouter on the frontend; routes:
  - `/` — Landing page
  - `/sign-in`, `/sign-up` — Clerk auth flows
  - `/onboard` — claim a username after first sign-in
  - `/dashboard` — overview stats + quick actions
  - `/dashboard/profile` — edit name, bio, links, template, avatar, resume
  - `/dashboard/projects` — CRUD projects
  - `/dashboard/skills` — CRUD skill groups
  - `/dashboard/preview` — iframe live preview
  - `/:username` — public portfolio (last route, falls back to 404)
- **API contract:** OpenAPI 3 spec at `lib/api-spec/openapi.yaml`. Runs through orval to produce:
  - `lib/api-zod` (zod schemas for backend validation)
  - `lib/api-client-react` (typed react-query hooks + custom-fetch with auth token getter)

## Repo layout

```
artifacts/
  api-server/
    src/
      app.ts             Express app (cors, json, clerk proxy — no global clerkMiddleware)
      index.ts           Boots HTTP server on $PORT
      seed.ts            Seeds demo profile (aditya)
      routes/
        index.ts         Mounts public routes first, then clerkMiddleware(), then protected routes
        health.ts        GET /health
        users.ts         GET /api/users/:username, GET /api/showcase, GET /api/usernames/:username/availability
        contact.ts       POST /api/contact
        templates.ts     GET /api/templates
        me.ts            GET/POST/PUT /api/me, GET /api/me/stats (requireAuth)
        projects.ts      CRUD /api/projects (requireAuth)
        skills.ts        CRUD /api/skills (requireAuth)
      middlewares/
        requireAuth.ts   Reads Clerk session via getAuth(req), sets req.clerkUserId
        clerkProxyMiddleware.ts  Proxies Clerk FAPI in production
      lib/
        users.ts         findUserByClerkId helper
        templates.ts     Template definitions (neon, minimal)

  codefolio/
    src/
      App.tsx            ClerkProvider + QueryClientProvider + Wouter router + RequireAuth guard
      pages/
        Landing.tsx
        Onboard.tsx
        Dashboard.tsx         Overview with stats + quick actions
        DashboardProfile.tsx  Profile form with template picker
        DashboardProjects.tsx CRUD with dialog
        DashboardSkills.tsx   CRUD with dialog
        DashboardPreview.tsx  Iframe live preview
        PublicPortfolio.tsx   Loads profile data, picks template component
        not-found.tsx
      components/
        layout/DashboardLayout.tsx  Sidebar + mobile header
        templates/
          NeonTemplate.tsx    Dark glassmorphic cyan/violet + contact form
          MinimalTemplate.tsx Clean light serif editorial + contact form
        ui/                   shadcn/ui primitives
      lib/
        api.ts             setupAuthInterceptor → setAuthTokenGetter
      hooks/
        use-mobile.tsx
        use-toast.ts

lib/
  api-spec/            openapi.yaml (source of truth)
  api-zod/             generated zod schemas
  api-client-react/    generated react-query hooks + custom-fetch (setAuthTokenGetter)
  db/                  drizzle schema (users, projects, skills, contactMessages)
```

## Database schema

- `users` — clerkUserId (unique), username (unique), name, email, bio, headline,
  location, avatarUrl, resumeUrl, templateId, socialLinks (jsonb), isPro, timestamps.
- `projects` — userId FK, title, description, techStack[], githubLink, liveLink, imageUrl, position.
- `skills` — userId FK, category, items[], position.
- `contactMessages` — recipientId FK, senderName, senderEmail, message, createdAt.

## Templates

Two built-in templates registered in `PublicPortfolio.tsx`:

- `neon` — Dark glassmorphic, cyan/violet gradient, animated via Framer Motion
- `minimal` — Clean light serif, editorial, subtle hover states

Both templates include a full contact form that posts to `POST /api/contact`.

## Demo data

Run `pnpm --filter @workspace/api-server run seed` to (re)seed Aditya as a
public demo profile (`/aditya`, Neon template, Pro badge, 3 sample projects,
4 skill groups). Safe to re-run.

## Auth flow

1. User signs up via `/sign-up` (Clerk UI).
2. After sign-in, frontend calls `GET /api/me`. If `needsOnboarding=true`, redirected to `/onboard`.
3. `POST /api/me/onboard` creates the row in `users` table linked to `clerkUserId`.
4. Dashboard requests carry the Clerk Bearer token; `requireAuth` middleware resolves `clerkUserId`.

## Important: Route auth split

Public routes (`/api/users/:username`, `/api/contact`, `/api/templates`, `/api/showcase`)
are mounted **before** `clerkMiddleware()` in `routes/index.ts`. Protected routes are mounted
after. This allows public portfolio pages to work without Clerk keys configured.

## Reserved usernames

`sign-in`, `sign-up`, `dashboard`, `onboard`, `api`, `admin`, `404`,
`settings`, `logout`, `login`, `signup`, `register`.

## Workflows

- `artifacts/api-server: API Server` — `pnpm --filter @workspace/api-server run dev`
- `artifacts/codefolio: web` — `pnpm --filter @workspace/codefolio run dev`

## Environment / Secrets

- `DATABASE_URL` — Replit Postgres (auto-set)
- `CLERK_SECRET_KEY` — Clerk backend secret
- `CLERK_PUBLISHABLE_KEY` — Clerk backend (proxy)
- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk frontend publishable key

## Conventions

- All API requests from the frontend go through generated react-query hooks
  from `@workspace/api-client-react`.
- Cache invalidation on mutation: invalidate the related `getXxxQueryKey()`.
- Contact form submissions stored in `contactMessages`; no email delivery yet.
- The contact endpoint never exposes the recipient's email address.
