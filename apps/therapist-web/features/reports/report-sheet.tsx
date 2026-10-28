"use client";

import { useMemo } from "react";

import { periodLabel, summarize, type DeskReport } from "./report-data";
import { EventBarcode } from "@/components/case-file/event-barcode";
import { FileMonogram } from "@/components/case-file/file-monogram";
import { Action, DateStamp, intensityFill } from "@/components/case-file/primitives";
import { RankBars } from "@/components/case-file/rhythm-grid";
import { Glyph } from "@/components/icons/glyphs";
import { cx } from "@/components/ui/styles";
import { fill } from "@/lib/format";
import { getChild, therapist } from "@/lib/sample-data/fixtures";
import { dayOf, formatDay, formatStampDate } from "@/lib/sample-data/time";
import type { Intensity } from "@/lib/sample-data/types";
import { useLanguage } from "@/providers/language-provider";

const intensities: readonly Intensity[] = ["high", "moderate", "low"];

export function ReportSheet({
  report,
  onShare,
  onMarkReady,
}: {
  report: DeskReport;
  onShare: () => void;
  onMarkReady: () => void;
}) {
  const { language, t } = useLanguage();
  const child = getChild(report.childId);
  const summary = useMemo(() => summarize(report), [report]);
  const [from = "", to = ""] = report.period.split("/");
  const total = summary.events.length;
  const highShare = total ? Math.round((summary.mix.high / total) * 100) : 0;
  const signed = report.status !== "draft";

  if (!child) return null;

  return (
    <div className="grid min-w-0 content-start gap-5">
      <div className="flex flex-wrap items-center gap-3" role="group" aria-label={report.title}>
        {report.status !== "shared" ? (
          <Action variant="ink" glyph="send" onClick={onShare}>
            {t(`reports.share.${report.audience}`)}
          </Action>
        ) : null}
        {report.status === "draft" ? (
          <Action variant="outline" glyph="tick" onClick={onMarkReady}>
            {t("reports.markReady")}
          </Action>
        ) : null}
        <span className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          <Action variant="outline" glyph="download" disabled aria-describedby="pdf-helper">
            {t("reports.download")}
          </Action>
          <span id="pdf-helper" className="max-w-[34ch] text-[12.5px] leading-4 text-ink-3">
            {t("reports.download.helper")}
          </span>
        </span>
      </div>

      <article
        aria-label={report.title}
        className="animate-rise relative grid content-start gap-9 rounded-[6px] bg-sheet-raised px-5 py-8 shadow-lift sm:min-h-[62rem] sm:px-12 sm:py-12 xl:px-16 xl:py-14"
      >
        {/* letterhead */}
        <header className="grid gap-6 border-b border-rule-strong pb-7">
          <div className="flex items-start justify-between gap-4">
            <p className="flex items-center gap-2 text-[13px] font-medium text-ink-2">
              <Glyph name="clinic" size={18} />
              <bdi>{therapist.practice}</bdi>
            </p>
            <div className="flex flex-col items-end gap-2">
              <DateStamp tilt={-3}>{formatStampDate(dayOf(report.updatedAt), language)}</DateStamp>
              {report.status === "draft" ? (
                <DateStamp tone="pen" tilt={2}>
                  {t("reports.doc.draftStamp")}
                </DateStamp>
              ) : null}
            </div>
          </div>
          <h2 className="font-display max-w-[24ch] text-[30px] leading-[1.08] text-ink sm:text-[36px]">
            <bdi>{report.title}</bdi>
          </h2>
          <dl className="grid gap-x-8 gap-y-3 text-[13.5px] sm:grid-cols-3">
            <div className="grid gap-1">
              <dt className="text-[12px] text-ink-3">{t("reports.doc.child")}</dt>
              <dd className="flex items-center gap-2 text-ink">
                <FileMonogram childId={child.id} size="small" />
                <span>
                  <bdi>{child.name}</bdi>
                  <span className="block text-[12px] text-ink-3">{fill(t("reports.doc.age"), { age: child.age })}</span>
                </span>
              </dd>
            </div>
            <div className="grid content-start gap-1">
              <dt className="text-[12px] text-ink-3">{t("reports.doc.period")}</dt>
              <dd className="font-figures text-ink">{periodLabel(report.period, language, t)}</dd>
            </div>
            <div className="grid content-start gap-1">
              <dt className="text-[12px] text-ink-3">{t("reports.doc.audience")}</dt>
              <dd className="text-ink">{t(`reports.audience.${report.audience}`)}</dd>
            </div>
          </dl>
        </header>

        {/* summary */}
        <section aria-labelledby={`${report.id}-summary`} className="grid gap-5">
          <h3 id={`${report.id}-summary`} className="font-display text-[19px] leading-6 text-ink">
            {t("reports.doc.summaryTitle")}
          </h3>
          <p className="max-w-[64ch] text-[15.5px] leading-7 text-ink-2">
            {total
              ? fill(t("reports.doc.summary"), {
                  from: formatDay(from, language),
                  to: formatDay(to, language),
                  count: total,
                  high: summary.mix.high,
                  moderate: summary.mix.moderate,
                  low: summary.mix.low,
                  name: child.givenName,
                  recovery: summary.recovery,
                })
              : fill(t("reports.doc.summaryNone"), { name: child.givenName })}
            {summary.coverageFrom ? (
              <span className="text-ink-3">
                {" "}
                {fill(t("reports.doc.coverage"), { from: formatDay(summary.coverageFrom, language) })}
              </span>
            ) : null}
          </p>

          {total ? (
            <>
              <dl className="grid grid-cols-3 border-y border-rule">
                <DocFigure label={t("reports.doc.events")} value={String(total)} />
                <DocFigure label={t("reports.doc.highShare")} value={`${highShare}%`} />
                <DocFigure label={t("reports.doc.recovery")} value={String(summary.recovery)} unit={t("unit.min")} />
              </dl>

              <figure className="grid gap-3">
                <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="text-[13.5px] font-medium text-ink">{t("reports.doc.barcodeTitle")}</span>
                  <span className="flex items-center gap-3 text-[12px] text-ink-3">
                    {intensities.map((level) => (
                      <span key={level} className="inline-flex items-center gap-1.5">
                        <span aria-hidden="true" className={cx("h-2.5 w-[5px] rounded-[1.5px]", intensityFill[level])} />
                        {t(`vocab.intensity.${level}`)} {summary.mix[level]}
                      </span>
                    ))}
                  </span>
                </figcaption>
                <EventBarcode events={summary.events} days={28} height={52} showAxis />
                <p className="text-[12px] text-ink-3">{t("reports.doc.barcodeNote")}</p>
              </figure>
            </>
          ) : null}
        </section>

        {total ? (
          <div className="grid gap-9 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-12">
            <section aria-labelledby={`${report.id}-triggers`} className="grid content-start gap-4">
              <div className="grid gap-1">
                <h3 id={`${report.id}-triggers`} className="font-display text-[17px] leading-6 text-ink">
                  {t("reports.doc.triggersTitle")}
                </h3>
                <p className="text-[12.5px] text-ink-3">{t("reports.doc.triggersNote")}</p>
              </div>
              <RankBars
                rows={summary.triggers.map((row) => ({
                  key: row.key,
                  label: t(`vocab.trigger.${row.key}`),
                  value: row.count,
                  display: `${Math.round(row.share * 100)}% · ${row.count}/${total}`,
                }))}
              />
            </section>
            <section aria-labelledby={`${report.id}-helped`} className="grid content-start gap-4">
              <h3 id={`${report.id}-helped`} className="font-display text-[17px] leading-6 text-ink">
                {t("reports.doc.helpedTitle")}
              </h3>
              {summary.supports.length ? (
                <ul className="grid gap-3 text-[14.5px] leading-6 text-ink-2">
                  {summary.supports.map((support) => (
                    <li key={support.key} className="flex gap-2.5">
                      <Glyph name="leaf" size={17} className="mt-[3px] shrink-0 text-moss-ink" />
                      <span>
                        {fill(t("reports.doc.helpedRow"), {
                          support: t(`vocab.support.${support.key}`),
                          worked: support.worked,
                          uses: support.uses,
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[14px] text-ink-3">{t("reports.doc.helpedNone")}</p>
              )}
            </section>
          </div>
        ) : null}

        <section aria-labelledby={`${report.id}-goal`} className="grid gap-2 border-t border-rule pt-6">
          <h3 id={`${report.id}-goal`} className="text-[12px] text-ink-3">
            {t("reports.doc.goalTitle")}
          </h3>
          <p className="max-w-[64ch] text-[15px] leading-6 text-ink">
            <bdi>{child.goal}</bdi>
          </p>
        </section>

        {/* signature */}
        <footer className="mt-auto grid gap-6 pt-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] sm:gap-12">
          <div className="grid gap-1.5">
            <span className="flex h-12 items-end border-b border-ink-3 pb-1">
              {signed ? (
                <span className="font-display text-[26px] leading-none text-pen italic">
                  <bdi>{therapist.name}</bdi>
                </span>
              ) : null}
            </span>
            <span className="text-[12px] text-ink-3">{t("reports.doc.signature")}</span>
            <span className="text-[13.5px] text-ink">
              <bdi>{therapist.name}</bdi>
              <span className="text-ink-3">
                , <bdi>{therapist.credential}</bdi>
              </span>
            </span>
          </div>
          <div className="grid content-end gap-1.5">
            <span className="font-figures flex h-12 items-end border-b border-ink-3 pb-1 text-[14px] text-ink">
              {signed ? formatDay(dayOf(report.updatedAt), language) : null}
            </span>
            <span className="text-[12px] text-ink-3">{t("reports.doc.dated")}</span>
          </div>
        </footer>

        {report.status === "shared" ? (
          <div aria-hidden="true" className="pointer-events-none absolute bottom-32 end-6 sm:bottom-28 sm:end-16">
            <DateStamp tone="moss" tilt={-9} className="border-2 px-3 py-1.5 text-[15px]">
              {fill(t("reports.doc.sharedStamp"), {
                date: formatDay(report.sharedOn ?? dayOf(report.updatedAt), language),
              })}
            </DateStamp>
          </div>
        ) : null}
      </article>
    </div>
  );
}

function DocFigure({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="grid gap-0.5 border-e border-rule py-3 pe-3 ps-3 first:ps-0 last:border-e-0">
      <dt className="order-2 text-[12px] leading-4 text-ink-3">{label}</dt>
      <dd className="font-figures text-[24px] leading-8 text-ink">
        {value}
        {unit ? <span className="ms-1 text-[12.5px] text-ink-3">{unit}</span> : null}
      </dd>
    </div>
  );
}
