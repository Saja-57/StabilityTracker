"use client";

import Link from "next/link";
import { useState } from "react";

import { FileStack } from "./file-stack";
import { EventBarcode } from "@/components/case-file/event-barcode";
import { FileMonogram } from "@/components/case-file/file-monogram";
import {
  Action,
  ActionLink,
  DateStamp,
  IntensityMark,
  PenCircle,
  PenTick,
  SheetHeading,
  TabLabel,
} from "@/components/case-file/primitives";
import { Glyph, type GlyphName } from "@/components/icons/glyphs";
import { cx } from "@/components/ui/styles";
import { fill } from "@/lib/format";
import { eventsFor, eventsSince, trendOf } from "@/lib/sample-data/analysis";
import { appointments, children, events, getChild, getThread, therapist } from "@/lib/sample-data/fixtures";
import { addDays, formatStampDate, formatTime, SAMPLE_NOW, SAMPLE_TODAY } from "@/lib/sample-data/time";
import type { Appointment, SessionMode, Trend } from "@/lib/sample-data/types";
import { useLanguage } from "@/providers/language-provider";

const modeGlyph: Record<SessionMode, GlyphName> = { clinic: "clinic", video: "video", home: "home" };
const trendGlyph: Record<Trend, GlyphName> = { calmer: "trendDown", steady: "steady", busier: "trendUp" };

export function DeskView() {
  const { language, t } = useLanguage();
  const needYou = children.filter((child) => child.status === "needsReview");
  const today = appointments.filter((appointment) => appointment.start.startsWith(SAMPLE_TODAY));
  const yesterday = addDays(SAMPLE_TODAY, -1);
  const fresh = events.filter((event) => event.at >= `${yesterday}T06:00`);

  return (
    <div className="grid gap-12">
      <header className="flex flex-wrap items-end justify-between gap-6 pt-4">
        <div className="grid gap-3">
          <h1 className="font-display text-[40px] leading-[1.05] text-ink sm:text-[52px]">
            {fill(t("desk.greeting.morning"), { name: therapist.givenName })}
          </h1>
          <p className="max-w-[60ch] text-[17px] leading-7 text-ink-2">
            {fill(t("desk.summary"), {
              files: needYou.length,
              sessions: today.length,
              logs: fresh.length,
            })}
          </p>
        </div>
        <DateStamp className="mb-2 text-[12px]" tilt={-4}>
          {formatStampDate(SAMPLE_TODAY, language)}
        </DateStamp>
      </header>

      <div className="grid gap-12 xl:grid-cols-[minmax(0,1.55fr)_minmax(19rem,1fr)] xl:gap-10">
        <section aria-labelledby="need-you" className="grid content-start gap-5">
          <SheetHeading
            title={<span id="need-you">{t("desk.needYou.title")}</span>}
            description={t("desk.needYou.description")}
          />
          <FileStack files={needYou} />
        </section>

        <section aria-labelledby="today" className="grid content-start gap-5">
          <SheetHeading
            title={<span id="today">{t("desk.today.title")}</span>}
            aside={
              <ActionLink href="/appointments" variant="quiet" size="small" trailingGlyph="chevron">
                {t("desk.today.week")}
              </ActionLink>
            }
          />
          <SessionTimeline sessions={today} />
        </section>
      </div>

      <div className="grid gap-12 xl:grid-cols-[minmax(0,1.55fr)_minmax(19rem,1fr)] xl:gap-10">
        <HomeFeed />
        <div className="grid content-start gap-12">
          <FamiliesWaiting />
          <CaseloadPulse />
        </div>
      </div>
    </div>
  );
}

