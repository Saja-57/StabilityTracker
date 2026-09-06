import assert from "node:assert/strict";

import {
  getDirection,
  getFontFamilyForLanguage,
  SUPPORTED_LANGUAGES,
  translate,
  translationResources,
  type SupportedLanguage,
} from "../packages/i18n/src/index";
import { getMobileFontFamily } from "../apps/parent-mobile/src/theme/typography";

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

for (const language of SUPPORTED_LANGUAGES) {
  assert.equal(getDirection(language), expectedDirections[language]);
  assert.equal(getFontFamilyForLanguage(language), expectedFonts[language]);
  assert.equal(getMobileFontFamily(language), expectedMobileFonts[language]);
  assert.ok(translate(language, "bootstrap.ready").length > 0);
  assert.deepEqual(
    Object.keys(translationResources[language]),
    Object.keys(translationResources.en),
  );
}

console.log("Foundation localization invariants verified.");
