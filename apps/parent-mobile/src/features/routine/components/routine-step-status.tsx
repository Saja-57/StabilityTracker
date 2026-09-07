import { colors, radius, sizing } from "@stability/design-tokens";
import {
  Check,
  Circle,
  CircleDot,
  CircleSlash2,
  Clock3,
} from "lucide-react-native";
import { StyleSheet, View, type ViewStyle } from "react-native";

import {
  Badge,
  getIconSize,
  iconStrokeWidth,
  type IconComponent,
} from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import type { RoutineStepStatus as RoutineStepStatusValue } from "../types";

export interface RoutineStepStatusProps {
  readonly compact?: boolean;
  readonly status: RoutineStepStatusValue;
}

interface StatusVisual {
  readonly color: string;
  readonly container: ViewStyle;
  readonly icon: IconComponent;
  readonly tone: "neutral" | "brand" | "success" | "warning";
}

const styles = StyleSheet.create({
  indicator: {
    alignItems: "center",
    borderRadius: radius.full,
    height: sizing.avatar.small,
    justifyContent: "center",
    width: sizing.avatar.small,
  },
});

const statusVisuals: Record<RoutineStepStatusValue, StatusVisual> = {
  upcoming: {
    color: colors.text.muted,
    container: { backgroundColor: colors.background.subtle },
    icon: Circle,
    tone: "neutral",
  },
  current: {
    color: colors.brand.primary,
    container: { backgroundColor: colors.brand.subtle },
    icon: CircleDot,
    tone: "brand",
  },
  completed: {
    color: colors.status.success,
    container: { backgroundColor: colors.statusSurface.success },
    icon: Check,
    tone: "success",
  },
  skipped: {
    color: colors.text.muted,
    container: { backgroundColor: colors.background.subtle },
    icon: CircleSlash2,
    tone: "neutral",
  },
  delayed: {
    color: colors.status.warning,
    container: { backgroundColor: colors.statusSurface.warning },
    icon: Clock3,
    tone: "warning",
  },
};

const statusKeys = {
  upcoming: "routine.status.upcoming",
  current: "routine.status.current",
  completed: "routine.status.completed",
  skipped: "routine.status.skipped",
  delayed: "routine.status.delayed",
} as const;

export function RoutineStepStatus({
  compact = false,
  status,
}: RoutineStepStatusProps) {
  const { t } = useLanguage();
  const visual = statusVisuals[status];
  const label = t(statusKeys[status]);

  if (!compact) {
    return (
      <Badge icon={visual.icon} tone={visual.tone}>
        {label}
      </Badge>
    );
  }

  const Icon = visual.icon;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.indicator, visual.container]}
    >
      <Icon
        color={visual.color}
        size={getIconSize("small")}
        strokeWidth={iconStrokeWidth}
      />
    </View>
  );
}
