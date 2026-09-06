import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "@stability/design-tokens";
import type { CSSProperties } from "react";

type ThemeVariables = CSSProperties &
  Record<`--${string}`, string | number | undefined>;

export const webThemeVariables: ThemeVariables = {
  "--color-background-primary": colors.backgroundPrimary,
  "--color-background-secondary": colors.backgroundSecondary,
  "--color-surface-primary": colors.surfacePrimary,
  "--color-surface-elevated": colors.surfaceElevated,
  "--color-text-primary": colors.textPrimary,
  "--color-text-secondary": colors.textSecondary,
  "--color-text-muted": colors.textMuted,
  "--color-border-default": colors.borderDefault,
  "--color-brand-primary": colors.brandPrimary,
  "--radius-small": `${radius.small}px`,
  "--radius-medium": `${radius.medium}px`,
  "--spacing-md": `${spacing.md}px`,
  "--font-size-body": `${typography.fontSize.body}px`,
  "--shadow-subtle": `${shadows.subtle.offsetX}px ${shadows.subtle.offsetY}px ${shadows.subtle.radius}px rgb(28 33 31 / ${shadows.subtle.opacity})`,
};
