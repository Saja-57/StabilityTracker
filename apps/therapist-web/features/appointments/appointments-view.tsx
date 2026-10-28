"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useMemo, useRef, useState, type KeyboardEvent } from "react";

import { SessionPrepBody } from "./session-prep";
import { modeGlyph, modes } from "./shared";
import { FileMonogram } from "@/components/case-file/file-monogram";
import { Action, DateStamp, TabLabel } from "@/components/case-file/primitives";
import { Glyph } from "@/components/icons/glyphs";
import { cx } from "@/components/ui/styles";
import { fill } from "@/lib/format";
import {
  DAY_END_HOUR,
  DAY_START_HOUR,
  defaultSelection,
  isPast,
  isUnderway,
  placeInLanes,
  prepFor,
  sessionsInWeek,
  weekDays,
  weekStartOf,
} from "@/lib/sample-data/appointments";
import { getChild } from "@/lib/sample-data/fixtures";
import {
  addDays,
  dayOf,
  formatDay,
  formatLongDay,
  formatTime,
  formatWeekday,
  minutesOfDay,
  SAMPLE_NOW,
  SAMPLE_TODAY,
} from "@/lib/sample-data/time";
import type { Appointment } from "@/lib/sample-data/types";
import { useLanguage } from "@/providers/language-provider";

const HOUR_PX = 60;
const HOURS = DAY_END_HOUR - DAY_START_HOUR;
const THIS_WEEK = weekStartOf(SAMPLE_TODAY);

function topOf(value: string): number {
  return ((minutesOfDay(value) - DAY_START_HOUR * 60) / 60) * HOUR_PX;
}

