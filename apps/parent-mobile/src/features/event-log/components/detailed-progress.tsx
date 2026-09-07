import { spacing } from "@stability/design-tokens";
import { StyleSheet, View } from "react-native";

import { AppText, Progress } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

export interface DetailedProgressProps {
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

export function DetailedProgress({ current, total }: DetailedProgressProps) {
  const { language, t } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={[styles.label, getDirectionalRowStyle(language)]}>
        <AppText color="muted" variant="caption">
          {t("eventLog.progress.step")}
        </AppText>
        <AppText variant="bodyStrong">
          {current.toLocaleString(language)}
        </AppText>
        <AppText color="muted" variant="caption">
          {t("eventLog.progress.of")}
        </AppText>
        <AppText variant="bodyStrong">{total.toLocaleString(language)}</AppText>
      </View>
      <Progress
        accessibilityLabel={t("eventLog.progress.accessibility")}
        value={(current / total) * 100}
      />
    </View>
  );
}
