import type { ReactNode } from "react";

import { getIconSize, iconStrokeWidth, type UiIcon } from "./icon";
import { Text } from "./text";
import { cx } from "./styles";

export interface EmptyStateProps {
  readonly icon: UiIcon;
  readonly title: ReactNode;
  readonly description: ReactNode;
  readonly action?: ReactNode;
  readonly className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cx(
        "grid justify-items-center gap-3 rounded-[var(--radius-medium)] border border-dashed border-[var(--color-border-default)] bg-[var(--color-surface-secondary)] px-6 py-8 text-center",
        className,
      )}
    >
      <span className="grid size-10 place-items-center rounded-[var(--radius-small)] bg-[var(--color-brand-subtle)] text-[var(--color-brand-primary)]">
        <Icon
          aria-hidden="true"
          size={getIconSize("large")}
          strokeWidth={iconStrokeWidth}
        />
      </span>
      <Text as="h3" variant="cardTitle">
        {title}
      </Text>
      <Text color="muted" className="max-w-md">
        {description}
      </Text>
      {action ? <div className="mt-1">{action}</div> : null}
    </section>
  );
}
