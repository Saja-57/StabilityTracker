import { spacing } from "@stability/design-tokens";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
});

export function RoutineHeader() {
  const { language, t } = useLanguage();
  const currentDate = useMemo(
    () =>
      new Intl.DateTimeFormat(language, {
        day: "numeric",
        month: "long",
        weekday: "long",
      }).format(new Date()),
    [language],
  );

  return (
    <View style={styles.container}>
      <AppText accessibilityRole="header" variant="pageTitle">
        {t("routine.title")}
      </AppText>
      <AppText color="muted">{currentDate}</AppText>
    </View>
  );
}
