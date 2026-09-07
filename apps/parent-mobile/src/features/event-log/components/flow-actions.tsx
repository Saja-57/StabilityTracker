import { spacing } from "@stability/design-tokens";
import { StyleSheet, View } from "react-native";

import { AppText, Button } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";

export interface FlowActionsProps {
  readonly onBack?: () => void;
  readonly onPrimary: () => void;
  readonly primaryLabel: string;
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  unavailable: {
    textAlign: "center",
  },
});

export function FlowActions({
  onBack,
  onPrimary,
  primaryLabel,
}: FlowActionsProps) {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Button
        accessibilityLabel={primaryLabel}
        fullWidth
        onPress={onPrimary}
        size="large"
      >
        {primaryLabel}
      </Button>
      {onBack ? (
        <Button
          accessibilityLabel={t("eventLog.actions.back")}
          fullWidth
          onPress={onBack}
          variant="ghost"
        >
          {t("eventLog.actions.back")}
        </Button>
      ) : null}
      <Button
        accessibilityLabel={t("eventLog.actions.completeLater")}
        disabled
        fullWidth
        variant="secondary"
      >
        {t("eventLog.actions.completeLater")}
      </Button>
      <AppText color="muted" style={styles.unavailable} variant="helper">
        {t("eventLog.actions.completeLaterUnavailable")}
      </AppText>
    </View>
  );
}
