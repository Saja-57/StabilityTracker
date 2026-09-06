# Project foundation

This repository is the technical foundation for a multilingual care platform with a parent/caregiver mobile application and a therapist web application. Product branding is intentionally not established; repository and package identifiers are technical working names only.

The repository currently contains only application shells and shared infrastructure. It does not contain product screens, domain data, database tables, seed data, or mocked API responses.

## Architecture

The workspace uses pnpm workspaces and Turborepo. TypeScript is strict across applications and packages.

```text
apps/
  parent-mobile/    Expo, React Native, Expo Router
  therapist-web/    Next.js App Router, React, Tailwind CSS
packages/
  config/           Stable runtime constants
  design-tokens/    Small semantic token foundation
  i18n/             Resources, translation keys, direction, font metadata
  supabase/         Browser, server, and secure mobile client factories
  types/            Foundational shared types
  utils/            Reserved for genuinely shared utilities
  validation/       Shared Zod schemas
supabase/
  functions/        Future Edge Functions
  migrations/       Future database migrations
```

UI components are intentionally platform-specific. There is no cross-platform UI package.

## Prerequisites

- Node.js 20.9 or newer
- pnpm 10 or newer
- Expo-supported Android or iOS tooling when running a native simulator
- Docker and the Supabase CLI when local Supabase services are introduced

## Install and run

```bash
pnpm install
pnpm dev:web
pnpm dev:mobile
```

The workspace-level development command starts both application development servers:

```bash
pnpm dev
```

Quality and build commands:

```bash
pnpm typecheck
pnpm lint
pnpm verify
pnpm build
```

## Environment

Copy `.env.example` to the relevant local environment file and provide project values. Variables prefixed with `NEXT_PUBLIC_` or `EXPO_PUBLIC_` are public bundle inputs and must never contain secrets.

`SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` are server-only. They must never be imported by browser or mobile modules.

## Shared packages

- `@stability/design-tokens` contains temporary semantic foundation values. Exact palette values will be refined from approved visual references.
- `@stability/i18n` is the source of translation resources, supported language behavior, direction, and language-to-font metadata.
- `@stability/types` contains only foundational language and role types.
- `@stability/validation` contains matching Zod validators without application-form assumptions.
- `@stability/supabase` exposes separate browser, server, and mobile entry points so platform-only dependencies do not leak into the wrong bundle.
- `@stability/config` contains the supported language and role constants.
- `@stability/utils` remains intentionally empty until a genuinely shared utility exists.

## Localization, typography, and direction

English is the default language. English, Hebrew, and Arabic are supported from the foundation. Every visible component string must use a typed translation key; strings are not written directly in components.

Font selection is language-specific:

- English uses Ubuntu.
- Hebrew uses Heebo.
- Arabic uses Cairo.

Mixed-language content must mark each segment with its language so the correct font and direction apply independently.

English is left-to-right. Hebrew and Arabic are right-to-left. Web layout uses document direction and CSS logical properties. Mobile layout uses centralized direction helpers and start/end spacing properties. Do not add physical left/right spacing when a logical property can express the intent.

## Product foundation policies

- Do not add mock patients, caregivers, therapists, appointments, routines, incidents, messages, analytics, or generated insights.
- Use loading, empty, and error states once real Supabase-backed features are introduced.
- Do not hardcode visible strings outside translation resources.
- Do not use emoji. Use Lucide icon components when icons are needed.
- Do not expose service-role or other server-only secrets to client applications.
- Do not implement product screens until the technical foundation is approved.
