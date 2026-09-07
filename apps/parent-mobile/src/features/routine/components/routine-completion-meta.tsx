import { colors, spacing } from "@stability/design-tokens";
import { Clock3, UserRound } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { AppText, getIconSize, iconStrokeWidth } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

import type { RoutineCompletionViewModel } from "../types";

export interface RoutineCompletionMetaProps {
  readonly completion?: RoutineCompletionViewModel;
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  item: {
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
});

export function RoutineCompletionMeta({
  completion,
}: RoutineCompletionMetaProps) {
  const { language, t } = useLanguage();
  const caregiverLanguage = completion?.caregiverLanguage ?? language;

  if (!completion?.caregiverDisplayName && !completion?.completedAt) {
    return null;
  }

  return (
    <View style={styles.container}>
      {completion.caregiverDisplayName ? (
        <View style={[styles.item, getDirectionalRowStyle(language)]}>
          <UserRound
            color={colors.text.muted}
            size={getIconSize("small")}
            strokeWidth={iconStrokeWidth}
          />
          <AppText color="muted" variant="caption">
            {t("routine.completedBy")}
          </AppText>
          <AppText
            color="secondary"
            language={caregiverLanguage}
            variant="caption"
          >
            {completion.caregiverDisplayName}
          </AppText>
        </View>
      ) : null}
      {completion.completedAt ? (
        <View style={[styles.item, getDirectionalRowStyle(language)]}>
          <Clock3
            color={colors.text.muted}
            size={getIconSize("small")}
            strokeWidth={iconStrokeWidth}
          />
          <AppText color="muted" variant="caption">
            {t("routine.completedAt")}
          </AppText>
          <AppText color="secondary" variant="caption">
            {completion.completedAt}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}
