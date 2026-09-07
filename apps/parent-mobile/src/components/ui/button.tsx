import { colors, radius, sizing, spacing } from "@stability/design-tokens";
import type { SupportedLanguage } from "@stability/i18n";
import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { AppText, type AppTextColor } from "./app-text";
import { useLanguage } from "../../providers/language-provider";
import { getDirectionalRowStyle } from "../../theme/direction";
import { getIconSize, iconStrokeWidth, type IconComponent } from "./icon";
import { LoadingIndicator } from "./loading-indicator";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps {
  accessibilityLabel?: string;
  children: ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: IconComponent;
  loading?: boolean;
  language?: SupportedLanguage;
  onPress?: () => void;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  variant?: ButtonVariant;
}

const sizeStyles = StyleSheet.create({
  small: {
    minHeight: sizing.touchTarget,
    paddingHorizontal: spacing.md,
  },
  medium: {
    minHeight: sizing.control.medium,
    paddingHorizontal: spacing.lg,
  },
  large: {
    minHeight: sizing.control.large,
    paddingHorizontal: spacing.xl,
  },
});

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radius.small,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  disabled: {
    opacity: 0.48,
  },
});

const variantStyles: Record<
  ButtonVariant,
  {
    default: ViewStyle;
    iconColor: string;
    pressed: ViewStyle;
    textColor: AppTextColor;
  }
> = {
  primary: {
    default: {
      backgroundColor: colors.brand.primary,
      borderColor: colors.brand.primary,
    },
    pressed: {
      backgroundColor: colors.brand.primaryPressed,
      borderColor: colors.brand.primaryPressed,
    },
    iconColor: colors.text.inverse,
    textColor: "inverse",
  },
  secondary: {
    default: {
      backgroundColor: colors.surface.primary,
      borderColor: colors.border.default,
    },
    pressed: {
      backgroundColor: colors.surface.interactive,
      borderColor: colors.border.strong,
    },
    iconColor: colors.text.primary,
    textColor: "primary",
  },
  ghost: {
    default: {
      backgroundColor: "transparent",
      borderColor: "transparent",
    },
    pressed: {
      backgroundColor: colors.surface.interactive,
      borderColor: colors.surface.interactive,
    },
    iconColor: colors.text.secondary,
    textColor: "secondary",
  },
  danger: {
    default: {
      backgroundColor: colors.status.danger,
      borderColor: colors.status.danger,
    },
    pressed: {
      opacity: 0.82,
    },
    iconColor: colors.text.inverse,
    textColor: "inverse",
  },
};

export function Button({
  accessibilityLabel,
  children,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  language,
  loading = false,
  onPress,
  size = "medium",
  style,
  variant = "primary",
}: ButtonProps) {
  const { language: activeLanguage } = useLanguage();
  const isDisabled = disabled || loading;
  const visual = variantStyles[variant];
  const resolvedLanguage = language ?? activeLanguage;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        getDirectionalRowStyle(resolvedLanguage),
        sizeStyles[size],
        visual.default,
        pressed && !isDisabled ? visual.pressed : undefined,
        fullWidth ? styles.fullWidth : undefined,
        isDisabled ? styles.disabled : undefined,
        style,
      ]}
    >
      {loading ? (
        <LoadingIndicator
          size={getIconSize("small")}
          tone={
            variant === "primary" || variant === "danger" ? "inverse" : "brand"
          }
        />
      ) : Icon ? (
        <Icon
          color={visual.iconColor}
          size={getIconSize("small")}
          strokeWidth={iconStrokeWidth}
        />
      ) : null}
      <AppText
        color={visual.textColor}
        language={resolvedLanguage}
        variant="button"
      >
        {children}
      </AppText>
    </Pressable>
  );
}
