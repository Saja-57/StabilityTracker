"use client";

import { useRouter } from "next/navigation";

import { modeGlyph } from "./shared";
import { EventBarcode } from "@/components/case-file/event-barcode";
import { FileMonogram } from "@/components/case-file/file-monogram";
import { Action, ActionLink, Figure, IntensityMark } from "@/components/case-file/primitives";
import { Glyph } from "@/components/icons/glyphs";
import { fill } from "@/lib/format";
import { type SessionPrep, sessionEnd } from "@/lib/sample-data/appointments";
import { formatDay, formatLongDay, formatTime } from "@/lib/sample-data/time";
import { useLanguage } from "@/providers/language-provider";

/** The prep sheet for one session: what changed at home since the last visit. */
export function SessionPrepBody({ prep }: { prep: SessionPrep }) {
  const { language, t } = useLanguage();
  const router = useRouter();
  const { child, session } = prep;

  return (
    <div key={session.id} className="grid gap-6 [animation:sheet-in_380ms_cubic-bezier(0.16,1,0.3,1)_both]">
      <div className="flex items-start gap-3.5">
        <FileMonogram childId={child.id} size="medium" />
        <div className="grid min-w-0 gap-1">
          <p className="font-display truncate text-[22px] leading-7 text-ink">{child.name}</p>
          <p className="text-[14px] leading-5 text-ink-2">
            <bdi>{session.focus}</bdi>
          </p>
        </div>
      </div>

      <dl className="grid gap-2 border-y border-rule py-3 text-[13.5px]">
        <div className="flex items-center gap-2.5 text-ink-2">
          <dt className="sr-only">{t("appointments.legend.label")}</dt>
          <Glyph name={modeGlyph[session.mode]} size={17} className="text-ink-3" />
          <dd>{t(`vocab.mode.${session.mode}`)}</dd>
        </div>
        <div className="flex items-center gap-2.5 text-ink-2">
          <dt className="sr-only">{t("appointments.prep.title")}</dt>
          <Glyph name="clock" size={17} className="text-ink-3" />
          <dd className="tabular">
            {fill(t("appointments.prep.when"), {
              day: formatLongDay(session.start, language),
              from: formatTime(session.start, language),
              to: formatTime(sessionEnd(session), language),
            })}
          </dd>
        </div>
      </dl>

      <section aria-labelledby="prep-logs" className="grid gap-4">
        <h3 id="prep-logs" className="text-[13px] leading-5 text-ink-3">
          {fill(t("appointments.prep.sinceSession"), { date: formatDay(child.lastSession, language) })}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <Figure value={prep.since.length} label={t("appointments.prep.logs")} />
          <Figure
            value={<span className={prep.high ? "text-ruby-ink" : undefined}>{prep.high}</span>}
            label={t("appointments.prep.high")}
          />
          <Figure
            value={prep.since.length ? prep.recovery : "–"}
            {...(prep.since.length ? { unit: t("unit.min") } : {})}
            label={t("appointments.prep.recovery")}
          />
        </div>
        <EventBarcode events={prep.history} days={14} since={child.lastSession} height={36} showAxis />
      </section>

      <section aria-labelledby="prep-flagged" className="grid gap-2.5">
        <h3 id="prep-flagged" className="font-display text-[16px] leading-6 text-ink">
          {t("appointments.prep.flagged")}
        </h3>
        {prep.flagged.length ? (
          <ul className="grid border-t border-rule">
            {prep.flagged.slice(0, 4).map((event) => (
              <li key={event.id} className="grid gap-1 border-b border-rule py-2.5">
                <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span className="text-[14px] font-medium text-ink">{t(`vocab.eventType.${event.type}`)}</span>
                  <IntensityMark intensity={event.intensity} withLabel />
                  <span className="font-figures ms-auto text-[12px] text-ink-3">
                    {formatDay(event.at, language)} {formatTime(event.at, language)}
                  </span>
                </p>
                <p className="line-clamp-2 text-[13px] leading-5 text-ink-2">
                  <span className="text-ink-3">{t("vocab.abc.before")}: </span>
                  <bdi>{event.before}</bdi>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[13.5px] text-ink-3">
            {prep.since.length ? t("appointments.prep.noneFlagged") : t("appointments.prep.noLogs")}
          </p>
        )}
      </section>

      {prep.note ? (
        <section aria-labelledby="prep-note" className="grid gap-2">
          <h3 id="prep-note" className="flex items-baseline justify-between gap-3">
            <span className="font-display text-[16px] leading-6 text-ink">{t("appointments.prep.latestNote")}</span>
            <span className="font-figures text-[12px] text-ink-3">{formatDay(prep.note.at, language)}</span>
          </h3>
          <blockquote className="rounded-[12px] bg-sheet-sunk px-4 py-3 text-[13.5px] leading-6 text-ink-2">
            <span className="mb-1 block text-[12.5px] font-medium text-ink"><bdi>{prep.note.title}</bdi>
            </span>
            <span className="line-clamp-4">
              <bdi>{prep.note.body}</bdi>
            </span>
          </blockquote>
        </section>
      ) : null}

      <div className="flex flex-wrap items-center gap-2.5">
        <Action variant="ink" glyph="edit" onClick={() => router.push(`/notes?child=${child.id}`)}>
          {t("appointments.prep.startNote")}
        </Action>
        <ActionLink href={`/children/${child.id}`} variant="outline" trailingGlyph="chevron">
          {t("file.open")}
        </ActionLink>
      </div>
    </div>
  );
}
