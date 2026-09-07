import { spacing } from "@stability/design-tokens";
import { UserRound } from "lucide-react-native";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { AppText, Card, Divider } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import { HomeCardHeader } from "./home-card-header";
import { HomeUnavailableState } from "./home-unavailable-state";

const styles = StyleSheet.create({
  context: {
    gap: spacing.lg,
  },
  greeting: {
    gap: spacing.xs,
  },
});

export function DailyContext() {
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
    <View style={styles.context}>
      <View style={styles.greeting}>
        <AppText color="secondary" variant="bodyStrong">
          {t("home.welcome")}
        </AppText>
        <AppText accessibilityRole="header" variant="pageTitle">
          {t("home.title")}
        </AppText>
        <AppText color="muted">{currentDate}</AppText>
      </View>
      <Card variant="subtle">
        <HomeCardHeader icon={UserRound} title={t("home.context.title")} />
        <Divider spacingSize="medium" />
        <HomeUnavailableState
          description={t("home.context.emptyDescription")}
          title={t("home.context.emptyTitle")}
        />
      </Card>
    </View>
  );
}