export function AppointmentsView() {
  const { language, t } = useLanguage();
  const [offset, setOffset] = useState(0);
  const weekStart = addDays(THIS_WEEK, offset * 7);
  const days = useMemo(() => weekDays(weekStart), [weekStart]);
  const sessions = useMemo(() => sessionsInWeek(weekStart), [weekStart]);
  const [selectedId, setSelectedId] = useState<string | null>(() => defaultSelection(sessionsInWeek(THIS_WEEK)));
  const [sheetOpen, setSheetOpen] = useState(false);

  const selected = sessions.find((session) => session.id === selectedId) ?? null;
  const prep = selected ? prepFor(selected) : null;
  const ahead = sessions.filter((session) => session.start > SAMPLE_NOW).length;

  function goToWeek(next: number) {
    setOffset(next);
    setSelectedId(defaultSelection(sessionsInWeek(addDays(THIS_WEEK, next * 7))));
  }

  const title =
    offset === 0
      ? t("appointments.week.this")
      : offset === 1
        ? t("appointments.week.next")
        : offset === -1
          ? t("appointments.week.last")
          : fill(t("appointments.week.of"), { date: formatDay(weekStart, language) });

  return (
    <div className="grid gap-8">
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 pt-4">
        <div className="grid gap-3">
          <h1 className="font-display text-[40px] leading-[1.05] text-ink sm:text-[52px]">{title}</h1>
          <p className="text-[16px] leading-6 text-ink-2" aria-live="polite">
            {sessions.length
              ? fill(t("appointments.week.summary"), { count: sessions.length, ahead })
              : t("appointments.week.summaryNone")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <DateStamp key={weekStart} className="text-[12px]" tilt={-3}>
            {fill(t("appointments.week.range"), {
              from: formatDay(weekStart, language),
              to: formatDay(addDays(weekStart, 6), language),
            })}
          </DateStamp>
          <div className="flex items-center gap-1 rounded-[12px] bg-sheet-sunk p-1">
            <button
              type="button"
              aria-label={t("appointments.week.previous")}
              onClick={() => goToWeek(offset - 1)}
              className="grid size-8 place-items-center rounded-[9px] text-ink-2 transition-colors hover:bg-sheet-raised hover:text-ink"
            >
              <Glyph name="arrowBack" size={17} />
            </button>
            <button
              type="button"
              onClick={() => goToWeek(0)}
              disabled={offset === 0}
              className="h-8 rounded-[9px] px-3 text-[13px] font-medium text-ink-2 transition-colors hover:bg-sheet-raised hover:text-ink disabled:pointer-events-none disabled:opacity-45"
            >
              {t("appointments.grid.today")}
            </button>
            <button
              type="button"
              aria-label={t("appointments.week.following")}
              onClick={() => goToWeek(offset + 1)}
              className="grid size-8 place-items-center rounded-[9px] text-ink-2 transition-colors hover:bg-sheet-raised hover:text-ink"
            >
              <Glyph name="arrow" size={17} />
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_21.5rem] xl:gap-8">
        <div className="grid min-w-0 content-start gap-4">
          <WeekGrid
            key={weekStart}
            days={days}
            sessions={sessions}
            selectedId={selected?.id ?? null}
            onSelect={(id, open) => {
              setSelectedId(id);
              if (open && !window.matchMedia("(min-width: 80rem)").matches) setSheetOpen(true);
            }}
            onBack={() => goToWeek(0)}
            showBack={offset !== 0}
          />
          <Agenda
            key={`agenda-${weekStart}`}
            days={days}
            sessions={sessions}
            selectedId={selected?.id ?? null}
            onSelect={(id) => {
              setSelectedId(id);
              setSheetOpen(true);
            }}
            onBack={() => goToWeek(0)}
            showBack={offset !== 0}
          />
          <ModeLegend />
        </div>

        <aside
          aria-labelledby="prep-title"
          className="hidden content-start gap-5 self-start rounded-[18px] bg-sheet-raised p-6 shadow-folder ring-1 ring-rule xl:sticky xl:top-20 xl:grid"
        >
          <h2 id="prep-title" className="font-display text-[21px] leading-7 text-ink">
            {t("appointments.prep.title")}
          </h2>
          {prep ? (
            <SessionPrepBody prep={prep} />
          ) : (
            <p className="text-[14px] leading-6 text-ink-3">{t("appointments.prep.empty")}</p>
          )}
        </aside>
      </div>

      <DialogPrimitive.Root open={sheetOpen && Boolean(prep)} onOpenChange={setSheetOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-[var(--cf-overlay)] data-[state=open]:animate-[sheet-settle_220ms_ease-out] xl:hidden" />
          <DialogPrimitive.Content
            aria-describedby={undefined}
            className="sheet-stock fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] overflow-y-auto rounded-t-[22px] bg-sheet px-5 pt-3 pb-8 shadow-lift outline-none data-[state=open]:animate-[sheet-in_420ms_cubic-bezier(0.16,1,0.3,1)] xl:hidden"
          >
            <span aria-hidden="true" className="mx-auto mb-3 block h-1 w-10 rounded-full bg-rule-strong" />
            <div className="mb-4 flex items-center justify-between gap-3">
              <DialogPrimitive.Title className="font-display text-[19px] leading-7 text-ink">
                {t("appointments.prep.title")}
              </DialogPrimitive.Title>
              <DialogPrimitive.Close
                aria-label={t("appointments.prep.close")}
                className="grid size-9 place-items-center rounded-[10px] text-ink-2 hover:bg-sheet-sunk"
              >
                <Glyph name="close" size={18} />
              </DialogPrimitive.Close>
            </div>
            {prep ? <SessionPrepBody prep={prep} /> : null}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}

/* ------------------------------------------------------------- week grid */

interface CalendarProps {
  readonly days: readonly string[];
  readonly sessions: readonly Appointment[];
  readonly selectedId: string | null;
  readonly onSelect: (id: string, open?: boolean) => void;
  readonly onBack: () => void;
  readonly showBack: boolean;
}

function WeekGrid({ days, sessions, selectedId, onSelect, onBack, showBack }: CalendarProps) {
  const { language, t } = useLanguage();
  const bodyRef = useRef<HTMLDivElement>(null);
  const hasToday = days.includes(SAMPLE_TODAY);
  const nowTop = topOf(SAMPLE_NOW);
  const columns = days
    .map((day, index) => (index >= 5 && !sessions.some((session) => dayOf(session.start) === day) ? "0.6fr" : "1fr"))
    .map((size) => `minmax(0,${size})`)
    .join(" ");
  const template = { gridTemplateColumns: `3.25rem ${columns}` };

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (!keys.includes(event.key) || !sessions.length) return;
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const forward =
      event.key === "ArrowDown" || event.key === (rtl ? "ArrowLeft" : "ArrowRight");
    const index = sessions.findIndex((session) => session.id === selectedId);
    const next = sessions[Math.min(sessions.length - 1, Math.max(0, index + (forward ? 1 : -1)))];
    if (!next) return;
    event.preventDefault();
    onSelect(next.id);
    bodyRef.current?.querySelector<HTMLButtonElement>(`[data-session="${next.id}"]`)?.focus();
  }

  return (
    <section
      aria-label={t("appointments.grid.label")}
      aria-describedby="grid-hint"
      className="hidden overflow-hidden rounded-[16px] bg-sheet-raised ring-1 ring-rule lg:block"
    >
      <p id="grid-hint" className="sr-only">
        {t("appointments.grid.hint")}
      </p>
      <div className="grid border-b border-rule" style={template}>
        <span />
        {days.map((day) => {
          const today = day === SAMPLE_TODAY;
          return (
            <div
              key={day}
              className={cx("grid justify-items-center gap-1 border-s border-rule py-3", today && "bg-sheet-sunk")}
            >
              <span className={cx("text-[12px]", today ? "font-medium text-ink" : "text-ink-3")}>
                {formatWeekday(day, language)}
              </span>
              <span
                className={cx(
                  "font-figures grid h-7 min-w-7 place-items-center rounded-full px-1.5 text-[14px]",
                  today ? "bg-board text-board-ink" : "text-ink-2",
                )}
              >
                {Number(day.slice(8))}
              </span>
            </div>
          );
        })}
      </div>

      <div
        ref={bodyRef}
        onKeyDown={onKeyDown}
        className="relative grid"
        style={{ ...template, height: HOURS * HOUR_PX + 12 }}
      >
        <div aria-hidden="true" className="relative">
          {Array.from({ length: HOURS + 1 }, (_, hour) => (
            <span
              key={hour}
              className="font-figures absolute end-2 -translate-y-1/2 text-[11px] text-ink-3"
              style={{ top: hour * HOUR_PX + 6 }}
            >
              {formatTime(`${SAMPLE_TODAY}T${String(DAY_START_HOUR + hour).padStart(2, "0")}:00`, language)}
            </span>
          ))}
        </div>

        {days.map((day) => {
          const today = day === SAMPLE_TODAY;
          const daySessions = sessions.filter((session) => dayOf(session.start) === day);
          return (
            <div
              key={day}
              role="group"
              aria-label={formatLongDay(day, language)}
              className={cx("relative border-s border-rule", today && "bg-sheet-sunk")}
            >
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1.5">
                {Array.from({ length: HOURS }, (_, hour) => (
                  <div key={hour} className="relative border-t border-rule" style={{ height: HOUR_PX }}>
                    <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-rule/70" />
                  </div>
                ))}
                <div className="border-t border-rule" />
              </div>
              <ol className="absolute inset-x-0 top-1.5">
                {placeInLanes(daySessions).map(({ session, lane, lanes }) => (
                  <li key={session.id}>
                    <Slip
                      session={session}
                      lane={lane}
                      lanes={lanes}
                      order={sessions.indexOf(session)}
                      selected={session.id === selectedId}
                      onSelect={onSelect}
                    />
                  </li>
                ))}
              </ol>
            </div>
          );
        })}

        {hasToday ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 z-10 grid items-center"
            style={{ ...template, top: nowTop + 6 }}
          >
            <span className="stamp -translate-y-1/2 pe-1.5 text-end text-[9.5px] leading-none text-stamp">
              {t("appointments.grid.now")}
            </span>
            {days.map((day) => (
              <span key={day} className="relative -translate-y-1/2">
                {day === SAMPLE_TODAY ? (
                  <>
                    <span className="absolute -start-[4px] top-1/2 size-2 -translate-y-1/2 rounded-full bg-stamp [animation:now-pulse_2.4s_ease-in-out_infinite]" />
                    <span className="block h-[1.5px] bg-stamp" />
                  </>
                ) : (
                  <span className="block h-px bg-stamp/25" />
                )}
              </span>
            ))}
          </div>
        ) : null}

        {!sessions.length ? <EmptyWeek onBack={onBack} showBack={showBack} floating /> : null}
      </div>
    </section>
  );
}

