import type { SupportedLanguage } from "@stability/types";

import type { TranslationKey } from "./locales/en/common";

const languageLabelKeys = {
  en: "common.english",
  he: "common.hebrew",
  ar: "common.arabic",
} as const satisfies Record<SupportedLanguage, TranslationKey>;

export function getLanguageLabelKey(
  language: SupportedLanguage,
): TranslationKey {
  return languageLabelKeys[language];
}
