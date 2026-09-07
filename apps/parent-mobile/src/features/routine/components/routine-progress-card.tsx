import { colors, spacing } from "@stability/design-tokens";
import { ChartNoAxesColumnIncreasing } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import {
  AppText,
  Card,
  Divider,
  getIconSize,
  iconStrokeWidth,
  Progress,
} from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

import type { RoutineSummaryViewModel } from "../types";

export interface RoutineProgressCardProps {
  readonly summary?: RoutineSummaryViewModel;
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    gap: spacing.sm,
  },
  content: {
    gap: spacing.md,
  },
  metrics: {
    gap: spacing.xl,
  },
  metric: {
    flex: 1,
    gap: spacing.xs,
  },
  unavailable: {
    gap: spacing.xs,
  },
});

export function RoutineProgressCard({ summary }: RoutineProgressCardProps) {
  const { language, t } = useLanguage();

  return (
    <Card>
      <View style={[styles.header, getDirectionalRowStyle(language)]}>
        <ChartNoAxesColumnIncreasing
          color={colors.brand.primary}
          size={getIconSize("medium")}
          strokeWidth={iconStrokeWidth}
        />
        <AppText variant="cardTitle">{t("routine.progress.title")}</AppText>
      </View>
      <Divider spacingSize="medium" />
      <View style={styles.content}>
        <Progress
          accessibilityLabel={t("routine.progress.accessibility")}
          unavailableLabel={t("routine.progress.unavailable")}
          {...(summary ? { value: summary.progressPercent } : {})}
        />
        {summary ? (
          <View style={[styles.metrics, getDirectionalRowStyle(language)]}>
            <View style={styles.metric}>
              <AppText color="muted" variant="caption">
                {t("routine.progress.completed")}
              </AppText>
              <AppText variant="bodyStrong">
                {summary.completedSteps.toLocaleString(language)}
              </AppText>
            </View>
            <View style={styles.metric}>
              <AppText color="muted" variant="caption">
                {t("routine.progress.total")}
              </AppText>
              <AppText variant="bodyStrong">
                {summary.totalSteps.toLocaleString(language)}
              </AppText>
            </View>
          </View>
        ) : (
          <View style={styles.unavailable}>
            <AppText variant="bodyStrong">
              {t("routine.progress.unavailable")}
            </AppText>
            <AppText color="secondary">
              {t("routine.progress.description")}
            </AppText>
          </View>
        )}
      </View>
    </Card>
  );
}
