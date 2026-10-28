"use client";

import { cx } from "@/components/ui/styles";
import { dayParts, rhythmGrid } from "@/lib/sample-data/analysis";
import { addDays, formatWeekday } from "@/lib/sample-data/time";
import type { CareEvent } from "@/lib/sample-data/types";
import { useLanguage } from "@/providers/language-provider";

/** A Monday used only to label weekday columns. */
const REFERENCE_MONDAY = "2026-10-12";

/**
 * The behaviour-analysis scatterplot: weekday by part of day, ink density by
 * intensity-weighted event count. Patterns announce themselves.
 */
export function RhythmGrid({ events, compact = false }: { events: readonly CareEvent[]; compact?: boolean }) {
  const { language, t } = useLanguage();
  const grid = rhythmGrid(events);
  const max = Math.max(1, ...grid.flat());

  return (
    <div className="grid gap-2">
      <div
        className="grid items-center gap-[5px]"
        style={{ gridTemplateColumns: `${compact ? "4.5rem" : "6rem"} repeat(7, minmax(0, 1fr))` }}
      >
        <span />
        {Array.from({ length: 7 }, (_, index) => (
          <span key={index} className="text-center text-[11px] text-ink-3">
            {formatWeekday(addDays(REFERENCE_MONDAY, index), language, compact ? "narrow" : "short")}
          </span>
        ))}
        {dayParts.map((part, row) => (
          <RhythmRow key={part} label={t(`vocab.dayPart.${part}`)} values={grid[row] ?? []} max={max} compact={compact} />
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 text-[11px] text-ink-3">
        <span>{t("rhythm.fewer")}</span>
        {[0.12, 0.35, 0.6, 0.85].map((level) => (
          <span key={level} className="size-3 rounded-[3px] bg-board" style={{ opacity: level }} />
        ))}
        <span>{t("rhythm.more")}</span>
      </div>
    </div>
  );
}

function RhythmRow({
  label,
  values,
  max,
  compact,
}: {
  label: string;
  values: readonly number[];
  max: number;
  compact: boolean;
}) {
  return (
    <>
      <span className={cx("truncate text-ink-3", compact ? "text-[11px]" : "text-[12px]")}>{label}</span>
      {values.map((value, index) => (
        <span
          key={index}
          className={cx("relative rounded-[5px] bg-sheet-sunk", compact ? "h-6" : "h-8")}
          title={String(value)}
        >
          {value > 0 ? (
            <span
              className="absolute inset-0 rounded-[5px] bg-board transition-opacity duration-500"
              style={{ opacity: 0.12 + (value / max) * 0.8 }}
            />
          ) : null}
        </span>
      ))}
    </>
  );
}

export function RankBars({
  rows,
  tone = "board",
}: {
  rows: readonly { key: string; label: string; value: number; display: string; note?: string }[];
  tone?: "board" | "moss" | "ruby";
}) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  const fill = tone === "moss" ? "bg-moss" : tone === "ruby" ? "bg-ruby" : "bg-board";
  return (
    <ol className="grid gap-3">
      {rows.map((row, index) => (
        <li key={row.key} className="grid gap-1.5" style={{ ["--i" as string]: index }}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="truncate text-[14px] text-ink">{row.label}</span>
            <span className="font-figures shrink-0 text-[12.5px] text-ink-3">
              {row.display}
              {row.note ? <span className="ms-2 text-ink-3">{row.note}</span> : null}
            </span>
          </div>
          <span className="h-[6px] overflow-hidden rounded-full bg-sheet-sunk">
            <span
              className={cx("animate-settle block h-full rounded-full", fill)}
              style={{ width: `${Math.max(6, (row.value / max) * 100)}%`, ["--i" as string]: index }}
            />
          </span>
        </li>
      ))}
    </ol>
  );
}
