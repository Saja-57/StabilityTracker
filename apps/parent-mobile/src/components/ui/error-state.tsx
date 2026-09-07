import { colors, radius, spacing } from "@stability/design-tokens";
import { CircleAlert } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { AppText } from "./app-text";
import { Button } from "./button";
import { getIconSize, iconStrokeWidth } from "./icon";

export interface ErrorStateProps {
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
  title: string;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.statusSurface.danger,
    borderColor: colors.status.danger,
    borderRadius: radius.medium,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.xl,
  },
  copy: {
    alignItems: "center",
    gap: spacing.xs,
  },
  centered: {
    textAlign: "center",
  },
  title: {
    color: colors.status.danger,
  },
});

export function ErrorState({
  description,
  onRetry,
  retryLabel,
  title,
}: ErrorStateProps) {
  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={styles.container}
    >
      <CircleAlert
        color={colors.status.danger}
        size={getIconSize("large")}
        strokeWidth={iconStrokeWidth}
      />
      <View style={styles.copy}>
        <AppText style={[styles.centered, styles.title]} variant="cardTitle">
          {title}
        </AppText>
        <AppText color="secondary" style={styles.centered}>
          {description}
        </AppText>
      </View>
      {retryLabel && onRetry ? (
        <Button onPress={onRetry} size="small" variant="danger">
          {retryLabel}
        </Button>
      ) : null}
    </View>
  );
}