function Slip({
  session,
  lane,
  lanes,
  order,
  selected,
  onSelect,
}: {
  session: Appointment;
  lane: number;
  lanes: number;
  order: number;
  selected: boolean;
  onSelect: (id: string, open?: boolean) => void;
}) {
  const { language, t } = useLanguage();
  const child = getChild(session.childId);
  if (!child) return null;
  const past = isPast(session);
  const underway = isUnderway(session);
  const height = (session.durationMin / 60) * HOUR_PX - 4;

  return (
    <button
      type="button"
      data-session={session.id}
      aria-pressed={selected}
      aria-label={fill(t("appointments.grid.slip"), {
        name: child.name,
        time: formatTime(session.start, language),
        mode: t(`vocab.mode.${session.mode}`),
      })}
      onClick={() => onSelect(session.id, true)}
      className={cx(
        "animate-settle motion-reduce:[animation-delay:0ms] group absolute grid content-start gap-0.5 rounded-[8px] bg-sheet ps-2 pe-1.5 pt-2 text-start ring-1 transition-[box-shadow,transform,opacity,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        selected
          ? "z-[5] -translate-y-px bg-sheet-raised shadow-lift ring-2 ring-board"
          : "shadow-press ring-rule hover:-translate-y-px hover:shadow-folder hover:ring-rule-strong",
        past && !selected && "opacity-50 hover:opacity-80",
      )}
      style={{
        top: topOf(session.start) + 2,
        height,
        insetInlineStart: `calc(${(lane / lanes) * 100}% + 4px)`,
        width: `calc(${100 / lanes}% - 8px)`,
        ["--i" as string]: order,
      }}
    >
      <span
        aria-hidden="true"
        className={cx("absolute -top-[5px] start-2 h-[5px] w-6 rounded-t-[3px]", child.status === "needsReview" ? "bg-gold" : "bg-board")}
      />
      <span className="flex items-center gap-1">
        <span className="font-figures text-[11px] leading-4 text-ink-3">{formatTime(session.start, language)}</span>
        <Glyph name={modeGlyph[session.mode]} size={13} className="ms-auto text-ink-3" />
      </span>
      <span className="truncate text-[12.5px] leading-4 font-medium text-ink">{child.givenName}</span>
      {underway ? <span className="sr-only">{t("appointments.grid.underway")}</span> : null}
    </button>
  );
}

