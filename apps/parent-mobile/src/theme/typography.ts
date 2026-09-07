import type { SupportedLanguage } from "@stability/i18n";

export type MobileFontWeight = "regular" | "medium" | "bold";

const mobileFontFamilies = {
  en: {
    regular: "Ubuntu_400Regular",
    medium: "Ubuntu_500Medium",
    bold: "Ubuntu_700Bold",
  },
  he: {
    regular: "Heebo_400Regular",
    medium: "Heebo_500Medium",
    bold: "Heebo_700Bold",
  },
  ar: {
    regular: "Cairo_400Regular",
    medium: "Cairo_500Medium",
    bold: "Cairo_700Bold",
  },
} as const satisfies Record<
  SupportedLanguage,
  Record<MobileFontWeight, string>
>;

export function getMobileFontFamily(
  language: SupportedLanguage,
  weight: MobileFontWeight = "regular",
): string {
  return mobileFontFamilies[language][weight];
}
