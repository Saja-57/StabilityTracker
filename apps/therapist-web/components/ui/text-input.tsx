import { useId, type InputHTMLAttributes } from "react";

import { Field, getFieldDescriptionId, type FieldMessages } from "./field";
import { cx, disabledState, focusRing } from "./styles";

export interface TextInputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "size" | keyof FieldMessages>,
    FieldMessages {
  readonly containerClassName?: string;
}

export function TextInput({
  id: providedId,
  label,
  helperText,
  errorText,
  required,
  requiredLabel,
  containerClassName,
  className,
  disabled,
  ...props
}: TextInputProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = getFieldDescriptionId(
    id,
    Boolean(errorText),
    Boolean(helperText),
  );

  return (
    <Field
      id={id}
      label={label}
      helperText={helperText}
      errorText={errorText}
      required={required}
      requiredLabel={requiredLabel}
      className={containerClassName}
    >
      <input
        {...props}
        id={id}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(errorText)}
        aria-describedby={descriptionId}
        className={cx(
          "type-body min-h-[var(--control-medium)] w-full rounded-[var(--radius-small)] border bg-[var(--color-surface-primary)] px-3 text-start text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)]",
          errorText
            ? "border-[var(--color-status-danger)]"
            : "border-[var(--color-border-default)]",
          focusRing,
          disabledState,
          className,
        )}
      />
    </Field>
  );
}
