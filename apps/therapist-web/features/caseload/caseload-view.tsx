"use client";

import Link from "next/link";
import { useMemo, useState, ViewTransition } from "react";

import { EventBarcode } from "@/components/case-file/event-barcode";
import { FileMonogram } from "@/components/case-file/file-monogram";
import { Glyph, type GlyphName } from "@/components/icons/glyphs";
import { cx } from "@/components/ui/styles";
import { fill } from "@/lib/format";
import { eventsFor, eventsSince, trendOf } from "@/lib/sample-data/analysis";
import { children } from "@/lib/sample-data/fixtures";
import { formatDay, formatTime, formatWeekday } from "@/lib/sample-data/time";
import type { ChildFile, FileStatus, Trend } from "@/lib/sample-data/types";
import { useLanguage } from "@/providers/language-provider";

type Filter = "all" | FileStatus;
type Sort = "attention" | "next" | "name";

const filters: readonly Filter[] = ["all", "needsReview", "sessionToday", "steady"];
const tabFill: Record<FileStatus, string> = {
  needsReview: "bg-gold text-board-deep",
  sessionToday: "bg-cobalt-wash text-cobalt-ink",
  steady: "bg-sheet-raised text-ink-3",
};
const statusRank: Record<FileStatus, number> = { needsReview: 0, sessionToday: 1, steady: 2 };
const trendGlyph: Record<Trend, GlyphName> = { calmer: "trendDown", steady: "steady", busier: "trendUp" };

export function CaseloadView() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("attention");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () =>
      Object.fromEntries(
        filters.map((entry) => [entry, entry === "all" ? children.length : children.filter((child) => child.status === entry).length]),
      ) as Record<Filter, number>,
    [],
  );

  const files = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return children
      .filter((child) => filter === "all" || child.status === filter)
      .filter((child) => !needle || child.name.toLocaleLowerCase().includes(needle))
      .sort((a, b) => {
        if (sort === "name") return a.name.localeCompare(b.name);
        if (sort === "next") return (a.nextSession ?? "9").localeCompare(b.nextSession ?? "9");
        return statusRank[a.status] - statusRank[b.status] || (a.nextSession ?? "9").localeCompare(b.nextSession ?? "9");
      });
  }, [filter, sort, query]);

  return (
    <div className="grid gap-10">
      <header className="grid gap-3 pt-4">
        <h1 className="font-display text-[40px] leading-[1.05] text-ink sm:text-[52px]">{t("caseload.title")}</h1>
        <p className="max-w-[60ch] text-[17px] leading-7 text-ink-2">
          {fill(t("caseload.summary"), {
            total: children.length,
            review: counts.needsReview,
            today: counts.sessionToday,
          })}
        </p>
      </header>

      <div className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div role="tablist" aria-label={t("caseload.filterLabel")} className="flex flex-wrap gap-1.5">
            {filters.map((entry) => {
              const active = filter === entry;
              return (
                <button
                  key={entry}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(entry)}
                  className={cx(
                    "inline-flex h-9 items-center gap-2 rounded-[10px] px-3.5 text-[13.5px] transition-[background-color,color,box-shadow] duration-200",
                    active ? "bg-board text-board-ink shadow-press" : "text-ink-2 ring-1 ring-rule hover:bg-sheet-sunk",
                  )}
                >
                  {entry === "all" ? t("caseload.filter.all") : t(`file.status.${entry}`)}
                  <span className={cx("font-figures text-[11.5px]", active ? "text-board-muted" : "text-ink-3")}>
                    {counts[entry]}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex h-9 items-center gap-2 rounded-[10px] bg-sheet-raised ps-3 pe-2 ring-1 ring-rule focus-within:ring-pen">
              <Glyph name="search" size={16} className="text-ink-3" />
              <span className="sr-only">{t("caseload.search")}</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("caseload.search")}
                className="w-40 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-3"
              />
            </label>
            <label className="flex h-9 items-center gap-2 rounded-[10px] bg-sheet-raised ps-3 pe-1 ring-1 ring-rule">
              <Glyph name="sort" size={16} className="text-ink-3" />
              <span className="sr-only">{t("caseload.sortLabel")}</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as Sort)}
                className="h-full cursor-pointer bg-transparent pe-1 text-[13.5px] text-ink outline-none"
              >
                <option value="attention">{t("caseload.sort.attention")}</option>
                <option value="next">{t("caseload.sort.next")}</option>
                <option value="name">{t("caseload.sort.name")}</option>
              </select>
            </label>
          </div>
        </div>

        <Drawer files={files} />
      </div>
    </div>
  );
}

