import {
  colors,
  radius,
  sizing,
  spacing,
  typography,
} from "@stability/design-tokens";
import type { SupportedLanguage } from "@stability/i18n";
import {
  StyleSheet,
  TextInput as NativeTextInput,
  type StyleProp,
  type TextInputProps as NativeTextInputProps,
  type TextStyle,
} from "react-native";

import { useLanguage } from "../../providers/language-provider";
import { getDirectionalTextStyle } from "../../theme/direction";
import { FormField } from "./form-field";

export interface TextInputProps extends Omit<
  NativeTextInputProps,
  "multiline" | "style"
> {
  disabled?: boolean;
  errorText?: string;
  helperText?: string;
  inputStyle?: StyleProp<TextStyle>;
  label: string;
  language?: SupportedLanguage;
  required?: boolean;
  requiredLabel?: string;
}

interface TextControlProps extends TextInputProps {
  multiline?: boolean;
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface.primary,
    borderColor: colors.border.default,
    borderRadius: radius.small,
    borderWidth: 1,
    color: colors.text.primary,
    fontSize: typography.body.fontSize,
    letterSpacing: typography.body.letterSpacing,
    lineHeight: typography.body.lineHeight,
    minHeight: sizing.control.medium,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  multiline: {
    minHeight: sizing.control.multiline,
    textAlignVertical: "top",
  },
  error: {
    borderColor: colors.status.danger,
  },
  disabled: {
    backgroundColor: colors.background.subtle,
    color: colors.text.muted,
    opacity: 0.72,
  },
});

export function TextControl({
  accessibilityLabel,
  disabled = false,
  errorText,
  helperText,
  inputStyle,
  label,
  language,
  multiline = false,
  required = false,
  requiredLabel,
  ...props
}: TextControlProps) {
  const { language: activeLanguage } = useLanguage();
  const resolvedLanguage = language ?? activeLanguage;

  return (
    <FormField
      errorText={errorText}
      helperText={helperText}
      label={label}
      language={resolvedLanguage}
      required={required}
      requiredLabel={requiredLabel}
    >
      <NativeTextInput
        {...props}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled }}
        editable={!disabled}
        multiline={multiline}
        placeholderTextColor={colors.text.muted}
        selectionColor={colors.brand.primary}
        style={[
          styles.input,
          multiline ? styles.multiline : undefined,
          errorText ? styles.error : undefined,
          disabled ? styles.disabled : undefined,
          inputStyle,
          getDirectionalTextStyle(resolvedLanguage),
        ]}
      />
    </FormField>
  );
}

export function TextInput(props: TextInputProps) {
  return <TextControl {...props} />;
}
