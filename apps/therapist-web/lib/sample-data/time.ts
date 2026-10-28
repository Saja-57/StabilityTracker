/**
 * Timezone-independent date helpers. Sample timestamps are local wall-clock
 * strings ("YYYY-MM-DDTHH:mm"); all math runs in UTC so server and client
 * render identical output.
 */
export const SAMPLE_TODAY = "2026-10-14";
export const SAMPLE_NOW = "2026-10-14T10:20";

function toUtc(value: string): Date {
  const [date = SAMPLE_TODAY, time = "00:00"] = value.split("T");
  const [year = 2026, month = 1, day = 1] = date.split("-").map(Number);
  const [hour = 0, minute = 0] = time.split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour, minute));
}

function fromUtc(date: Date, withTime: boolean): string {
  const iso = date.toISOString();
  return withTime ? iso.slice(0, 16) : iso.slice(0, 10);
}

export function addDays(day: string, amount: number): string {
  const date = toUtc(day);
  date.setUTCDate(date.getUTCDate() + amount);
  return fromUtc(date, false);
}

export function addMinutes(value: string, amount: number): string {
  const date = toUtc(value);
  date.setUTCMinutes(date.getUTCMinutes() + amount);
  return fromUtc(date, true);
}

export function dayOf(value: string): string {
  return value.slice(0, 10);
}

export function minutesOfDay(value: string): number {
  const [hour = 0, minute = 0] = (value.split("T")[1] ?? "00:00").split(":").map(Number);
  return hour * 60 + minute;
}

export function daysBetween(from: string, to: string): number {
  return Math.round((toUtc(dayOf(to)).getTime() - toUtc(dayOf(from)).getTime()) / 86_400_000);
}

/** Monday-first weekday index, 0 to 6. */
export function weekdayIndex(day: string): number {
  return (toUtc(day).getUTCDay() + 6) % 7;
}

const localeByLanguage = { en: "en-GB", he: "he-IL", ar: "ar-EG" } as const;
type Language = keyof typeof localeByLanguage;

function format(value: string, language: Language, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(localeByLanguage[language], {
    timeZone: "UTC",
    numberingSystem: "latn",
    ...options,
  }).format(toUtc(value));
}

export function formatTime(value: string, language: Language): string {
  return format(value, language, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
}

/**
 * ICU builds disagree on English short months ("Sep" vs "Sept"), which breaks
 * server and client rendering, so English short months are fixed here.
 */
const EN_SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const EN_SHORT_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function enShortMonth(value: string): string {
  return EN_SHORT_MONTHS[toUtc(value).getUTCMonth()] ?? "";
}

export function formatDay(value: string, language: Language): string {
  if (language === "en") return `${toUtc(value).getUTCDate()} ${enShortMonth(value)}`;
  return format(value, language, { day: "numeric", month: "short" });
}

export function formatLongDay(value: string, language: Language): string {
  return format(value, language, { weekday: "long", day: "numeric", month: "long" });
}

export function formatWeekday(value: string, language: Language, width: "short" | "narrow" | "long" = "short"): string {
  return format(value, language, { weekday: width });
}

export function formatStampDate(value: string, language: Language): string {
  if (language === "en") {
    const date = toUtc(value);
    return `${EN_SHORT_WEEKDAYS[date.getUTCDay()]}, ${String(date.getUTCDate()).padStart(2, "0")} ${enShortMonth(value)} ${date.getUTCFullYear()}`;
  }
  return format(value, language, { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
}
