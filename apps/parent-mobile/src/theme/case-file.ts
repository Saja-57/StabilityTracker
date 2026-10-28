import { caseFile } from "@stability/design-tokens";
import type { SupportedLanguage } from "@stability/i18n";
import type { TextStyle, ViewStyle } from "react-native";

/** Case File material palette, shared with the therapist workspace. */
export const cf = caseFile;

export const ink = {
  primary: cf.sheet.ink,
  secondary: cf.sheet.inkSecondary,
  muted: cf.sheet.inkMuted,
  board: cf.pressboard.ink,
  boardMuted: cf.pressboard.inkMuted,
  pen: cf.pen,
  stamp: cf.stamp,
  gold: cf.tab.goldInk,
  moss: cf.tab.mossInk,
  cobalt: cf.tab.cobaltInk,
  ruby: cf.tab.rubyInk,
} as const;

export type InkColor = keyof typeof ink;

export const surface = {
  ground: cf.sheet.base,
  raised: cf.sheet.raised,
  sunk: cf.sheet.sunk,
  rule: cf.sheet.rule,
  ruleStrong: cf.sheet.ruleStrong,
  board: cf.pressboard.base,
  boardDeep: cf.pressboard.deep,
  boardRaised: cf.pressboard.raised,
  boardLine: cf.pressboard.line,
} as const;

export const elevation: Record<"tile" | "lift" | "press", ViewStyle> = {
  tile: { boxShadow: cf.shadow.folder },
  lift: { boxShadow: cf.shadow.lift },
  press: { boxShadow: cf.shadow.press },
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48, gutter: 20 } as const;
export const corner = { sm: 10, md: 14, lg: 20, xl: 26, pill: 999 } as const;

export const motionCurve = [0.16, 1, 0.3, 1] as const;

const displayFamilies: Record<SupportedLanguage, string> = {
  en: "BricolageGrotesque_700Bold",
  he: "Heebo_800ExtraBold",
  ar: "Cairo_800ExtraBold",
};

export function displayFont(language: SupportedLanguage): TextStyle {
  return {
    fontFamily: displayFamilies[language],
    letterSpacing: language === "en" ? -0.6 : 0,
  };
}

export const monoFont: TextStyle = { fontFamily: "GeistMono_500Medium", fontVariant: ["tabular-nums"] };
