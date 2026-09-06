import {
  resolveSupportedLanguage,
  translate,
  type SupportedLanguage,
  type TranslationKey,
} from "@stability/i18n";
import { getLocales } from "expo-localization";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

interface LanguageContextValue {
  readonly language: SupportedLanguage;
  readonly setLanguage: (language: SupportedLanguage) => void;
  readonly t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): SupportedLanguage {
  return resolveSupportedLanguage(getLocales()[0]?.languageCode);
}

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] =
    useState<SupportedLanguage>(getInitialLanguage);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key) => translate(language, key),
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider.");
  }

  return context;
}
