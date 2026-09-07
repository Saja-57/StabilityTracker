import { colors, spacing } from "@stability/design-tokens";
import { StyleSheet, View } from "react-native";

import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

import type { RoutineStepViewModel } from "../types";
import { RoutineStep } from "./routine-step";
import { RoutineStepStatus } from "./routine-step-status";

export interface RoutineTimelineProps {
  readonly completionDisabled?: boolean;
  readonly onComplete?: (stepId: string) => void;
  readonly onUndo?: (stepId: string) => void;
  readonly steps: readonly RoutineStepViewModel[];
}

const styles = StyleSheet.create({
  timeline: {
    gap: spacing.md,
  },
  item: {
    alignItems: "stretch",
    gap: spacing.md,
  },
  rail: {
    alignItems: "center",
    width: spacing.xxl,
  },
  connector: {
    backgroundColor: colors.border.default,
    flex: 1,
    marginVertical: spacing.xs,
    minHeight: spacing.xl,
    width: 1,
  },
});

export function RoutineTimeline({
  completionDisabled = false,
  onComplete,
  onUndo,
  steps,
}: RoutineTimelineProps) {
  const { language } = useLanguage();

  return (
    <View style={styles.timeline}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <View
            key={step.id}
            style={[styles.item, getDirectionalRowStyle(language)]}
          >
            <View style={styles.rail}>
              <RoutineStepStatus compact status={step.status} />
              {isLast ? null : <View style={styles.connector} />}
            </View>
            <RoutineStep
              completionDisabled={completionDisabled}
              step={step}
              {...(onComplete ? { onComplete } : {})}
              {...(onUndo ? { onUndo } : {})}
            />
          </View>
        );
      })}
    </View>
  );
}
