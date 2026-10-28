import type { SupportedLanguage, TranslationKey } from "@stability/i18n";

import type { Tone } from "@/components/case-file/primitives";
import { addDays, dayOf, formatDay, formatTime } from "@/lib/time";

import type { MessageCategory } from "./types";

export const messageCategoryLabelKeys: Record<MessageCategory, TranslationKey> =
  {
    observation: "messages.category.observation",
    recommendation: "messages.category.recommendation",
    reminder: "messages.category.reminder",
    routineAdjustment: "messages.category.routineAdjustment",
  };

/** Kind colors: moss helps, cobalt informs, clay reminds, ink adjusts. Never gold. */
export const messageCategoryTones: Record<MessageCategory, Tone> = {
  observation: "cobalt",
  recommendation: "moss",
  reminder: "clay",
  routineAdjustment: "ink",
};

/** Split a note body into readable paragraphs. */
export function toParagraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/u)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/** Today's notes show the time; older notes show the day. */
export function formatNoteWhen(
  sentAt: string | undefined,
  today: string | undefined,
  language: SupportedLanguage,
  yesterdayLabel?: string,
): string {
  if (!sentAt) {
    return "";
  }
  if (today && dayOf(sentAt) === today) {
    return formatTime(sentAt, language);
  }
  if (today && yesterdayLabel && dayOf(sentAt) === addDays(today, -1)) {
    return yesterdayLabel;
  }
  return formatDay(sentAt, language);
}
