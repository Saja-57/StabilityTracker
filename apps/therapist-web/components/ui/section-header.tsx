import type { ReactNode } from "react";

import { Text } from "./text";
import { cx } from "./styles";

export interface SectionHeaderProps {
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly action?: ReactNode;
  readonly className?: string;
}

export function SectionHeader({
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={cx(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="grid min-w-0 gap-1">
        <Text as="h2" variant="sectionTitle">
          {title}
        </Text>
        {description ? <Text color="muted">{description}</Text> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
