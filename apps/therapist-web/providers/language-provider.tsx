"use client";

import {
  DEFAULT_LANGUAGE,
  getDirection,
  isSupportedLanguage,
  translate,
  type SupportedLanguage,
  type TextDirection,
  type TranslationKey,
} from "@stability/i18n";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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

const LANGUAGE_STORAGE_KEY = "stability.language";

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] =
    useState<SupportedLanguage>(DEFAULT_LANGUAGE);

  const setLanguage = useCallback((nextLanguage: SupportedLanguage) => {
    document.documentElement.lang = nextLanguage;
    document.documentElement.dir = getDirection(nextLanguage);
    setLanguageState(nextLanguage);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch {
      // Storage can be unavailable (private mode); the choice still applies.
    }
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved && isSupportedLanguage(saved) && saved !== DEFAULT_LANGUAGE) {
        // Apply after hydration so server and first client render agree.
        queueMicrotask(() => setLanguage(saved));
      }
    } catch {
      // Ignore unavailable storage.
    }
  }, [setLanguage]);

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
