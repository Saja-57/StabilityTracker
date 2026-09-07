import { colors, sizing } from "@stability/design-tokens";
import { ActivityIndicator, type ActivityIndicatorProps } from "react-native";

export interface LoadingIndicatorProps extends ActivityIndicatorProps {
  tone?: "brand" | "inverse";
}

export function LoadingIndicator({
  accessibilityLabel,
  size = sizing.icon.medium,
  tone = "brand",
  ...props
}: LoadingIndicatorProps) {
  return (
    <ActivityIndicator
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityLabel ? "progressbar" : undefined}
      accessible={Boolean(accessibilityLabel)}
      color={tone === "inverse" ? colors.text.inverse : colors.brand.primary}
      size={size}
      {...props}
    />
  );
}
