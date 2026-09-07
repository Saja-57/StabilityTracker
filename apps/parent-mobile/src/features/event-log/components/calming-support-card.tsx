import { spacing } from "@stability/design-tokens";
import { LifeBuoy } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { AppText, Button, Card } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  copy: {
    gap: spacing.xs,
  },
});

export function CalmingSupportCard() {
  const { t } = useLanguage();

  return (
    <Card style={styles.card} variant="highlighted">
      <View style={styles.copy}>
        <AppText accessibilityRole="header" variant="cardTitle">
          {t("eventLog.support.title")}
        </AppText>
        <AppText color="secondary">{t("eventLog.support.description")}</AppText>
      </View>
      <Button
        accessibilityLabel={t("eventLog.support.action")}
        disabled
        fullWidth
        icon={LifeBuoy}
        variant="secondary"
      >
        {t("eventLog.support.action")}
      </Button>
    </Card>
  );
}
