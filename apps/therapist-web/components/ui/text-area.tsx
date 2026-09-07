import { useId, type TextareaHTMLAttributes } from "react";

import { Field, getFieldDescriptionId, type FieldMessages } from "./field";
import { cx, disabledState, focusRing } from "./styles";

export interface TextAreaProps
  extends
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof FieldMessages>,
    FieldMessages {
  readonly containerClassName?: string;
}

export function TextArea({
  id: providedId,
  label,
  helperText,
  errorText,
  required,
  requiredLabel,
  containerClassName,
  className,
  disabled,
  rows = 4,
  ...props
}: TextAreaProps) {
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
      <textarea
        {...props}
        id={id}
        rows={rows}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(errorText)}
        aria-describedby={descriptionId}
        className={cx(
          "type-body w-full resize-y rounded-[var(--radius-small)] border bg-[var(--color-surface-primary)] px-3 py-2.5 text-start text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)]",
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
