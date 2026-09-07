import { colors, radius, shadows, spacing } from "@stability/design-tokens";
import type { PropsWithChildren } from "react";
import { StyleSheet, type StyleProp, View, type ViewStyle } from "react-native";

export type CardVariant = "default" | "subtle" | "interactive" | "highlighted";

export interface CardProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  variant?: CardVariant;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.medium,
    borderWidth: 1,
    padding: spacing.lg,
  },
  default: {
    backgroundColor: colors.surface.primary,
    borderColor: colors.border.subtle,
  },
  subtle: {
    backgroundColor: colors.surface.secondary,
    borderColor: colors.border.subtle,
  },
  interactive: {
    backgroundColor: colors.surface.primary,
    borderColor: colors.border.default,
  },
  highlighted: {
    backgroundColor: colors.brand.subtle,
    borderColor: colors.brand.secondary,
    elevation: shadows.subtle.elevation,
    shadowColor: shadows.subtle.color,
    shadowOffset: {
      height: shadows.subtle.offsetY,
      width: shadows.subtle.offsetX,
    },
    shadowOpacity: shadows.subtle.opacity,
    shadowRadius: shadows.subtle.radius,
  },
});

export function Card({ children, style, variant = "default" }: CardProps) {
  return <View style={[styles.base, styles[variant], style]}>{children}</View>;
}
