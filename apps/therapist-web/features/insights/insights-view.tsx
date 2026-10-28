"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { caseloadInsights, periodOptions, type ChildTrend, type PeriodDays } from "./insight-data";
import { WeeklyIntensity } from "./weekly-intensity";
import { EventBarcode } from "@/components/case-file/event-barcode";
import { FileMonogram } from "@/components/case-file/file-monogram";
import { DateStamp, SheetHeading } from "@/components/case-file/primitives";
import { RankBars, RhythmGrid } from "@/components/case-file/rhythm-grid";
import { Glyph, type GlyphName } from "@/components/icons/glyphs";
import { cx } from "@/components/ui/styles";
import { fill } from "@/lib/format";
import { addDays, formatStampDate, formatWeekday, SAMPLE_TODAY } from "@/lib/sample-data/time";
import type { Trend } from "@/lib/sample-data/types";
import { useLanguage } from "@/providers/language-provider";

const REFERENCE_MONDAY = "2026-10-12";
const trendOrder: readonly Trend[] = ["busier", "steady", "calmer"];
const trendGlyph: Record<Trend, GlyphName> = { calmer: "trendDown", steady: "steady", busier: "trendUp" };
const trendInk: Record<Trend, string> = { calmer: "text-moss-ink", steady: "text-ink-3", busier: "text-ruby-ink" };

