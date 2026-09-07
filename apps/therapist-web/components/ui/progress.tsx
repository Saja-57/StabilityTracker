import { cx } from "./styles";

export interface ProgressProps {
  readonly value: number;
  readonly label: string;
  readonly className?: string;
}

function clampProgress(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export function Progress({ value, label, className }: ProgressProps) {
  const progress = clampProgress(value);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      className={cx(
        "h-2 w-full overflow-hidden rounded-[var(--radius-full)] bg-[var(--color-background-subtle)]",
        className,
      )}
    >
      <div
        className="h-full rounded-[inherit] bg-[var(--color-brand-primary)] transition-[inline-size] duration-[var(--motion-normal)] ease-[var(--motion-standard)]"
        style={{ inlineSize: `${progress}%` }}
      />
    </div>
  );
}
