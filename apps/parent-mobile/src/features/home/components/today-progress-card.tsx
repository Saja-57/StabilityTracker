import { spacing } from "@stability/design-tokens";
import { ChartNoAxesColumnIncreasing } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { Card, Divider, Progress } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import { HomeCardHeader } from "./home-card-header";
import { HomeUnavailableState } from "./home-unavailable-state";

const styles = StyleSheet.create({
  progress: {
    gap: spacing.lg,
  },
});

export function TodayProgressCard() {
  const { t } = useLanguage();

  return (
    <Card>
      <HomeCardHeader
        icon={ChartNoAxesColumnIncreasing}
        title={t("home.todayProgress.title")}
      />
      <Divider spacingSize="medium" />
      <View style={styles.progress}>
        <Progress
          accessibilityLabel={t("home.todayProgress.accessibility")}
          unavailableLabel={t("home.todayProgress.unavailable")}
        />
        <HomeUnavailableState
          description={t("home.todayProgress.emptyDescription")}
          title={t("home.todayProgress.unavailable")}
        />
      </View>
    </Card>
  );
}
