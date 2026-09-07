import type { SupportedLanguage } from "@stability/i18n";
import { ChevronDown } from "lucide-react";
import { useId, type SelectHTMLAttributes } from "react";

import { Field, getFieldDescriptionId, type FieldMessages } from "./field";
import { getIconSize, iconStrokeWidth } from "./icon";
import { cx, disabledState, focusRing } from "./styles";

export interface SelectOption {
  readonly value: string;
  readonly label: string;
  readonly language?: SupportedLanguage;
  readonly disabled?: boolean;
}

export interface SelectProps
  extends
    Omit<SelectHTMLAttributes<HTMLSelectElement>, keyof FieldMessages>,
    FieldMessages {
  readonly options: readonly SelectOption[];
  readonly placeholder?: string;
  readonly containerClassName?: string;
}

export function Select({
  id: providedId,
  label,
  helperText,
  errorText,
  required,
  requiredLabel,
  options,
  placeholder,
  containerClassName,
  className,
  disabled,
  ...props
}: SelectProps) {
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
      <div className="relative">
        <select
          {...props}
          id={id}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(errorText)}
          aria-describedby={descriptionId}
          className={cx(
            "type-body min-h-[var(--control-medium)] w-full appearance-none rounded-[var(--radius-small)] border bg-[var(--color-surface-primary)] ps-3 pe-10 text-start text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)]",
            errorText
              ? "border-[var(--color-status-danger)]"
              : "border-[var(--color-border-default)]",
            focusRing,
            disabledState,
            className,
          )}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              lang={option.language}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          size={getIconSize("small")}
          strokeWidth={iconStrokeWidth}
        />
      </div>
    </Field>
  );
}
