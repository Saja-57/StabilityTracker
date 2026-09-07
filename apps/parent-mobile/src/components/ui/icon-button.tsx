import { colors, radius, sizing } from "@stability/design-tokens";
import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import {
  getIconSize,
  iconStrokeWidth,
  type IconComponent,
  type IconSize,
} from "./icon";

export interface IconButtonProps {
  accessibilityLabel: string;
  disabled?: boolean;
  icon: IconComponent;
  onPress?: () => void;
  size?: IconSize;
  style?: StyleProp<ViewStyle>;
  variant?: "secondary" | "ghost";
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radius.small,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: sizing.touchTarget,
    minWidth: sizing.touchTarget,
  },
  secondary: {
    backgroundColor: colors.surface.primary,
    borderColor: colors.border.default,
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  pressed: {
    backgroundColor: colors.surface.interactive,
    borderColor: colors.border.strong,
  },
  disabled: {
    opacity: 0.48,
  },
});

export function IconButton({
  accessibilityLabel,
  disabled = false,
  icon: Icon,
  onPress,
  size = "medium",
  style,
  variant = "secondary",
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !disabled ? styles.pressed : undefined,
        disabled ? styles.disabled : undefined,
        style,
      ]}
    >
      <Icon
        color={colors.text.secondary}
        size={getIconSize(size)}
        strokeWidth={iconStrokeWidth}
      />
    </Pressable>
  );
}
