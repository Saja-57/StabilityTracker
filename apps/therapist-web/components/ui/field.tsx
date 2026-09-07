import type { ReactNode } from "react";

import { cx } from "./styles";

export interface FieldMessages {
  readonly label: ReactNode;
  readonly helperText?: ReactNode | undefined;
  readonly errorText?: ReactNode | undefined;
  readonly required?: boolean | undefined;
  readonly requiredLabel?: string | undefined;
}

interface FieldProps extends FieldMessages {
  readonly id: string;
  readonly children: ReactNode;
  readonly className?: string | undefined;
}

export function getFieldDescriptionId(
  id: string,
  hasError: boolean,
  hasHelper: boolean,
): string | undefined {
  if (hasError) {
    return `${id}-error`;
  }

  return hasHelper ? `${id}-helper` : undefined;
}

export function Field({
  id,
  label,
  helperText,
  errorText,
  required,
  requiredLabel,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cx("grid gap-1.5", className)}>
      <label
        htmlFor={id}
        className="type-label text-[var(--color-text-primary)]"
      >
        {label}
        {required ? (
          <span
            aria-label={requiredLabel}
            className="ms-1 text-[var(--color-status-danger)]"
          >
            *
          </span>
        ) : null}
      </label>
      {children}
      {errorText ? (
        <p
          id={`${id}-error`}
          className="type-helper text-[var(--color-status-danger)]"
        >
          {errorText}
        </p>
      ) : helperText ? (
        <p
          id={`${id}-helper`}
          className="type-helper text-[var(--color-text-muted)]"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
