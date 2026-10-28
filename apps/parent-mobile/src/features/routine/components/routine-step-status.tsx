import { StyleSheet, View, type ViewStyle } from "react-native";

import { TabLabel, type Tone } from "@/components/case-file/primitives";
import { useLanguage } from "@/providers/language-provider";
import { cf, ink, surface } from "@/theme/case-file";

import type { RoutineStepStatus as RoutineStepStatusValue } from "../types";

export interface RoutineStepStatusProps {
  /** Compact renders the timeline node; otherwise a tab label when the status needs words. */
  readonly compact?: boolean;
  readonly status: RoutineStepStatusValue;
}

export const routineStatusKeys = {
  upcoming: "routine.status.upcoming",
  current: "routine.status.current",
  completed: "routine.status.completed",
  skipped: "routine.status.skipped",
  delayed: "routine.status.delayed",
} as const;

const nodeStyle: Record<RoutineStepStatusValue, ViewStyle> = {
  upcoming: {
    backgroundColor: surface.ground,
    borderColor: cf.sheet.ruleStrong,
    borderWidth: 2,
  },
  current: {
    backgroundColor: cf.pressboard.base,
    borderColor: cf.tab.mossWash,
    borderWidth: 4,
    height: 20,
    width: 20,
  },
  completed: { backgroundColor: ink.pen },
  skipped: {
    backgroundColor: surface.ground,
    borderColor: cf.tab.clay,
    borderStyle: "dashed",
    borderWidth: 2,
  },
  delayed: {
    backgroundColor: cf.tab.clayWash,
    borderColor: cf.tab.clay,
    borderWidth: 2,
  },
};

/** Only statuses that a picture cannot show on its own get a word. */
const labelTone: Partial<Record<RoutineStepStatusValue, Tone>> = {
  skipped: "clay",
  delayed: "clay",
};

export const ROUTINE_NODE_SIZE = 20;

export function RoutineStepStatus({
  compact = false,
  status,
}: RoutineStepStatusProps) {
  const { t } = useLanguage();

  if (compact) {
    return (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.slot}
      >
        <View style={[styles.node, nodeStyle[status]]} />
      </View>
    );
  }

  const tone = labelTone[status];
  return tone ? (
    <TabLabel tone={tone} label={t(routineStatusKeys[status])} />
  ) : null;
}

const styles = StyleSheet.create({
  slot: {
    alignItems: "center",
    height: ROUTINE_NODE_SIZE,
    justifyContent: "center",
    width: ROUTINE_NODE_SIZE,
  },
  node: { borderRadius: 10, height: 12, width: 12 },
});
