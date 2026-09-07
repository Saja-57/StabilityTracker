import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

import { getIconSize, iconStrokeWidth, type UiIcon } from "./icon";
import { cx } from "./styles";

export type BadgeVariant =
  "neutral" | "brand" | "success" | "warning" | "danger" | "info";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  readonly variant?: BadgeVariant;
  readonly icon?: UiIcon;
  readonly children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral:
    "bg-[var(--color-background-subtle)] text-[var(--color-text-secondary)]",
  brand: "bg-[var(--color-brand-subtle)] text-[var(--color-brand-primary)]",
  success:
    "bg-[var(--color-status-surface-success)] text-[var(--color-status-success)]",
  warning:
    "bg-[var(--color-status-surface-warning)] text-[var(--color-status-warning)]",
  danger:
    "bg-[var(--color-status-surface-danger)] text-[var(--color-status-danger)]",
  info: "bg-[var(--color-status-surface-info)] text-[var(--color-status-info)]",
};

export function Badge({
  variant = "neutral",
  icon: Icon,
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={cx(
        "type-caption inline-flex min-h-6 items-center gap-1 rounded-[var(--radius-full)] px-2 py-1 font-medium",
        variantClasses[variant],
        className,
      )}
    >
      {Icon ? (
        <Icon
          aria-hidden="true"
          size={getIconSize("small")}
          strokeWidth={iconStrokeWidth}
        />
      ) : null}
      {children}
    </span>
  );
}

export type StatusBadgeStatus = "success" | "warning" | "danger" | "info";

export interface StatusBadgeProps extends Omit<BadgeProps, "variant" | "icon"> {
  readonly status: StatusBadgeStatus;
}

const statusIcons: Record<StatusBadgeStatus, UiIcon> = {
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleX,
  info: Info,
};

export function StatusBadge({ status, ...props }: StatusBadgeProps) {
  return <Badge {...props} variant={status} icon={statusIcons[status]} />;
}
