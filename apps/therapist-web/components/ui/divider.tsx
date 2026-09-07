import type { HTMLAttributes } from "react";

import { cx } from "./styles";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  readonly orientation?: "horizontal" | "vertical";
}

export function Divider({
  orientation = "horizontal",
  className,
  ...props
}: DividerProps) {
  return (
    <div
      {...props}
      role="separator"
      aria-orientation={orientation}
      className={cx(
        "shrink-0 bg-[var(--color-border-subtle)]",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
    />
  );
}
