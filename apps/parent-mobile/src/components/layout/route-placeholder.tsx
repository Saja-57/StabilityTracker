import { spacing } from "@stability/design-tokens";
import { getDirection, type TranslationKey } from "@stability/i18n";
import { router } from "expo-router";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import {
  AppText,
  EmptyState,
  IconButton,
  ScreenContainer,
} from "@/components/ui";
import type { IconComponent } from "@/components/ui/icon";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

export interface RoutePlaceholderProps {
  icon: IconComponent;
  showBack?: boolean;
  titleKey: TranslationKey;
}

const styles = StyleSheet.create({
  header: {
    alignItems: "flex-start",
    gap: spacing.md,
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xs,
  },
});

export function RoutePlaceholder({
  icon,
  showBack = false,
  titleKey,
}: RoutePlaceholderProps) {
  const { language, t } = useLanguage();
  const BackIcon = getDirection(language) === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <ScreenContainer>
      <View style={[styles.header, getDirectionalRowStyle(language)]}>
        {showBack ? (
          <IconButton
            accessibilityLabel={t("common.back")}
            icon={BackIcon}
            onPress={() => router.back()}
          />
        ) : null}
        <View style={styles.headerCopy}>
          <AppText variant="pageTitle">{t(titleKey)}</AppText>
          <AppText color="secondary">{t("shell.route.description")}</AppText>
        </View>
      </View>
      <EmptyState
        description={t("shell.route.description")}
        icon={icon}
        title={t("states.empty.title")}
      />
    </ScreenContainer>
  );
}
