import { useId, type InputHTMLAttributes, type ReactNode } from "react";

import { getFieldDescriptionId } from "./field";
import { cx, disabledState, focusRing } from "./styles";

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  readonly label: ReactNode;
  readonly helperText?: ReactNode;
  readonly errorText?: ReactNode;
}

export function Checkbox({
  id: providedId,
  label,
  helperText,
  errorText,
  className,
  disabled,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = getFieldDescriptionId(
    id,
    Boolean(errorText),
    Boolean(helperText),
  );

  return (
    <div className="grid gap-1.5">
      <label
        htmlFor={id}
        className={cx(
          "type-bodyStrong inline-flex min-h-11 cursor-pointer items-center gap-2 text-[var(--color-text-primary)]",
          disabled && "cursor-not-allowed opacity-45",
          className,
        )}
      >
        <input
          {...props}
          id={id}
          type="checkbox"
          disabled={disabled}
          aria-invalid={Boolean(errorText)}
          aria-describedby={descriptionId}
          className={cx(
            "size-5 shrink-0 accent-[var(--color-brand-primary)]",
            focusRing,
            disabledState,
          )}
        />
        <span>{label}</span>
      </label>
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
