import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";

import { colors, typography } from "../packages/design-tokens/src/index";
import {
  DEFAULT_LANGUAGE,
  getDirection,
  getFontFamilyForLanguage,
  SUPPORTED_LANGUAGES,
  translate,
  translationResources,
  type SupportedLanguage,
  type TranslationKey,
} from "../packages/i18n/src/index";
import { getMobileFontFamily } from "../apps/parent-mobile/src/theme/typography";
import {
  CANONICAL_BRAND_DIR,
  EXPECTED_BRAND_ASSETS,
  TARGET_BRAND_DIRS,
} from "./sync-brand-assets";

const expectedDirections = {
  en: "ltr",
  he: "rtl",
  ar: "rtl",
} as const satisfies Record<SupportedLanguage, "ltr" | "rtl">;

const expectedFonts = {
  en: "Ubuntu",
  he: "Heebo",
  ar: "Cairo",
} as const satisfies Record<SupportedLanguage, string>;

const expectedMobileFonts = {
  en: "Ubuntu_400Regular",
  he: "Heebo_400Regular",
  ar: "Cairo_400Regular",
} as const satisfies Record<SupportedLanguage, string>;

const expectedMobileBoldFonts = {
  en: "Ubuntu_700Bold",
  he: "Heebo_700Bold",
  ar: "Cairo_700Bold",
} as const satisfies Record<SupportedLanguage, string>;

const expectedColorGroups = [
  "background",
  "surface",
  "text",
  "border",
  "brand",
  "status",
  "statusSurface",
  "focus",
  "overlay",
] as const;

const expectedTypographyVariants = [
  "display",
  "pageTitle",
  "sectionTitle",
  "cardTitle",
  "body",
  "bodyStrong",
  "label",
  "caption",
  "helper",
  "button",
] as const;

const expectedShellTranslationKeys = [
  "navigation.home",
  "navigation.routine",
  "navigation.log",
  "navigation.messages",
  "navigation.more",
  "navigation.dashboard",
  "navigation.children",
  "navigation.appointments",
  "navigation.reports",
  "navigation.insights",
  "navigation.notes",
  "navigation.settings",
  "navigation.resources",
  "navigation.askAI",
  "navigation.surveys",
  "navigation.family",
  "navigation.profile",
  "shell.primaryNavigation",
  "shell.secondaryNavigation",
  "shell.openNavigation",
  "shell.navigationDescription",
  "shell.route.description",
  "shell.more.description",
] as const satisfies readonly TranslationKey[];

const expectedBrandTranslationKeys = [
  "app.name",
  "brand.logo",
  "brand.tagline",
  "brand.title",
  "brand.description",
] as const satisfies readonly TranslationKey[];

const expectedParentHomeTranslationKeys = [
  "home.title",
  "home.welcome",
  "home.context.title",
  "home.context.emptyTitle",
  "home.context.emptyDescription",
  "home.todayProgress.title",
  "home.todayProgress.accessibility",
  "home.todayProgress.unavailable",
  "home.todayProgress.emptyDescription",
  "home.needHelp.title",
  "home.needHelp.description",
  "home.needHelp.action",
  "home.nextActivity.title",
  "home.nextActivity.emptyTitle",
  "home.nextActivity.emptyDescription",
  "home.caregiverSurvey.title",
  "home.caregiverSurvey.emptyTitle",
  "home.caregiverSurvey.emptyDescription",
  "home.caregiverSurvey.action",
  "home.quickActions.title",
  "home.actions.routine",
  "home.actions.log",
  "home.actions.askAI",
  "home.actions.resources",
] as const satisfies readonly TranslationKey[];

const expectedParentRoutineTranslationKeys = [
  "routine.title",
  "routine.context.title",
  "routine.context.unavailable",
  "routine.context.description",
  "routine.progress.title",
  "routine.progress.accessibility",
  "routine.progress.unavailable",
  "routine.progress.description",
  "routine.progress.completed",
  "routine.progress.total",
  "routine.steps",
  "routine.step",
  "routine.empty.title",
  "routine.empty.description",
  "routine.loading",
  "routine.error.title",
  "routine.error.description",
  "routine.retry",
  "routine.status.upcoming",
  "routine.status.current",
  "routine.status.completed",
  "routine.status.skipped",
  "routine.status.delayed",
  "routine.actions.complete",
  "routine.actions.undo",
  "routine.scheduledAt",
  "routine.completedBy",
  "routine.completedAt",
] as const satisfies readonly TranslationKey[];

