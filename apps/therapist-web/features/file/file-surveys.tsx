"use client";

import { useState } from "react";

import { Action, DateStamp } from "@/components/case-file/primitives";
import { Glyph } from "@/components/icons/glyphs";
import { cx } from "@/components/ui/styles";
import { fill } from "@/lib/format";
import { getSurveys } from "@/lib/sample-data/fixtures";
import { formatDay } from "@/lib/sample-data/time";
import type { ChildFile } from "@/lib/sample-data/types";
import { useLanguage } from "@/providers/language-provider";

export function FileSurveys({ child }: { child: ChildFile }) {
  const { language, t } = useLanguage();
  const surveys = getSurveys(child.id);
  const [requested, setRequested] = useState(false);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-[60ch] text-[14px] leading-6 text-ink-3">{t("file.surveys.description")}</p>
        {requested ? (
          <DateStamp tone="pen">{t("file.surveys.requested")}</DateStamp>
        ) : (
          <Action variant="ink" glyph="survey" onClick={() => setRequested(true)}>
            {t("file.surveys.send")}
          </Action>
        )}
      </div>
      <ol className="grid border-y border-rule">
        {surveys.map((survey, index) => {
          const delta = survey.score != null && survey.previousScore != null ? survey.score - survey.previousScore : null;
          return (
            <li
              key={survey.id}
              className="animate-settle grid gap-3 border-b border-rule py-5 last:border-b-0 md:grid-cols-[minmax(0,1fr)_14rem] md:items-center md:gap-8"
              style={{ ["--i" as string]: index }}
            >
              <div className="grid gap-1">
                <p className="text-[15.5px] font-medium text-ink"><bdi>{survey.title}</bdi></p>
                <p className="text-[14px] leading-6 text-ink-2"><bdi>{survey.highlight}</bdi></p>
                <p className="text-[12.5px] text-ink-3">
                  {fill(t("file.surveys.answered"), { date: survey.answeredAt ? formatDay(survey.answeredAt, language) : "" })}
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex items-baseline justify-between">
                  <span className="font-figures text-[28px] leading-none text-ink">{survey.score ?? "-"}</span>
                  {delta != null ? (
                    <span
                      className={cx(
                        "font-figures inline-flex items-center gap-1 text-[13px]",
                        delta < 0 ? "text-ruby-ink" : "text-moss-ink",
                      )}
                    >
                      <Glyph name={delta < 0 ? "trendDown" : "trendUp"} size={15} />
                      {delta > 0 ? "+" : ""}
                      {delta}
                    </span>
                  ) : null}
                </div>
                <span className="relative h-2 overflow-hidden rounded-full bg-sheet-sunk">
                  {survey.previousScore != null ? (
                    <span
                      className="absolute inset-y-0 w-0.5 bg-ink-3"
                      style={{ insetInlineStart: `${survey.previousScore}%` }}
                    />
                  ) : null}
                  <span className="block h-full rounded-full bg-board" style={{ width: `${survey.score ?? 0}%` }} />
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
