import type { HTMLAttributes } from "react";

import { cx } from "./styles";

export type CardVariant = "default" | "subtle" | "interactive" | "highlighted";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  readonly variant?: CardVariant;
}

const variantClasses: Record<CardVariant, string> = {
  default:
    "border-[var(--color-border-subtle)] bg-[var(--color-surface-primary)]",
  subtle:
    "border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]",
  interactive:
    "border-[var(--color-border-default)] bg-[var(--color-surface-primary)] transition-[background-color,border-color] duration-[var(--motion-fast)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-interactive)]",
  highlighted:
    "border-[var(--color-brand-secondary)] bg-[var(--color-brand-subtle)]",
};

export function Card({ variant = "default", className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cx(
        "rounded-[var(--radius-medium)] border p-5",
        variantClasses[variant],
        className,
      )}
    />
  );
}
