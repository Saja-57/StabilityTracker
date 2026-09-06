import { getDirection, type SupportedLanguage } from "@stability/i18n";
import type { TextStyle, ViewStyle } from "react-native";

import { getMobileFontFamily, type MobileFontWeight } from "./typography";

export function getDirectionalViewStyle(
  language: SupportedLanguage,
): ViewStyle {
  return { direction: getDirection(language) };
}

export function getDirectionalRowStyle(language: SupportedLanguage): ViewStyle {
  return {
    flexDirection: getDirection(language) === "rtl" ? "row-reverse" : "row",
  };
}

export function getDirectionalTextStyle(
  language: SupportedLanguage,
  weight: MobileFontWeight = "regular",
): TextStyle {
  const direction = getDirection(language);

  return {
    fontFamily: getMobileFontFamily(language, weight),
    textAlign: direction === "rtl" ? "right" : "left",
    writingDirection: direction,
  };
}
