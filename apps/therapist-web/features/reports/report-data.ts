import {
  eventsFor,
  intensityMix,
  medianRecovery,
  rankTriggers,
  supportStats,
  type Ranked,
  type SupportStat,
} from "@/lib/sample-data/analysis";
import { fill } from "@/lib/format";
import { addDays, dayOf, formatDay, SAMPLE_TODAY } from "@/lib/sample-data/time";
import type { CareEvent, Intensity, ReportDocument, Trigger } from "@/lib/sample-data/types";

export type ReportStatus = ReportDocument["status"];
export type ReportAudience = ReportDocument["audience"];

export interface DeskReport extends ReportDocument {
  /** Day the report was shared in this session, if any. */
  readonly sharedOn: string | null;
}

export const statusOrder: readonly ReportStatus[] = ["draft", "ready", "shared"];
export const audiences: readonly ReportAudience[] = ["family", "school", "clinicalTeam"];

export type PeriodPreset = "d14" | "d28" | "session";
export const periodPresets: readonly PeriodPreset[] = ["d14", "d28", "session"];

export function parsePeriod(period: string): { from: string; to: string } {
  const [from = SAMPLE_TODAY, to = SAMPLE_TODAY] = period.split("/");
  return { from, to };
}

export function presetPeriod(preset: PeriodPreset, lastSession: string): string {
  const from =
    preset === "d14"
      ? addDays(SAMPLE_TODAY, -13)
      : preset === "d28"
        ? addDays(SAMPLE_TODAY, -27)
        : addDays(lastSession, 1);
  return `${from}/${SAMPLE_TODAY}`;
}

export interface ReportSummary {
  readonly events: readonly CareEvent[];
  readonly mix: Record<Intensity, number>;
  readonly triggers: readonly Ranked<Trigger>[];
  readonly supports: readonly SupportStat[];
  readonly recovery: number;
  /** First day with a log inside the period, when logs start later than the period. */
  readonly coverageFrom: string | null;
}

export function summarize(report: ReportDocument): ReportSummary {
  const { from, to } = parsePeriod(report.period);
  const list = eventsFor(report.childId).filter((event) => {
    const day = dayOf(event.at);
    return day >= from && day <= to;
  });
  const earliest = list.reduce<string | null>((min, event) => {
    const day = dayOf(event.at);
    return !min || day < min ? day : min;
  }, null);
  return {
    events: list,
    mix: intensityMix(list),
    triggers: rankTriggers(list).slice(0, 3),
    supports: [...supportStats(list)].sort((a, b) => b.rate - a.rate || b.uses - a.uses).slice(0, 3),
    recovery: medianRecovery(list),
    coverageFrom: earliest && earliest > addDays(from, 2) ? earliest : null,
  };
}

type Language = Parameters<typeof formatDay>[1];

export function periodLabel(period: string, language: Language, t: (key: "reports.period") => string) {
  const { from, to } = parsePeriod(period);
  return fill(t("reports.period"), { from: formatDay(from, language), to: formatDay(to, language) });
}
