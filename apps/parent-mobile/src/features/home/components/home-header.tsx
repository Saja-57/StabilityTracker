import { spacing } from "@stability/design-tokens";
import { StyleSheet, View } from "react-native";

import { AppText, BrandLogo } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.md,
  },
});

export function HomeHeader() {
  const { language, t } = useLanguage();

  return (
    <View style={[styles.container, getDirectionalRowStyle(language)]}>
      <BrandLogo size="medium" variant="mark" />
      <AppText language="en" variant="cardTitle">
        {t("app.name")}
      </AppText>
    </View>
  );
}
