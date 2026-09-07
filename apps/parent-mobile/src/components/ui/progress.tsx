import { colors, radius, spacing } from "@stability/design-tokens";
import { StyleSheet, View } from "react-native";

export interface ProgressProps {
  accessibilityLabel: string;
  unavailableLabel?: string;
  value?: number;
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.background.subtle,
    borderRadius: radius.full,
    height: spacing.sm,
    overflow: "hidden",
    width: "100%",
  },
  indicator: {
    backgroundColor: colors.brand.primary,
    borderRadius: radius.full,
    height: "100%",
  },
});

export function Progress({
  accessibilityLabel,
  unavailableLabel,
  value,
}: ProgressProps) {
  const normalizedValue =
    value === undefined ? undefined : Math.min(100, Math.max(0, value));

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
      accessibilityValue={
        normalizedValue === undefined
          ? { text: unavailableLabel }
          : { max: 100, min: 0, now: normalizedValue }
      }
      style={styles.track}
    >
      {normalizedValue === undefined ? null : (
        <View style={[styles.indicator, { width: `${normalizedValue}%` }]} />
      )}
    </View>
  );
}
