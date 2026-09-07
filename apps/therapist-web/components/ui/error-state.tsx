import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";

import { getIconSize, iconStrokeWidth } from "./icon";
import { Text } from "./text";
import { cx } from "./styles";

export interface ErrorStateProps {
  readonly title: ReactNode;
  readonly description: ReactNode;
  readonly action?: ReactNode;
  readonly className?: string;
}

export function ErrorState({
  title,
  description,
  action,
  className,
}: ErrorStateProps) {
  return (
    <section
      role="alert"
      className={cx(
        "grid justify-items-center gap-3 rounded-[var(--radius-medium)] border border-[var(--color-status-danger)] bg-[var(--color-status-surface-danger)] px-6 py-8 text-center",
        className,
      )}
    >
      <CircleAlert
        aria-hidden="true"
        className="text-[var(--color-status-danger)]"
        size={getIconSize("large")}
        strokeWidth={iconStrokeWidth}
      />
      <Text as="h3" variant="cardTitle">
        {title}
      </Text>
      <Text color="secondary" className="max-w-md">
        {description}
      </Text>
      {action ? <div className="mt-1">{action}</div> : null}
    </section>
  );
}