function SessionTimeline({ sessions }: { sessions: readonly Appointment[] }) {
  const { language, t } = useLanguage();
  const nextIndex = sessions.findIndex((session) => session.start > SAMPLE_NOW);

  return (
    <ol className="relative grid gap-1 before:absolute before:inset-y-3 before:start-[4.6rem] before:w-px before:bg-rule-strong">
      {sessions.map((session, index) => {
        const child = getChild(session.childId);
        if (!child) return null;
        const since = eventsSince(eventsFor(child.id), child.lastSession);
        const flagged = since.filter((event) => event.flagged).length;
        const isNext = index === nextIndex;
        const past = session.start <= SAMPLE_NOW;
        return (
          <li key={session.id} className="animate-settle" style={{ ["--i" as string]: index }}>
            {isNext ? <NowLine /> : null}
            <Link
              href={`/children/${child.id}`}
              className={cx(
                "group grid grid-cols-[4.1rem_1rem_minmax(0,1fr)] items-start gap-x-2 rounded-[14px] py-2.5 pe-3 transition-colors hover:bg-sheet-sunk",
                past && "opacity-55",
              )}
            >
              <span className="font-figures pt-0.5 text-end text-[14px] text-ink-2">
                {formatTime(session.start, language)}
              </span>
              <span className="relative grid h-6 place-items-center">
                <span
                  className={cx(
                    "size-[11px] rounded-full ring-[3px] ring-sheet",
                    isNext ? "bg-gold" : past ? "bg-rule-strong" : "bg-board",
                  )}
                />
              </span>
              <span className="grid min-w-0 gap-1.5">
                <span className="flex items-center gap-2.5">
                  <span className="truncate text-[15.5px] font-medium text-ink group-hover:underline group-hover:decoration-rule-strong group-hover:underline-offset-4">
                    {child.name}
                  </span>
                  {isNext ? <TabLabel tone="gold">{t("desk.today.next")}</TabLabel> : null}
                </span>
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-3">
                  <span className="inline-flex items-center gap-1.5">
                    <Glyph name={modeGlyph[session.mode]} size={15} />
                    {t(`vocab.mode.${session.mode}`)}
                  </span>
                  <span className="truncate"><bdi>{session.focus}</bdi></span>
                </span>
                <span className="flex flex-wrap items-center gap-x-2 text-[12.5px] text-ink-2">
                  <bdi>{fill(t("desk.today.prep"), { events: since.length })}</bdi>
                  {flagged ? (
                    <PenCircle label="">
                      <bdi className="text-ink">{fill(t("desk.today.flagged"), { count: flagged })}</bdi>
                    </PenCircle>
                  ) : null}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

function NowLine() {
  const { language, t } = useLanguage();
  return (
    <div className="grid grid-cols-[4.1rem_1rem_minmax(0,1fr)] items-center gap-x-2 py-1" aria-label={t("desk.today.now")}>
      <span className="stamp text-end text-[10.5px] text-stamp">{t("desk.today.now")}</span>
      <span className="grid place-items-center">
        <span className="size-2 rounded-full bg-stamp [animation:now-pulse_2.4s_ease-in-out_infinite]" />
      </span>
      <span className="flex items-center gap-2">
        <span className="h-px flex-1 bg-stamp/50" />
        <span className="font-figures text-[11.5px] text-stamp">{formatTime(SAMPLE_NOW, language)}</span>
      </span>
    </div>
  );
}

function HomeFeed() {
  const { language, t } = useLanguage();
  const yesterday = addDays(SAMPLE_TODAY, -1);
  const fresh = events.filter((event) => event.at >= `${yesterday}T06:00`).slice(0, 9);
  const [reviewed, setReviewed] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(fresh.map((event) => [event.id, event.reviewed])),
  );
  const open = fresh.filter((event) => !reviewed[event.id]).length;

  return (
    <section aria-labelledby="home-feed" className="grid content-start gap-5">
      <SheetHeading
        title={<span id="home-feed">{t("desk.feed.title")}</span>}
        description={fill(t("desk.feed.description"), { count: open })}
        aside={
          <Action
            variant="quiet"
            size="small"
            glyph="tick"
            disabled={open === 0}
            onClick={() => setReviewed(Object.fromEntries(fresh.map((event) => [event.id, true])))}
          >
            {t("desk.feed.markAll")}
          </Action>
        }
      />
      <ul className="grid border-y border-rule">
        {fresh.map((event, index) => {
          const child = getChild(event.childId);
          if (!child) return null;
          const done = Boolean(reviewed[event.id]);
          return (
            <li
              key={event.id}
              className="animate-settle grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-4 border-b border-rule py-4 last:border-b-0"
              style={{ ["--i" as string]: index }}
            >
              <FileMonogram childId={child.id} size="small" className="mt-0.5" />
              <div className={cx("grid min-w-0 gap-1.5 transition-opacity duration-300", done && "opacity-60")}>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Link href={`/children/${child.id}?tab=events`} className="text-[15px] font-medium text-ink hover:underline hover:underline-offset-4">
                    {child.name}
                  </Link>
                  <span className="text-[14px] text-ink-2">{t(`vocab.eventType.${event.type}`)}</span>
                  {event.flagged ? (
                    <PenCircle label={t("desk.feed.flagged")}>
                      <IntensityMark intensity={event.intensity} withLabel />
                    </PenCircle>
                  ) : (
                    <IntensityMark intensity={event.intensity} withLabel />
                  )}
                </p>
                <p className="max-w-[62ch] text-[14px] leading-5 text-ink-2">
                  <span className="text-ink-3">{t("vocab.abc.before")}: </span>
                  <bdi>{event.before}</bdi>
                </p>
                <p className="flex flex-wrap items-center gap-x-3 text-[12.5px] text-ink-3">
                  <span className="font-figures">
                    {event.at.startsWith(SAMPLE_TODAY) ? t("common.today") : t("common.yesterday")}{" "}
                    {formatTime(event.at, language)}
                  </span>
                  <span>{fill(t("desk.feed.by"), { name: event.reporter })}</span>
                  {event.helpedWorked ? (
                    <span className="inline-flex items-center gap-1 text-moss-ink">
                      <Glyph name="leaf" size={14} />
                      {t(`vocab.support.${event.helped[0] ?? "quietSpace"}`)}
                    </span>
                  ) : null}
                </p>
              </div>
              <PenTick
                checked={done}
                label={t("desk.feed.markReviewed")}
                onToggle={() => setReviewed((state) => ({ ...state, [event.id]: !state[event.id] }))}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function FamiliesWaiting() {
  const { language, t } = useLanguage();
  const waiting = children
    .map((child) => ({ child, message: getThread(child.id).find((entry) => entry.from === "family" && !entry.read) }))
    .filter((entry) => entry.message);

  return (
    <section aria-labelledby="waiting" className="grid content-start gap-5">
      <SheetHeading title={<span id="waiting">{t("desk.waiting.title")}</span>} />
      <ul className="grid gap-3">
        {waiting.map(({ child, message }, index) =>
          message ? (
            <li
              key={message.id}
              className="animate-settle relative grid gap-3 rounded-[14px] bg-gold-wash/55 p-4 ring-1 ring-gold/30"
              style={{ ["--i" as string]: index }}
            >
              <p className="flex items-center gap-2 text-[13px] text-ink-3">
                <span className="font-medium text-ink">{message.author}</span>
                <span>{fill(t("desk.waiting.about"), { name: child.givenName })}</span>
                <span className="font-figures ms-auto">{formatTime(message.at, language)}</span>
              </p>
              <blockquote className="text-[14.5px] leading-6 text-ink-2"><bdi>{message.body}</bdi></blockquote>
              <ActionLink href={`/messages?family=${child.id}`} size="small" variant="ink" glyph="send" className="justify-self-start">
                {t("desk.waiting.reply")}
              </ActionLink>
            </li>
          ) : null,
        )}
      </ul>
    </section>
  );
}

function CaseloadPulse() {
  const { t } = useLanguage();
  return (
    <section aria-labelledby="pulse" className="grid content-start gap-4">
      <SheetHeading
        title={<span id="pulse">{t("desk.pulse.title")}</span>}
        aside={
          <ActionLink href="/children" variant="quiet" size="small" trailingGlyph="chevron">
            {t("desk.pulse.all")}
          </ActionLink>
        }
      />
      <ul className="grid">
        {children.map((child) => {
          const list = eventsFor(child.id);
          const trend = trendOf(list);
          return (
            <li key={child.id}>
              <Link
                href={`/children/${child.id}`}
                className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_5.5rem] items-center gap-4 rounded-[10px] px-2 py-2 transition-colors hover:bg-sheet-sunk"
              >
                <span className="truncate text-[14px] text-ink">{child.name}</span>
                <EventBarcode events={list} days={14} height={20} />
                <span
                  className={cx(
                    "inline-flex items-center justify-end gap-1 text-[12.5px]",
                    trend === "busier" ? "text-ruby-ink" : trend === "calmer" ? "text-moss-ink" : "text-ink-3",
                  )}
                >
                  <Glyph name={trendGlyph[trend]} size={15} />
                  {t(`vocab.trend.${trend}`)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
