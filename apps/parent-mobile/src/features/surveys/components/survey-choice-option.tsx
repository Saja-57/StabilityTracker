import { colors, radius, sizing, spacing } from "@stability/design-tokens";
import type { SupportedLanguage } from "@stability/i18n";
import {
  Circle,
  CircleCheck,
  Square,
  SquareCheckBig,
} from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { AppText, getIconSize, iconStrokeWidth } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

export interface SurveyChoiceOptionProps {
  readonly label: string;
  readonly language?: SupportedLanguage;
  readonly mode: "single" | "multiple";
  readonly onPress: () => void;
  readonly selected: boolean;
}

const styles = StyleSheet.create({
  option: {
    borderColor: colors.border.default,
    borderRadius: radius.small,
    borderWidth: 1,
    minHeight: sizing.touchTarget,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  selected: {
    backgroundColor: colors.brand.subtle,
    borderColor: colors.brand.primary,
  },
  pressed: {
    backgroundColor: colors.surface.interactive,
  },
  content: {
    alignItems: "center",
    gap: spacing.sm,
  },
  label: {
    flex: 1,
  },
});

export function SurveyChoiceOption({
  label,
  language,
  mode,
  onPress,
  selected,
}: SurveyChoiceOptionProps) {
  const { language: activeLanguage } = useLanguage();
  const resolvedLanguage = language ?? activeLanguage;
  const Indicator =
    mode === "single"
      ? selected
        ? CircleCheck
        : Circle
      : selected
        ? SquareCheckBig
        : Square;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole={mode === "single" ? "radio" : "checkbox"}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        selected ? styles.selected : undefined,
        pressed ? styles.pressed : undefined,
      ]}
    >
      <View style={[styles.content, getDirectionalRowStyle(resolvedLanguage)]}>
        <Indicator
          color={selected ? colors.brand.primary : colors.text.muted}
          size={getIconSize("small")}
          strokeWidth={iconStrokeWidth}
        />
        <AppText
          language={resolvedLanguage}
          style={styles.label}
          variant="bodyStrong"
        >
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}
