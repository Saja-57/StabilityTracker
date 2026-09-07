import { colors, spacing } from "@stability/design-tokens";
import type { SupportedLanguage } from "@stability/i18n";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { AppText } from "./app-text";
import { useLanguage } from "../../providers/language-provider";
import { getDirectionalRowStyle } from "../../theme/direction";

interface FormFieldProps {
  children: ReactNode;
  errorText?: string | undefined;
  helperText?: string | undefined;
  label: string;
  language?: SupportedLanguage;
  required?: boolean;
  requiredLabel?: string | undefined;
}

const styles = StyleSheet.create({
  field: {
    alignSelf: "stretch",
    gap: spacing.xs,
  },
  labelRow: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: spacing.xs,
  },
  error: {
    color: colors.status.danger,
  },
});

export function FormField({
  children,
  errorText,
  helperText,
  label,
  language,
  required = false,
  requiredLabel,
}: FormFieldProps) {
  const { language: activeLanguage } = useLanguage();
  const resolvedLanguage = language ?? activeLanguage;

  return (
    <View style={styles.field}>
      <View style={[styles.labelRow, getDirectionalRowStyle(resolvedLanguage)]}>
        <AppText language={resolvedLanguage} variant="label">
          {label}
        </AppText>
        {required && requiredLabel ? (
          <AppText color="muted" language={resolvedLanguage} variant="helper">
            {requiredLabel}
          </AppText>
        ) : null}
      </View>
      {children}
      {errorText ? (
        <AppText
          accessibilityLiveRegion="polite"
          language={resolvedLanguage}
          style={styles.error}
          variant="helper"
        >
          {errorText}
        </AppText>
      ) : helperText ? (
        <AppText color="muted" language={resolvedLanguage} variant="helper">
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
}
