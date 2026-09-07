import { colors, radius, sizing, spacing } from "@stability/design-tokens";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { AppText } from "./app-text";
import { getIconSize, iconStrokeWidth, type IconComponent } from "./icon";

export interface EmptyStateProps {
  action?: ReactNode;
  description: string;
  icon: IconComponent;
  title: string;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.surface.secondary,
    borderColor: colors.border.default,
    borderRadius: radius.medium,
    borderStyle: "dashed",
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.xl,
  },
  icon: {
    alignItems: "center",
    backgroundColor: colors.brand.subtle,
    borderRadius: radius.small,
    height: sizing.touchTarget,
    justifyContent: "center",
    width: sizing.touchTarget,
  },
  copy: {
    alignItems: "center",
    gap: spacing.xs,
  },
  centered: {
    textAlign: "center",
  },
});

export function EmptyState({
  action,
  description,
  icon: Icon,
  title,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Icon
          color={colors.brand.primary}
          size={getIconSize("large")}
          strokeWidth={iconStrokeWidth}
        />
      </View>
      <View style={styles.copy}>
        <AppText style={styles.centered} variant="cardTitle">
          {title}
        </AppText>
        <AppText color="secondary" style={styles.centered}>
          {description}
        </AppText>
      </View>
      {action}
    </View>
  );
}