/** A pressboard drawer of upright folders; each tab is staggered like a real file. */
function Drawer({ files }: { files: readonly ChildFile[] }) {
  const { t } = useLanguage();

  return (
    <div className="workspace rounded-[22px] p-2 pt-3 shadow-[inset_0_2px_10px_var(--cf-overlay)] sm:p-3 sm:pt-4">
      {files.length === 0 ? (
        <div className="grid place-items-center gap-2 px-6 py-16 text-center">
          <Glyph name="drawer" size={32} className="text-board-muted" />
          <p className="text-[15px] text-board-ink">{t("caseload.empty.title")}</p>
          <p className="text-[13.5px] text-board-muted">{t("caseload.empty.description")}</p>
        </div>
      ) : (
        <ol className="grid">
          {files.map((child, index) => (
            <li key={child.id} className="animate-rise relative pt-[26px]" style={{ ["--i" as string]: index }}>
              <FolderRow child={child} index={index} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function FolderRow({ child, index }: { child: ChildFile; index: number }) {
  const { language, t } = useLanguage();
  const list = eventsFor(child.id);
  const since = eventsSince(list, child.lastSession);
  const trend = trendOf(list);
  const primary = child.caregivers.find((caregiver) => caregiver.primary);
  const tabStart = `${(index % 4) * 18 + 1}%`;

  return (
    <Link
      href={`/children/${child.id}`}
      className="group relative block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 focus-visible:-translate-y-1.5"
    >
      <span
        className={cx(
          "absolute -top-[26px] flex h-[27px] max-w-[45%] items-center gap-2 rounded-t-[11px] px-3 text-[12.5px] font-medium",
          tabFill[child.status],
        )}
        style={{ insetInlineStart: tabStart }}
      >
        <span className="truncate">{t(`file.status.${child.status}`)}</span>
      </span>
      <span className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 rounded-[14px] bg-sheet-raised px-4 py-4 shadow-folder transition-shadow duration-300 group-hover:shadow-lift sm:px-5 lg:grid-cols-[auto_minmax(0,1.3fr)_minmax(0,1fr)_minmax(9rem,1fr)_auto]">
        <ViewTransition name={`file-mono-${child.id}`} share="file" default="none">
          <FileMonogram childId={child.id} size="medium" />
        </ViewTransition>
        <span className="grid min-w-0 gap-0.5">
          <ViewTransition name={`file-name-${child.id}`} share="file" default="none">
            <span className="font-display w-fit truncate text-[19px] leading-6 text-ink">{child.name}</span>
          </ViewTransition>
          <span className="truncate text-[13px] text-ink-3">
            {fill(t("file.ageYears"), { age: child.age })} / {child.focus.map((focus) => t(`vocab.focus.${focus}`)).join(", ")}
          </span>
        </span>

        <span className="col-span-3 grid min-w-0 gap-1 text-[13px] text-ink-2 lg:col-span-1">
          {primary ? (
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <Glyph name="family" size={15} className="text-ink-3" />
              <span className="truncate">
                {primary.name}, {t(`vocab.relation.${primary.relation}`)}
              </span>
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <Glyph name="calendar" size={15} className="text-ink-3" />
            {child.nextSession ? (
              <span className="font-figures text-[12.5px]">
                {formatWeekday(child.nextSession, language)} {formatDay(child.nextSession, language)}{" "}
                {formatTime(child.nextSession, language)}
              </span>
            ) : (
              <span>{t("caseload.noSession")}</span>
            )}
          </span>
        </span>

        <span className="col-span-3 grid gap-1 lg:col-span-1">
          <EventBarcode events={list} days={14} height={28} since={child.lastSession} tone="folder" />
          <span className="flex items-center justify-between text-[12px] text-ink-3">
            <span>{fill(t("caseload.sinceSession"), { count: since.length })}</span>
            <span
              className={cx(
                "inline-flex items-center gap-1",
                trend === "busier" ? "text-ruby-ink" : trend === "calmer" ? "text-moss-ink" : undefined,
              )}
            >
              <Glyph name={trendGlyph[trend]} size={14} />
              {t(`vocab.trend.${trend}`)}
            </span>
          </span>
        </span>

        <span className="col-start-3 row-start-1 flex items-center gap-3 lg:col-start-auto lg:row-start-auto">
          <Glyph name="chevron" size={18} className="text-ink-3 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
        </span>
      </span>
    </Link>
  );
}
