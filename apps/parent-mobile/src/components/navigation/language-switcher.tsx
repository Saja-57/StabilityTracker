import { spacing } from "@stability/design-tokens";
import {
  getLanguageLabelKey,
  SUPPORTED_LANGUAGES,
  translate,
} from "@stability/i18n";
import { StyleSheet, View } from "react-native";

import { Button } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { getDirectionalRowStyle } from "@/theme/direction";

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <View
      accessibilityLabel={t("common.language")}
      accessibilityRole="toolbar"
      style={[styles.container, getDirectionalRowStyle(language)]}
    >
      {SUPPORTED_LANGUAGES.map((option) => (
        <Button
          key={option}
          language={option}
          onPress={() => setLanguage(option)}
          size="small"
          variant={language === option ? "primary" : "secondary"}
        >
          {translate(option, getLanguageLabelKey(option))}
        </Button>
      ))}
    </View>
  );
}
