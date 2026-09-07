import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { basename, join, resolve } from "node:path";

export const CANONICAL_BRAND_DIR = resolve(process.cwd(), "assets/brand");
export const EXPECTED_BRAND_ASSETS = [
  "app-icon.png",
  "logo-horizontal.png",
  "logo-mark.png",
  "logo-stacked.png",
] as const;

export const TARGET_BRAND_DIRS = [
  resolve(process.cwd(), "apps/parent-mobile/assets/brand"),
  resolve(process.cwd(), "apps/therapist-web/public/brand"),
] as const;

const DERIVED_NOTICE = `# Brand Assets (Platform-Derived Artifacts)

> **DO NOT EDIT, RENAME, OR REPLACE FILES IN THIS DIRECTORY DIRECTLY.**

The canonical single source of truth for all approved Stability Tracker brand assets is:
\`assets/brand/\` (at the repository root).

The files in this directory are automated platform-specific derived copies required by:
- Next.js static browser asset serving (\`/brand/app-icon.png\`, web manifest, favicons)
- Expo Metro bundler and mobile export asset packaging

To verify or synchronize these assets with the canonical source of truth, run:
\`pnpm sync:brand\`
`;

export function syncBrandAssets(): void {
  if (!existsSync(CANONICAL_BRAND_DIR)) {
    throw new Error(
      `Canonical brand directory not found at: ${CANONICAL_BRAND_DIR}`,
    );
  }

  const existingFiles = new Set(
    readdirSync(CANONICAL_BRAND_DIR).map((file) => basename(file)),
  );
  for (const expected of EXPECTED_BRAND_ASSETS) {
    if (!existingFiles.has(expected)) {
      throw new Error(
        `Missing expected canonical brand asset: ${expected} in ${CANONICAL_BRAND_DIR}`,
      );
    }
  }

  for (const targetDir of TARGET_BRAND_DIRS) {
    mkdirSync(targetDir, { recursive: true });

    for (const assetName of EXPECTED_BRAND_ASSETS) {
      const src = join(CANONICAL_BRAND_DIR, assetName);
      const dest = join(targetDir, assetName);
      copyFileSync(src, dest);
    }

    writeFileSync(join(targetDir, "README.md"), DERIVED_NOTICE, "utf8");
  }

  console.log(
    "Successfully synchronized canonical brand assets to platform directories.",
  );
}

if (process.argv[1]?.endsWith("sync-brand-assets.ts")) {
  syncBrandAssets();
}
