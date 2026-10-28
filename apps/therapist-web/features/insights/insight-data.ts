import { dayParts, eventsSince, intensityMix, rankTriggers, rhythmGrid, supportStats, type DayPart } from "@/lib/sample-data/analysis";
import { children, events } from "@/lib/sample-data/fixtures";
import { addDays, dayOf, SAMPLE_TODAY } from "@/lib/sample-data/time";
import type { CareEvent, ChildFile, Intensity, Trend } from "@/lib/sample-data/types";

export type PeriodDays = 14 | 28;
export const periodOptions: readonly PeriodDays[] = [14, 28];

/** Minimum uses before a support is ranked by success rate. */
export const MIN_SUPPORT_USES = 3;

export interface ChildTrend {
  readonly child: ChildFile;
  readonly events: readonly CareEvent[];
  readonly before: number;
  readonly after: number;
  readonly trend: Trend;
}

export interface WeekMix {
  readonly start: string;
  readonly end: string;
  readonly mix: Record<Intensity, number>;
  readonly total: number;
  /** False when the week falls outside the selected period. */
  readonly inPeriod: boolean;
}

export interface CaseloadInsights {
  readonly days: PeriodDays;
  readonly events: readonly CareEvent[];
  readonly triggers: ReturnType<typeof rankTriggers>;
  readonly supports: ReturnType<typeof supportStats>;
  readonly peak: { readonly weekday: number; readonly part: DayPart } | null;
  readonly trends: readonly ChildTrend[];
  readonly weeks: readonly WeekMix[];
}

function inRange(event: CareEvent, from: string, to: string) {
  const day = dayOf(event.at);
  return day >= from && day <= to;
}

/** Second half of the period against the first half, with a proportional threshold. */
function trendBetween(before: number, after: number): Trend {
  if (after - before >= 2 && after >= before * 1.25) return "busier";
  if (before - after >= 2 && after <= before * 0.8) return "calmer";
  return "steady";
}

export function caseloadInsights(days: PeriodDays): CaseloadInsights {
  const list = eventsSince(events, addDays(SAMPLE_TODAY, -days));
  const half = days / 2;
  const midpoint = addDays(SAMPLE_TODAY, -half);

  const grid = rhythmGrid(list);
  let peak: CaseloadInsights["peak"] = null;
  let best = 0;
  grid.forEach((row, partIndex) =>
    row.forEach((value, weekday) => {
      const part = dayParts[partIndex];
      if (value > best && part) {
        best = value;
        peak = { weekday, part };
      }
    }),
  );

  const trends = children.map((child) => {
    const own = list.filter((event) => event.childId === child.id);
    const after = own.filter((event) => dayOf(event.at) > midpoint).length;
    const before = own.length - after;
    return { child, events: own, before, after, trend: trendBetween(before, after) };
  });

  /** Always the last 4 weeks, so the chart keeps its shape; weeks outside the period recede. */
  const weeks = Array.from({ length: 4 }, (_, index) => {
    const end = addDays(SAMPLE_TODAY, -7 * (3 - index));
    const start = addDays(end, -6);
    const weekEvents = events.filter((event) => inRange(event, start, end));
    return { start, end, mix: intensityMix(weekEvents), total: weekEvents.length, inPeriod: index >= 4 - days / 7 };
  });

  return {
    days,
    events: list,
    triggers: rankTriggers(list),
    supports: supportStats(list)
      .filter((stat) => stat.uses >= MIN_SUPPORT_USES)
      .sort((a, b) => b.rate - a.rate || b.uses - a.uses),
    peak,
    trends,
    weeks,
  };
}
