import { colors, spacing } from "@stability/design-tokens";
import { CalendarDays } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import {
  AppText,
  Card,
  Divider,
  getIconSize,
  iconStrokeWidth,
} from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

import type { RoutineContextViewModel } from "../types";

export interface RoutineContextCardProps {
  readonly context?: RoutineContextViewModel;
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    gap: spacing.sm,
  },
  available: {
    gap: spacing.xs,
  },
  unavailable: {
    gap: spacing.xs,
  },
});

export function RoutineContextCard({ context }: RoutineContextCardProps) {
  const { language, t } = useLanguage();
  const contentLanguage = context?.contentLanguage ?? language;
  const hasContext = Boolean(
    context?.routineName || context?.childDisplayName || context?.periodLabel,
  );

  return (
    <Card variant="subtle">
      <View style={[styles.header, getDirectionalRowStyle(language)]}>
        <CalendarDays
          color={colors.brand.primary}
          size={getIconSize("medium")}
          strokeWidth={iconStrokeWidth}
        />
        <AppText variant="cardTitle">{t("routine.context.title")}</AppText>
      </View>
      <Divider spacingSize="medium" />
      {context && hasContext ? (
        <View style={styles.available}>
          {context.routineName ? (
            <AppText language={contentLanguage} variant="bodyStrong">
              {context.routineName}
            </AppText>
          ) : null}
          {context.childDisplayName ? (
            <AppText color="secondary" language={contentLanguage}>
              {context.childDisplayName}
            </AppText>
          ) : null}
          {context.periodLabel ? (
            <AppText color="muted" language={contentLanguage}>
              {context.periodLabel}
            </AppText>
          ) : null}
        </View>
      ) : (
        <View style={styles.unavailable}>
          <AppText variant="bodyStrong">
            {t("routine.context.unavailable")}
          </AppText>
          <AppText color="secondary">
            {t("routine.context.description")}
          </AppText>
        </View>
      )}
    </Card>
  );
}
