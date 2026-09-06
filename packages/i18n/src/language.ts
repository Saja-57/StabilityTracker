import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "@stability/config";
import type { SupportedLanguage } from "@stability/types";

export function isSupportedLanguage(
  language: string,
): language is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(language);
}

export function resolveSupportedLanguage(
  language: string | null | undefined,
): SupportedLanguage {
  if (!language) {
    return DEFAULT_LANGUAGE;
  }

  const baseLanguage = language.toLowerCase().split("-")[0];
  return baseLanguage && isSupportedLanguage(baseLanguage)
    ? baseLanguage
    : DEFAULT_LANGUAGE;
}
