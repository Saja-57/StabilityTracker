import { spacing } from "@stability/design-tokens";
import { X } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { AppText, IconButton } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

export interface EventLogHeaderProps {
  readonly onExit?: () => void;
}

const styles = StyleSheet.create({
  header: {
    alignItems: "flex-start",
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
});

export function EventLogHeader({ onExit }: EventLogHeaderProps) {
  const { language, t } = useLanguage();

  return (
    <View style={[styles.header, getDirectionalRowStyle(language)]}>
      <View style={styles.copy}>
        <AppText accessibilityRole="header" variant="pageTitle">
          {t("eventLog.title")}
        </AppText>
        <AppText color="secondary">{t("eventLog.subtitle")}</AppText>
      </View>
      {onExit ? (
        <IconButton
          accessibilityLabel={t("eventLog.actions.exit")}
          icon={X}
          onPress={onExit}
          variant="ghost"
        />
      ) : null}
    </View>
  );
}