/* ---------------------------------------------------------------- agenda */

function Agenda({ days, sessions, selectedId, onSelect, onBack, showBack }: CalendarProps) {
  const { language, t } = useLanguage();
  const groups = days
    .map((day) => ({ day, list: sessions.filter((session) => dayOf(session.start) === day) }))
    .filter((group) => group.list.length || group.day === SAMPLE_TODAY);

  if (!sessions.length) {
    return (
      <div className="lg:hidden">
        <EmptyWeek onBack={onBack} showBack={showBack} />
      </div>
    );
  }

  let order = 0;
  return (
    <div className="grid gap-7 lg:hidden">
      {groups.map(({ day, list }) => {
        const today = day === SAMPLE_TODAY;
        return (
          <section key={day} aria-labelledby={`agenda-${day}`} className="grid gap-2.5">
            <h2 id={`agenda-${day}`} className="flex items-center gap-2.5 border-b border-rule pb-2">
              <span className="font-display text-[18px] leading-6 text-ink">{formatLongDay(day, language)}</span>
              {today ? <TabLabel tone="ink">{t("appointments.grid.today")}</TabLabel> : null}
            </h2>
            {list.length ? (
              <ul className="grid gap-2.5">
                {list.map((session) => {
                  const child = getChild(session.childId);
                  if (!child) return null;
                  const past = isPast(session);
                  const selected = session.id === selectedId;
                  const index = order++;
                  return (
                    <li key={session.id} className="animate-settle motion-reduce:[animation-delay:0ms]" style={{ ["--i" as string]: index }}>
                      <button
                        type="button"
                        aria-haspopup="dialog"
                        onClick={() => onSelect(session.id)}
                        className={cx(
                          "relative grid w-full grid-cols-[3.25rem_auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[12px] bg-sheet-raised py-3 ps-3 pe-3 text-start ring-1 transition-[box-shadow,opacity] duration-300",
                          selected ? "shadow-folder ring-board/60" : "shadow-press ring-rule",
                          past && "opacity-55",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cx("absolute -top-[4px] start-4 h-[4px] w-6 rounded-t-[3px]", child.status === "needsReview" ? "bg-gold" : "bg-board")}
                        />
                        <span className="font-figures text-[13.5px] text-ink-2">
                          {formatTime(session.start, language)}
                        </span>
                        <FileMonogram childId={child.id} size="small" />
                        <span className="grid min-w-0 gap-0.5">
                          <span className="truncate text-[15px] font-medium text-ink">{child.name}</span>
                          <span className="truncate text-[12.5px] text-ink-3">
                            <bdi>{session.focus}</bdi>
                          </span>
                        </span>
                        <span className="grid justify-items-end gap-0.5 text-ink-3">
                          <Glyph name={modeGlyph[session.mode]} size={17} title={t(`vocab.mode.${session.mode}`)} />
                          {past ? <span className="text-[11px]">{t("appointments.grid.done")}</span> : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-[13.5px] text-ink-3">{t("appointments.agenda.noSessions")}</p>
            )}
          </section>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------- empty, legend */

function EmptyWeek({ onBack, showBack, floating = false }: { onBack: () => void; showBack: boolean; floating?: boolean }) {
  const { t } = useLanguage();
  return (
    <div
      className={cx(
        "grid justify-items-center gap-3 text-center",
        floating
          ? "absolute inset-x-0 top-24 z-10 mx-auto w-[min(26rem,80%)] rounded-[14px] bg-sheet px-6 py-7 shadow-folder ring-1 ring-rule [animation:sheet-in_420ms_cubic-bezier(0.16,1,0.3,1)_both]"
          : "rounded-[14px] border border-dashed border-rule-strong px-5 py-10",
      )}
    >
      <Glyph name="calendar" size={26} className="text-ink-3" />
      <p className="font-display text-[18px] leading-6 text-ink">{t("appointments.empty.title")}</p>
      <p className="max-w-[40ch] text-[13.5px] leading-5 text-ink-3">{t("appointments.empty.body")}</p>
      {showBack ? (
        <Action variant="outline" size="small" onClick={onBack}>
          {t("appointments.week.backToThis")}
        </Action>
      ) : null}
    </div>
  );
}

function ModeLegend() {
  const { t } = useLanguage();
  return (
    <dl className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-ink-3">
      <dt className="sr-only">{t("appointments.legend.label")}</dt>
      {modes.map((mode) => (
        <dd key={mode} className="inline-flex items-center gap-1.5">
          <Glyph name={modeGlyph[mode]} size={15} />
          {t(`vocab.mode.${mode}`)}
        </dd>
      ))}
    </dl>
  );
}
