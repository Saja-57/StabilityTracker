"use client";

import { type ReactNode, useId, useRef, useState } from "react";

import { audiences, periodLabel, periodPresets, presetPeriod, type PeriodPreset, type ReportAudience } from "./report-data";
import { FileMonogram } from "@/components/case-file/file-monogram";
import { Action } from "@/components/case-file/primitives";
import { Glyph } from "@/components/icons/glyphs";
import { cx } from "@/components/ui/styles";
import { children } from "@/lib/sample-data/fixtures";
import { SAMPLE_NOW } from "@/lib/sample-data/time";
import type { ReportDocument } from "@/lib/sample-data/types";
import { useLanguage } from "@/providers/language-provider";


export function ReportComposer({
  onCancel,
  onCreate,
}: {
  onCancel: () => void;
  onCreate: (doc: ReportDocument) => void;
}) {
  const { language, t } = useLanguage();
  const serial = useRef(0);
  const [childId, setChildId] = useState(children[0]?.id ?? "");
  const [preset, setPreset] = useState<PeriodPreset>("d28");
  const [audience, setAudience] = useState<ReportAudience>("family");
  const child = children.find((entry) => entry.id === childId);
  const period = child ? presetPeriod(preset, child.lastSession) : "";
  const selectId = useId();

  return (
    <section
      id="report-composer"
      aria-labelledby="report-composer-title"
      className="animate-settle grid gap-6 rounded-[14px] bg-sheet-sunk px-5 py-6 sm:px-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <h2 id="report-composer-title" className="font-display text-[21px] leading-7 text-ink">
            {t("reports.composer.title")}
          </h2>
          <p className="text-[14px] leading-5 text-ink-3">{t("reports.composer.description")}</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label={t("reports.composer.close")}
          className="grid size-9 shrink-0 place-items-center rounded-[10px] text-ink-2 transition-colors hover:bg-sheet hover:text-ink"
        >
          <Glyph name="close" size={18} />
        </button>
      </div>

      <form
        className="grid gap-6 sm:grid-cols-2 xl:grid-cols-[minmax(0,15rem)_minmax(0,1.3fr)_minmax(0,1.2fr)_auto] xl:gap-8"
        onSubmit={(event) => {
          event.preventDefault();
          if (!child) return;
          onCreate({
            id: `r-new-${child.id}-${(serial.current += 1)}`,
            childId: child.id,
            title: t(`reports.newTitle.${audience}`),
            period,
            status: "draft",
            updatedAt: SAMPLE_NOW,
            audience,
          });
        }}
      >
        <div className="grid content-start gap-2">
          <label htmlFor={selectId} className="text-[12.5px] text-ink-3">
            {t("reports.composer.child")}
          </label>
          <div className="relative flex items-center">
            {child ? <FileMonogram childId={child.id} size="small" className="pointer-events-none absolute start-1" /> : null}
            <select
              id={selectId}
              value={childId}
              onChange={(event) => setChildId(event.target.value)}
              className="h-10 w-full appearance-none rounded-[11px] bg-sheet-raised ps-11 pe-9 text-[14px] text-ink ring-1 ring-rule hover:ring-rule-strong"
            >
              {children.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
                </option>
              ))}
            </select>
            <Glyph name="chevronDown" size={16} className="pointer-events-none absolute end-3 text-ink-3" />
          </div>
        </div>

        <Choice legend={t("reports.composer.period")} hint={child ? periodLabel(period, language, t) : null}>
          {periodPresets.map((entry) => (
            <ChoiceOption key={entry} name="report-period" checked={preset === entry} onSelect={() => setPreset(entry)}>
              {t(`reports.composer.preset.${entry}`)}
            </ChoiceOption>
          ))}
        </Choice>

        <Choice legend={t("reports.composer.audience")} hint={null}>
          {audiences.map((entry) => (
            <ChoiceOption key={entry} name="report-audience" checked={audience === entry} onSelect={() => setAudience(entry)}>
              {t(`reports.audience.${entry}`)}
            </ChoiceOption>
          ))}
        </Choice>

        <div className="flex gap-2 self-end">
          <Action type="submit" variant="ink" glyph="plus">
            {t("reports.composer.create")}
          </Action>
          <Action variant="quiet" onClick={onCancel}>
            {t("reports.composer.cancel")}
          </Action>
        </div>
      </form>
    </section>
  );
}

function Choice({ legend, hint, children: options }: { legend: string; hint: string | null; children: ReactNode }) {
  return (
    <fieldset className="grid min-w-0 content-start gap-2">
      <legend className="mb-2 flex w-full items-baseline justify-between gap-3 text-[12.5px] text-ink-3">
        <span>{legend}</span>
        {hint ? <span className="font-figures text-ink-2">{hint}</span> : null}
      </legend>
      <div className="flex flex-wrap gap-1.5">{options}</div>
    </fieldset>
  );
}

function ChoiceOption({
  name,
  checked,
  onSelect,
  children: label,
}: {
  name: string;
  checked: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <label
      className={cx(
        "inline-flex h-9 cursor-pointer items-center rounded-[10px] px-3 text-[13.5px] transition-[background-color,box-shadow,color] duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold",
        checked ? "bg-board text-board-ink shadow-press" : "bg-sheet-raised text-ink-2 ring-1 ring-rule hover:text-ink hover:ring-rule-strong",
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="sr-only" />
      {label}
    </label>
  );
}