const expectedParentRoutineFiles = [
  "apps/parent-mobile/src/features/routine/routine-screen.tsx",
  "apps/parent-mobile/src/features/routine/types.ts",
  "apps/parent-mobile/src/features/routine/components/routine-context-card.tsx",
  "apps/parent-mobile/src/features/routine/components/routine-feedback-states.tsx",
  "apps/parent-mobile/src/features/routine/components/routine-header.tsx",
  "apps/parent-mobile/src/features/routine/components/routine-progress-card.tsx",
  "apps/parent-mobile/src/features/routine/components/routine-timeline.tsx",
  "apps/parent-mobile/src/features/routine/components/routine-step.tsx",
  "apps/parent-mobile/src/features/routine/components/routine-step-status.tsx",
  "apps/parent-mobile/src/features/routine/components/routine-completion-meta.tsx",
] as const;

const expectedRouteFiles = [
  "apps/parent-mobile/app/(tabs)/index.tsx",
  "apps/parent-mobile/app/(tabs)/routine.tsx",
  "apps/parent-mobile/app/(tabs)/log.tsx",
  "apps/parent-mobile/app/(tabs)/messages.tsx",
  "apps/parent-mobile/app/(tabs)/more.tsx",
  "apps/parent-mobile/app/ai/index.tsx",
  "apps/parent-mobile/app/resources/index.tsx",
  "apps/parent-mobile/app/surveys/index.tsx",
  "apps/parent-mobile/app/appointments/index.tsx",
  "apps/parent-mobile/app/family/index.tsx",
  "apps/parent-mobile/app/profile/index.tsx",
  "apps/parent-mobile/app/internal/design-system.tsx",
  "apps/therapist-web/app/(dashboard)/dashboard/page.tsx",
  "apps/therapist-web/app/(dashboard)/children/page.tsx",
  "apps/therapist-web/app/(dashboard)/children/[childId]/page.tsx",
  "apps/therapist-web/app/(dashboard)/appointments/page.tsx",
  "apps/therapist-web/app/(dashboard)/messages/page.tsx",
  "apps/therapist-web/app/(dashboard)/insights/page.tsx",
  "apps/therapist-web/app/(dashboard)/notes/page.tsx",
  "apps/therapist-web/app/(dashboard)/reports/page.tsx",
  "apps/therapist-web/app/(dashboard)/settings/page.tsx",
  "apps/therapist-web/app/internal/design-system/page.tsx",
] as const;

assert.equal(DEFAULT_LANGUAGE, "en");

for (const language of SUPPORTED_LANGUAGES) {
  assert.equal(getDirection(language), expectedDirections[language]);
  assert.equal(getFontFamilyForLanguage(language), expectedFonts[language]);
  assert.equal(getMobileFontFamily(language), expectedMobileFonts[language]);
  assert.equal(
    getMobileFontFamily(language, "bold"),
    expectedMobileBoldFonts[language],
  );
  assert.ok(translate(language, "bootstrap.ready").length > 0);
  assert.ok(translate(language, "preview.title").length > 0);
  for (const key of expectedShellTranslationKeys) {
    assert.ok(translate(language, key).length > 0);
  }
  for (const key of expectedBrandTranslationKeys) {
    assert.ok(translate(language, key).length > 0);
  }
  for (const key of expectedParentHomeTranslationKeys) {
    assert.ok(translate(language, key).length > 0);
  }
  for (const key of expectedParentRoutineTranslationKeys) {
    assert.ok(translate(language, key).length > 0);
  }
  assert.deepEqual(
    Object.keys(translationResources[language]),
    Object.keys(translationResources.en),
  );
}

// Brand asset verification
assert.ok(
  existsSync(CANONICAL_BRAND_DIR),
  "Canonical brand directory must exist.",
);
const canonicalFiles = readdirSync(CANONICAL_BRAND_DIR).filter(
  (entry) => !entry.startsWith("."),
);
assert.deepEqual(
  canonicalFiles.sort(),
  [...EXPECTED_BRAND_ASSETS].sort(),
  "Canonical brand directory must contain exactly the approved brand assets.",
);

