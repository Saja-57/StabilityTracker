import type { sizing } from "@stability/design-tokens";
import type { HTMLAttributes } from "react";

import { cx } from "./styles";

export type AvatarSize = keyof typeof sizing.avatar;

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  readonly label: string;
  readonly src?: string;
  readonly fallback?: string;
  readonly size?: AvatarSize;
}

const sizeClasses: Record<AvatarSize, string> = {
  small: "size-7 type-caption",
  medium: "size-9 type-label",
  large: "size-12 type-bodyStrong",
};

export function Avatar({
  label,
  src,
  fallback,
  size = "medium",
  className,
  ...props
}: AvatarProps) {
  return (
    <div
      {...props}
      role={src ? undefined : "img"}
      aria-label={src ? undefined : label}
      className={cx(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-full)] bg-[var(--color-brand-subtle)] font-medium text-[var(--color-brand-primary)]",
        sizeClasses[size],
        className,
      )}
    >
      {src ? (
        // This primitive intentionally uses a native image because sources may be external.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={label} className="size-full object-cover" />
      ) : (
        <span aria-hidden="true">{fallback}</span>
      )}
    </div>
  );
}
