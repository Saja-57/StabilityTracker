import type { SupportedLanguage } from "@stability/i18n";

export type MobileFontWeight = "regular" | "medium";

const mobileFontFamilies = {
  en: {
    regular: "Ubuntu_400Regular",
    medium: "Ubuntu_500Medium",
  },
  he: {
    regular: "Heebo_400Regular",
    medium: "Heebo_500Medium",
  },
  ar: {
    regular: "Cairo_400Regular",
    medium: "Cairo_500Medium",
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
