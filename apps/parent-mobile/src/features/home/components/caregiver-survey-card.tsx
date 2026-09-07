import { spacing } from "@stability/design-tokens";
import { ClipboardCheck, ListChecks } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { Button, Card, Divider } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

import { HomeCardHeader } from "./home-card-header";
import { HomeUnavailableState } from "./home-unavailable-state";

interface CaregiverSurveyCardProps {
  readonly onPress: () => void;
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
});

export function CaregiverSurveyCard({ onPress }: CaregiverSurveyCardProps) {
  const { t } = useLanguage();
  const actionLabel = t("home.caregiverSurvey.action");

  return (
    <Card variant="subtle">
      <HomeCardHeader
        icon={ClipboardCheck}
        title={t("home.caregiverSurvey.title")}
      />
      <Divider spacingSize="medium" />
      <View style={styles.content}>
        <HomeUnavailableState
          description={t("home.caregiverSurvey.emptyDescription")}
          title={t("home.caregiverSurvey.emptyTitle")}
        />
        <Button
          accessibilityLabel={actionLabel}
          fullWidth
          icon={ListChecks}
          onPress={onPress}
          variant="secondary"
        >
          {actionLabel}
        </Button>
      </View>
    </Card>
  );
}
