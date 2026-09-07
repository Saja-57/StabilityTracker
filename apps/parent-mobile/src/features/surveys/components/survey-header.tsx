import { spacing } from "@stability/design-tokens";
import { getDirection } from "@stability/i18n";
import { router } from "expo-router";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { AppText, IconButton } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

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

export function SurveyHeader() {
  const { language, t } = useLanguage();
  const BackIcon = getDirection(language) === "rtl" ? ArrowRight : ArrowLeft;
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/more");
  };

  return (
    <View style={[styles.header, getDirectionalRowStyle(language)]}>
      <IconButton
        accessibilityLabel={t("common.back")}
        icon={BackIcon}
        onPress={goBack}
      />
      <View style={styles.copy}>
        <AppText accessibilityRole="header" variant="pageTitle">
          {t("surveys.title")}
        </AppText>
        <AppText color="secondary">{t("surveys.subtitle")}</AppText>
      </View>
    </View>
  );
}
