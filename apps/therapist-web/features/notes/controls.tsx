"use client";

import { useId, useRef, type KeyboardEvent, type ReactNode, type SelectHTMLAttributes } from "react";

import { Glyph } from "@/components/icons/glyphs";
import { cx } from "@/components/ui/styles";
import { useLanguage } from "@/providers/language-provider";

/* ------------------------------------------------------------ segmented */

export interface SegmentOption<T extends string> {
  readonly value: T;
  readonly label: ReactNode;
  /** Optional index-tab dot shown before the label. */
  readonly dot?: string;
}

/**
 * A radio group drawn as a recessed strip on the sheet. Arrow keys move the
 * selection and follow reading direction, so RTL behaves naturally.
 */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled = false,
  className,
}: {
  label: string;
  value: T;
  options: readonly SegmentOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
}) {
  const { direction } = useLanguage();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const forward = direction === "rtl" ? "ArrowLeft" : "ArrowRight";
    const back = direction === "rtl" ? "ArrowRight" : "ArrowLeft";
    let next = index;
    if (event.key === forward || event.key === "ArrowDown") next = (index + 1) % options.length;
    else if (event.key === back || event.key === "ArrowUp") next = (index - 1 + options.length) % options.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = options.length - 1;
    else return;
    event.preventDefault();
    const option = options[next];
    if (!option) return;
    onChange(option.value);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={cx(
        "inline-grid auto-cols-fr grid-flow-col gap-0.5 rounded-[11px] bg-sheet-sunk p-0.5 ring-1 ring-rule transition-opacity duration-200",
        disabled && "opacity-50",
        className,
      )}
    >
      {options.map((option, index) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => move(event, index)}
            className={cx(
              "inline-flex h-8 items-center justify-center gap-1.5 rounded-[9px] px-3 text-[13px] whitespace-nowrap transition-[background-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
              active ? "bg-sheet-raised font-medium text-ink shadow-press" : "text-ink-3 hover:text-ink",
              disabled && "cursor-not-allowed",
            )}
          >
            {option.dot ? <span aria-hidden="true" className={cx("size-1.5 rounded-full", option.dot)} /> : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------- form bits */

export const lineField =
  "w-full rounded-none border-0 border-b border-rule-strong bg-transparent px-0 pb-2 pt-1 text-[16px] leading-6 text-ink placeholder:text-ink-3/80 transition-[border-color] duration-200 hover:border-ink-3 focus:border-pen focus:outline-none focus-visible:outline-none";

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-[12.5px] font-medium text-ink-3">
      {children}
    </label>
  );
}

/** Native select, so it keeps the platform picker and full accessibility, drawn as a slip on the sheet. */
export function PaperSelect({
  label,
  children,
  className,
  ...props
}: { label: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <div className={cx("grid gap-1.5", className)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <select
          id={id}
          className="h-10 w-full cursor-pointer appearance-none rounded-[11px] bg-sheet-raised ps-3 pe-9 text-[14.5px] text-ink ring-1 ring-rule transition-[box-shadow] duration-200 hover:ring-rule-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-pen"
          {...props}
        >
          {children}
        </select>
        <Glyph
          name="chevronDown"
          size={16}
          className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-ink-3"
        />
      </div>
    </div>
  );
}
