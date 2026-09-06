export const enCommon = {
  "app.name": "Care application",
  "bootstrap.ready": "Technical foundation ready",
  "common.language": "Language",
  "common.english": "English",
  "common.hebrew": "Hebrew",
  "common.arabic": "Arabic",
  "common.loading": "Loading",
  "common.retry": "Retry",
} as const;

export type TranslationKey = keyof typeof enCommon;
export type TranslationResource = Record<TranslationKey, string>;
