"use client";

import { useState } from "react";

import type { WeekMix } from "./insight-data";
import { Action, intensityFill } from "@/components/case-file/primitives";
import { cx } from "@/components/ui/styles";
import { fill } from "@/lib/format";
import { formatDay } from "@/lib/sample-data/time";
import type { Intensity } from "@/lib/sample-data/types";
import { useLanguage } from "@/providers/language-provider";

/** Bottom to top: the most serious intensity sits on the baseline. */
const stackOrder: readonly Intensity[] = ["high", "moderate", "low"];
const legendOrder: readonly Intensity[] = ["low", "moderate", "high"];
const PLOT_HEIGHT = 220;

function niceMax(value: number): { max: number; step: number } {
  const raw = Math.max(4, value) / 4;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((candidate) => candidate >= raw) ?? raw;
  return { max: step * 4, step };
}

export function WeeklyIntensity({ weeks }: { weeks: readonly WeekMix[] }) {
  const { language, t } = useLanguage();
  const [active, setActive] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const { max, step } = niceMax(Math.max(...weeks.map((week) => week.total)));
  const ticks = Array.from({ length: 5 }, (_, index) => index * step);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-10">
      <figure className="grid min-w-0 gap-3">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3">
          {/* y axis */}
          <div className="relative w-8" style={{ height: PLOT_HEIGHT }} aria-hidden="true">
            {ticks.map((tick) => (
              <span
                key={tick}
                className="font-figures absolute end-0 text-[11px] text-ink-3"
                style={{ bottom: `${(tick / max) * 100}%`, transform: "translateY(50%)" }}
              >
                {tick}
              </span>
            ))}
          </div>

          {/* plot */}
          <div className="relative" style={{ height: PLOT_HEIGHT }}>
            {ticks.map((tick) => (
              <span
                key={tick}
                aria-hidden="true"
                className={cx("absolute inset-x-0 h-px", tick === 0 ? "bg-rule-strong" : "bg-rule")}
                style={{ bottom: `${(tick / max) * 100}%` }}
              />
            ))}
            <div className="animate-bars relative grid h-full grid-cols-4 items-end gap-[12%] px-[6%]">
              {weeks.map((week, index) => {
                const label = fill(t("insights.weekly.total"), { count: week.total });
                const range = `${formatDay(week.start, language)} – ${formatDay(week.end, language)}`;
                const description = `${range}: ${label}. ${legendOrder
                  .map((level) => `${t(`vocab.intensity.${level}`)} ${week.mix[level]}`)
                  .join(", ")}`;
                return (
                  <div
                    key={week.end}
                    tabIndex={0}
                    role="img"
                    aria-label={description}
                    onMouseEnter={() => setActive(index)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(index)}
                    onBlur={() => setActive(null)}
                    className={cx(
                      "relative flex h-full flex-col justify-end rounded-[6px] outline-offset-4 transition-opacity duration-300",
                      !week.inPeriod && "opacity-35",
                      active !== null && active !== index && "opacity-60",
                    )}
                    style={{ ["--i" as string]: index }}
                  >
                    <div className="flex flex-col-reverse gap-[2px]">
                      {stackOrder.map((level, levelIndex) => {
                        const count = week.mix[level];
                        if (!count) return null;
                        const isTop = stackOrder.slice(levelIndex + 1).every((next) => !week.mix[next]);
                        return (
                          <span
                            key={level}
                            className={cx("block w-full", intensityFill[level], isTop ? "rounded-t-[4px]" : undefined)}
                            style={{ height: `${(count / max) * (PLOT_HEIGHT - 2)}px` }}
                          />
                        );
                      })}
                    </div>
                    <span className="font-figures absolute inset-x-0 text-center text-[12px] text-ink-2" style={{ bottom: `calc(${(week.total / max) * 100}% + 6px)` }}>
                      {week.total}
                    </span>
                    {active === index ? (
                      <span
                        role="presentation"
                        className="pointer-events-none absolute start-1/2 top-2 z-10 grid w-max -translate-x-1/2 gap-1 rounded-[10px] bg-sheet-raised px-3 py-2 text-[12px] text-ink-2 shadow-lift rtl:translate-x-1/2"
                      >
                        <span className="font-medium text-ink">{range}</span>
                        {legendOrder.map((level) => (
                          <span key={level} className="flex items-center justify-between gap-4">
                            <span className="inline-flex items-center gap-1.5">
                              <span className={cx("size-2.5 rounded-[3px]", intensityFill[level])} />
                              {t(`vocab.intensity.${level}`)}
                            </span>
                            <span className="font-figures text-ink">{week.mix[level]}</span>
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* x axis */}
          <span />
          <div className="grid grid-cols-4 gap-[12%] px-[6%] pt-2" aria-hidden="true">
            {weeks.map((week) => (
              <span key={week.end} className={cx("font-figures text-center text-[11.5px] text-ink-3", !week.inPeriod && "opacity-60")}>
                {formatDay(week.end, language)}
              </span>
            ))}
          </div>
        </div>
        <figcaption className="flex flex-wrap justify-between gap-x-6 gap-y-1 ps-11 text-[11.5px] text-ink-3">
          <span>{t("insights.weekly.axis")}</span>
          <span>{t("insights.weekly.weekAxis")}</span>
        </figcaption>
      </figure>

      <div className="grid content-start gap-5 border-t border-rule pt-5 lg:border-t-0 lg:border-s lg:ps-8 lg:pt-0">
        <ul className="grid gap-2.5" aria-label={t("insights.weekly.title")}>
          {legendOrder.map((level) => (
            <li key={level} className="flex items-center justify-between gap-3 text-[13.5px] text-ink-2">
              <span className="inline-flex items-center gap-2">
                <span aria-hidden="true" className={cx("size-3 rounded-[3px]", intensityFill[level])} />
                {t(`vocab.intensity.${level}`)}
              </span>
              <span className="font-figures text-ink">
                {weeks.filter((week) => week.inPeriod).reduce((sum, week) => sum + week.mix[level], 0)}
              </span>
            </li>
          ))}
        </ul>
        <Action
          variant="quiet"
          size="small"
          glyph="layers"
          aria-expanded={showTable}
          aria-controls="weekly-table"
          className="justify-self-start"
          onClick={() => setShowTable((open) => !open)}
        >
          {showTable ? t("insights.weekly.hideTable") : t("insights.weekly.table")}
        </Action>
      </div>

      {showTable ? (
        <div id="weekly-table" className="overflow-x-auto lg:col-span-2">
          <table className="w-full min-w-[26rem] text-[13px]">
            <thead>
              <tr className="border-b border-rule-strong text-ink-3">
                <th scope="col" className="py-2 text-start font-normal">
                  {t("insights.weekly.week")}
                </th>
                {legendOrder.map((level) => (
                  <th key={level} scope="col" className="py-2 text-end font-normal">
                    {t(`vocab.intensity.${level}`)}
                  </th>
                ))}
                <th scope="col" className="py-2 text-end font-normal">
                  {t("insights.weekly.sum")}
                </th>
              </tr>
            </thead>
            <tbody className="font-figures text-ink">
              {weeks.map((week) => (
                <tr key={week.end} className={cx("border-b border-rule", !week.inPeriod && "text-ink-3")}>
                  <th scope="row" className="py-2 text-start font-normal">
                    {formatDay(week.start, language)} – {formatDay(week.end, language)}
                  </th>
                  {legendOrder.map((level) => (
                    <td key={level} className="py-2 text-end">
                      {week.mix[level]}
                    </td>
                  ))}
                  <td className="py-2 text-end">{week.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
