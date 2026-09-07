# Brand Assets (Platform-Derived Artifacts)

> **DO NOT EDIT, RENAME, OR REPLACE FILES IN THIS DIRECTORY DIRECTLY.**

The canonical single source of truth for all approved Stability Tracker brand assets is:
`assets/brand/` (at the repository root).

The files in this directory are automated platform-specific derived copies required by:

- Next.js static browser asset serving (`/brand/app-icon.png`, web manifest, favicons)
- Expo Metro bundler and mobile export asset packaging

To verify or synchronize these assets with the canonical source of truth, run:
`pnpm sync:brand`
