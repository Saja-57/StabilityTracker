import { colors, spacing } from "@stability/design-tokens";
import { Check, Clock3, RotateCcw } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import {
  AppText,
  Button,
  Card,
  getIconSize,
  iconStrokeWidth,
} from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

import type { RoutineStepViewModel } from "../types";
import { RoutineCompletionMeta } from "./routine-completion-meta";
import { RoutineStepStatus } from "./routine-step-status";

export interface RoutineStepProps {
  readonly completionDisabled?: boolean;
  readonly onComplete?: (stepId: string) => void;
  readonly onUndo?: (stepId: string) => void;
  readonly step: RoutineStepViewModel;
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: spacing.md,
  },
  completed: {
    opacity: 0.76,
  },
  header: {
    alignItems: "flex-start",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  titleGroup: {
    flex: 1,
    gap: spacing.xs,
  },
  order: {
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  time: {
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
});

export function RoutineStep({
  completionDisabled = false,
  onComplete,
  onUndo,
  step,
}: RoutineStepProps) {
  const { language, t } = useLanguage();
  const textLanguage = step.textLanguage ?? language;
  const isCompleted = step.status === "completed";
  const action = isCompleted ? onUndo : onComplete;
  const actionLabel = isCompleted
    ? t("routine.actions.undo")
    : t("routine.actions.complete");

  return (
    <Card
      style={[styles.card, isCompleted ? styles.completed : undefined]}
      variant={step.status === "current" ? "highlighted" : "default"}
    >
      <View style={[styles.header, getDirectionalRowStyle(language)]}>
        <View style={styles.titleGroup}>
          <View style={[styles.order, getDirectionalRowStyle(language)]}>
            <AppText color="muted" variant="caption">
              {t("routine.step")}
            </AppText>
            <AppText color="secondary" variant="caption">
              {step.order.toLocaleString(language)}
            </AppText>
          </View>
          <AppText language={textLanguage} variant="cardTitle">
            {step.title}
          </AppText>
          {step.description ? (
            <AppText color="secondary" language={textLanguage}>
              {step.description}
            </AppText>
          ) : null}
        </View>
        <RoutineStepStatus status={step.status} />
      </View>
      {step.scheduledAt ? (
        <View style={[styles.time, getDirectionalRowStyle(language)]}>
          <Clock3
            color={colors.text.muted}
            size={getIconSize("small")}
            strokeWidth={iconStrokeWidth}
          />
          <AppText color="muted" variant="caption">
            {t("routine.scheduledAt")}
          </AppText>
          <AppText color="secondary" variant="caption">
            {step.scheduledAt}
          </AppText>
        </View>
      ) : null}
      {step.completion ? (
        <RoutineCompletionMeta completion={step.completion} />
      ) : null}
      {action ? (
        <Button
          accessibilityLabel={`${actionLabel}: ${step.title}`}
          disabled={completionDisabled}
          icon={isCompleted ? RotateCcw : Check}
          onPress={() => action(step.id)}
          size="small"
          variant={isCompleted ? "ghost" : "secondary"}
        >
          {actionLabel}
        </Button>
      ) : null}
    </Card>
  );
}
