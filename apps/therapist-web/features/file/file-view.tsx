"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ViewTransition } from "react";

import { FileEvents } from "./file-events";
import { FileNotes } from "./file-notes";
import { FileOverview } from "./file-overview";
import { FileRoutine } from "./file-routine";
import { FileSurveys } from "./file-surveys";
import { FileMonogram } from "@/components/case-file/file-monogram";
import { ActionLink, DateStamp, TabLabel, type Tone } from "@/components/case-file/primitives";
import { Glyph, type GlyphName } from "@/components/icons/glyphs";
import { cx } from "@/components/ui/styles";
import { fill } from "@/lib/format";
import { eventsFor, eventsSince } from "@/lib/sample-data/analysis";
import { getChild } from "@/lib/sample-data/fixtures";
import { formatDay, formatTime, formatWeekday } from "@/lib/sample-data/time";
import type { FileStatus } from "@/lib/sample-data/types";
import { useLanguage } from "@/providers/language-provider";

export const fileTabs = ["overview", "events", "routine", "surveys", "notes"] as const;
export type FileTab = (typeof fileTabs)[number];

const tabGlyph: Record<FileTab, GlyphName> = {
  overview: "desk",
  events: "pulse",
  routine: "routine",
  surveys: "survey",
  notes: "notes",
};
const statusTone: Record<FileStatus, Tone> = { needsReview: "gold", sessionToday: "cobalt", steady: "moss" };

export function FileView({ childId }: { childId: string }) {
  const { language, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const child = getChild(childId);
  const requested = params.get("tab");
  const tab: FileTab = fileTabs.includes(requested as FileTab) ? (requested as FileTab) : "overview";

  if (!child) {
    return (
      <div className="grid justify-items-start gap-4 pt-10">
        <Glyph name="drawer" size={36} className="text-ink-3" />
        <h1 className="font-display text-[36px] text-ink">{t("file.missing.title")}</h1>
        <p className="text-ink-3">{t("file.missing.description")}</p>
        <ActionLink href="/children" variant="ink" glyph="arrowBack">
          {t("file.backToCaseload")}
        </ActionLink>
      </div>
    );
  }

  const unreviewed = eventsSince(eventsFor(child.id), child.lastSession).filter((event) => !event.reviewed).length;
  const select = (next: FileTab) => {
    const search = new URLSearchParams(params.toString());
    if (next === "overview") search.delete("tab");
    else search.set("tab", next);
    const query = search.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8">
      <Link
        href="/children"
        className="inline-flex w-fit items-center gap-1.5 pt-3 text-[13.5px] text-ink-3 transition-colors hover:text-ink"
      >
        <Glyph name="arrowBack" size={16} />
        {t("file.backToCaseload")}
      </Link>

      <header className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="flex min-w-0 flex-wrap items-start gap-5">
          <ViewTransition name={`file-mono-${child.id}`} share="file" default="none">
            <FileMonogram childId={child.id} size="large" className="size-20 rounded-[20px] text-[28px]" />
          </ViewTransition>
          <div className="grid min-w-0 gap-2">
            <ViewTransition name={`file-name-${child.id}`} share="file" default="none">
              <h1 className="font-display w-fit text-[40px] leading-[1.02] text-ink sm:text-[56px]">{child.name}</h1>
            </ViewTransition>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[14.5px] text-ink-2">
              <span>{fill(t("file.ageYears"), { age: child.age })}</span>
              <span aria-hidden="true" className="text-rule-strong">/</span>
              <span>{child.focus.map((focus) => t(`vocab.focus.${focus}`)).join(", ")}</span>
              <span aria-hidden="true" className="text-rule-strong">/</span>
              <span>{fill(t("file.inCareSince"), { date: formatDay(child.since, language) + " " + child.since.slice(0, 4) })}</span>
            </p>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px] text-ink-3">
              {child.caregivers.map((caregiver) => (
                <span key={caregiver.name} className="inline-flex items-center gap-1.5">
                  <Glyph name="person" size={15} />
                  <span className="text-ink-2">{caregiver.name}</span>
                  <span>{t(`vocab.relation.${caregiver.relation}`)}</span>
                </span>
              ))}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <TabLabel tone={statusTone[child.status]}>{t(`file.status.${child.status}`)}</TabLabel>
          {child.nextSession ? (
            <DateStamp tone="pen" tilt={-2}>
              {t("file.nextSession")} {formatWeekday(child.nextSession, language)} {formatDay(child.nextSession, language)}{" "}
              {formatTime(child.nextSession, language)}
            </DateStamp>
          ) : null}
        </div>
      </header>

      <p className="flex max-w-[72ch] items-start gap-3 rounded-[14px] bg-sheet-sunk px-4 py-3 text-[15px] leading-6 text-ink-2">
        <Glyph name="flag" size={18} className="mt-0.5 text-moss-ink" />
        <span>
          <span className="font-medium text-ink">{t("file.goal")}: </span>
          <bdi>{child.goal}</bdi>
        </span>
      </p>

      <section className="min-w-0">
        <div role="tablist" aria-label={t("file.sections")} className="flex gap-1 overflow-x-auto px-2">
          {fileTabs.map((entry) => {
            const active = entry === tab;
            return (
              <button
                key={entry}
                type="button"
                role="tab"
                id={`file-tab-${entry}`}
                aria-selected={active}
                aria-controls="file-panel"
                onClick={() => select(entry)}
                className={cx(
                  "relative inline-flex h-11 shrink-0 items-center gap-2 rounded-t-[13px] px-4 text-[14px] transition-[background-color,color] duration-200",
                  active ? "z-10 bg-sheet-raised font-medium text-ink" : "bg-sheet-sunk/80 text-ink-3 hover:text-ink",
                )}
              >
                <Glyph name={tabGlyph[entry]} size={17} />
                {t(`file.tab.${entry}`)}
                {entry === "events" && unreviewed > 0 ? (
                  <span className="font-figures grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1.5 text-[11px] text-board-deep">
                    {unreviewed}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        <div
          id="file-panel"
          role="tabpanel"
          aria-labelledby={`file-tab-${tab}`}
          className="relative rounded-[18px] bg-sheet-raised p-5 shadow-folder sm:p-8"
        >
          <div key={tab} className="animate-settle">
            {tab === "overview" ? <FileOverview child={child} onOpenTab={select} /> : null}
            {tab === "events" ? <FileEvents child={child} /> : null}
            {tab === "routine" ? <FileRoutine child={child} /> : null}
            {tab === "surveys" ? <FileSurveys child={child} /> : null}
            {tab === "notes" ? <FileNotes child={child} /> : null}
          </div>
        </div>
      </section>
    </div>
  );
}
