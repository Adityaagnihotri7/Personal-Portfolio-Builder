# CodeFolio

A multi-tenant developer-portfolio CMS. Developers sign up with Clerk, fill in
their profile / projects / skills via a dashboard with live preview, choose a
template (Neon Dark or Minimal Light), and get a public portfolio at
`/<username>`.

## Stack

- **Monorepo:** pnpm workspace
- **Frontend:** React + Vite + Tailwind + shadcn/ui + Framer Motion (artifact: `portfolio`)
- **Backend:** Express + Clerk (`@clerk/express`) + Drizzle ORM (artifact: `api-server`)
- **Database:** Replit Postgres (Drizzle migrations via `pnpm --filter @workspace/db push`)
- **Auth:** Clerk (whitelabel via `@clerk/react` on the frontend, JWT verified by `clerkMiddleware` on the backend, session cookies proxied for `/clerk/*`)
- **Routing:** Wouter on the frontend; routes:
  - `/` — Landing page with templates + showcase
  - `/sign-in/*?`, `/sign-up/*?` — Clerk hosted-style flows
  - `/onboard` — claim a username after first sign-in
  - `/dashboard/:tab?` — Profile / Projects / Skills / Template tabs
  - `/:username` — public portfolio (last route, falls back to 404)
- **API contract:** OpenAPI 3 spec at `lib/api-spec/openapi.yaml`. Runs through orval to produce:
  - `lib/api-zod` (zod schemas for backend validation)
  - `lib/api-client-react` (typed react-query hooks for the frontend)

## Repo layout

```
artifacts/
  api-server/          Express backend
    src/
      app.ts           Express app + Clerk proxy + middleware
      index.ts         Boots HTTP server
      seed.ts          Seeds demo profile (aditya)
      routes/          auth, me, projects, skills, templates, contact, users
      middlewares/     requireAuth (Clerk-aware)
      lib/             users helpers, templates list
  portfolio/           React + Vite SPA
    src/
      App.tsx          ClerkProvider + Wouter router
      pages/           Landing, Onboard, Dashboard, Portfolio, not-found
      templates/       NeonTemplate, MinimalTemplate, index registry
      lib/             api (re-exports orval hooks), portfolioTypes,
                       queryClient, clerkAppearance
      components/ui    shadcn/ui primitives
  mockup-sandbox/      (untouched scaffold)

lib/
  api-spec/            openapi.yaml (source of truth)
  api-zod/             generated zod schemas
  api-client-react/    generated react-query hooks
  db/                  drizzle schema (users, projects, skills, contactMessages)
```

## Database schema

- `users` — clerkUserId (unique), username (unique), name, email, bio, headline,
  location, avatarUrl, resumeUrl, templateId, socialLinks (jsonb), isPro,
  customDomain, timestamps.
- `projects` — userId FK, title, description, techStack[], githubLink,
  liveLink, imageUrl, position.
- `skills` — userId FK, category, items[], position.
- `contactMessages` — recipientId FK, senderName, senderEmail, message, createdAt.

## Templates

`artifacts/portfolio/src/templates/index.ts` registers each template with id,
name, description, preview swatch, accent color, and React component. Adding a
new template: add the file under `src/templates`, then register it.

Currently registered:

- `neon` — Neon Dark glassmorphic theme (cyan + violet)
- `minimal` — Minimal Light editorial theme (serif accents)

## Demo data

Run `pnpm --filter @workspace/api-server run seed` to (re)seed Aditya as a
public demo profile (`/aditya`, Neon Dark template, Pro badge, 3 sample
projects, 4 skill groups). Safe to re-run.

## Auth flow

1. User signs up via `/sign-up` (Clerk hosted UI, dark themed).
2. After sign-in, frontend calls `GET /api/me`. If `needsOnboarding=true`, user
   is redirected to `/onboard` to claim a username.
3. `POST /api/me/onboard` creates the row in our `users` table linked to
   `clerkUserId` from the validated session.
4. Subsequent dashboard requests carry the Clerk session cookie + JWT; backend
   uses `getAuth(req)` to resolve the Clerk user and look up our row by
   `clerk_user_id`.

## Reserved usernames

`sign-in`, `sign-up`, `dashboard`, `onboard`, `api`, `admin`, `404`,
`settings`, `logout`, `login`, `signup`, `register` (enforced in
`api-server/src/lib/users.ts`).

## Workflows

- `artifacts/api-server: API Server` — `pnpm --filter @workspace/api-server run dev`
- `artifacts/portfolio: web` — `pnpm --filter @workspace/portfolio run dev`
- `artifacts/mockup-sandbox: Component Preview Server` — unused (scaffold)

## Environment / Secrets

- `DATABASE_URL` — Replit Postgres
- `CLERK_SECRET_KEY` — Clerk backend
- `CLERK_PUBLISHABLE_KEY` — also used by backend proxy
- `VITE_CLERK_PUBLISHABLE_KEY` — exposed to the frontend
- `SESSION_SECRET` — legacy (not used after the Clerk migration)

## Conventions

- All API requests from the frontend go through generated react-query hooks
  exported from `@/lib/api`.
- Cache invalidation on mutation: invalidate the related `getXxxQueryKey()`
  plus `getGetMyStatsQueryKey()` and the affected user's
  `getGetPublicProfileQueryKey(username)`.
- Public portfolio data is denormalized in a single `GET /api/u/:username`
  call that returns `{ user, projects, skills }`.
- Contact form submissions are stored in `contactMessages` only (no email is
  sent yet — Resend integration is a planned follow-up).
- The contact endpoint never exposes the recipient's email address.

## Outstanding

- Email delivery for contact form via Resend (proposed integration).
