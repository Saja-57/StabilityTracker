"use client";

import { useState } from "react";

import { Action, DateStamp, TabLabel } from "@/components/case-file/primitives";
import { Glyph } from "@/components/icons/glyphs";
import { cx } from "@/components/ui/styles";
import { fill } from "@/lib/format";
import { getRoutine } from "@/lib/sample-data/fixtures";
import { addDays, formatDay, SAMPLE_TODAY } from "@/lib/sample-data/time";
import type { ChildFile, RoutineStep, StepStatus } from "@/lib/sample-data/types";
import { useLanguage } from "@/providers/language-provider";

const statusCell: Record<StepStatus, string> = {
  completed: "bg-moss",
  delayed: "bg-clay",
  skipped: "bg-transparent ring-1 ring-inset ring-ruby/60",
  upcoming: "bg-transparent ring-1 ring-inset ring-rule-strong",
  current: "bg-transparent ring-2 ring-inset ring-board",
};

interface Draft {
  readonly stepId: string;
  readonly time: string;
  readonly label: string;
}

export function FileRoutine({ child }: { child: ChildFile }) {
  const { language, t } = useLanguage();
  const [steps, setSteps] = useState<readonly RoutineStep[]>(() => getRoutine(child.id));
  const [draft, setDraft] = useState<Draft | null>(null);
  const [sent, setSent] = useState<string[]>([]);

  const save = () => {
    if (!draft) return;
    setSteps((current) =>
      current.map((step) => (step.id === draft.stepId ? { ...step, time: draft.time, label: draft.label, adjusted: true } : step)),
    );
    setSent((current) => [...current, draft.stepId]);
    setDraft(null);
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-[60ch] text-[14px] leading-6 text-ink-3">{t("file.routine.description")}</p>
        <Legend />
      </div>

      <div className="hidden grid-cols-[4rem_minmax(0,1fr)_auto_3.5rem] items-end gap-4 px-1 text-[11.5px] text-ink-3 md:grid">
        <span>{t("file.routine.time")}</span>
        <span>{t("file.routine.step")}</span>
        <span className="flex justify-between gap-6">
          <span>{formatDay(addDays(SAMPLE_TODAY, -13), language)}</span>
          <span>{t("common.today")}</span>
        </span>
        <span className="text-end">{t("file.routine.kept")}</span>
      </div>

      <ol className="grid border-y border-rule">
        {steps.map((step, index) => {
          const done = step.history.filter((status) => status === "completed").length;
          const counted = step.history.filter((status) => status !== "upcoming" && status !== "current").length;
          const rate = Math.round((done / Math.max(1, counted)) * 100);
          const editing = draft?.stepId === step.id;
          return (
            <li key={step.id} className="animate-settle border-b border-rule last:border-b-0" style={{ ["--i" as string]: index }}>
              <div className="grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 py-4 md:grid-cols-[4rem_minmax(0,1fr)_auto_3.5rem]">
                <span className="font-figures text-[14px] text-ink-2">{step.time}</span>
                <span className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="text-[15px] text-ink"><bdi>{step.label}</bdi></span>
                  {step.adjusted ? <TabLabel tone="cobalt">{t("file.routine.adjusted")}</TabLabel> : null}
                  {sent.includes(step.id) ? (
                    <DateStamp tone="pen" tilt={-2} className="text-[10px]">
                      {t("file.routine.sent")}
                    </DateStamp>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setDraft({ stepId: step.id, time: step.time, label: step.label })}
                    className="ms-auto inline-flex h-8 items-center gap-1.5 rounded-[9px] px-2.5 text-[13px] text-ink-3 transition-colors hover:bg-sheet-sunk hover:text-ink md:ms-0"
                  >
                    <Glyph name="edit" size={15} />
                    {t("file.routine.propose")}
                  </button>
                </span>
                <span
                  className="col-span-2 grid grid-cols-[repeat(14,minmax(0,1fr))] gap-[3px] md:col-span-1 md:w-[15rem]"
                  role="img"
                  aria-label={fill(t("file.routine.history"), { done, total: counted })}
                >
                  {step.history.map((status, day) => (
                    <span
                      key={day}
                      title={t(`vocab.stepStatus.${status}`)}
                      className={cx("h-[18px] rounded-[4px]", statusCell[status])}
                    />
                  ))}
                </span>
                <span className="font-figures hidden text-end text-[14px] text-ink md:block">{rate}%</span>
              </div>
              {editing && draft ? (
                <div className="animate-settle mb-4 grid gap-3 rounded-[14px] bg-sheet p-4 ring-1 ring-rule sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-end">
                  <label className="grid gap-1 text-[12.5px] text-ink-3">
                    {t("file.routine.time")}
                    <input
                      type="time"
                      value={draft.time}
                      onChange={(event) => setDraft({ ...draft, time: event.target.value })}
                      className="font-figures h-10 rounded-[10px] bg-sheet-raised px-3 text-[14px] text-ink ring-1 ring-rule outline-none focus:ring-pen"
                    />
                  </label>
                  <label className="grid gap-1 text-[12.5px] text-ink-3">
                    {t("file.routine.step")}
                    <input
                      value={draft.label}
                      onChange={(event) => setDraft({ ...draft, label: event.target.value })}
                      className="h-10 rounded-[10px] bg-sheet-raised px-3 text-[14px] text-ink ring-1 ring-rule outline-none focus:ring-pen"
                    />
                  </label>
                  <span className="flex gap-2">
                    <Action variant="quiet" onClick={() => setDraft(null)}>
                      {t("common.cancel")}
                    </Action>
                    <Action variant="ink" glyph="send" onClick={save}>
                      {t("file.routine.sendToFamily")}
                    </Action>
                  </span>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Legend() {
  const { t } = useLanguage();
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-ink-3">
      {(["completed", "delayed", "skipped", "upcoming"] as const).map((status) => (
        <li key={status} className="inline-flex items-center gap-1.5">
          <span className={cx("size-3 rounded-[3px]", statusCell[status])} />
          {t(`vocab.stepStatus.${status}`)}
        </li>
      ))}
    </ul>
  );
}
