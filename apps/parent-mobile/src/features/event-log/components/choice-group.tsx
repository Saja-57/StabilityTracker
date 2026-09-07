import { colors, radius, sizing, spacing } from "@stability/design-tokens";
import { Circle, CircleCheck } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { AppText, getIconSize, iconStrokeWidth } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

import type { EventLogChoice } from "../types";

export interface ChoiceGroupProps<TValue extends string> {
  readonly compact?: boolean;
  readonly description?: string;
  readonly errorText?: string;
  readonly label: string;
  readonly onSelect: (value: TValue) => void;
  readonly options: readonly EventLogChoice<TValue>[];
  readonly requiredLabel?: string;
  readonly selectedValue: TValue | null;
}

const styles = StyleSheet.create({
  group: {
    gap: spacing.sm,
  },
  heading: {
    gap: spacing.xs,
  },
  labelRow: {
    alignItems: "baseline",
    gap: spacing.xs,
  },
  options: {
    gap: spacing.sm,
  },
  compactOptions: {
    flexDirection: "row",
  },
  option: {
    borderColor: colors.border.default,
    borderRadius: radius.small,
    borderWidth: 1,
    minHeight: sizing.touchTarget,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  compactOption: {
    flex: 1,
  },
  optionContent: {
    alignItems: "center",
    gap: spacing.sm,
  },
  selected: {
    backgroundColor: colors.brand.subtle,
    borderColor: colors.brand.primary,
  },
  pressed: {
    backgroundColor: colors.surface.interactive,
  },
  error: {
    color: colors.status.danger,
  },
});

export function ChoiceGroup<TValue extends string>({
  compact = false,
  description,
  errorText,
  label,
  onSelect,
  options,
  requiredLabel,
  selectedValue,
}: ChoiceGroupProps<TValue>) {
  const { language, t } = useLanguage();

  return (
    <View accessibilityLabel={label} style={styles.group}>
      <View style={styles.heading}>
        <View style={[styles.labelRow, getDirectionalRowStyle(language)]}>
          <AppText variant="label">{label}</AppText>
          {requiredLabel ? (
            <AppText color="muted" variant="helper">
              {requiredLabel}
            </AppText>
          ) : null}
        </View>
        {description ? (
          <AppText color="muted" variant="helper">
            {description}
          </AppText>
        ) : null}
      </View>
      <View
        style={[
          styles.options,
          compact ? styles.compactOptions : undefined,
          compact ? getDirectionalRowStyle(language) : undefined,
        ]}
      >
        {options.map((option) => {
          const optionLabel = t(option.labelKey);
          const isSelected = selectedValue === option.value;
          const Indicator = isSelected ? CircleCheck : Circle;

          return (
            <Pressable
              key={option.value}
              accessibilityLabel={optionLabel}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              onPress={() => onSelect(option.value)}
              style={({ pressed }) => [
                styles.option,
                compact ? styles.compactOption : undefined,
                isSelected ? styles.selected : undefined,
                pressed ? styles.pressed : undefined,
              ]}
            >
              <View
                style={[styles.optionContent, getDirectionalRowStyle(language)]}
              >
                <Indicator
                  color={isSelected ? colors.brand.primary : colors.text.muted}
                  size={getIconSize("small")}
                  strokeWidth={iconStrokeWidth}
                />
                <AppText
                  color={isSelected ? "primary" : "secondary"}
                  variant="bodyStrong"
                >
                  {optionLabel}
                </AppText>
              </View>
            </Pressable>
          );
        })}
      </View>
      {errorText ? (
        <AppText
          accessibilityLiveRegion="polite"
          style={styles.error}
          variant="helper"
        >
          {errorText}
        </AppText>
      ) : null}
    </View>
  );
}
