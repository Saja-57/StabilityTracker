"use client";

import { useMemo, useState, type ReactNode } from "react";

import { IntensityMark, PenCircle, PenTick } from "@/components/case-file/primitives";
import { Glyph } from "@/components/icons/glyphs";
import { cx } from "@/components/ui/styles";
import { fill } from "@/lib/format";
import { eventsFor } from "@/lib/sample-data/analysis";
import { dayOf, formatLongDay, formatTime } from "@/lib/sample-data/time";
import type { CareEvent, ChildFile, Intensity } from "@/lib/sample-data/types";
import { useLanguage } from "@/providers/language-provider";

type IntensityFilter = "all" | Intensity;

export function FileEvents({ child }: { child: ChildFile }) {
  const { language, t } = useLanguage();
  const all = eventsFor(child.id);
  const [filter, setFilter] = useState<IntensityFilter>("all");
  const [open, setOpen] = useState<string | null>(() => all.find((event) => !event.reviewed)?.id ?? null);
  const [reviewed, setReviewed] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(all.map((event) => [event.id, event.reviewed])),
  );
  const [flagged, setFlagged] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(all.map((event) => [event.id, event.flagged])),
  );

  const groups = useMemo(() => {
    const visible = all.filter((event) => filter === "all" || event.intensity === filter);
    const map = new Map<string, CareEvent[]>();
    visible.forEach((event) => map.set(dayOf(event.at), [...(map.get(dayOf(event.at)) ?? []), event]));
    return [...map.entries()];
  }, [all, filter]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-ink-3">
          {fill(t("file.events.summary"), { count: all.length, open: Object.values(reviewed).filter((value) => !value).length })}
        </p>
        <div role="group" aria-label={t("file.events.filter")} className="flex gap-1 rounded-[11px] bg-sheet-sunk p-1">
          {(["all", "high", "moderate", "low"] as const).map((entry) => (
            <button
              key={entry}
              type="button"
              aria-pressed={filter === entry}
              onClick={() => setFilter(entry)}
              className={cx(
                "h-8 rounded-[8px] px-3 text-[13px] transition-[background-color,color,box-shadow]",
                filter === entry ? "bg-sheet-raised text-ink shadow-press" : "text-ink-3 hover:text-ink",
              )}
            >
              {entry === "all" ? t("caseload.filter.all") : t(`vocab.intensity.${entry}`)}
            </button>
          ))}
        </div>
      </div>

      {groups.length === 0 ? (
        <p className="py-10 text-center text-[14px] text-ink-3">{t("file.events.empty")}</p>
      ) : (
        <div className="grid gap-8">
          {groups.map(([day, list]) => (
            <section key={day} className="grid gap-2 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-6">
              <h3 className="stamp pt-4 text-[11px] text-ink-3">{formatLongDay(day, language)}</h3>
              <ul className="grid border-y border-rule">
                {list.map((event) => {
                  const expanded = open === event.id;
                  const done = Boolean(reviewed[event.id]);
                  return (
                    <li key={event.id} className="border-b border-rule last:border-b-0">
                      <div className="flex items-center gap-3 py-3">
                        <button
                          type="button"
                          aria-expanded={expanded}
                          onClick={() => setOpen(expanded ? null : event.id)}
                          className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 rounded-[8px] text-start"
                        >
                          <span className="font-figures w-12 text-[13px] text-ink-2">{formatTime(event.at, language)}</span>
                          <span className={cx("text-[15px] text-ink", !done && "font-medium")}>
                            {t(`vocab.eventType.${event.type}`)}
                          </span>
                          {flagged[event.id] ? (
                            <PenCircle label={t("desk.feed.flagged")}>
                              <IntensityMark intensity={event.intensity} withLabel />
                            </PenCircle>
                          ) : (
                            <IntensityMark intensity={event.intensity} withLabel />
                          )}
                          <span className="text-[13px] text-ink-3">
                            {t(`vocab.trigger.${event.trigger}`)} / {t(`vocab.setting.${event.setting}`)}
                          </span>
                          <Glyph
                            name="chevronDown"
                            size={16}
                            className={cx("ms-auto text-ink-3 transition-transform duration-300", expanded && "rotate-180")}
                          />
                        </button>
                        <PenTick
                          checked={done}
                          label={t("desk.feed.markReviewed")}
                          onToggle={() => setReviewed((state) => ({ ...state, [event.id]: !state[event.id] }))}
                        />
                      </div>
                      <div
                        className={cx(
                          "grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <div className="overflow-hidden">
                          <EventScore
                            event={event}
                            flagged={Boolean(flagged[event.id])}
                            onFlag={() => setFlagged((state) => ({ ...state, [event.id]: !state[event.id] }))}
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

/** The event as a three-column score: what came before, the behavior, what helped. */
function EventScore({ event, flagged, onFlag }: { event: CareEvent; flagged: boolean; onFlag: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="grid gap-4 pb-5">
      <div className="grid overflow-hidden rounded-[14px] ring-1 ring-rule md:grid-cols-3">
        <ScoreColumn label={t("vocab.abc.before")} glyph="spark" tone="text-gold-ink">
          <p><bdi>{event.before}</bdi></p>
          <p className="text-[12.5px] text-ink-3">
            {t(`vocab.trigger.${event.trigger}`)} / {t(`vocab.setting.${event.setting}`)}
          </p>
        </ScoreColumn>
        <ScoreColumn label={t("vocab.abc.behavior")} glyph="pulse" tone="text-ruby-ink" center>
          <p><bdi>{event.behavior}</bdi></p>
          <p className="font-figures text-[12.5px] text-ink-3">
            {fill(t("file.events.duration"), { min: event.durationMin })}
          </p>
        </ScoreColumn>
        <ScoreColumn label={t("vocab.abc.helped")} glyph="leaf" tone="text-moss-ink">
          <p>{event.helped.map((support) => t(`vocab.support.${support}`)).join(", ")}</p>
          <p className="text-[12.5px] text-ink-3">
            {event.helpedWorked ? t("file.events.worked") : t("file.events.partly")} /{" "}
            <span className="font-figures">{fill(t("file.events.recovery"), { min: event.recoveryMin })}</span>
          </p>
        </ScoreColumn>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-[12.5px] text-ink-3">
        <span>
          {fill(t("desk.feed.by"), { name: event.reporter })} / {event.quick ? t("file.events.quick") : t("file.events.detailed")}
        </span>
        <button
          type="button"
          aria-pressed={flagged}
          onClick={onFlag}
          className={cx(
            "inline-flex h-8 items-center gap-1.5 rounded-[9px] px-2.5 transition-colors",
            flagged ? "text-pen" : "text-ink-2 hover:bg-sheet-sunk",
          )}
        >
          <Glyph name="flag" size={15} />
          {flagged ? t("file.events.unflag") : t("file.events.flag")}
        </button>
      </div>
    </div>
  );
}

function ScoreColumn({
  label,
  glyph,
  tone,
  center = false,
  children,
}: {
  label: string;
  glyph: "spark" | "pulse" | "leaf";
  tone: string;
  center?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        "grid content-start gap-2 p-4 text-[14px] leading-6 text-ink-2",
        center ? "bg-sheet border-y border-rule md:border-x md:border-y-0" : "bg-sheet-raised",
      )}
    >
      <p className={cx("flex items-center gap-1.5 text-[12.5px] font-medium", tone)}>
        <Glyph name={glyph} size={15} />
        {label}
      </p>
      {children}
    </div>
  );
}
