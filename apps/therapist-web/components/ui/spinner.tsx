import { LoaderCircle } from "lucide-react";

import { getIconSize, iconStrokeWidth, type IconSize } from "./icon";
import { cx } from "./styles";

export interface SpinnerProps {
  readonly size?: IconSize;
  readonly className?: string;
  readonly label?: string;
}

export function Spinner({ size = "medium", className, label }: SpinnerProps) {
  return (
    <LoaderCircle
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "status" : undefined}
      className={cx("ui-spin shrink-0", className)}
      size={getIconSize(size)}
      strokeWidth={iconStrokeWidth}
    />
  );
}
