"use client";

import { useState } from "react";

import { EventBarcode } from "@/components/case-file/event-barcode";
import { useFileCopy } from "@/components/case-file/file-copy";
import { FileMonogram } from "@/components/case-file/file-monogram";
import { ActionLink, Figure, TabLabel } from "@/components/case-file/primitives";
import { Glyph } from "@/components/icons/glyphs";
import { cx } from "@/components/ui/styles";
import { eventsFor, eventsSince, intensityMix, medianRecovery } from "@/lib/sample-data/analysis";
import { formatDay } from "@/lib/sample-data/time";
import type { ChildFile } from "@/lib/sample-data/types";
import { fill } from "@/lib/format";
import { useLanguage } from "@/providers/language-provider";

const TAB_RISE = 30;

/**
 * The files that need the therapist, physically stacked. Back folders show
 * only their index tabs; choosing a tab pulls that folder to the front.
 */
export function FileStack({ files }: { files: readonly ChildFile[] }) {
  const { t } = useLanguage();
  const [front, setFront] = useState(0);
  const order = files.map((_, index) => (index - front + files.length) % files.length);
  const backCount = files.length - 1;

  return (
    <div className="relative" style={{ paddingTop: backCount * TAB_RISE }}>
      <div role="tablist" aria-label={t("desk.needYou.title")} className="contents">
        {files.map((file, index) => {
          const depth = order[index] ?? 0;
          const tabOffset = files.length > 1 ? (index / files.length) * 100 : 0;
          return (
            <button
              key={file.id}
              type="button"
              role="tab"
              id={`stack-tab-${file.id}`}
              aria-selected={depth === 0}
              aria-controls="stack-panel"
              onClick={() => setFront(index)}
              className={cx(
                "absolute z-30 flex h-[34px] items-center gap-2 rounded-t-[12px] ps-3 pe-4 text-start text-[13.5px] transition-[transform,background-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                depth === 0
                  ? "bg-sheet-raised font-medium text-ink shadow-[inset_0_3px_0_var(--cf-tab-gold)]"
                  : "bg-gold-wash text-gold-ink hover:text-ink",
              )}
              style={{
                insetInlineStart: `calc(${tabOffset}% + 0.5rem)`,
                width: `calc(${100 / files.length}% - 0.75rem)`,
                top: (backCount - depth) * TAB_RISE - 34 + 1,
                zIndex: 30 - depth,
              }}
            >
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full bg-gold"
              />
              <span className="truncate">{file.name}</span>
            </button>
          );
        })}
      </div>

      <div className="grid">
        {files.map((file, index) => {
          const depth = order[index] ?? 0;
          return (
            <div
              key={file.id}
              aria-hidden={depth !== 0}
              className={cx(
                "col-start-1 row-start-1 rounded-[16px] transition-[transform,background-color,box-shadow,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                depth === 0 ? "bg-sheet-raised shadow-lift" : "bg-sheet-sunk shadow-folder",
              )}
              style={{
                transform: `translateY(${-depth * TAB_RISE}px) scale(${1 - depth * 0.018})`,
                transformOrigin: "50% 0",
                zIndex: 20 - depth,
              }}
            >
              {depth === 0 ? <FolderFace file={file} key={file.id} /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FolderFace({ file }: { file: ChildFile }) {
  const { language, t } = useLanguage();
  const all = eventsFor(file.id);
  const since = eventsSince(all, file.lastSession);
  const mix = intensityMix(since);
  const copy = useFileCopy(file);

  return (
    <article
      id="stack-panel"
      role="tabpanel"
      aria-labelledby={`stack-tab-${file.id}`}
      className="animate-settle grid gap-6 p-5 sm:p-7"
    >
      <header className="flex flex-wrap items-start gap-4">
        <FileMonogram childId={file.id} size="large" />
        <div className="grid min-w-0 flex-1 gap-1">
          <h3 className="font-display text-[28px] leading-8 text-ink sm:text-[32px] sm:leading-9">{file.name}</h3>
          <p className="text-[14px] text-ink-3">
            {fill(t("file.ageYears"), { age: file.age })}
            <span aria-hidden="true" className="mx-2 text-rule-strong">/</span>
            {file.focus.map((focus) => t(`vocab.focus.${focus}`)).join(", ")}
          </p>
        </div>
        <span className="hidden sm:block">
          <TabLabel tone="gold">{t("file.status.needsReview")}</TabLabel>
        </span>
      </header>

      <p className="max-w-[58ch] text-[17px] leading-7 text-ink-2">{copy.reason}</p>

      <div className="grid gap-2">
        <div className="flex items-baseline justify-between gap-3 text-[12.5px] text-ink-3">
          <span>{t("desk.needYou.fortnight")}</span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2.5 w-4 rounded-[3px] bg-gold-wash ring-1 ring-gold/40" />
            {fill(t("desk.needYou.sinceSession"), { date: formatDay(file.lastSession, language) })}
          </span>
        </div>
        <EventBarcode events={all} since={file.lastSession} days={28} height={64} showAxis tone="folder" />
      </div>

      <div className="grid grid-cols-3 gap-5 border-t border-dashed border-rule-strong pt-5 sm:grid-cols-[auto_auto_auto_1fr] sm:items-end sm:gap-8">
        <Figure value={since.length} label={t("desk.figures.events")} />
        <Figure value={mix.high} label={t("desk.figures.high")} />
        <Figure value={medianRecovery(since)} unit={t("unit.min")} label={t("desk.figures.recovery")} />
        <p className="col-span-3 flex items-start gap-2 text-[14px] leading-5 text-ink-2 sm:col-span-1 sm:max-w-[30ch] sm:justify-self-end">
          <Glyph name="spark" size={18} className="mt-px text-gold-ink" />
          {copy.pattern}
        </p>
      </div>

      <footer className="flex flex-wrap items-center gap-3">
        <ActionLink href={`/children/${file.id}`} variant="ink" trailingGlyph="arrow">
          {t("file.open")}
        </ActionLink>
        <ActionLink href={`/messages?family=${file.id}`} variant="outline" glyph="messages">
          {t("desk.messageFamily")}
        </ActionLink>
      </footer>
    </article>
  );
}
