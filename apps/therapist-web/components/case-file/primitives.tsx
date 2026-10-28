"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";

import { Glyph, type GlyphName } from "@/components/icons/glyphs";
import { cx } from "@/components/ui/styles";
import type { Intensity } from "@/lib/sample-data/types";
import { useLanguage } from "@/providers/language-provider";

/* ----------------------------------------------------------------- tone */

export type Tone = "gold" | "ruby" | "cobalt" | "moss" | "clay" | "ink";

export const toneWash: Record<Tone, string> = {
  gold: "bg-gold-wash text-gold-ink",
  ruby: "bg-ruby-wash text-ruby-ink",
  cobalt: "bg-cobalt-wash text-cobalt-ink",
  moss: "bg-moss-wash text-moss-ink",
  clay: "bg-clay-wash text-ink-2",
  ink: "bg-sheet-sunk text-ink-2",
};

export const toneSolid: Record<Tone, string> = {
  gold: "bg-gold",
  ruby: "bg-ruby",
  cobalt: "bg-cobalt",
  moss: "bg-moss",
  clay: "bg-clay",
  ink: "bg-ink-3",
};

/* --------------------------------------------------------------- button */

type ButtonVariant = "ink" | "gold" | "quiet" | "outline";

const buttonVariants: Record<ButtonVariant, string> = {
  ink: "bg-board text-board-ink shadow-press hover:bg-board-raised active:translate-y-px",
  gold: "bg-gold text-board-deep shadow-press hover:brightness-[1.04] active:translate-y-px",
  quiet: "text-ink-2 hover:bg-sheet-sunk hover:text-ink",
  outline: "bg-sheet-raised text-ink ring-1 ring-rule hover:ring-rule-strong active:translate-y-px",
};

const buttonSizes = {
  small: "h-8 gap-1.5 px-3 text-[13px] rounded-[9px]",
  medium: "h-10 gap-2 px-4 text-[14px] rounded-[11px]",
} as const;

interface ActionBase {
  readonly variant?: ButtonVariant;
  readonly size?: keyof typeof buttonSizes;
  readonly glyph?: GlyphName;
  readonly trailingGlyph?: GlyphName;
  readonly children: ReactNode;
}

function actionClass(variant: ButtonVariant, size: keyof typeof buttonSizes, className?: string) {
  return cx(
    "inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-[background-color,box-shadow,color,filter,transform] duration-150 disabled:pointer-events-none disabled:opacity-45",
    buttonVariants[variant],
    buttonSizes[size],
    className,
  );
}

export function Action({
  variant = "outline",
  size = "medium",
  glyph,
  trailingGlyph,
  children,
  className,
  type = "button",
  ...props
}: ActionBase & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={actionClass(variant, size, className)} {...props}>
      {glyph ? <Glyph name={glyph} size={size === "small" ? 16 : 18} /> : null}
      {children}
      {trailingGlyph ? <Glyph name={trailingGlyph} size={size === "small" ? 15 : 17} /> : null}
    </button>
  );
}

export function ActionLink({
  variant = "outline",
  size = "medium",
  glyph,
  trailingGlyph,
  children,
  className,
  ...props
}: ActionBase & ComponentProps<typeof Link>) {
  return (
    <Link className={actionClass(variant, size, className)} {...props}>
      {glyph ? <Glyph name={glyph} size={size === "small" ? 16 : 18} /> : null}
      {children}
      {trailingGlyph ? <Glyph name={trailingGlyph} size={size === "small" ? 15 : 17} /> : null}
    </Link>
  );
}

/* ------------------------------------------------------------ intensity */

const intensityLevel: Record<Intensity, number> = { low: 1, moderate: 2, high: 3 };
export const intensityFill: Record<Intensity, string> = {
  low: "bg-int-low",
  moderate: "bg-int-moderate",
  high: "bg-int-high",
};

export function IntensityMark({ intensity, withLabel = false }: { intensity: Intensity; withLabel?: boolean }) {
  const { t } = useLanguage();
  const level = intensityLevel[intensity];
  return (
    <span className="inline-flex items-center gap-1.5" title={t(`vocab.intensity.${intensity}`)}>
      <span aria-hidden="true" className="inline-flex h-3 items-end gap-[2px]">
        {[1, 2, 3].map((step) => (
          <span
            key={step}
            className={cx("w-[3px] rounded-[1px]", step <= level ? intensityFill[intensity] : "bg-rule")}
            style={{ height: `${4 + step * 2.5}px` }}
          />
        ))}
      </span>
      {withLabel ? (
        <span className="text-[12.5px] text-ink-2">{t(`vocab.intensity.${intensity}`)}</span>
      ) : (
        <span className="sr-only">{t(`vocab.intensity.${intensity}`)}</span>
      )}
    </span>
  );
}

