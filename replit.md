# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Hosts the **CodeFolio** SaaS — a multi-user developer-portfolio builder where any user can sign up, fill in their data, pick a template, and publish a portfolio at `/:username`.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec) — used by some artifacts
- **Build**: esbuild (CJS bundle)
- **Frontend (portfolio artifact)**: React + Vite + Tailwind v4 + wouter + framer-motion + next-themes
- **Auth**: JWT (HS256) stored in `localStorage` as `codefolio_token`
- **Email**: Nodemailer via Gmail SMTP (needs `GMAIL_USER` + `GMAIL_APP_PASSWORD` secrets)

## Artifacts

- `artifacts/api-server` (`/api`) — Express JSON API. Routes:
  - `POST /api/auth/register | login`, `GET /api/auth/me`
  - `GET /api/user/:username` (public)
  - `PUT /api/user/update` (auth)
  - `GET|POST /api/projects`, `PUT|DELETE /api/projects/:id` (auth)
  - `GET|POST /api/skills`, `PUT|DELETE /api/skills/:id` (auth)
  - `POST /api/contact` — looks up `username`, emails that user via Gmail SMTP
- `artifacts/portfolio` (`/`) — React SPA. Routes (wouter):
  - `/` Landing (CodeFolio marketing)
  - `/login`, `/signup`
  - `/dashboard` (auth-gated CMS with live `<iframe>` preview, tabs: profile/projects/skills/template)
  - `/:username` Public portfolio — picks a template based on `user.templateId`
- `artifacts/mockup-sandbox` — design preview server (unused by SaaS)

## Database

`lib/db/src/schema/` — Drizzle tables:
- `users` (uuid pk, email unique, username unique, passwordHash, name, bio, role, location, avatarUrl, resumeUrl, templateId, socialLinks jsonb, isPro)
- `projects` (uuid pk, userId fk → users.id cascade, title, subtitle, description, techStack text[], githubLink, liveLink, image, sortOrder)
- `skills` (uuid pk, userId fk → users.id cascade, category, items text[], sortOrder)

Seed: `scripts/seed.mjs` (run with `pnpm exec tsx ./seed.mjs` from `scripts/`) creates Aditya as the example user (`username=aditya`, password `changeme123`, `templateId=neon`, `isPro=true`, 4 projects, 5 skill groups).

## Templates

`artifacts/portfolio/src/templates/`:
- `NeonTemplate.tsx` — dark glassmorphism, gradients, scroll progress, animated reveals
- `MinimalTemplate.tsx` — light, clean, typographic
- `index.ts` exports `pickTemplate(id)` and `templateOptions`

Add a new template by creating the component, adding it to `templateMap`, and listing it in `templateOptions`.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/portfolio run dev` — run portfolio frontend
- `cd scripts && pnpm exec tsx ./seed.mjs` — re-seed Aditya

## Secrets

- `JWT_SECRET` — set automatically (random 48-byte base64url) for signing auth tokens
- `GMAIL_USER`, `GMAIL_APP_PASSWORD` — required for the contact form to actually send mail. Without them, `/api/contact` returns 503.

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
