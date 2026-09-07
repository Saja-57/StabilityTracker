# Project foundation

This repository is the technical foundation for Stability Tracker, a multilingual care platform with a parent/caregiver mobile application and a therapist web application.

The repository currently contains application shells, shared infrastructure, and platform-specific UI foundations. Application entry points render navigation-only shells with translated route placeholders, not product screens. Internal design-system previews remain available outside normal product navigation. There is no domain data, database schema, seed data, or mocked API response.

## Brand assets

The canonical single source of truth for approved Stability Tracker brand assets is:

```text
assets/brand/
```

This root-level directory contains the approved artwork files:

- `app-icon.png` (1254x1254): Application, OS, and PWA icon contexts.
- `logo-mark.png` (1254x1254): Compact identity contexts, collapsed navigation, and small brand identifiers.
- `logo-horizontal.png` (2066x761): Primary header and navigation identity across web and mobile shells.
- `logo-stacked.png` (1254x1254): Primary large-format identity, authentication, onboarding, and entry contexts.

### Asset hierarchy and usage rules

- **App / OS / PWA**: Use `app-icon.png`.
- **Compact identity**: Use `logo-mark.png`.
- **Header / navigation**: Use `logo-horizontal.png`.
- **Auth / onboarding / large identity**: Use `logo-stacked.png`.

These assets are approved artwork and must not be casually regenerated, redesigned, recolored, stretched, distorted, unnecessarily cropped, reconstructed with CSS/text/Lucide, given arbitrary gradients or shadows, or wrapped in decorative containers. Original aspect ratios must always be preserved.

### Platform-specific derived copies

`assets/brand/` remains the canonical source of truth. Platform-specific copies are derived build artifacts created only when technically required:

- `apps/therapist-web/public/brand/`: Static browser-served assets for `<link rel="icon">`, Web App Manifest (`manifest.webmanifest`), and Next.js Image optimization.
- `apps/parent-mobile/assets/brand/`: Local Metro bundler asset resolution and Expo app icon packaging.

To synchronize derived platform copies with the canonical root assets and ensure byte-for-byte fidelity:

```bash
pnpm sync:brand
```

## Architecture

The workspace uses pnpm workspaces and Turborepo. TypeScript is strict across applications and packages.

```text
apps/
  parent-mobile/    Expo, React Native, Expo Router
  therapist-web/    Next.js App Router, React, Tailwind CSS
packages/
  config/           Stable runtime constants
  design-tokens/    Semantic palette, typography, spacing, shape, and motion
  i18n/             Resources, translation keys, direction, font metadata
  supabase/         Browser, server, and secure mobile client factories
  types/            Foundational shared types
  utils/            Reserved for genuinely shared utilities
  validation/       Shared Zod schemas
supabase/
  functions/        Future Edge Functions
  migrations/       Future database migrations
```

UI components are intentionally platform-specific. Web primitives live in `apps/therapist-web/components/ui`; mobile primitives live in `apps/parent-mobile/src/components/ui`. There is no cross-platform UI package.

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

- `@stability/design-tokens` contains the shared semantic palette, typography hierarchy, spacing, restrained radii and shadows, sizing, motion, and web breakpoint values.
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

## UI foundations

The web foundation owns accessible controls and overlay behavior with Tailwind styling, Lucide icons, and narrowly selected Radix interaction primitives. The mobile foundation owns independent React Native implementations, including language-aware `AppText`, safe and keyboard-aware screen layout, controls, feedback states, and restrained loading treatments.

The parent application uses Expo Router tabs for Home, Routine, Log, Messages, and More. More links to route-only placeholders for Ask AI, Resources, Surveys, Appointments, Family, and Profile. The therapist application uses a responsive dashboard shell with a persistent desktop sidebar, an accessible narrow-screen drawer, and routes for Dashboard, Children, Appointments, Messages, Clinical Insights, Therapist Notes, Reports, and Settings. The child-detail route is structurally prepared without child data.

The preview entry points exist only to validate tokens, component states, language switching, RTL layout, and mixed-language font behavior:

- Parent: `/internal/design-system`
- Therapist: `/internal/design-system`

They are intentionally absent from normal application navigation. Preview labels come from translation resources and preview progress values are component-state demonstrations rather than domain data.

## Product foundation policies

- Do not add mock patients, caregivers, therapists, appointments, routines, incidents, messages, analytics, or generated insights.
- Use loading, empty, and error states once real Supabase-backed features are introduced.
- Do not hardcode visible strings outside translation resources.
- Do not use emoji. Use Lucide icon components when icons are needed.
- Do not expose service-role or other server-only secrets to client applications.
- Do not implement product screens until the technical foundation is approved.
