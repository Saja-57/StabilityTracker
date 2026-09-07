import type { HTMLAttributes } from "react";

import { cx } from "./styles";

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cx(
        "ui-skeleton rounded-[var(--radius-small)] bg-[var(--color-background-subtle)]",
        className,
      )}
    />
  );
}
