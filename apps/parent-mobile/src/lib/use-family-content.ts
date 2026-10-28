import { useMemo } from "react";

import { useLanguage } from "@/providers/language-provider";

import { localizedFamily, type FamilyContent } from "./sample-family";

/** The illustrative sample family, in the language the app is showing. */
export function useFamilyContent(): FamilyContent {
  const { language } = useLanguage();
  return useMemo(() => localizedFamily(language), [language]);
}
