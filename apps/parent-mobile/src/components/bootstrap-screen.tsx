import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "@stability/design-tokens";
import {
  getLanguageLabelKey,
  SUPPORTED_LANGUAGES,
  translate,
  type SupportedLanguage,
} from "@stability/i18n";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLanguage } from "@/providers/language-provider";
import {
  getDirectionalRowStyle,
  getDirectionalTextStyle,
  getDirectionalViewStyle,
} from "@/theme/direction";

export function BootstrapScreen() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <SafeAreaView style={[styles.safeArea, getDirectionalViewStyle(language)]}>
      <View style={styles.container}>
        <View style={styles.panel}>
          <Text
            style={[styles.status, getDirectionalTextStyle(language, "medium")]}
          >
            {t("bootstrap.ready")}
          </Text>
          <Text
            style={[styles.title, getDirectionalTextStyle(language, "medium")]}
          >
            {t("app.name")}
          </Text>
          <Text style={[styles.label, getDirectionalTextStyle(language)]}>
            {t("common.language")}
          </Text>
          <View
            style={[styles.languageOptions, getDirectionalRowStyle(language)]}
          >
            {SUPPORTED_LANGUAGES.map((option) => (
              <LanguageOption
                key={option}
                language={option}
                selected={language === option}
                onSelect={setLanguage}
              />
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

interface LanguageOptionProps {
  readonly language: SupportedLanguage;
  readonly selected: boolean;
  readonly onSelect: (language: SupportedLanguage) => void;
}

function LanguageOption({ language, selected, onSelect }: LanguageOptionProps) {
  const label = translate(language, getLanguageLabelKey(language));

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => onSelect(language)}
      style={({ pressed }) => [
        styles.languageOption,
        selected && styles.languageOptionSelected,
        pressed && styles.languageOptionPressed,
      ]}
    >
      <Text
        style={[
          styles.languageOptionText,
          selected && styles.languageOptionTextSelected,
          getDirectionalTextStyle(language, "medium"),
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingStart: spacing.xl,
    paddingEnd: spacing.xl,
  },
  panel: {
    gap: spacing.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.medium,
    backgroundColor: colors.surfacePrimary,
    shadowColor: shadows.subtle.color,
    shadowOpacity: shadows.subtle.opacity,
    shadowRadius: shadows.subtle.radius,
    shadowOffset: {
      width: shadows.subtle.offsetX,
      height: shadows.subtle.offsetY,
    },
    elevation: shadows.subtle.elevation,
  },
  status: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.caption,
    lineHeight: typography.lineHeight.caption,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.title,
    lineHeight: typography.lineHeight.title,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
  },
  languageOptions: {
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  languageOption: {
    minHeight: 44,
    justifyContent: "center",
    paddingStart: spacing.lg,
    paddingEnd: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.small,
    backgroundColor: colors.surfaceElevated,
  },
  languageOptionSelected: {
    borderColor: colors.brandPrimary,
    backgroundColor: colors.backgroundSecondary,
  },
  languageOptionPressed: {
    opacity: 0.72,
  },
  languageOptionText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
  },
  languageOptionTextSelected: {
    color: colors.textPrimary,
  },
});
