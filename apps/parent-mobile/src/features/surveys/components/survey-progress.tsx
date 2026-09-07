import { spacing } from "@stability/design-tokens";
import { StyleSheet, View } from "react-native";

import { AppText, Progress } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

export interface SurveyProgressProps {
  readonly current: number;
  readonly total: number;
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    alignItems: "center",
    gap: spacing.xs,
  },
});

export function SurveyProgress({ current, total }: SurveyProgressProps) {
  const { language, t } = useLanguage();
  const value = total > 0 ? (current / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={[styles.label, getDirectionalRowStyle(language)]}>
        <AppText color="muted" variant="caption">
          {t("surveys.progress.question")}
        </AppText>
        <AppText variant="bodyStrong">
          {current.toLocaleString(language)}
        </AppText>
        <AppText color="muted" variant="caption">
          {t("surveys.progress.of")}
        </AppText>
        <AppText variant="bodyStrong">{total.toLocaleString(language)}</AppText>
      </View>
      <Progress
        accessibilityLabel={t("surveys.progress.accessibility")}
        value={value}
      />
    </View>
  );
}
