import type { SupportedLanguage } from "@stability/types";

export type TextDirection = "ltr" | "rtl";

const directions = {
  en: "ltr",
  he: "rtl",
  ar: "rtl",
} as const satisfies Record<SupportedLanguage, TextDirection>;

export function getDirection(language: SupportedLanguage): TextDirection {
  return directions[language];
}
