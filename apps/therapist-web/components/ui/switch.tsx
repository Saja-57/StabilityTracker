import type { ReactNode } from "react";

import { cx, disabledState, focusRing } from "./styles";

export interface SwitchProps {
  readonly checked: boolean;
  readonly onCheckedChange: (checked: boolean) => void;
  readonly label: ReactNode;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  label,
  disabled = false,
  className,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cx(
        "type-bodyStrong inline-flex min-h-11 w-fit cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-[var(--color-text-primary)]",
        focusRing,
        disabledState,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          "inline-flex h-6 w-10 shrink-0 items-center rounded-[var(--radius-full)] border p-0.5 transition-colors duration-[var(--motion-fast)]",
          checked
            ? "justify-end border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]"
            : "justify-start border-[var(--color-border-strong)] bg-[var(--color-background-subtle)]",
        )}
      >
        <span
          aria-hidden="true"
          className="size-4 rounded-[var(--radius-full)] bg-[var(--color-surface-primary)] shadow-[var(--shadow-subtle)]"
        />
      </span>
      <span>{label}</span>
    </button>
  );
}
