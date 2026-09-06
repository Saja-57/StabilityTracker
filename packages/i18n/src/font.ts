import type { SupportedLanguage } from "@stability/types";

export type LanguageFontFamily = "Ubuntu" | "Heebo" | "Cairo";

const fontFamilies = {
  en: "Ubuntu",
  he: "Heebo",
  ar: "Cairo",
} as const satisfies Record<SupportedLanguage, LanguageFontFamily>;

export function getFontFamilyForLanguage(
  language: SupportedLanguage,
): LanguageFontFamily {
  return fontFamilies[language];
}