for (const asset of EXPECTED_BRAND_ASSETS) {
  const canonicalPath = join(CANONICAL_BRAND_DIR, asset);
  const canonicalContent = readFileSync(canonicalPath);
  assert.ok(
    canonicalContent.length > 0,
    `Canonical asset ${asset} must not be empty.`,
  );

  for (const targetDir of TARGET_BRAND_DIRS) {
    const derivedPath = join(targetDir, asset);
    assert.ok(
      existsSync(derivedPath),
      `Derived brand asset ${derivedPath} must exist. Run 'pnpm sync:brand' to synchronize.`,
    );
    const derivedContent = readFileSync(derivedPath);
    assert.ok(
      canonicalContent.equals(derivedContent),
      `Derived brand asset ${derivedPath} must match canonical asset byte-for-byte. Run 'pnpm sync:brand' to synchronize.`,
    );
  }
}

for (const targetDir of TARGET_BRAND_DIRS) {
  const noticePath = join(targetDir, "README.md");
  assert.ok(
    existsSync(noticePath),
    `${noticePath} must exist to document derived platform assets.`,
  );
}

// Expo brand configuration verification
const mobileAppJson = JSON.parse(
  readFileSync("apps/parent-mobile/app.json", "utf8"),
) as {
  expo: {
    icon: string;
    name: string;
    slug: string;
  };
};

assert.equal(
  mobileAppJson.expo.name,
  "Stability Tracker",
  "Mobile app name must match approved brand name.",
);
assert.equal(
  mobileAppJson.expo.slug,
  "stability-tracker",
  "Mobile app slug must match approved brand slug.",
);
assert.equal(
  mobileAppJson.expo.icon,
  "./assets/brand/app-icon.png",
  "Mobile app icon must point to approved brand app-icon.",
);

assert.deepEqual(Object.keys(colors), [...expectedColorGroups]);
assert.deepEqual(Object.keys(colors.background), [
  "canvas",
  "subtle",
  "elevated",
]);
assert.deepEqual(Object.keys(colors.surface), [
  "primary",
  "secondary",
  "interactive",
]);
assert.deepEqual(Object.keys(colors.text), [
  "primary",
  "secondary",
  "muted",
  "inverse",
]);
assert.deepEqual(Object.keys(colors.border), ["subtle", "default", "strong"]);
assert.deepEqual(Object.keys(colors.brand), [
  "primary",
  "primaryHover",
  "primaryPressed",
  "secondary",
  "subtle",
]);
assert.deepEqual(Object.keys(colors.status), [
  "success",
  "warning",
  "danger",
  "info",
]);
assert.deepEqual(Object.keys(typography), [...expectedTypographyVariants]);

for (const path of expectedRouteFiles) {
  assert.ok(existsSync(path), `${path} is required by the application shells.`);
}

for (const path of expectedParentRoutineFiles) {
  assert.ok(existsSync(path), `${path} is required by the Routine UI.`);
}

const sourceExtensions = new Set([".css", ".js", ".mjs", ".ts", ".tsx"]);
const applicationRoots = ["apps/parent-mobile", "apps/therapist-web"];
const ignoredDirectories = new Set([".expo", ".next", "dist", "node_modules"]);
const prohibitedFontPattern = /\b(?:Inter|Roboto|Poppins)\b/u;
const rawColorPattern = /#[\dA-Fa-f]{3,8}\b|\brgba?\s*\(/u;
const emojiPattern = /\p{Extended_Pictographic}/u;
const physicalDirectionPattern =
  /\b(?:left|right|marginLeft|marginRight|paddingLeft|paddingRight)\s*:/u;

function getSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return ignoredDirectories.has(entry.name) ? [] : getSourceFiles(path);
    }

    return sourceExtensions.has(extname(entry.name)) ? [path] : [];
  });
}

for (const path of applicationRoots.flatMap(getSourceFiles)) {
  const source = readFileSync(path, "utf8");
  assert.doesNotMatch(
    source,
    prohibitedFontPattern,
    `${path} uses a prohibited font.`,
  );
  assert.doesNotMatch(
    source,
    rawColorPattern,
    `${path} contains an application color literal.`,
  );
  assert.doesNotMatch(source, emojiPattern, `${path} contains an emoji.`);
}

for (const path of expectedParentRoutineFiles) {
  const source = readFileSync(path, "utf8");
  assert.doesNotMatch(
    source,
    physicalDirectionPattern,
    `${path} contains a physical-direction style that can break RTL.`,
  );
}

console.log(
  "Application-shell routes, localization, typography, palette, and source invariants verified.",
);
