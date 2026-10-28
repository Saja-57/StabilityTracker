"use client";

import { useState } from "react";

import { ReportComposer } from "./report-composer";
import { periodLabel, statusOrder, type DeskReport, type ReportAudience, type ReportStatus } from "./report-data";
import { ReportSheet } from "./report-sheet";
import { FileMonogram } from "@/components/case-file/file-monogram";
import { Action, TabLabel } from "@/components/case-file/primitives";
import { cx } from "@/components/ui/styles";
import { fill } from "@/lib/format";
import { getChild, reports } from "@/lib/sample-data/fixtures";
import { addDays, dayOf, formatDay, formatTime, SAMPLE_TODAY } from "@/lib/sample-data/time";
import type { ReportDocument } from "@/lib/sample-data/types";
import { useLanguage } from "@/providers/language-provider";

const initial: DeskReport[] = reports.map((report) => ({ ...report, sharedOn: null }));

export function ReportsView() {
  const { t } = useLanguage();
  const [docs, setDocs] = useState<DeskReport[]>(initial);
  const [selectedId, setSelectedId] = useState<string>(
    () => initial.find((doc) => doc.status === "draft")?.id ?? initial[0]?.id ?? "",
  );
  const [composing, setComposing] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const selected = docs.find((doc) => doc.id === selectedId) ?? docs[0];
  const count = (status: ReportStatus) => docs.filter((doc) => doc.status === status).length;

  const update = (id: string, patch: Partial<Pick<DeskReport, "status" | "sharedOn" | "updatedAt">>) =>
    setDocs((list) => list.map((doc) => (doc.id === id ? { ...doc, ...patch } : doc)));

  const create = (doc: ReportDocument) => {
    setDocs((list) => [{ ...doc, sharedOn: null }, ...list]);
    setSelectedId(doc.id);
    setComposing(false);
    setAnnouncement(fill(t("reports.created"), { name: getChild(doc.childId)?.name ?? "" }));
  };

  return (
    <div className="grid gap-10">
      <header className="flex flex-wrap items-end justify-between gap-6 pt-4">
        <div className="grid gap-3">
          <h1 className="font-display text-[40px] leading-[1.05] text-ink sm:text-[52px]">{t("reports.title")}</h1>
          <p className="max-w-[60ch] text-[17px] leading-7 text-ink-2">
            {fill(t("reports.summary"), { drafts: count("draft"), ready: count("ready"), shared: count("shared") })}
          </p>
        </div>
        <Action
          variant="ink"
          glyph="plus"
          aria-expanded={composing}
          aria-controls="report-composer"
          onClick={() => setComposing((open) => !open)}
        >
          {t("reports.prepare")}
        </Action>
      </header>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      {composing ? <ReportComposer onCancel={() => setComposing(false)} onCreate={create} /> : null}

      <div className="grid gap-10 lg:grid-cols-[minmax(17rem,22rem)_minmax(0,1fr)] lg:gap-10 xl:gap-14">
        <nav aria-label={t("reports.list.label")} className="grid content-start gap-8">
          {statusOrder.map((status) => (
            <ReportGroup
              key={status}
              status={status}
              docs={docs
                .filter((doc) => doc.status === status)
                .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))}
              selectedId={selected?.id ?? ""}
              onSelect={setSelectedId}
            />
          ))}
        </nav>

        {selected ? (
          <ReportSheet
            key={selected.id}
            report={selected}
            onMarkReady={() => update(selected.id, { status: "ready" })}
            onShare={() => {
              update(selected.id, { status: "shared", sharedOn: SAMPLE_TODAY });
              setAnnouncement(fill(t("reports.share.done"), { audience: audienceLabel(t, selected.audience) }));
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

function audienceLabel(t: ReturnType<typeof useLanguage>["t"], audience: ReportAudience) {
  return t(`reports.audience.${audience}`).toLowerCase();
}

function ReportGroup({
  status,
  docs,
  selectedId,
  onSelect,
}: {
  status: ReportStatus;
  docs: readonly DeskReport[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const { language, t } = useLanguage();
  const headingId = `report-group-${status}`;

  return (
    <section aria-labelledby={headingId} className="grid gap-2">
      <h2 id={headingId} className="flex items-baseline justify-between gap-3 border-b border-rule-strong pb-2">
        <span className="font-display text-[17px] leading-6 text-ink">{t(`reports.status.${status}`)}</span>
        <span className="font-figures text-[12.5px] text-ink-3">{docs.length}</span>
      </h2>
      {docs.length === 0 ? (
        <p className="py-3 text-[13.5px] text-ink-3">{t("reports.group.empty")}</p>
      ) : (
        <ul className="grid">
          {docs.map((doc, index) => {
            const child = getChild(doc.childId);
            const active = doc.id === selectedId;
            return (
              <li key={doc.id} className="animate-settle border-b border-rule last:border-b-0" style={{ ["--i" as string]: index }}>
                <button
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => onSelect(doc.id)}
                  className={cx(
                    "grid w-full grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 rounded-[10px] px-2 py-3 text-start transition-colors duration-150",
                    active ? "bg-sheet-raised shadow-sheet" : "hover:bg-sheet-sunk",
                  )}
                >
                  <FileMonogram childId={doc.childId} size="small" className="row-span-2 mt-0.5" />
                  <span className="flex min-w-0 items-center gap-2">
                    <span className={cx("truncate text-[14.5px] text-ink", active && "font-medium")}><bdi>{doc.title}</bdi></span>
                    {doc.status === "draft" ? (
                      <TabLabel tone="gold" className="ms-auto">
                        {t("reports.needsYou")}
                      </TabLabel>
                    ) : null}
                  </span>
                  <span className="grid min-w-0 gap-0.5 text-[12.5px] text-ink-3">
                    <span className="truncate">
                      <bdi className="text-ink-2">{child?.name}</bdi>
                      <span aria-hidden="true"> · </span>
                      {t(`reports.audience.${doc.audience}`)}
                    </span>
                    <span className="font-figures flex flex-wrap gap-x-3">
                      <span>{periodLabel(doc.period, language, t)}</span>
                      <span>{fill(t("reports.updated"), { when: whenLabel(doc.updatedAt, language, t) })}</span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

type Lang = ReturnType<typeof useLanguage>["language"];
type T = ReturnType<typeof useLanguage>["t"];

function whenLabel(at: string, language: Lang, t: T) {
  const day = dayOf(at);
  if (day === SAMPLE_TODAY) return `${t("common.today")} ${formatTime(at, language)}`;
  if (day === addDays(SAMPLE_TODAY, -1)) return `${t("common.yesterday")} ${formatTime(at, language)}`;
  return formatDay(day, language);
}
