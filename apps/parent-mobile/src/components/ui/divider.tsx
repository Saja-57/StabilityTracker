import { colors, spacing } from "@stability/design-tokens";
import { StyleSheet, type StyleProp, View, type ViewStyle } from "react-native";

export interface DividerProps {
  spacingSize?: "none" | "small" | "medium" | "large";
  style?: StyleProp<ViewStyle>;
}

const marginBySize = {
  none: 0,
  small: spacing.sm,
  medium: spacing.lg,
  large: spacing.xl,
} as const;

const styles = StyleSheet.create({
  divider: {
    alignSelf: "stretch",
    backgroundColor: colors.border.subtle,
    height: StyleSheet.hairlineWidth,
  },
});

export function Divider({ spacingSize = "medium", style }: DividerProps) {
  return (
    <View
      accessibilityRole="none"
      style={[
        styles.divider,
        { marginBlock: marginBySize[spacingSize] },
        style,
      ]}
    />
  );
}