/* ---------------------------------------------------------------- stamp */

export function DateStamp({
  children,
  tone = "stamp",
  tilt = -3,
  className,
}: {
  children: ReactNode;
  tone?: "stamp" | "pen" | "moss";
  tilt?: number;
  className?: string;
}) {
  const color = tone === "stamp" ? "text-stamp" : tone === "pen" ? "text-pen" : "text-moss-ink";
  return (
    <span
      className={cx(
        "stamp animate-stamp inline-flex items-center gap-1.5 rounded-[6px] border-[1.5px] border-current px-2 py-[3px] text-[11px] font-medium opacity-90 mix-blend-multiply",
        color,
        className,
      )}
      style={{ ["--stamp-tilt" as string]: `${tilt}deg`, transform: `rotate(${tilt}deg)` }}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------- pen marks */

/** A ballpoint tick: an uneven, slightly overshooting hand stroke. */
export function PenTick({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={cx(
        "grid size-8 shrink-0 place-items-center rounded-[8px] transition-[background-color,box-shadow] duration-200",
        checked ? "text-pen" : "text-transparent ring-1 ring-rule-strong ring-inset hover:bg-sheet-sunk",
      )}
    >
      <svg aria-hidden="true" viewBox="0 0 28 28" width={26} height={26} fill="none">
        {checked ? (
          <path
            className="pen-draw"
            d="M4.6 15.2c1.3.4 2.7 1.7 3.9 3.3.6.8 1.1 1.7 1.5 2.6.2-.6.9-2.3 2.2-4.6 2.6-4.6 6.4-9.5 12.2-13.4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.2}
            style={{ ["--pen-length" as string]: 40 }}
          />
        ) : null}
      </svg>
    </button>
  );
}

/** A loose ballpoint loop drawn around whatever the therapist flagged. */
export function PenCircle({ children, label }: { children: ReactNode; label: string }) {
  return (
    <span className="relative inline-flex items-center px-2 py-0.5">
      {children}
      <span className="sr-only">{label}</span>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-1 -inset-y-1.5 h-[calc(100%+12px)] w-[calc(100%+8px)] overflow-visible text-pen"
        preserveAspectRatio="none"
        viewBox="0 0 100 40"
        fill="none"
      >
        <path
          className="pen-draw"
          d="M62 4.5C40 1.5 9 5 4.2 17.6 0.4 27.7 26 36.6 55 35.2c27-1.3 42.4-9 40.6-19.2C93.7 5.4 66 1.2 44 4.4 33 6 24 8.6 19 11"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={1.7}
          vectorEffect="non-scaling-stroke"
          style={{ ["--pen-length" as string]: 300 }}
        />
      </svg>
    </span>
  );
}

/* ------------------------------------------------------------ headings */

export function SheetHeading({
  title,
  aside,
  description,
  as: Tag = "h2",
  className,
}: {
  title: ReactNode;
  aside?: ReactNode;
  description?: ReactNode;
  as?: "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={cx("flex flex-wrap items-end justify-between gap-x-6 gap-y-2", className)}>
      <div className="grid min-w-0 gap-1">
        <Tag className={cx("font-display text-ink", Tag === "h2" ? "text-[21px] leading-7" : "text-[17px] leading-6")}>
          {title}
        </Tag>
        {description ? <p className="max-w-[60ch] text-[14px] leading-5 text-ink-3">{description}</p> : null}
      </div>
      {aside}
    </div>
  );
}

export function TabLabel({ tone, children, className }: { tone: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex h-6 items-center gap-1.5 rounded-[7px] px-2 text-[12px] font-medium whitespace-nowrap",
        toneWash[tone],
        className,
      )}
    >
      <span aria-hidden="true" className={cx("size-1.5 rounded-full", toneSolid[tone])} />
      {children}
    </span>
  );
}

export function Figure({
  value,
  label,
  unit,
  className,
}: {
  value: ReactNode;
  label: ReactNode;
  unit?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("grid gap-0.5", className)}>
      <span className="font-figures text-[26px] leading-8 text-ink">
        {value}
        {unit ? <span className="ms-1 text-[13px] text-ink-3">{unit}</span> : null}
      </span>
      <span className="text-[12.5px] leading-4 text-ink-3">{label}</span>
    </div>
  );
}
