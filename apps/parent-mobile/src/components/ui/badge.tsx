import { colors, radius, sizing, spacing } from "@stability/design-tokens";
import type { SupportedLanguage } from "@stability/i18n";
import {
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
} from "lucide-react-native";
import type { PropsWithChildren } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

import { AppText } from "./app-text";
import { useLanguage } from "../../providers/language-provider";
import { getDirectionalRowStyle } from "../../theme/direction";
import { getIconSize, iconStrokeWidth, type IconComponent } from "./icon";

export type BadgeTone =
  "neutral" | "brand" | "success" | "warning" | "danger" | "info";
export type StatusTone = Exclude<BadgeTone, "neutral" | "brand">;

export interface BadgeProps extends PropsWithChildren {
  icon?: IconComponent;
  language?: SupportedLanguage;
  tone?: BadgeTone;
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: radius.full,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: sizing.badge,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
});

const toneStyles: Record<BadgeTone, { color: string; container: ViewStyle }> = {
  neutral: {
    color: colors.text.secondary,
    container: { backgroundColor: colors.background.subtle },
  },
  brand: {
    color: colors.brand.primary,
    container: { backgroundColor: colors.brand.subtle },
  },
  success: {
    color: colors.status.success,
    container: { backgroundColor: colors.statusSurface.success },
  },
  warning: {
    color: colors.status.warning,
    container: { backgroundColor: colors.statusSurface.warning },
  },
  danger: {
    color: colors.status.danger,
    container: { backgroundColor: colors.statusSurface.danger },
  },
  info: {
    color: colors.status.info,
    container: { backgroundColor: colors.statusSurface.info },
  },
};

const statusIcons: Record<StatusTone, IconComponent> = {
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
  info: Info,
};

export function Badge({
  children,
  icon: Icon,
  language,
  tone = "neutral",
}: BadgeProps) {
  const { language: activeLanguage } = useLanguage();
  const resolvedLanguage = language ?? activeLanguage;
  const visual = toneStyles[tone];

  return (
    <View
      style={[
        styles.badge,
        getDirectionalRowStyle(resolvedLanguage),
        visual.container,
      ]}
    >
      {Icon ? (
        <Icon
          color={visual.color}
          size={getIconSize("small")}
          strokeWidth={iconStrokeWidth}
        />
      ) : null}
      <AppText
        language={resolvedLanguage}
        style={{ color: visual.color }}
        variant="caption"
      >
        {children}
      </AppText>
    </View>
  );
}

export function StatusBadge({
  children,
  tone,
}: PropsWithChildren<{ tone: StatusTone }>) {
  return (
    <Badge icon={statusIcons[tone]} tone={tone}>
      {children}
    </Badge>
  );
}
