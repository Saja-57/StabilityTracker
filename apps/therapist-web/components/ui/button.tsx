import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";

import { getIconSize, iconStrokeWidth, type UiIcon } from "./icon";
import { Spinner } from "./spinner";
import { cx, disabledState, focusRing } from "./styles";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly icon?: UiIcon;
  readonly iconPosition?: "start" | "end";
  readonly loading?: boolean;
  readonly fullWidth?: boolean;
  readonly children: ReactNode;
  readonly ref?: Ref<HTMLButtonElement>;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-[var(--color-brand-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-brand-primary-hover)] active:bg-[var(--color-brand-primary-pressed)]",
  secondary:
    "border-[var(--color-border-default)] bg-[var(--color-surface-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-interactive)] active:border-[var(--color-border-strong)]",
  ghost:
    "border-transparent bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-interactive)] active:text-[var(--color-text-primary)]",
  danger:
    "border-transparent bg-[var(--color-status-danger)] text-[var(--color-text-inverse)] hover:opacity-90 active:opacity-80",
};

const sizeClasses: Record<ButtonSize, string> = {
  small: "min-h-[var(--control-small)] gap-1.5 px-3",
  medium: "min-h-[var(--control-medium)] gap-2 px-4",
  large: "min-h-[var(--control-large)] gap-2.5 px-5",
};

const iconSizes: Record<ButtonSize, "small" | "medium"> = {
  small: "small",
  medium: "medium",
  large: "medium",
};

export function Button({
  variant = "primary",
  size = "medium",
  icon: Icon,
  iconPosition = "start",
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className,
  type = "button",
  ref,
  ...props
}: ButtonProps) {
  const icon = Icon ? (
    <Icon
      aria-hidden="true"
      size={getIconSize(iconSizes[size])}
      strokeWidth={iconStrokeWidth}
    />
  ) : null;

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        "type-button relative inline-flex items-center justify-center rounded-[var(--radius-small)] border transition-[background-color,border-color,color,opacity] duration-[var(--motion-fast)] ease-[var(--motion-standard)]",
        variantClasses[variant],
        sizeClasses[size],
        focusRing,
        disabledState,
        fullWidth && "w-full",
        className,
      )}
    >
      {loading ? (
        <span className="absolute inset-0 grid place-items-center">
          <Spinner size={iconSizes[size]} />
        </span>
      ) : null}
      <span
        className={cx(
          "inline-flex items-center justify-center gap-[inherit]",
          loading && "opacity-0",
        )}
      >
        {iconPosition === "start" ? icon : null}
        {children}
        {iconPosition === "end" ? icon : null}
      </span>
    </button>
  );
}
