"use client";

import type { FileTab } from "./file-view";
import { EventBarcode } from "@/components/case-file/event-barcode";
import { useFileCopy } from "@/components/case-file/file-copy";
import { Action, ActionLink, DateStamp, Figure, SheetHeading } from "@/components/case-file/primitives";
import { RankBars, RhythmGrid } from "@/components/case-file/rhythm-grid";
import { Glyph } from "@/components/icons/glyphs";
import { cx } from "@/components/ui/styles";
import { fill } from "@/lib/format";
import {
  eventsFor,
  eventsSince,
  intensityMix,
  medianRecovery,
  rankTriggers,
  supportStats,
} from "@/lib/sample-data/analysis";
import { getRoutine, getSurveys } from "@/lib/sample-data/fixtures";
import { addDays, daysBetween, formatDay, SAMPLE_TODAY } from "@/lib/sample-data/time";
import type { ChildFile } from "@/lib/sample-data/types";
import { useLanguage } from "@/providers/language-provider";

export function FileOverview({ child, onOpenTab }: { child: ChildFile; onOpenTab: (tab: FileTab) => void }) {
  const { language, t } = useLanguage();
  const all = eventsFor(child.id);
  const month = eventsSince(all, addDays(SAMPLE_TODAY, -28));
  const since = eventsSince(all, child.lastSession);
  const mix = intensityMix(since);
  const triggers = rankTriggers(month).slice(0, 4);
  const supports = supportStats(month).slice(0, 4);
  const routine = getRoutine(child.id);
  const lastWeek = routine.flatMap((step) => step.history.slice(-8, -1));
  const adherence = Math.round((lastWeek.filter((status) => status === "completed").length / Math.max(1, lastWeek.length)) * 100);
  const survey = getSurveys(child.id)[0];
  const surveyDelta = survey?.score != null && survey.previousScore != null ? survey.score - survey.previousScore : 0;
  const days = daysBetween(child.lastSession, SAMPLE_TODAY);
  const copy = useFileCopy(child);

  return (
    <div className="grid gap-10">
      <section className="grid gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <DateStamp tilt={-3}>{fill(t("file.overview.stamp"), { date: formatDay(child.lastSession, language) })}</DateStamp>
          <p className="text-[13.5px] text-ink-3">{fill(t("file.overview.daysAgo"), { days })}</p>
        </div>
        <p className="font-display max-w-[34ch] text-[26px] leading-[1.25] text-ink sm:text-[30px]">{copy.pattern}</p>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <Figure value={since.length} label={t("desk.figures.events")} />
          <Figure value={mix.high} label={t("desk.figures.high")} />
          <Figure value={medianRecovery(since)} unit={t("unit.min")} label={t("desk.figures.recovery")} />
          <Figure value={adherence} unit="%" label={t("file.overview.routineKept")} />
        </div>
        <div className="grid gap-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2 text-[12.5px] text-ink-3">
            <span>{t("desk.needYou.fortnight")}</span>
            <span className="flex items-center gap-4">
              {(["low", "moderate", "high"] as const).map((level) => (
                <span key={level} className="inline-flex items-center gap-1.5">
                  <span
                    className={cx(
                      "h-2.5 w-1 rounded-[1px]",
                      level === "low" ? "bg-int-low" : level === "moderate" ? "bg-int-moderate" : "bg-int-high",
                    )}
                  />
                  {t(`vocab.intensity.${level}`)}
                </span>
              ))}
            </span>
          </div>
          <EventBarcode events={all} days={28} since={child.lastSession} height={72} showAxis />
        </div>
      </section>

      <section className="grid gap-10 border-t border-rule pt-8 md:grid-cols-2 md:gap-12">
        <div className="grid content-start gap-5">
          <SheetHeading as="h3" title={t("file.overview.before")} description={t("file.overview.beforeHint")} />
          <RankBars
            rows={triggers.map((row) => ({
              key: row.key,
              label: t(`vocab.trigger.${row.key}`),
              value: row.count,
              display: `${Math.round(row.share * 100)}%`,
            }))}
          />
        </div>
        <div className="grid content-start gap-5">
          <SheetHeading as="h3" title={t("file.overview.helped")} description={t("file.overview.helpedHint")} />
          <RankBars
            tone="moss"
            rows={supports.map((row) => ({
              key: row.key,
              label: t(`vocab.support.${row.key}`),
              value: row.rate * 100,
              display: `${row.worked}/${row.uses}`,
            }))}
          />
        </div>
      </section>

      <section className="grid gap-10 border-t border-rule pt-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12">
        <div className="grid content-start gap-5">
          <SheetHeading as="h3" title={t("file.overview.when")} description={t("file.overview.whenHint")} />
          <RhythmGrid events={month} />
        </div>
        {survey ? (
          <div className="grid content-start gap-5">
            <SheetHeading as="h3" title={t("file.overview.survey")} />
            <div className="grid gap-3">
              <p className="flex items-baseline gap-3">
                <span className="font-figures text-[44px] leading-none text-ink">{survey.score}</span>
                <span className="text-[13px] text-ink-3">/ 100</span>
                <span
                  className={cx(
                    "font-figures inline-flex items-center gap-1 text-[13px]",
                    surveyDelta < 0 ? "text-ruby-ink" : "text-moss-ink",
                  )}
                >
                  <Glyph name={surveyDelta < 0 ? "trendDown" : "trendUp"} size={15} />
                  {surveyDelta > 0 ? "+" : ""}
                  {surveyDelta}
                </span>
              </p>
              <p className="text-[14.5px] leading-6 text-ink-2"><bdi>{survey.highlight}</bdi></p>
              <p className="text-[12.5px] text-ink-3">
                <bdi>{survey.title}</bdi> / {survey.answeredAt ? formatDay(survey.answeredAt, language) : ""}
              </p>
            </div>
          </div>
        ) : null}
      </section>

      <section className="flex flex-wrap items-center gap-3 border-t border-rule pt-6">
        <ActionLink href={`/messages?family=${child.id}`} variant="ink" glyph="send">
          {t("file.overview.sendGuidance")}
        </ActionLink>
        <Action variant="outline" glyph="routine" onClick={() => onOpenTab("routine")}>
          {t("file.overview.adjustRoutine")}
        </Action>
        <Action variant="quiet" glyph="pulse" onClick={() => onOpenTab("events")}>
          {t("file.overview.readEvents")}
        </Action>
      </section>
    </div>
  );
}
