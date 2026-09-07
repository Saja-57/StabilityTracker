import type { ButtonHTMLAttributes, Ref } from "react";

import { getIconSize, iconStrokeWidth, type UiIcon } from "./icon";
import { Spinner } from "./spinner";
import { cx, disabledState, focusRing } from "./styles";

import type { ButtonSize, ButtonVariant } from "./button";

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label"
> {
  readonly "aria-label": string;
  readonly icon: UiIcon;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly loading?: boolean;
  readonly ref?: Ref<HTMLButtonElement>;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-[var(--color-brand-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-brand-primary-hover)] active:bg-[var(--color-brand-primary-pressed)]",
  secondary:
    "border-[var(--color-border-default)] bg-[var(--color-surface-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-interactive)]",
  ghost:
    "border-transparent bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-interactive)]",
  danger:
    "border-transparent bg-[var(--color-status-danger)] text-[var(--color-text-inverse)] hover:opacity-90",
};

const sizeClasses: Record<ButtonSize, string> = {
  small: "size-[var(--control-small)]",
  medium: "size-[var(--control-medium)]",
  large: "size-[var(--control-large)]",
};

const iconSizes: Record<ButtonSize, "small" | "medium" | "large"> = {
  small: "small",
  medium: "medium",
  large: "large",
};

export function IconButton({
  icon: Icon,
  variant = "ghost",
  size = "medium",
  loading = false,
  disabled,
  className,
  type = "button",
  ref,
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-[var(--radius-small)] border transition-[background-color,border-color,color,opacity] duration-[var(--motion-fast)]",
        variantClasses[variant],
        sizeClasses[size],
        focusRing,
        disabledState,
        className,
      )}
    >
      {loading ? (
        <Spinner size={iconSizes[size]} />
      ) : (
        <Icon
          aria-hidden="true"
          size={getIconSize(iconSizes[size])}
          strokeWidth={iconStrokeWidth}
        />
      )}
    </button>
  );
}
