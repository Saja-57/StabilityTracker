export { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "./config";
export { getDirection, type TextDirection } from "./direction";
export { getFontFamilyForLanguage, type LanguageFontFamily } from "./font";
export { getLanguageLabelKey } from "./language-labels";
export { isSupportedLanguage, resolveSupportedLanguage } from "./language";
export type { TranslationKey, TranslationResource } from "./locales/en/common";
export { translate, translationResources } from "./resources";
export type { SupportedLanguage } from "@stability/types";
