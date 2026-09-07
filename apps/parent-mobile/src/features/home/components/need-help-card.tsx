import { spacing } from "@stability/design-tokens";
import { ClipboardPenLine, LifeBuoy } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { AppText, Button, Card, Divider } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import { HomeCardHeader } from "./home-card-header";

interface NeedHelpCardProps {
  readonly onPress: () => void;
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
});

export function NeedHelpCard({ onPress }: NeedHelpCardProps) {
  const { t } = useLanguage();
  const actionLabel = t("home.needHelp.action");

  return (
    <Card variant="highlighted">
      <HomeCardHeader icon={LifeBuoy} title={t("home.needHelp.title")} />
      <Divider spacingSize="medium" />
      <View style={styles.content}>
        <AppText color="secondary">{t("home.needHelp.description")}</AppText>
        <Button
          accessibilityLabel={actionLabel}
          fullWidth
          icon={ClipboardPenLine}
          onPress={onPress}
        >
          {actionLabel}
        </Button>
      </View>
    </Card>
  );
}
