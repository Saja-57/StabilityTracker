import type { SupportedLanguage } from "@stability/types";

import { arCommon } from "./locales/ar/common";
import { enCommon } from "./locales/en/common";
import type { TranslationKey, TranslationResource } from "./locales/en/common";
import { heCommon } from "./locales/he/common";

export const translationResources = {
  en: enCommon,
  he: heCommon,
  ar: arCommon,
} as const satisfies Record<SupportedLanguage, TranslationResource>;

export function translate(
  language: SupportedLanguage,
  key: TranslationKey,
): string {
  return translationResources[language][key];
}