export function InsightsView() {
  const { language, t } = useLanguage();
  const [days, setDays] = useState<PeriodDays>(28);
  const data = useMemo(() => caseloadInsights(days), [days]);
  const total = data.events.length;
  const topTrigger = data.triggers[0];
  const topSupport = data.supports[0];
  const busier = data.trends.filter((entry) => entry.trend === "busier").length;
  const peakLabel = data.peak
    ? {
        weekday: formatWeekday(addDays(REFERENCE_MONDAY, data.peak.weekday), language, "long"),
        part: t(`vocab.dayPart.${data.peak.part}`).toLocaleLowerCase(language),
      }
    : null;

  return (
    <div className="grid gap-12">
      <header className="grid gap-6 pt-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="grid gap-4">
          <h1 className="font-display max-w-[18ch] text-[40px] leading-[1.05] text-ink sm:text-[52px]">
            {t("insights.title")}
          </h1>
          <div key={days} className="grid max-w-[64ch] gap-2 text-[17px] leading-7 text-ink-2">
            {total && topTrigger ? (
              <>
                <p className="animate-settle text-ink">
                  {fill(t("insights.lead.trigger"), {
                    trigger: t(`vocab.trigger.${topTrigger.key}`),
                    share: Math.round(topTrigger.share * 100),
                    count: total,
                    days,
                  })}
                </p>
                {topSupport ? (
                  <p className="animate-settle" style={{ ["--i" as string]: 1 }}>
                    {fill(t("insights.lead.support"), {
                      support: t(`vocab.support.${topSupport.key}`),
                      worked: topSupport.worked,
                      uses: topSupport.uses,
                    })}
                  </p>
                ) : null}
                {peakLabel ? (
                  <p className="animate-settle" style={{ ["--i" as string]: 2 }}>
                    {fill(t("insights.lead.rhythm"), { ...peakLabel, busier, total: data.trends.length })}
                  </p>
                ) : null}
              </>
            ) : (
              <p>{fill(t("insights.lead.empty"), { days })}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 lg:flex-col lg:items-end">
          <PeriodSelector value={days} onChange={setDays} />
          <DateStamp tilt={-3}>{formatStampDate(SAMPLE_TODAY, language)}</DateStamp>
        </div>
      </header>

      {/* Rhythm and antecedents: the wide band */}
      <div className="grid gap-10 border-t border-rule-strong pt-8 xl:grid-cols-[minmax(0,1.75fr)_minmax(17rem,1fr)] xl:gap-0">
        <section aria-labelledby="ins-rhythm" className="grid content-start gap-5 xl:pe-10">
          <SheetHeading
            title={<span id="ins-rhythm">{t("insights.rhythm.title")}</span>}
            description={t("insights.rhythm.description")}
            aside={
              peakLabel ? (
                <span className="text-[13px] text-ink-2">{fill(t("insights.rhythm.peak"), peakLabel)}</span>
              ) : null
            }
          />
          <div className="hidden sm:block">
            <RhythmGrid events={data.events} />
          </div>
          <div className="sm:hidden">
            <RhythmGrid events={data.events} compact />
          </div>
        </section>
        <section
          aria-labelledby="ins-antecedents"
          className="grid content-start gap-5 border-t border-rule pt-8 xl:border-t-0 xl:border-s xl:ps-10 xl:pt-0"
        >
          <SheetHeading
            as="h2"
            title={<span id="ins-antecedents">{t("insights.antecedents.title")}</span>}
            description={t("insights.antecedents.description")}
          />
          {total ? (
            <RankBars
              key={days}
              rows={data.triggers.slice(0, 6).map((row) => ({
                key: row.key,
                label: t(`vocab.trigger.${row.key}`),
                value: row.count,
                display: `${Math.round(row.share * 100)}% · ${row.count}`,
              }))}
            />
          ) : (
            <p className="text-[14px] text-ink-3">{t("insights.empty")}</p>
          )}
        </section>
      </div>

      {/* Trend ledger and what helped */}
      <div className="grid gap-10 border-t border-rule-strong pt-8 xl:grid-cols-[minmax(17rem,1fr)_minmax(0,1.6fr)] xl:gap-0">
        <section aria-labelledby="ins-helped" className="grid content-start gap-5 xl:pe-10">
          <SheetHeading
            title={<span id="ins-helped">{t("insights.helped.title")}</span>}
            description={t("insights.helped.description")}
          />
          {data.supports.length ? (
            <RankBars
              key={days}
              tone="moss"
              rows={data.supports.slice(0, 6).map((row) => ({
                key: row.key,
                label: t(`vocab.support.${row.key}`),
                value: row.rate,
                display: `${fill(t("insights.helped.rate"), { rate: Math.round(row.rate * 100) })} · ${fill(t("insights.helped.note"), { worked: row.worked, uses: row.uses })}`,
              }))}
            />
          ) : (
            <p className="text-[14px] text-ink-3">{t("insights.empty")}</p>
          )}
        </section>
        <section
          aria-labelledby="ins-trend"
          className="grid content-start gap-5 border-t border-rule pt-8 xl:border-t-0 xl:border-s xl:ps-10 xl:pt-0"
        >
          <SheetHeading
            title={<span id="ins-trend">{t("insights.trend.title")}</span>}
            description={t("insights.trend.description")}
          />
          <TrendLedger trends={data.trends} days={days} />
        </section>
      </div>

      <section aria-labelledby="ins-weekly" className="grid gap-5 border-t border-rule-strong pt-8">
        <SheetHeading
          title={<span id="ins-weekly">{t("insights.weekly.title")}</span>}
          description={t("insights.weekly.description")}
        />
        <WeeklyIntensity weeks={data.weeks} />
      </section>
    </div>
  );
}

function PeriodSelector({ value, onChange }: { value: PeriodDays; onChange: (days: PeriodDays) => void }) {
  const { t } = useLanguage();
  return (
    <fieldset className="flex items-center gap-3">
      <legend className="sr-only">{t("insights.period.label")}</legend>
      <span aria-hidden="true" className="text-[13px] text-ink-3">
        {t("insights.period.label")}
      </span>
      <div className="flex rounded-[11px] bg-sheet-sunk p-1">
        {periodOptions.map((option) => (
          <label
            key={option}
            className={cx(
              "inline-flex h-8 cursor-pointer items-center rounded-[8px] px-3 text-[13.5px] transition-[background-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold",
              option === value ? "bg-sheet-raised font-medium text-ink shadow-sheet" : "text-ink-2 hover:text-ink",
            )}
          >
            <input
              type="radio"
              name="insights-period"
              value={option}
              checked={option === value}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            {t(`insights.period.d${option}`)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function TrendLedger({ trends, days }: { trends: readonly ChildTrend[]; days: PeriodDays }) {
  const { t } = useLanguage();
  return (
    <div className="grid gap-6">
      {trendOrder.map((trend) => {
        const group = trends.filter((entry) => entry.trend === trend).sort((a, b) => b.after - a.after);
        return (
          <div key={trend} className="grid gap-1">
            <h3 className={cx("flex items-center gap-2 border-b border-rule pb-2 text-[13.5px] font-medium", trendInk[trend])}>
              <Glyph name={trendGlyph[trend]} size={16} />
              {t(`vocab.trend.${trend}`)}
              <span className="font-figures text-ink-3">{group.length}</span>
            </h3>
            {group.length === 0 ? (
              <p className="py-2 text-[13px] text-ink-3">{t("insights.trend.none")}</p>
            ) : (
              <ul className="grid">
                {group.map((entry) => (
                  <li key={entry.child.id} className="border-b border-rule last:border-b-0">
                    <Link
                      href={`/children/${entry.child.id}`}
                      className="grid grid-cols-[auto_minmax(0,8rem)_minmax(0,1fr)] items-center gap-3 rounded-[10px] px-1.5 py-2 transition-colors hover:bg-sheet-sunk sm:grid-cols-[auto_minmax(0,9rem)_minmax(0,1fr)_6.5rem]"
                    >
                      <FileMonogram childId={entry.child.id} size="small" />
                      <span className="truncate text-[14px] text-ink"><bdi>{entry.child.name}</bdi></span>
                      <EventBarcode key={days} events={entry.events} days={days} height={20} />
                      <span className="font-figures col-span-3 col-start-2 text-[12px] text-ink-3 sm:col-span-1 sm:col-start-auto sm:text-end">
                        {fill(t("insights.trend.delta"), { before: entry.before, after: entry.after })}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
