"use client";

import { cx } from "@/components/ui/styles";
import { dailyCells } from "@/lib/sample-data/analysis";
import { formatDay, formatWeekday, SAMPLE_TODAY } from "@/lib/sample-data/time";
import type { CareEvent, Intensity } from "@/lib/sample-data/types";
import { useLanguage } from "@/providers/language-provider";

const barHeight: Record<Intensity, string> = { low: "40%", moderate: "70%", high: "100%" };
const barColor: Record<Intensity, string> = { low: "bg-int-low", moderate: "bg-int-moderate", high: "bg-int-high" };

export interface EventBarcodeProps {
  readonly events: readonly CareEvent[];
  readonly days?: number;
  readonly since?: string;
  readonly height?: number;
  readonly showAxis?: boolean;
  readonly tone?: "sheet" | "folder";
  readonly className?: string;
}

/**
 * One column per day, one bar per logged event, bar height by intensity.
 * Dense and literal: the shape of a fortnight at a glance.
 */
export function EventBarcode({
  events,
  days = 14,
  since,
  height = 44,
  showAxis = false,
  tone = "sheet",
  className,
}: EventBarcodeProps) {
  const { language, t } = useLanguage();
  const cells = dailyCells(events, days);
  const total = cells.reduce((sum, cell) => sum + cell.events.length, 0);

  return (
    <figure className={cx("grid gap-1.5", className)}>
      <div
        role="img"
        aria-label={`${total} ${t("barcode.eventsAcross")} ${days} ${t("barcode.days")}`}
        className="animate-bars grid items-end gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${days}, minmax(0, 1fr))`, height }}
      >
        {cells.map((cell, index) => {
          const isToday = cell.day === SAMPLE_TODAY;
          const afterSession = since ? cell.day > since : false;
          return (
            <div
              key={cell.day}
              title={`${formatDay(cell.day, language)}: ${cell.events.length}`}
              className={cx(
                "relative flex h-full items-end justify-center gap-[2px] rounded-[3px] px-[1px]",
                afterSession ? (tone === "folder" ? "bg-gold-wash/70" : "bg-gold-wash/60") : undefined,
              )}
              style={{ ["--i" as string]: index }}
            >
              {cell.events.length === 0 ? (
                <span className="mb-0 h-[3px] w-full rounded-full bg-rule" />
              ) : (
                cell.events
                  .slice(0, 4)
                  .map((event) => (
                    <span
                      key={event.id}
                      className={cx("w-full max-w-[5px] min-w-[2px] rounded-[1.5px]", barColor[event.intensity])}
                      style={{ height: barHeight[event.intensity] }}
                    />
                  ))
              )}
              {isToday ? (
                <span aria-hidden="true" className="absolute -top-[6px] size-[3px] rounded-full bg-ink" />
              ) : null}
            </div>
          );
        })}
      </div>
      {showAxis ? (
        <figcaption
          className="font-figures grid text-[10.5px] text-ink-3"
          style={{ gridTemplateColumns: `repeat(${days}, minmax(0, 1fr))` }}
        >
          {cells.map((cell, index) => (
            <span key={cell.day} className="pt-1 text-center">
              {index % 2 === (days - 1) % 2 ? formatWeekday(cell.day, language, "narrow") : ""}
            </span>
          ))}
        </figcaption>
      ) : null}
    </figure>
  );
}
