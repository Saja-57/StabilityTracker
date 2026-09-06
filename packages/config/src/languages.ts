import type { SupportedLanguage } from "@stability/types";

export const SUPPORTED_LANGUAGES = [
  "en",
  "he",
  "ar",
] as const satisfies readonly SupportedLanguage[];

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";
