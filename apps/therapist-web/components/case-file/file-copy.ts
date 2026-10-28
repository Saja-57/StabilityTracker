"use client";

import { fill } from "@/lib/format";
import { eventsFor, eventsSince, rankTriggers, trendOf } from "@/lib/sample-data/analysis";
import { addDays, formatDay, formatTime, SAMPLE_TODAY } from "@/lib/sample-data/time";
import type { ChildFile } from "@/lib/sample-data/types";
import { useLanguage } from "@/providers/language-provider";

/**
 * The file's front-sheet sentences, computed from the logs and written
 * through translation templates so they read natively in every language.
 */
export function useFileCopy(child: ChildFile): { reason: string; pattern: string } {
  const { language, t } = useLanguage();
  const all = eventsFor(child.id);
  const since = eventsSince(all, child.lastSession);
  const recent = since.length >= 4 ? since : eventsSince(all, addDays(SAMPLE_TODAY, -14));
  const top = rankTriggers(recent)[0];

  const pattern = top
    ? fill(t("copy.pattern"), { trigger: t(`vocab.trigger.${top.key}`), count: top.count, total: recent.length })
    : t("copy.pattern.none");

  let reason: string;
  if (child.status === "needsReview") {
    reason = fill(t("copy.reason.needsReview"), {
      high: since.filter((event) => event.intensity === "high").length,
      total: since.length,
      date: formatDay(child.lastSession, language),
      open: since.filter((event) => !event.reviewed).length,
    });
  } else if (child.status === "sessionToday" && child.nextSession) {
    reason = fill(t("copy.reason.sessionToday"), {
      time: formatTime(child.nextSession, language),
      total: since.length,
    });
  } else {
    reason = fill(t("copy.reason.steady"), {
      total: eventsSince(all, addDays(SAMPLE_TODAY, -14)).length,
      trend: t(`vocab.trend.${trendOf(all)}`),
    });
  }

  return { reason, pattern };
}
