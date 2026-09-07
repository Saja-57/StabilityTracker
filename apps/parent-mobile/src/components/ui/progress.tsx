import { colors, radius, spacing } from "@stability/design-tokens";
import { StyleSheet, View } from "react-native";

export interface ProgressProps {
  accessibilityLabel: string;
  value: number;
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

export function Progress({ accessibilityLabel, value }: ProgressProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
      accessibilityValue={{ max: 100, min: 0, now: normalizedValue }}
      style={styles.track}
    >
      <View style={[styles.indicator, { width: `${normalizedValue}%` }]} />
    </View>
  );
}
