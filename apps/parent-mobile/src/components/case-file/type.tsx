import type { SupportedLanguage } from "@stability/i18n";
import { Text, type TextProps, type TextStyle } from "react-native";

import { useLanguage } from "@/providers/language-provider";
import { displayFont, ink, monoFont, type InkColor } from "@/theme/case-file";
import { getDirectionalTextStyle } from "@/theme/direction";

export type TypeVariant =
  | "hero"
  | "display"
  | "title"
  | "headline"
  | "lede"
  | "body"
  | "label"
  | "small"
  | "caption"
  | "figure"
  | "figureLarge"
  | "stamp";

const metrics: Record<TypeVariant, TextStyle> = {
  hero: { fontSize: 38, lineHeight: 42 },
  display: { fontSize: 30, lineHeight: 34 },
  title: { fontSize: 22, lineHeight: 28 },
  headline: { fontSize: 18, lineHeight: 24 },
  lede: { fontSize: 17, lineHeight: 25 },
  body: { fontSize: 16, lineHeight: 24 },
  label: { fontSize: 15, lineHeight: 20 },
  small: { fontSize: 14, lineHeight: 20 },
  caption: { fontSize: 12.5, lineHeight: 17 },
  figure: { fontSize: 15, lineHeight: 20 },
  figureLarge: { fontSize: 28, lineHeight: 32 },
  stamp: { fontSize: 11, lineHeight: 14, letterSpacing: 1, textTransform: "uppercase" },
};

const displayVariants = new Set<TypeVariant>(["hero", "display", "title", "headline"]);
const monoVariants = new Set<TypeVariant>(["figure", "figureLarge", "stamp"]);
const mediumVariants = new Set<TypeVariant>(["label"]);

export interface TypeProps extends TextProps {
  readonly variant?: TypeVariant;
  readonly color?: InkColor;
  /** Render in another language's face, for content authored in that language. */
  readonly language?: SupportedLanguage;
}

/** The Case File type ramp for mobile: display face, workhorse body, mono figures. */
export function Type({ variant = "body", color = "primary", language, style, ...props }: TypeProps) {
  const { language: active } = useLanguage();
  const resolved = language ?? active;
  const base = getDirectionalTextStyle(resolved, mediumVariants.has(variant) ? "medium" : "regular");
  // Geist Mono has no Hebrew or Arabic glyphs: stamps in those scripts use
  // the script's own face; numerals keep the mono face in every language.
  const mono = monoVariants.has(variant) && !(variant === "stamp" && resolved !== "en");
  const face = displayVariants.has(variant) ? displayFont(resolved) : mono ? monoFont : null;

  return (
    <Text
      {...props}
      style={[
        base,
        metrics[variant],
        face,
        // Tracking breaks Arabic joining and has no role in Hebrew.
        variant === "stamp" && resolved !== "en" ? { letterSpacing: 0 } : null,
        { color: ink[color] },
        style,
      ]}
    />
  );
}
