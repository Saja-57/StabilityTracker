import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  translate,
  type SupportedLanguage,
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
import { Platform } from "react-native";

import { deviceStore } from "@/lib/storage";

const languageKey = "language";

/** On web, `?lang=he` opens the app in that language (useful for review links). */
function requestedLanguage(): SupportedLanguage | null {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    const requested = new URLSearchParams(window.location.search).get("lang");
    if (requested && isSupportedLanguage(requested)) return requested;
  }
  return null;
}

interface LanguageContextValue {
  readonly language: SupportedLanguage;
  readonly setLanguage: (language: SupportedLanguage) => void;
  readonly t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: PropsWithChildren) {
  const [requested] = useState(requestedLanguage);
  const [language, setLanguageState] = useState<SupportedLanguage | null>(
    requested,
  );

  // A review link wins; otherwise the last language chosen on this device.
  useEffect(() => {
    if (requested) return;
    void deviceStore.read<string>(languageKey).then((saved) =>
      setLanguageState((current) =>
        current ?? (saved && isSupportedLanguage(saved) ? saved : DEFAULT_LANGUAGE),
      ),
    );
  }, [requested]);

  const setLanguage = useCallback((next: SupportedLanguage) => {
    setLanguageState(next);
    void deviceStore.write(languageKey, next);
  }, []);

  const value = useMemo<LanguageContextValue | null>(
    () =>
      language && {
        language,
        setLanguage,
        t: (key) => translate(language, key),
      },
    [language, setLanguage],
  );

  // Wait for the saved choice so Arabic or Hebrew never flashes as English.
  if (!value) return null;

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
