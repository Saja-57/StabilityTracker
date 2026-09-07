import { colors, typography } from "@stability/design-tokens";
import type { SupportedLanguage } from "@stability/i18n";
import type { TextProps, TextStyle } from "react-native";
import { Text } from "react-native";

import { useLanguage } from "../../providers/language-provider";
import { getDirectionalTextStyle } from "../../theme/direction";
import type { MobileFontWeight } from "../../theme/typography";

export type AppTextVariant = keyof typeof typography;
export type AppTextColor = keyof typeof colors.text;

export interface AppTextProps extends TextProps {
  color?: AppTextColor;
  language?: SupportedLanguage;
  variant?: AppTextVariant;
}

const variantWeights: Record<AppTextVariant, MobileFontWeight> = {
  display: "bold",
  pageTitle: "bold",
  sectionTitle: "medium",
  cardTitle: "medium",
  body: "regular",
  bodyStrong: "medium",
  label: "medium",
  caption: "regular",
  helper: "regular",
  button: "medium",
};

export function AppText({
  color = "primary",
  language,
  style,
  variant = "body",
  ...props
}: AppTextProps) {
  const { language: activeLanguage } = useLanguage();
  const resolvedLanguage = language ?? activeLanguage;
  const variantToken = typography[variant];
  const directionalStyle = getDirectionalTextStyle(
    resolvedLanguage,
    variantWeights[variant],
  );
  const tokenStyle: TextStyle = {
    color: colors.text[color],
    fontSize: variantToken.fontSize,
    letterSpacing: variantToken.letterSpacing,
    lineHeight: variantToken.lineHeight,
  };

  return (
    <Text
      {...props}
      lang={resolvedLanguage}
      style={[
        tokenStyle,
        directionalStyle,
        style,
        {
          fontFamily: directionalStyle.fontFamily,
          writingDirection: directionalStyle.writingDirection,
        },
      ]}
    />
  );
}
