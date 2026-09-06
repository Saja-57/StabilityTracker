"use client";

import {
  DEFAULT_LANGUAGE,
  getDirection,
  translate,
  type SupportedLanguage,
  type TextDirection,
  type TranslationKey,
} from "@stability/i18n";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

interface LanguageContextValue {
  readonly language: SupportedLanguage;
  readonly direction: TextDirection;
  readonly setLanguage: (language: SupportedLanguage) => void;
  readonly t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] =
    useState<SupportedLanguage>(DEFAULT_LANGUAGE);

  const setLanguage = useCallback((nextLanguage: SupportedLanguage) => {
    document.documentElement.lang = nextLanguage;
    document.documentElement.dir = getDirection(nextLanguage);
    setLanguageState(nextLanguage);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      direction: getDirection(language),
      setLanguage,
      t: (key) => translate(language, key),
    }),
    [language, setLanguage],
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
